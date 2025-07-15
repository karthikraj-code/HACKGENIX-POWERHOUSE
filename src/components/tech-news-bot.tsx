'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { getTechNewsUpdate } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  content: string | React.ReactNode;
  sender: 'user' | 'bot';
};

export function TechNewsBot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', content: "Hi! I'm Techie, your friendly tech news bot. Ask me anything about the latest in tech!" },
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, 100);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    const result = await getTechNewsUpdate({ query });
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) => [...prev, { sender: 'bot', content: "Sorry, I'm having trouble fetching the news right now. Please try again later." }]);
    } else if (result.data) {
        const botResponse = result.data;
        const botMessageContent = (
            <div className="space-y-3">
                <p className="text-sm">{botResponse.intro}</p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {botResponse.news.map((item, index) => (
                        <div key={index} className="p-3 rounded-md border bg-background/70 text-card-foreground text-left">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            {item.source && <p className="text-xs text-muted-foreground/80 mb-1">{item.source}</p>}
                            <p className="text-xs">{item.summary}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
        const botMessage: Message = { sender: 'bot', content: botMessageContent };
        setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="lg" className="rounded-full h-16 w-16 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg transition-transform hover:scale-110 hover:shadow-xl">
            <Bot className="h-8 w-8" />
            <span className="sr-only">Open Tech News Bot</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-3rem)] sm:w-96 h-[32rem] max-h-[80vh] mr-4 p-0 flex flex-col">
          <header className="p-4 bg-muted border-b">
            <h3 className="font-bold flex items-center gap-2"><Sparkles className="text-accent h-5 w-5"/> Tech News Bot</h3>
          </header>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn('flex items-start gap-3', message.sender === 'user' ? 'justify-end' : '')}>
                  {message.sender === 'bot' && (
                    <Avatar className='h-8 w-8 shrink-0'>
                      <AvatarFallback className='bg-primary text-primary-foreground'><Bot className='h-5 w-5'/></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    'max-w-[85%] rounded-lg px-3 py-2',
                    message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                   <Avatar className='h-8 w-8'>
                      <AvatarFallback className='bg-primary text-primary-foreground'><Bot className='h-5 w-5'/></AvatarFallback>
                    </Avatar>
                   <p className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                     <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                   </p>
                 </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t bg-muted">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about tech news..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
