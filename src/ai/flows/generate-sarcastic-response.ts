'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating sarcastic responses.
 *
 * - generateSarcasticResponse - A function that generates a sarcastic response based on the input text and sarcasm mode.
 * - GenerateSarcasticResponseInput - The input type for the generateSarcasticResponse function.
 * - GenerateSarcasticResponseOutput - The return type for the generateSarcasticResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSarcasticResponseInputSchema = z.object({
  text: z.string().describe('The input text to generate a sarcastic response for.'),
  sarcasticMode: z.boolean().describe('Whether or not to generate a sarcastic response.'),
});
export type GenerateSarcasticResponseInput = z.infer<
  typeof GenerateSarcasticResponseInputSchema
>;

const GenerateSarcasticResponseOutputSchema = z.object({
  response: z.string().describe('The generated sarcastic response.'),
});
export type GenerateSarcasticResponseOutput = z.infer<
  typeof GenerateSarcasticResponseOutputSchema
>;

export async function generateSarcasticResponse(
  input: GenerateSarcasticResponseInput
): Promise<GenerateSarcasticResponseOutput> {
  return generateSarcasticResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSarcasticResponsePrompt',
  input: {schema: GenerateSarcasticResponseInputSchema},
  output: {schema: GenerateSarcasticResponseOutputSchema},
  prompt: `You are a witty and sarcastic AI assistant. When sarcasticMode is true, generate a sarcastic response to the following text. When sarcasticMode is false, generate a normal response. Maintain accuracy even when being sarcastic.

Text: {{{text}}}
Sarcastic Mode: {{{sarcasticMode}}}

Response:`,
});

const generateSarcasticResponseFlow = ai.defineFlow(
  {
    name: 'generateSarcasticResponseFlow',
    inputSchema: GenerateSarcasticResponseInputSchema,
    outputSchema: GenerateSarcasticResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
