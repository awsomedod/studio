import { NewsSource } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface SourceCardProps {
  source: NewsSource;
  onRemove: (sourceId: string) => Promise<void>; // Server action for removal
}

export function SourceCard({ source, onRemove }: SourceCardProps) {
  // This component is a server component, but it needs to invoke a server action.
  // We achieve this by passing the server action (or a wrapper) as a prop.
  // The form element allows invoking the server action.

  const handleRemove = async () => {
    "use server"; // This is a server action defined inline or passed as a prop
    await onRemove(source.id);
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{source.name}</CardTitle>
        <CardDescription className="truncate text-sm">
          <Link href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
            {source.url} <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {source.bias && source.bias !== 'N/A' && (
          <Badge variant={
            source.bias === 'Left' ? 'destructive' : 
            source.bias === 'Right' ? 'default' : // Assuming default is blue-ish
            'secondary' // Center or other
          } className="capitalize">
            {source.bias} Bias
          </Badge>
        )}
         {source.bias === 'N/A' && (
          <Badge variant="outline">Bias N/A</Badge>
        )}
      </CardContent>
      <CardFooter>
        <form action={handleRemove} className="w-full">
          <Button type="submit" variant="destructive" size="sm" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
