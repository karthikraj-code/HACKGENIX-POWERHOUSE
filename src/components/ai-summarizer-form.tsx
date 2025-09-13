'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { getResourceSummary, extractTextFromPdfUsingLLM } from '@/app/actions';
import { Loader2, Upload, X, FileText, Search, MessageCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useDropzone } from 'react-dropzone';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const FormSchema = z.object({
  resourceContent: z.string().optional(),
  resourceFile: z
    .any()
    .optional()
    .describe('Optional PDF file to summarize'),
}).refine((data) => data.resourceContent && data.resourceContent.length >= 100 || (data.resourceFile && data.resourceFile.length > 0), {
  message: 'Please provide either content with at least 100 characters or upload a PDF file.',
  path: ['resourceContent'],
});

export function AiSummarizerForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [isStoringDocument, setIsStoringDocument] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [ragQuery, setRagQuery] = useState('');
  const [ragResponse, setRagResponse] = useState<{
    answer: string;
    sources: Array<{
      content: string;
      metadata: any;
      similarity: number;
    }>;
  } | null>(null);
  const [storedFileName, setStoredFileName] = useState<string | null>(null);
  const [extractedContent, setExtractedContent] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{
    question: string;
    answer: string;
    sources?: any[];
    timestamp: Date;
  }>>([]);
  const [showUploadArea, setShowUploadArea] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      resourceContent: '',
      resourceFile: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setSummary(null);

    let contentToSummarize = data.resourceContent || '';

    if (data.resourceFile && data.resourceFile.length > 0) {
      const file = data.resourceFile[0];
      setIsProcessingPDF(true);
      try {
        const text = await extractTextFromPDF(file);
        contentToSummarize = text;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to extract text from PDF file.',
        });
        setIsLoading(false);
        setIsProcessingPDF(false);
        return;
      }
      setIsProcessingPDF(false);
    }

    const result = await getResourceSummary({ resourceContent: contentToSummarize });
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setSummary(result.data.summary);
    }
  }

  async function extractTextFromPDF(file: File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // Validate file type
      if (!file.type || !file.type.includes('pdf')) {
        reject(new Error('Please upload a valid PDF file.'));
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Content = (reader.result as string).split(',')[1]; // Remove data:application/pdf;base64, prefix

          // Send to LLM for text extraction
          const result = await extractTextFromPdfUsingLLM({
            pdfContent: base64Content,
            fileName: file.name,
          });

          if (result.error) {
            reject(new Error(result.error));
            return;
          }

          if (result.data) {
            const extractedText = result.data.extractedText;
            console.log('LLM PDF Extraction Result:', {
              fileName: file.name,
              extractedTextLength: extractedText.length,
              pageCount: result.data.pageCount,
              confidence: result.data.confidence,
            });

            if (extractedText.trim().length === 0) {
              reject(new Error('No text found in PDF. The PDF might be corrupted or contain only images without recognizable text.'));
            } else {
              resolve(extractedText);
            }
          } else {
            reject(new Error('Failed to extract text from PDF.'));
          }
        } catch (e: any) {
          console.error('PDF processing error:', e);
          reject(new Error('Failed to process PDF file. Please try again or use text input instead.'));
        }
      };
      reader.onerror = (error) => reject(new Error('Failed to read PDF file. Please try again.'));
      reader.readAsDataURL(file); // Read as data URL to get base64
    });
  }

  async function performOCR(pdf: any): Promise<string> {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng');
    let ocrText = '';

    try {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const { data: { text } } = await worker.recognize(canvas);
        ocrText += text + '\n';
      }
    } finally {
      await worker.terminate();
    }

    return ocrText;
  }

  const storeDocumentInVectorStore = async (content: string, fileName?: string) => {
    try {
      setIsStoringDocument(true);
      const response = await fetch('/api/store-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          metadata: {
            title: fileName || 'Summarized Document',
            source: 'summarizer',
            type: 'summary',
            fileName: fileName || 'document.txt', // Ensure fileName is always set
            summary: summary || undefined,
          },
        }),
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setStoredFileName(fileName || 'Document');
      toast({
        title: 'Document stored successfully',
        description: 'You can now ask questions about this document.',
      });
    } catch (error) {
      console.error('Error storing document:', error);
      if (error instanceof Error && error.message?.includes('User not authenticated')) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to upload documents',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Error storing document',
        description: error instanceof Error ? error.message : 'Failed to store document in vector store.',
        variant: 'destructive',
      });
    } finally {
      setIsStoringDocument(false);
    }
  };

  const handleRagQuery = async () => {
    if (!ragQuery.trim()) return;

    try {
      setIsQuerying(true);
      
      // Always use vector store for queries since documents are automatically stored
      const requestBody: any = {
        question: ragQuery,
        limit: 5,
      };
      
      // Add fileName filter if we have a specific document
      if (storedFileName && storedFileName !== 'Document') {
        requestBody.fileName = storedFileName;
      }

      const response = await fetch('/api/query-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      const responseData = result.data;

      // Add to chat history
      setChatHistory(prev => [...prev, {
        question: ragQuery,
        answer: responseData.answer,
        sources: responseData.sources,
        timestamp: new Date(),
      }]);

      setRagResponse(responseData);
      setRagQuery(''); // Clear the input after sending
    } catch (error) {
      console.error('Error querying documents:', error);
      toast({
        title: 'Error querying documents',
        description: error instanceof Error ? error.message : 'Failed to query documents.',
        variant: 'destructive',
      });
    } finally {
      setIsQuerying(false);
    }
  };

  const handleDirectFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.txt', '.doc', '.docx', 'text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const fileType = file.type;
    
    const isAllowed = allowedTypes.some(type => 
      file.name.toLowerCase().endsWith(type) || fileType.includes(type)
    );
    
    if (!isAllowed) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload PDF, TXT, DOC, or DOCX files only',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsStoringDocument(true);
      
      // Extract text based on file type
      let content = '';
      if (file.name.toLowerCase().endsWith('.pdf')) {
        content = await extractTextFromPDF(file);
      } else {
        // For text files
        content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      }

      // Automatically store the document in vector store
      const response = await fetch('/api/store-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent
        body: JSON.stringify({
          content: content,
          metadata: {
            title: file.name,
            fileName: file.name,
            type: file.type,
            source: 'upload',
            fileSize: file.size,
            summary: content.substring(0, 500) + '...'
          }
        }),
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      // Store the extracted content and file name for immediate use
      setExtractedContent(content);
      setStoredFileName(file.name);
      setShowUploadArea(false); // Hide upload area after successful upload
      
      toast({
        title: 'File uploaded and stored',
        description: `${file.name} has been uploaded and stored in the vector store. You can now ask questions about it.`,
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsStoringDocument(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="summarize" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summarize">Summarize</TabsTrigger>
          <TabsTrigger value="query">Ask Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="summarize">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="resourceContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resource Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste the content of the article or blog post here..."
                            className="min-h-[250px] resize-y"
                            {...field}
                            disabled={form.getValues('resourceFile')?.length > 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="resourceFile"
                    render={({ field }) => {
                      const { getRootProps, getInputProps, isDragActive } = useDropzone({
                        accept: {
                          'application/pdf': ['.pdf'],
                          'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
                          'application/vnd.ms-powerpoint': ['.ppt'],
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                          'application/msword': ['.doc']
                        },
                        maxFiles: 1,
                        onDrop: (acceptedFiles) => {
                          field.onChange(acceptedFiles);
                          if (acceptedFiles.length > 0) {
                            form.setValue('resourceContent', '');
                          }
                        }
                      });

                      const selectedFile = field.value?.[0];

                      return (
                        <FormItem>
                          <FormLabel>Or upload a PDF file</FormLabel>
                          <FormControl>
                            <div
                              {...getRootProps()}
                              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                                isDragActive
                                  ? 'border-primary bg-primary/5'
                                  : 'border-muted-foreground/25 hover:border-primary/50'
                              }`}
                            >
                              <input {...getInputProps()} />
                              {selectedFile ? (
                                <div className="flex items-center justify-center space-x-4">
                                  <FileText className="h-8 w-8 text-primary" />
                                  <div className="text-left">
                                    <p className="font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      field.onChange(undefined);
                                      if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                      }
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                                  <div>
                                    <p className="font-medium">
                                      {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here, or click to select'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Only PDF files are supported (max 1 file)
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isProcessingPDF ? 'Processing PDF...' : isLoading ? 'Summarizing...' : 'Summarize Content'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {summary && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className='font-headline text-2xl'>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{summary}</div>
                <Button
                  onClick={() => storeDocumentInVectorStore(summary, storedFileName || (form.getValues('resourceFile')?.[0]?.name))}
                  disabled={isStoringDocument}
                  className="mt-4"
                  variant="secondary"
                >
                  {isStoringDocument ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Storing...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Store in Vector Store
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="query">
          <Card>
            <CardHeader>
              <CardTitle>Ask Questions About Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {showUploadArea ? (
                  /* File Upload Section */
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <div className="text-center space-y-2">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium">Upload a document to ask questions</p>
                        <p className="text-sm text-muted-foreground">
                          Drag & drop or click to upload PDF, TXT, DOC, or DOCX files - automatically stored for future questions
                        </p>
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDirectFileUpload(file);
                        }
                      }}
                      className="hidden"
                      id="rag-file-upload"
                    />
                    
                    <label
                      htmlFor="rag-file-upload"
                      className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                    >
                      {isStoringDocument ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Choose File'
                      )}
                    </label>
                  </div>
                ) : (
                  /* Chat History Section */
                  <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                      {chatHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            {storedFileName && storedFileName !== 'Document' 
                              ? `Ask your first question about ${storedFileName} (automatically stored)`
                              : "Upload a document to get started - it will be automatically stored for you to ask questions"}
                          </p>
                        </div>
                      ) : (
                        chatHistory.map((chat, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-end">
                              <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                                <p className="text-sm">{chat.question}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(chat.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-start">
                              <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                                <p className="text-sm whitespace-pre-wrap">{chat.answer}</p>
                                {chat.sources && chat.sources.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-border">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Sources:</p>
                                    {chat.sources.map((source, sourceIndex) => (
                                      <p key={sourceIndex} className="text-xs text-muted-foreground">
                                        • {source.metadata?.title || 'Document'}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Question Input - Always visible after upload */}
                {!showUploadArea && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder={storedFileName && storedFileName !== 'Document' 
                          ? `Ask a question about ${storedFileName}...` 
                          : "Ask a question about the document..."}
                        value={ragQuery}
                        onChange={(e) => setRagQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleRagQuery()}
                        disabled={isQuerying}
                      />
                      <Button onClick={handleRagQuery} disabled={isQuerying || !ragQuery.trim()}>
                        {isQuerying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {storedFileName && storedFileName !== 'Document' && (
                          <p className="text-xs text-muted-foreground">
                            🔍 Asking about: <strong>{storedFileName}</strong> (automatically stored)
                          </p>
                        )}
                        {!storedFileName && (
                          <p className="text-xs text-muted-foreground">
                            🔍 Asking about all stored documents
                          </p>
                        )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
