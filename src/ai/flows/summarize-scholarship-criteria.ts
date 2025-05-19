'use server';

/**
 * @fileOverview Summarizes scholarship criteria from a long document.
 *
 * - summarizeScholarshipCriteria - A function that summarizes scholarship criteria.
 * - SummarizeScholarshipCriteriaInput - The input type for the summarizeScholarshipCriteria function.
 * - SummarizeScholarshipCriteriaOutput - The return type for the summarizeScholarshipCriteria function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeScholarshipCriteriaInputSchema = z.object({
  document: z
    .string()
    .describe('The document containing scholarship guidelines or course descriptions.'),
  query: z
    .string()
    .describe(
      'The specific question about the document, such as eligibility criteria or important details.'
    ),
});
export type SummarizeScholarshipCriteriaInput = z.infer<
  typeof SummarizeScholarshipCriteriaInputSchema
>;

const SummarizeScholarshipCriteriaOutputSchema = z.object({
  summary: z.string().describe('The summarized information from the document.'),
});
export type SummarizeScholarshipCriteriaOutput = z.infer<
  typeof SummarizeScholarshipCriteriaOutputSchema
>;

export async function summarizeScholarshipCriteria(
  input: SummarizeScholarshipCriteriaInput
): Promise<SummarizeScholarshipCriteriaOutput> {
  return summarizeScholarshipCriteriaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeScholarshipCriteriaPrompt',
  input: {schema: SummarizeScholarshipCriteriaInputSchema},
  output: {schema: SummarizeScholarshipCriteriaOutputSchema},
  prompt: `You are an expert at summarizing documents to extract key information.

  Summarize the following document based on the user's query. Be concise and focus on the most relevant details.

  Document: {{{document}}}
  Query: {{{query}}}`,
});

const summarizeScholarshipCriteriaFlow = ai.defineFlow(
  {
    name: 'summarizeScholarshipCriteriaFlow',
    inputSchema: SummarizeScholarshipCriteriaInputSchema,
    outputSchema: SummarizeScholarshipCriteriaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
