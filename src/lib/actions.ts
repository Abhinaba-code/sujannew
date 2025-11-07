'use server';

import { generateFlashcardsFromText as generateFlashcardsFromTextFlow } from "@/ai/flows/generate-flashcards-from-text";
import { z } from "zod";

const inputSchema = z.object({
  text: z.string().min(50, "Please provide at least 50 characters of text."),
});

export async function generateFlashcardsAction(prevState: any, formData: FormData) {
  const validatedFields = inputSchema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
      flashcards: null
    };
  }
  
  try {
    const result = await generateFlashcardsFromTextFlow({ text: validatedFields.data.text, llmProvider: 'Gemini' });
    return {
        message: 'Success',
        errors: null,
        flashcards: result.flashcards,
    };
  } catch(e) {
    return {
        message: 'An error occurred while generating flashcards.',
        errors: null,
        flashcards: null
    }
  }
}
