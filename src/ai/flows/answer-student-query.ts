
// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering student queries related to college life.
 *
 * The flow takes a student's question as input and returns a helpful and informative answer.
 *
 * @interface AnswerStudentQueryInput - The input type for the answerStudentQuery function.
 * @interface AnswerStudentQueryOutput - The output type for the answerStudentQuery function.
 * @function answerStudentQuery - The main function that processes the student's query and returns an answer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the student's question.
const AnswerStudentQueryInputSchema = z.object({
  query: z.string().describe('The student’s question or command about college life, admissions, financial aid, etc.'),
});
export type AnswerStudentQueryInput = z.infer<typeof AnswerStudentQueryInputSchema>;

// Define the output schema for the chatbot's answer.
const AnswerStudentQueryOutputSchema = z.object({
  answer: z.string().describe('The chatbot’s helpful and informative answer to the student’s query or command execution result.'),
});
export type AnswerStudentQueryOutput = z.infer<typeof AnswerStudentQueryOutputSchema>;

// Exported function to answer student queries, calls the flow.
export async function answerStudentQuery(input: AnswerStudentQueryInput): Promise<AnswerStudentQueryOutput> {
  return answerStudentQueryFlow(input);
}

// Define the prompt for answering student queries.
const answerStudentQueryPrompt = ai.definePrompt({
  name: 'answerStudentQueryPrompt',
  input: {schema: AnswerStudentQueryInputSchema},
  output: {schema: AnswerStudentQueryOutputSchema},
  prompt: `You are CollegeGPT, an AI-powered guide for college life. Your role is to assist students by answering their questions and performing tasks based on their commands.
This includes providing information on admissions, scholarships, campus life, course selection, and more.
When a user gives you a query, understand if it's a question to be answered or a command to perform (e.g., "search for marketing programs", "list top 5 universities for computer science", "explain financial aid options"). Respond clearly, directly, and conversationally.

User Query: {{{query}}}

Your Response:`,
});

// Define the Genkit flow for answering student queries.
const answerStudentQueryFlow = ai.defineFlow(
  {
    name: 'answerStudentQueryFlow',
    inputSchema: AnswerStudentQueryInputSchema,
    outputSchema: AnswerStudentQueryOutputSchema,
  },
  async input => {
    // Call the prompt to generate the answer.
    const {output} = await answerStudentQueryPrompt(input);
    // Return the answer.
    return output!;
  }
);

