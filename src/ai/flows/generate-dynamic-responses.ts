'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating dynamic responses from an AI, varying in style from informative to creative.
 *
 * - generateDynamicResponse - A function that generates dynamic responses based on user input and sarcasm mode.
 * - GenerateDynamicResponseInput - The input type for the generateDynamicResponse function.
 * - GenerateDynamicResponseOutput - The output type for the generateDynamicResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDynamicResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to generate a response for.'),
  sarcasticMode: z.boolean().describe('Whether to generate a sarcastic response.'),
});

export type GenerateDynamicResponseInput = z.infer<
  typeof GenerateDynamicResponseInputSchema
>;

const GenerateDynamicResponseOutputSchema = z.object({
  response: z.string().describe('The generated response from the AI.'),
});

export type GenerateDynamicResponseOutput = z.infer<
  typeof GenerateDynamicResponseOutputSchema
>;

export async function generateDynamicResponse(
  input: GenerateDynamicResponseInput
): Promise<GenerateDynamicResponseOutput> {
  return generateDynamicResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDynamicResponsePrompt',
  input: {schema: GenerateDynamicResponseInputSchema},
  output: {schema: GenerateDynamicResponseOutputSchema},
  prompt: `You are a versatile AI assistant that can generate responses in different styles.

      The user input is: {{{userInput}}}

      You are able to toggle between formal, informative responses and creative, sarcastic responses based on the user's preference.

      {{#if sarcasticMode}}
        The AI is in sarcastic mode. Generate a response that is dry, humorous, and witty while maintaining accuracy.
      {{else}}
        The AI is in informative mode. Generate a response that is formal, accurate, and helpful.
      {{/if}}

      Ensure that the response is always in natural language and appropriate for a conversation.

      The response should be:
    `,
});

const generateDynamicResponseFlow = ai.defineFlow(
  {
    name: 'generateDynamicResponseFlow',
    inputSchema: GenerateDynamicResponseInputSchema,
    outputSchema: GenerateDynamicResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
