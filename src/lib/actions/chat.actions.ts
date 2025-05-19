"use server";

import { answerStudentQuery, type AnswerStudentQueryInput, type AnswerStudentQueryOutput } from '@/ai/flows/answer-student-query';
import { z } from 'zod';

const UserMessageInputSchema = z.object({
  query: z.string().min(1, "Query cannot be empty."),
});

export async function handleUserMessage(query: string): Promise<AnswerStudentQueryOutput> {
  const validation = UserMessageInputSchema.safeParse({ query });

  if (!validation.success) {
    // This error won't typically be shown directly to the user in this setup,
    // but it's good for server-side validation and logging.
    // The client-side validation should prevent empty submissions.
    throw new Error(validation.error.errors.map(e => e.message).join(', '));
  }

  const input: AnswerStudentQueryInput = { query: validation.data.query };
  
  try {
    const output = await answerStudentQuery(input);
    return output;
  } catch (error) {
    console.error("AI interaction error:", error);
    // Depending on the error type, you might want to customize the message
    return { answer: "I'm having a little trouble connecting right now. Please try again in a moment." };
  }
}
