export interface NewsSource {
  id: string;
  name: string;
  url: string;
  bias?: 'Left' | 'Center' | 'Right' | 'N/A';
}

export interface NewsSummary {
  id: string;
  title: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  date: string; // ISO string or formatted date string
  imageUrl?: string;
}

export interface SuggestedSource {
  id: string;
  name: string; // Could be a name or a URL
  // If it's just a name, we might need another step to find its URL
}
