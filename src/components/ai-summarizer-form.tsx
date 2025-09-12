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
import { Loader2, Upload, X, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useDropzone } from 'react-dropzone';

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
  const [summary, setSummary] = useState<string | null>(null);
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

  return (
    <>
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
          </CardContent>
        </Card>
      )}
    </>
  );
}
