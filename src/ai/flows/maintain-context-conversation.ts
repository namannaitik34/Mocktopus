'use server';

/**
 * @fileOverview An AI agent that maintains context throughout a conversation.
 *
 * - maintainContextConversation - A function that maintains the conversation context.
 * - MaintainContextConversationInput - The input type for the maintainContextConversation function.
 * - MaintainContextConversationOutput - The return type for the maintainContextConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaintainContextConversationInputSchema = z.object({
  userInput: z.string().describe('The current user input message.'),
  conversationHistory: z
    .array(z.object({role: z.enum(['user', 'assistant']), content: z.string()}))
    .optional()
    .describe('The history of the conversation.'),
  sarcasticMode: z.boolean().optional().default(false).describe('Whether to respond in sarcastic mode.'),
});
export type MaintainContextConversationInput = z.infer<typeof MaintainContextConversationInputSchema>;

const MaintainContextConversationOutputSchema = z.object({
  response: z.string().describe('The AI response to the user input.'),
  updatedConversationHistory: z.array(z.object({role: z.enum(['user', 'assistant']), content: z.string()})).describe('The updated history of the conversation.'),
});
export type MaintainContextConversationOutput = z.infer<typeof MaintainContextConversationOutputSchema>;

export async function maintainContextConversation(
  input: MaintainContextConversationInput
): Promise<MaintainContextConversationOutput> {
  return maintainContextConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'maintainContextConversationPrompt',
  input: {schema: MaintainContextConversationInputSchema},
  output: {schema: MaintainContextConversationOutputSchema},
  prompt: `You are a helpful AI assistant that maintains context throughout a conversation.
  The current user input is: {{{userInput}}}.
  You have access to conversation history, use it to maintain the context.
  Sarcastic Mode: {{#if sarcasticMode}}Enabled. Inject dry humor and witty remarks into responses, while maintaining accuracy.{{else}}Disabled. Provide informative and helpful responses.{{/if}}

  Here's the conversation history:
  {{#each conversationHistory}}
  {{#if (eq role "user")}}
  User: {{{this.content}}}
  {{else}}
  Assistant: {{{this.content}}}
  {{/if}}
  {{/each}}

  Generate a response to the user input, and update the conversation history.

  The user input is: {{{userInput}}}
  `,
});

const maintainContextConversationFlow = ai.defineFlow(
  {
    name: 'maintainContextConversationFlow',
    inputSchema: MaintainContextConversationInputSchema,
    outputSchema: MaintainContextConversationOutputSchema,
  },
  async input => {
    const {userInput, conversationHistory, sarcasticMode} = input;
    const {output} = await prompt({
      userInput,
      conversationHistory: conversationHistory ?? [],
      sarcasticMode,
    });

    const assistantResponse = output!.response;
    const updatedConversationHistory = [
      ...(conversationHistory ?? []),
      {role: 'user', content: userInput},
      {role: 'assistant', content: assistantResponse},
    ];

    return {
      response: assistantResponse,
      updatedConversationHistory: updatedConversationHistory,
    };
  }
);
