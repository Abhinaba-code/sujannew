'use client';

import { useEffect, useState } from 'react';
import { RefreshCcw, Quote as QuoteIcon } from 'lucide-react';
import { Button } from './ui/button';

type Quote = {
  q: string; // quote
  a: string; // author
};

export function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setQuote(data[0]);
      } else {
        throw new Error('No quote received');
      }
    } catch (error) {
      console.error("Failed to fetch quote", error);
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
    <div className="p-4 border-l-4 border-primary bg-muted/50 text-sm italic relative rounded-r-lg">
        {isLoading ? (
             <p className="text-sm text-muted-foreground">Loading quote...</p>
        ) : quote && (
            <>
                <QuoteIcon className="absolute -left-3 -top-2 h-5 w-5 text-primary/80" />
                <p>"{quote.q}"</p>
                <p className="text-right font-medium not-italic">- {quote.a}</p>
            </>
        )}
        <Button variant="ghost" size="icon" onClick={fetchQuote} className="absolute right-0 top-0 h-7 w-7">
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">New Quote</span>
        </Button>
    </div>
  );
}
