'use server';
/**
 * @fileOverview An AI agent for generating troll messages for a quiz.
 *
 * - generateTrollMessage - A function that handles the message generation process.
 * - GenerateTrollMessageOutput - The return type for the generateTrollMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTrollMessageOutputSchema = z.object({
  message: z.string().describe('A short, witty, and slightly trolling message for a student who is taking too long to answer a quiz question. Include a relevant emoji at the end.'),
});
export type GenerateTrollMessageOutput = z.infer<typeof GenerateTrollMessageOutputSchema>;

export async function generateTrollMessage(): Promise<GenerateTrollMessageOutput> {
  return generateTrollMessageFlow();
}

const prompt = ai.definePrompt({
  name: 'generateTrollMessagePrompt',
  output: {schema: GenerateTrollMessageOutputSchema},
  prompt: `You are a witty AI assistant inside a study application. Your task is to generate a short, funny, and slightly trolling message directed at a student who is taking too long to answer a quiz question. The message should be playful and encouraging, not mean. End the message with a fitting emoji.`,
});

const generateTrollMessageFlow = ai.defineFlow(
  {
    name: 'generateTrollMessageFlow',
    outputSchema: GenerateTrollMessageOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
