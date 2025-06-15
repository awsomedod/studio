import { getNewsSummariesAction, refreshSummariesAction, getGlobalSummaryAction } from '@/lib/actions';
import { NewsCard } from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Newspaper } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

export default async function DashboardPage() {
  const summaries = await getNewsSummariesAction();
  const globalSummary = await getGlobalSummaryAction();

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
          Daily News Brief
        </h1>
        <form action={refreshSummariesAction}>
          <Button type="submit" variant="outline" className="shadow-md">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Summaries
          </Button>
        </form>
      </div>

      {globalSummary && globalSummary !== "No global summary generated yet." && (
        <Alert className="mb-8 bg-secondary/50 border-primary/30 shadow-md">
          <Newspaper className="h-5 w-5 text-primary" />
          <AlertTitle className="font-headline text-lg text-primary">Overall News Highlight</AlertTitle>
          <AlertDescription className="text-foreground/80">
            {globalSummary}
          </AlertDescription>
        </Alert>
      )}

      {summaries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No news summaries available yet.</p>
          <p className="text-md text-muted-foreground mt-2">Try adding some sources or refreshing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map(summary => (
            <NewsCard key={summary.id} summary={summary} />
          ))}
        </div>
      )}
    </div>
  );
}
