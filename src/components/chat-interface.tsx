'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: Array<{
    title: string;
    fileName: string;
    similarity: number;
  }>;
  isLoading?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatInterfaceProps {
  onFileUpload?: (file: File) => void;
  uploadedFiles?: string[];
  currentFile?: string;
}

export default function ChatInterface({ 
  onFileUpload, 
  uploadedFiles = [], 
  currentFile 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>(currentFile || '');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setChatHistory(parsed);
      
      // If there's no current session, create a new one
      if (!currentSessionId && parsed.length > 0) {
        const latestSession = parsed[0];
        setCurrentSessionId(latestSession.id);
        setMessages(latestSession.messages);
      } else if (!currentSessionId) {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChatHistory(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  const updateSession = (newMessages: Message[]) => {
    if (currentSessionId) {
      setChatHistory(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: newMessages, updatedAt: new Date(), title: getChatTitle(newMessages) }
            : session
        )
      );
    }
  };

  const getChatTitle = (msgs: Message[]): string => {
    const firstUserMessage = msgs.find(m => m.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
    }
    return 'New Chat';
  };

  const loadSession = (sessionId: string) => {
    const session = chatHistory.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
    }
  };

  const deleteSession = (sessionId: string) => {
    setChatHistory(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      if (chatHistory.length > 1) {
        const nextSession = chatHistory.find(s => s.id !== sessionId);
        if (nextSession) loadSession(nextSession.id);
      } else {
        createNewSession();
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          history: newMessages.slice(0, -1), // Send history without the current message
          fileName: selectedFile || undefined,
          sessionId: currentSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        role: 'assistant',
        timestamp: new Date(),
        sources: data.sources,
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      updateSession(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  const clearChat = () => {
    createNewSession();
    toast({
      title: 'Chat cleared',
      description: 'Started a new conversation.',
    });
  };

  return (
    <div className="flex h-[600px] border rounded-lg">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Chat History</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={createNewSession}
            className="text-xs"
          >
            New Chat
          </Button>
        </div>
        
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {chatHistory.slice(0, 10).map(session => (
              <div
                key={session.id}
                className={cn(
                  'p-2 rounded cursor-pointer text-sm hover:bg-gray-100',
                  session.id === currentSessionId && 'bg-blue-100'
                )}
                onClick={() => loadSession(session.id)}
              >
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="w-full"
          >
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Document Chat</h2>
            {uploadedFiles.length > 0 && (
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="">All Documents</option>
                {uploadedFiles.map(file => (
                  <option key={file} value={file}>{file}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Ask me anything about your documents!</p>
                <p className="text-sm">I'll use the conversation history to provide better answers.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'
                )}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2">
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                          Sources ({message.sources.length})
                        </summary>
                        <div className="mt-1 space-y-1">
                          {message.sources.map((source, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-600">
                              <FileText className="w-3 h-3" />
                              <span>{source.fileName}</span>
                              <span className="text-gray-400">({(source.similarity * 100).toFixed(0)}%)</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            {onFileUpload && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            )}
            
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.txt,.doc,.docx"
            />
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedFile ? `Ask about ${selectedFile}...` : "Ask about your documents..."}
              className="flex-1"
              disabled={isLoading}
            />
            
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}