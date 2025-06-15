'use server';

import { revalidatePath } from 'next/cache';
import { suggestNewsSources as aiSuggestNewsSources } from '@/ai/flows/suggest-news-sources';
import { summarizeNews as aiSummarizeNews } from '@/ai/flows/summarize-news';
import type { NewsSource, NewsSummary, SuggestedSource } from '@/types';
import { initialNewsSummaries, getSourcesFromStore, addSourceToStore, removeSourceFromStore } from './data';

// Simulate user session/data store
let userNewsSources: NewsSource[] = getSourcesFromStore();
let globalSummary: string = "No global summary generated yet.";

export async function getNewsSources(): Promise<NewsSource[]> {
  return userNewsSources;
}

export async function addNewsSourceAction(formData: FormData): Promise<{ success: boolean; message?: string; suggestedSources?: SuggestedSource[] } > {
  const topic = formData.get('topic') as string;
  const bias = formData.get('bias') as string;

  if (!topic) {
    return { success: false, message: 'Topic is required.' };
  }

  try {
    const result = await aiSuggestNewsSources({ topic, bias: bias || 'any' });
    const suggested = result.sources.map((srcStr, index) => ({
      id: `suggested-${Date.now()}-${index}`,
      name: srcStr, // Assuming srcStr is a name or URL
    }));
    
    // For demo purposes, let's try to add the first suggested source directly if it looks like a URL
    // In a real app, user would select from these suggestions
    if (suggested.length > 0) {
        const firstSuggestion = suggested[0].name;
        if (firstSuggestion.startsWith('http://') || firstSuggestion.startsWith('https://')) {
            const newSource: NewsSource = {
                id: `user-${Date.now()}`,
                name: new URL(firstSuggestion).hostname, // Extract hostname as name
                url: firstSuggestion,
                bias: bias as NewsSource['bias'] || 'N/A',
            };
            if (!userNewsSources.find(s => s.url === newSource.url)) {
              userNewsSources.push(newSource);
              addSourceToStore(newSource); // Update our mock store
            }
        }
    }

    revalidatePath('/dashboard/sources');
    return { success: true, message: `Sources related to "${topic}" suggested. First URL-like suggestion auto-added if found.`, suggestedSources: suggested };
  } catch (error) {
    console.error('Error suggesting news sources:', error);
    return { success: false, message: 'Failed to suggest news sources.' };
  }
}

export async function confirmAddSource(sourceUrl: string, sourceName?: string, bias?: NewsSource['bias']): Promise<{ success: boolean; message?: string }> {
    if (!sourceUrl.startsWith('http://') && !sourceUrl.startsWith('https://')) {
        return { success: false, message: 'Invalid URL provided.' };
    }
    const newSource: NewsSource = {
        id: `user-${Date.now()}`,
        name: sourceName || new URL(sourceUrl).hostname,
        url: sourceUrl,
        bias: bias || 'N/A',
    };
    if (!userNewsSources.find(s => s.url === newSource.url)) {
        userNewsSources.push(newSource);
        addSourceToStore(newSource);
        revalidatePath('/dashboard/sources');
        return { success: true, message: `Source "${newSource.name}" added.` };
    }
    return { success: false, message: `Source "${newSource.name}" already exists.` };
}


export async function removeNewsSourceAction(sourceId: string): Promise<{ success: boolean; message?: string }> {
  userNewsSources = userNewsSources.filter(source => source.id !== sourceId);
  removeSourceFromStore(sourceId); // Update our mock store
  revalidatePath('/dashboard/sources');
  return { success: true, message: 'Source removed.' };
}

export async function getNewsSummariesAction(): Promise<NewsSummary[]> {
  // For now, return hardcoded summaries.
  // Later, this could integrate with AI-generated summaries.
  return initialNewsSummaries;
}

export async function refreshSummariesAction(): Promise<{ success: boolean; message?: string, generalSummary?: string }> {
  const currentSources = await getNewsSources();
  if (currentSources.length === 0) {
    return { success: false, message: 'No news sources configured to generate summaries.' };
  }

  const sourceUrls = currentSources.map(s => s.url);

  try {
    const result = await aiSummarizeNews({ newsSources: sourceUrls });
    globalSummary = result.summary; // Store the AI-generated single string summary

    // Here, you might also trigger an update of individual NewsSummary items if the AI provided structured data
    // For now, we just update the global summary and rely on hardcoded items for cards
    revalidatePath('/dashboard');
    return { success: true, message: 'News summaries refreshed (global summary updated).', generalSummary: globalSummary };
  } catch (error) {
    console.error('Error summarizing news:', error);
    return { success: false, message: 'Failed to refresh summaries.' };
  }
}

export async function getGlobalSummaryAction(): Promise<string> {
    return globalSummary;
}
