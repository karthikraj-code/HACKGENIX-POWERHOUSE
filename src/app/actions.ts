
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
  data: GenerateFlashcardsOutput | GenerateMindmapOutput | null;
  error: string | null;
  type: 'flashcards' | 'mindmap' | null;
};

export async function generateContent(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const topic = formData.get('topic') as string;
  const type = formData.get('type') as 'flashcards' | 'mindmap';

  if (!topic || !type) {
    return { data: null, error: 'Topic and type are required.', type: null };
  }

  try {
    if (type === 'flashcards') {
      const data = await generateFlashcards({ topic, numberOfCards: 5 });
      return { data, error: null, type };
    } else if (type === 'mindmap') {
      const data = await generateMindmap({ topic });
      return { data, error: null, type };
    } else {
      return { data: null, error: 'Invalid type.', type: null };
    }
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unexpected error occurred.', type: null };
  }
}
