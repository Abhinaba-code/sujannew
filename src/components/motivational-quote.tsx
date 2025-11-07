'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';

type Quote = {
  q: string; // quote
  a: string; // author
};

export function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ZenQuotes API has CORS issues, so we use a proxy.
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/random');
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setQuote(data[0]);
      } else {
        throw new Error('No quote received');
      }
    } catch (error) {
      console.error("Failed to fetch quote", error);
      setError('Could not load a quote. Please try again.');
      // Set a fallback quote on error
      setQuote({ q: "The secret to getting ahead is getting started.", a: "Mark Twain" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Card className="glassmorphism">
      <CardContent className="p-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading quote...</p>}
        {error && !isLoading && <p className="text-sm text-destructive">{error}</p>}
        {quote && (
          <div className="space-y-2">
            <blockquote className="text-sm italic">"{quote.q}"</blockquote>
            <p className="text-xs text-right font-medium">- {quote.a}</p>
          </div>
        )}
        <div className="flex justify-end mt-2">
          <Button variant="ghost" size="icon" onClick={fetchQuote} className="h-6 w-6">
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">New Quote</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
