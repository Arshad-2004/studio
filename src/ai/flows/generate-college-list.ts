// src/ai/flows/generate-college-list.ts
'use server';
/**
 * @fileOverview Generates a personalized list of potential colleges based on user criteria.
 *
 * - generateCollegeList - A function that generates the college list.
 * - GenerateCollegeListInput - The input type for the generateCollegeList function.
 * - GenerateCollegeListOutput - The return type for the generateCollegeList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCollegeListInputSchema = z.object({
  criteria: z
    .string()
    .describe(
      'A description of the ideal college, including size, location, programs, and any other relevant criteria.'
    ),
});
export type GenerateCollegeListInput = z.infer<typeof GenerateCollegeListInputSchema>;

const GenerateCollegeListOutputSchema = z.object({
  collegeList: z
    .string()
    .describe('A list of potential colleges that fit the provided criteria.'),
});
export type GenerateCollegeListOutput = z.infer<typeof GenerateCollegeListOutputSchema>;

export async function generateCollegeList(input: GenerateCollegeListInput): Promise<GenerateCollegeListOutput> {
  return generateCollegeListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCollegeListPrompt',
  input: {schema: GenerateCollegeListInputSchema},
  output: {schema: GenerateCollegeListOutputSchema},
  prompt: `You are a college advisor. Please generate a list of colleges based on the following criteria: {{{criteria}}}.`,
});

const generateCollegeListFlow = ai.defineFlow(
  {
    name: 'generateCollegeListFlow',
    inputSchema: GenerateCollegeListInputSchema,
    outputSchema: GenerateCollegeListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
