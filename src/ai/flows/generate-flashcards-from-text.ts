'use server';
/**
 * @fileOverview A flashcard generation AI agent.
 *
 * - generateFlashcardsFromText - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcardsFromText function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcardsFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  text: z
    .string()
    .describe('The text to generate flashcards from.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(z.object({
    front: z.string().describe('The front of the flashcard.'),
    back: z.string().describe('The back of the flashcard.'),
  })).describe('The generated flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcardsFromText(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert educator who can create flashcards from text.

  Create flashcards from the following text. Each flashcard should have a front and back.

  Text: {{{text}}}

  The flashcards should cover the key concepts in the text.

  The output should be a JSON array of flashcards, each with a front and back field.
  `,
});

const generateFlashcardsFromTextFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFromTextFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
