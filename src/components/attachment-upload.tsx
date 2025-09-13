'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  fileName: string;
  title: string;
  type: string;
  uploadDate: string;
}

interface AttachmentUploadProps {
  onAttachmentChange: (attachment: {
    type: 'pdf' | 'existing';
    file?: File;
    documentId?: string;
    content?: string;
  } | null) => void;
  disabled?: boolean;
}

export default function AttachmentUpload({ onAttachmentChange, disabled = false }: AttachmentUploadProps) {
  const [attachmentType, setAttachmentType] = useState<'pdf' | 'existing' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch existing documents when component mounts
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await fetch('/api/get-documents');
      const data = await response.json();
      
      if (data.success && data.documents) {
        setDocuments(data.documents);
        console.log(`📄 [ATTACHMENT] Loaded ${data.documents.length} existing documents`);
      } else {
        console.error('Failed to fetch documents:', data.error);
        setDocuments([]);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch existing documents',
        });
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch existing documents',
      });
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Please select a PDF file only',
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select a file smaller than 10MB',
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Convert file to base64 on client side
      try {
        const arrayBuffer = await file.arrayBuffer();
        const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        onAttachmentChange({
          type: 'pdf',
          file: base64Content, // Store base64 string instead of File object
          fileName: file.name,
          fileSize: file.size,
        });
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast({
          variant: 'destructive',
          title: 'File processing error',
          description: 'Failed to process the PDF file',
        });
      }
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocument(documentId);
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      onAttachmentChange({
        type: 'existing',
        documentId: documentId,
      });
    }
  };

  const clearAttachment = () => {
    setAttachmentType(null);
    setSelectedFile(null);
    setSelectedDocument('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onAttachmentChange(null);
  };

  return (
    <Card className="w-full border-dashed border-2 border-muted-foreground/25">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Attachment Options (Optional)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a PDF or select from existing documents to generate flashcards/mindmaps from specific content
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Attachment Type Selection */}
        <div className="space-y-2">
          <Label>Choose attachment type:</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={attachmentType === 'pdf' ? 'default' : 'outline'}
              onClick={() => setAttachmentType('pdf')}
              disabled={disabled}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
            <Button
              type="button"
              variant={attachmentType === 'existing' ? 'default' : 'outline'}
              onClick={() => setAttachmentType('existing')}
              disabled={disabled}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              From Existing Docs
            </Button>
          </div>
        </div>

        {/* PDF Upload */}
        {attachmentType === 'pdf' && (
          <div className="space-y-2">
            <Label htmlFor="pdf-upload">Select PDF file:</Label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                disabled={disabled}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                {selectedFile ? selectedFile.name : 'Choose PDF file'}
              </Button>
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearAttachment}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}

        {/* Existing Documents Selection */}
        {attachmentType === 'existing' && (
          <div className="space-y-2">
            <Label>Select document:</Label>
            {loadingDocuments ? (
              <div className="flex items-center justify-center p-4 border rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading documents...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Select value={selectedDocument} onValueChange={handleDocumentSelect} disabled={disabled}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.length === 0 ? (
                      <SelectItem value="no-docs" disabled>
                        No documents found
                      </SelectItem>
                    ) : (
                      documents.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{doc.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {doc.type} • {new Date(doc.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {documents.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Found {documents.length} document{documents.length !== 1 ? 's' : ''} in your library
                  </p>
                )}
              </div>
            )}
            {selectedDocument && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {documents.find(doc => doc.id === selectedDocument)?.title}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearAttachment}
                  disabled={disabled}
                  className="ml-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Clear All Button */}
        {attachmentType && (
          <Button
            type="button"
            variant="ghost"
            onClick={clearAttachment}
            disabled={disabled}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Attachment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
