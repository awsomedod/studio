import { getNewsSources, removeNewsSourceAction } from '@/lib/actions';
import { SourceCard } from '@/components/SourceCard';
import { AddSourceForm } from '@/components/AddSourceForm';
import { ListFilter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const sources = await getNewsSources();

  // Wrapper for remove action to be passed to SourceCard
  async function handleRemoveSource(sourceId: string) {
    "use server";
    await removeNewsSourceAction(sourceId);
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary flex items-center">
          <ListFilter className="mr-3 h-8 w-8" />
          Manage News Sources
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Add or remove news sources to customize your daily summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddSourceForm />
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-headline text-2xl mb-4">Your Current Sources</h2>
          {sources.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg">
              <p className="text-xl text-muted-foreground">No news sources added yet.</p>
              <p className="text-md text-muted-foreground mt-2">Use the form to add your first source.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sources.map(source => (
                <SourceCard key={source.id} source={source} onRemove={handleRemoveSource} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
