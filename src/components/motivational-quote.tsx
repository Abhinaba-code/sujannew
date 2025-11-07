'use client';

import { useEffect, useState } from 'react';
import { RefreshCcw, Quote as QuoteIcon } from 'lucide-react';
import { Button } from './ui/button';

type Quote = {
  q: string; // quote
  a: string; // author
};

// A collection of fallback quotes to be used if the API fails.
const fallbackQuotes: Quote[] = [
    { q: "The secret to getting ahead is getting started.", a: "Mark Twain" },
    { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
    { q: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", a: "Thomas A. Edison" },
];

export function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      // The direct API call is blocked by CORS. We will rely on fallbacks.
      // We will select a random quote from our fallback list.
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
    } catch (error) {
      console.error("Failed to set quote", error);
      // Ensure a quote is always set, even if Math.random fails.
      setQuote(fallbackQuotes[0]);
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
