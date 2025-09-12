import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';
config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Gemini API Key (masked):', apiKey ? apiKey.slice(0, 8) + '...' : 'NOT SET');
console.log('Gemini Model:', 'googleai/gemini-2.0-flash');

export const ai = genkit({
  plugins: [
    googleAI({ apiKey })
  ],
  model: 'googleai/gemini-2.0-flash',
});