
'use server';

import { aiResourceSummarizer, AiResourceSummarizerInput } from '@/ai/flows/ai-resource-summarizer';
import { personalizedRoadmap, PersonalizedRoadmapInput, PersonalizedRoadmapOutput } from '@/ai/flows/personalized-roadmap';
import { techNewsBot, TechNewsBotInput } from '@/ai/flows/tech-news-bot-flow';
import { projectIdeaGenerator, ProjectIdeaGeneratorInput } from '@/ai/flows/project-idea-generator';
import { conceptExplainer, ConceptExplainerInput } from '@/ai/flows/concept-explainer';
import { careerAdvisor, CareerAdvisorInput, CareerAdvisorOutput } from '@/ai/flows/career-advisor-flow';


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
