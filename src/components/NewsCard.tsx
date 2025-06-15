import Image from 'next/image';
import Link from 'next/link';
import { NewsSummary } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  summary: NewsSummary;
}

export function NewsCard({ summary }: NewsCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      {summary.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={summary.imageUrl}
            alt={summary.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="news article illustration"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl lg:text-2xl leading-tight">
          {summary.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          From: {summary.sourceName} &bull; {new Date(summary.date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/90 leading-relaxed">{summary.content}</p>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <Link href={summary.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary hover:underline">
          Read Original Article
          <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
