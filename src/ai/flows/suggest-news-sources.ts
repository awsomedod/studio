// src/ai/flows/suggest-news-sources.ts
'use server';

/**
 * @fileOverview Suggests relevant news sources based on a topic.
 *
 * - suggestNewsSources - A function that suggests news sources based on a topic.
 * - SuggestNewsSourcesInput - The input type for the suggestNewsSources function.
 * - SuggestNewsSourcesOutput - The return type for the suggestNewsSources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNewsSourcesInputSchema = z.object({
  topic: z.string().describe('The topic to suggest news sources for.'),
  bias: z.string().describe('The political bias of the news source being requested')
});
export type SuggestNewsSourcesInput = z.infer<typeof SuggestNewsSourcesInputSchema>;

const SuggestNewsSourcesOutputSchema = z.object({
  sources: z
 .array(
      z.string().url('Must be a valid URL.')
    )
    .describe('An array of suggested news sources related to the topic.'),
});
export type SuggestNewsSourcesOutput = z.infer<typeof SuggestNewsSourcesOutputSchema>;

export async function suggestNewsSources(input: SuggestNewsSourcesInput): Promise<SuggestNewsSourcesOutput> {
  return suggestNewsSourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNewsSourcesPrompt',
  input: {schema: SuggestNewsSourcesInputSchema},
  output: {schema: SuggestNewsSourcesOutputSchema},
  prompt: `You are a news expert. You will suggest news sources based on the topic.

  Topic: {{{topic}}}
  Bias: {{{bias}}}

  Suggest 5 valid URLs of news sources related to the topic.`,
});

const suggestNewsSourcesFlow = ai.defineFlow(
  {
    name: 'suggestNewsSourcesFlow',
    inputSchema: SuggestNewsSourcesInputSchema,
    outputSchema: SuggestNewsSourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

