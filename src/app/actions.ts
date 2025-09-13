
'use server';

import { aiResourceSummarizer, AiResourceSummarizerInput } from '@/ai/flows/ai-resource-summarizer';
import { personalizedRoadmap, PersonalizedRoadmapInput, PersonalizedRoadmapOutput } from '@/ai/flows/personalized-roadmap';
import { techNewsBot, TechNewsBotInput } from '@/ai/flows/tech-news-bot-flow';
import { projectIdeaGenerator, ProjectIdeaGeneratorInput } from '@/ai/flows/project-idea-generator';
import { conceptExplainer, ConceptExplainerInput } from '@/ai/flows/concept-explainer';
import { careerAdvisor, CareerAdvisorInput, CareerAdvisorOutput } from '@/ai/flows/career-advisor-flow';
import { pdfTextExtractor, PdfTextExtractorInput } from '@/ai/flows/pdf-text-extractor';
import { generateFlashcards, GenerateFlashcardsInput, GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards-from-topic';
import { generateMindmap, GenerateMindmapInput, GenerateMindmapOutput } from '@/ai/flows/generate-mindmap-from-topic';
import { generateFlashcardsFromContent, GenerateFlashcardsFromContentInput, GenerateFlashcardsFromContentOutput } from '@/ai/flows/generate-flashcards-from-content';
import { generateMindmapFromContent, GenerateMindmapFromContentInput, GenerateMindmapFromContentOutput } from '@/ai/flows/generate-mindmap-from-content';
import { vectorStoreService } from '@/lib/vector-store';
import { ragService } from '@/lib/rag-service';
import { getUserIdWithFallback } from '@/lib/auth-utils';


export async function getPersonalizedRoadmap(input: PersonalizedRoadmapInput): Promise<{ data?: PersonalizedRoadmapOutput; error?: string }> {
  try {
    const data = await personalizedRoadmap(input);
    return { data };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export async function getResourceSummary(input: AiResourceSummarizerInput) {
    try {
        console.log(`📊 [ACTIONS] getResourceSummary received content length: ${input.resourceContent?.length || 0} characters`);
        const data = await aiResourceSummarizer(input);
        return { data };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unexpected error occurred.' };
    }
}

export async function getTechNewsUpdate(input: TechNewsBotInput) {
  try {
    const data = await techNewsBot(input);
    return { data };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export async function getProjectIdea(input: ProjectIdeaGeneratorInput) {
  try {
    const data = await projectIdeaGenerator(input);
    return { data };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export async function getConceptExplanation(input: ConceptExplainerInput) {
  try {
    const data = await conceptExplainer(input);
    return { data };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export async function getCareerAdvice(input: CareerAdvisorInput): Promise<{ data?: CareerAdvisorOutput, error?: string }> {
  try {
    const data = await careerAdvisor(input);
    return { data };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export async function extractTextFromPdfUsingLLM(input: PdfTextExtractorInput) {
  try {
    const data = await pdfTextExtractor(input);
    return { data };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export type ActionState = {
  data: GenerateFlashcardsOutput | GenerateMindmapOutput | GenerateFlashcardsFromContentOutput | GenerateMindmapFromContentOutput | null;
  error: string | null;
  type: 'flashcards' | 'mindmap' | null;
};

export async function generateContent(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const topic = formData.get('topic') as string;
  const type = formData.get('type') as 'flashcards' | 'mindmap';
  const attachmentType = formData.get('attachmentType') as string;
  const attachmentData = formData.get('attachmentData') as string;
  const numberOfCards = parseInt(formData.get('numberOfCards') as string) || 5;

  if (!topic || !type) {
    return { data: null, error: 'Topic and type are required.', type: null };
  }

  try {
    // Check if we have attachment data
    if (attachmentType && attachmentData) {
      let content = '';
      
      if (attachmentType === 'pdf') {
        // Handle PDF file - file is already converted to base64 on client side
        const fileData = JSON.parse(attachmentData);
        
        const pdfResult = await pdfTextExtractor({ 
          pdfContent: fileData.file, // Already base64 string from client
          fileName: fileData.fileName 
        });
        content = pdfResult.extractedText;
      } else if (attachmentType === 'existing') {
        // Handle existing document - get content from vector store
        const documentId = JSON.parse(attachmentData).documentId;
        const userId = await getUserIdWithFallback();
        const documents = await vectorStoreService.getAllDocuments(1000, userId);
        const document = documents.find(doc => doc.metadata.fileName === documentId);
        if (document) {
          content = document.content;
          console.log(`📄 [ACTIONS] Using existing document: ${documentId} (${content.length} characters)`);
        } else {
          return { data: null, error: 'Document not found.', type: null };
        }
      }

      if (!content) {
        return { data: null, error: 'Could not extract content from attachment.', type: null };
      }

      // Store the document in vector store (like summarizer does)
      if (attachmentType === 'pdf') {
        try {
          const fileData = JSON.parse(attachmentData);
          const userId = await getUserIdWithFallback();
          
          await vectorStoreService.storeDocument({
            content: content,
            metadata: {
              title: fileData.fileName,
              source: 'upload',
              type: 'pdf',
              fileName: fileData.fileName,
              fileSize: fileData.fileSize || 0,
              summary: `PDF document used for ${type} generation`,
            },
          }, userId);
          
          console.log(`📄 [ACTIONS] PDF document stored in vector store: ${fileData.fileName}`);
        } catch (error) {
          console.error('❌ [ACTIONS] Error storing PDF document:', error);
          // Continue with generation even if storage fails
        }
      } else if (attachmentType === 'existing') {
        // Using existing document - do NOT store it again in vector store
        console.log(`📄 [ACTIONS] Using existing document for ${type} generation (not storing again)`);
      }

      // Generate based on content - STRICT CONTENT ONLY
      console.log(`📄 [ACTIONS] Generating ${type} from document content only (${content.length} characters)`);
      console.log(`📄 [ACTIONS] Content preview: ${content.substring(0, 200)}...`);
      console.log(`📄 [ACTIONS] Full extracted content for ${type} generation:`);
      console.log(`📄 [ACTIONS] ==========================================`);
      console.log(content);
      console.log(`📄 [ACTIONS] ==========================================`);
      console.log(`📄 [ACTIONS] End of extracted content`);
      
      if (type === 'flashcards') {
        const data = await generateFlashcardsFromContent({ 
          topic, 
          content, 
          numberOfCards 
        });
        console.log(`📄 [ACTIONS] Generated ${data.flashcards.length} flashcards from document content`);
        console.log(`📄 [ACTIONS] Generated flashcards content:`);
        console.log(`📄 [ACTIONS] ==========================================`);
        data.flashcards.forEach((card, index) => {
          console.log(`📄 [ACTIONS] Card ${index + 1}:`);
          console.log(`📄 [ACTIONS]   Front: ${card.front}`);
          console.log(`📄 [ACTIONS]   Back: ${card.back}`);
        });
        console.log(`📄 [ACTIONS] ==========================================`);
        return { data, error: null, type };
      } else if (type === 'mindmap') {
        const data = await generateMindmapFromContent({ topic, content });
        console.log(`📄 [ACTIONS] Generated mindmap from document content`);
        console.log(`📄 [ACTIONS] Generated mindmap content:`);
        console.log(`📄 [ACTIONS] ==========================================`);
        console.log(data.mindmap);
        console.log(`📄 [ACTIONS] ==========================================`);
        return { data, error: null, type };
      }
    } else {
      // Generate without attachment (original behavior)
      if (type === 'flashcards') {
        const data = await generateFlashcards({ topic, numberOfCards });
        return { data, error: null, type };
      } else if (type === 'mindmap') {
        const data = await generateMindmap({ topic });
        return { data, error: null, type };
      }
    }

    return { data: null, error: 'Invalid type.', type: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unexpected error occurred.', type: null };
  }
}

// Vector store and RAG actions
export async function storeDocument(input: {
  content: string;
  metadata: {
    title?: string;
    source?: string;
    type?: string;
    fileName?: string;
    fileSize?: number;
    summary?: string;
  };
}) {
  try {
    // Get user ID using simplified authentication
    const userId = await getUserIdWithFallback();
    console.log(`📄 [ACTIONS] Using User ID: ${userId}`);

    const documentId = await vectorStoreService.storeDocument({
      content: input.content,
      metadata: { ...input.metadata, userId: userId },
    }, userId);
    
    return { data: { documentId }, error: null };
  } catch (e: any) {
    console.error(e);
    
    // Handle authentication errors specifically
    if (e.message === 'User not authenticated') {
      return { data: null, error: 'Please sign in to upload documents.' };
    }
    
    return { data: null, error: e.message || 'Failed to store document.' };
  }
}

export async function queryDocuments(input: {
  question: string;
  limit?: number;
  fileName?: string;
  type?: string;
}) {
  try {
    // Get user ID using simplified authentication
    const userId = await getUserIdWithFallback();
    console.log(`🔍 [ACTIONS] Using User ID: ${userId}`);

    // Create metadata filter - always filter by user_id
    const metadataFilter: any = { userId: userId };

    // Add additional filters if provided
    if (input.fileName) {
      metadataFilter.fileName = input.fileName;
    }
    if (input.type) {
      metadataFilter.type = input.type;
    }
    
    console.log(`📋 [ACTIONS] Query request:`, {
      question: input.question,
      userId: userId,
      fileName: input.fileName,
      type: input.type,
      metadataFilter
    });

    const response = await ragService.queryDocuments({
      question: input.question,
      limit: input.limit || 5,
      metadataFilter,
    });
    return { data: response, error: null };
  } catch (e: any) {
    console.error(e);
    
    // Handle authentication errors specifically
    if (e.message === 'User not authenticated') {
      return { data: null, error: 'Please sign in to query documents.' };
    }
    
    return { data: null, error: e.message || 'Failed to query documents.' };
  }
}

export async function getDocumentsSummary() {
  try {
    // Get user ID using simplified authentication
    const userId = await getUserIdWithFallback();
    console.log(`📊 [ACTIONS] Using User ID: ${userId}`);
    console.log(`📊 [ACTIONS] Getting documents summary for user: ${userId}`);

    const summary = await ragService.getDocumentsSummaryWithAuth();
    return { data: summary, error: null };
  } catch (e: any) {
    console.error(e);
    
    // Handle authentication errors specifically
    if (e.message === 'User not authenticated') {
      return { data: null, error: 'Please sign in to view documents summary.' };
    }
    
    return { data: null, error: e.message || 'Failed to get documents summary.' };
  }
}
