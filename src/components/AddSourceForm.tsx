'use client';

import { useRef, useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addNewsSourceAction, confirmAddSource } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { SuggestedSource, NewsSource } from '@/types';
import { PlusCircle, Info, Search, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Processing...' : label}
    </Button>
  );
}

export function AddSourceForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const [suggestState, suggestFormAction] = useFormState(addNewsSourceAction, { success: false });
  const suggestFormRef = useRef<HTMLFormElement>(null);

  const [suggestedSources, setSuggestedSources] = useState<SuggestedSource[]>([]);

  const handleSuggestSubmit = async (formData: FormData) => {
    const result = await addNewsSourceAction(formData);
    if (result.success) {
      toast({ title: "Suggestion Successful", description: result.message, variant: 'default' });
      if (result.suggestedSources) {
        setSuggestedSources(result.suggestedSources);
      }
      suggestFormRef.current?.reset();
    } else {
      toast({ title: "Suggestion Failed", description: result.message, variant: 'destructive' });
    }
  };

  const handleConfirmAdd = (source: SuggestedSource) => {
    startTransition(async () => {
      // For simplicity, we assume suggested source name is a URL or can be used as one.
      // A more robust solution would involve checking if it's a valid URL
      // or providing another AI step to find the URL for a name.
      let urlToAdd = source.name;
      if (!source.name.startsWith('http://') && !source.name.startsWith('https://')) {
         // If not a URL, maybe try prepending https as a guess or prompt user for URL
         // For now, we'll just show a message that it can't be added directly
         toast({ title: "Cannot Add Source", description: `"${source.name}" is not a valid URL. Please add sources by URL directly.`, variant: 'destructive' });
         return;
      }

      const result = await confirmAddSource(urlToAdd, source.name);
      if (result.success) {
        toast({ title: 'Source Added', description: result.message, variant: 'default' });
        setSuggestedSources(prev => prev.filter(s => s.id !== source.id)); // Remove from suggested list
      } else {
        toast({ title: 'Failed to Add Source', description: result.message, variant: 'destructive' });
      }
    });
  };
  
  // Direct URL add form
  const [directUrl, setDirectUrl] = useState('');
  const [directSourceName, setDirectSourceName] = useState('');
  const [directBias, setDirectBias] = useState<NewsSource['bias']>('N/A');

  const handleDirectAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl) {
        toast({ title: 'Error', description: 'URL is required.', variant: 'destructive' });
        return;
    }
    startTransition(async () => {
        const result = await confirmAddSource(directUrl, directSourceName, directBias);
        if (result.success) {
            toast({ title: 'Source Added', description: result.message, variant: 'default' });
            setDirectUrl('');
            setDirectSourceName('');
            setDirectBias('N/A');
        } else {
            toast({ title: 'Failed to Add Source', description: result.message, variant: 'destructive' });
        }
    });
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <Search className="mr-2 h-6 w-6 text-primary" /> Suggest Sources by Topic
          </CardTitle>
          <CardDescription>Let AI suggest news sources based on a topic and political bias.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSuggestSubmit} ref={suggestFormRef} className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" name="topic" placeholder="e.g., Artificial Intelligence, Climate Change" required />
            </div>
            <div>
              <Label htmlFor="bias">Political Bias (Optional)</Label>
              <Select name="bias" defaultValue="any">
                <SelectTrigger>
                  <SelectValue placeholder="Select bias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Center">Center</SelectItem>
                  <SelectItem value="Right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SubmitButton label="Suggest Sources" />
          </form>

          {suggestedSources.length > 0 && (
            <div className="mt-6">
              <h3 className="font-headline text-lg mb-2">Suggested Sources:</h3>
              <ul className="space-y-2">
                {suggestedSources.map(source => (
                  <li key={source.id} className="flex items-center justify-between p-2 border rounded-md bg-secondary/30">
                    <span>{source.name}</span>
                    <Button size="sm" onClick={() => handleConfirmAdd(source)} disabled={isPending}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <PlusCircle className="mr-2 h-6 w-6 text-primary" /> Add Source by URL
          </CardTitle>
          <CardDescription>Manually add a specific news source by providing its URL.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDirectAdd} className="space-y-4">
            <div>
              <Label htmlFor="directUrl">Source URL</Label>
              <Input id="directUrl" name="directUrl" type="url" placeholder="https://www.example.com/news" value={directUrl} onChange={e => setDirectUrl(e.target.value)} required />
            </div>
             <div>
              <Label htmlFor="directSourceName">Source Name (Optional)</Label>
              <Input id="directSourceName" name="directSourceName" placeholder="e.g., Example News" value={directSourceName} onChange={e => setDirectSourceName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="directBias">Political Bias (Optional)</Label>
              <Select name="directBias" value={directBias} onValueChange={(value) => setDirectBias(value as NewsSource['bias'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">N/A</SelectItem>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Center">Center</SelectItem>
                  <SelectItem value="Right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Adding...' : 'Add Source'}
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}
