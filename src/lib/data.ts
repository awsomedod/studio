import type { NewsSource, NewsSummary } from '@/types';

export const initialNewsSources: NewsSource[] = [
  { id: '1', name: 'Tech Chronicles', url: 'https://techchronicles.example.com', bias: 'Center' },
  { id: '2', name: 'Global Affairs Weekly', url: 'https://globalaffairs.example.com', bias: 'Left' },
  { id: '3', name: 'Market Watchers', url: 'https://marketwatchers.example.com', bias: 'Right' },
];

export const initialNewsSummaries: NewsSummary[] = [
  {
    id: 's1',
    title: 'Revolutionary AI Model Announced',
    content: 'A new AI model promises to change the landscape of natural language processing with its unprecedented capabilities and efficiency. Experts are both excited and cautious about its potential impact.',
    sourceName: 'Tech Chronicles',
    sourceUrl: 'https://techchronicles.example.com/ai-model',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 's2',
    title: 'International Summit Concludes with New Climate Accord',
    content: 'Leaders from around the world have agreed on a new set of measures to combat climate change, though critics argue the commitments do not go far enough to address the urgency of the crisis.',
    sourceName: 'Global Affairs Weekly',
    sourceUrl: 'https://globalaffairs.example.com/climate-accord',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 's3',
    title: 'Stock Market Hits Record High Amidst Economic Optimism',
    content: 'The stock market surged to a new all-time high today, fueled by positive economic indicators and investor confidence in corporate earnings. Analysts predict continued growth in the coming quarter.',
    sourceName: 'Market Watchers',
    sourceUrl: 'https://marketwatchers.example.com/market-high',
    date: new Date().toISOString().split('T')[0], // Today
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

// Simulating a "database" or state for sources
let userSources: NewsSource[] = [...initialNewsSources];

export const getSourcesFromStore = (): NewsSource[] => userSources;

export const addSourceToStore = (source: NewsSource): void => {
  if (!userSources.find(s => s.url === source.url)) {
    userSources.push(source);
  }
};

export const removeSourceFromStore = (sourceId: string): void => {
  userSources = userSources.filter(s => s.id !== sourceId);
};
