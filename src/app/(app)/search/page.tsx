'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Book, ClipboardCheck, BookOpen } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { Note, Task, FlashcardDeck } from '@/lib/types';
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";

type WikiArticle = {
  title: string;
  extract: string;
  originalimage?: {
    source: string;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
};

export default function SearchPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  const [searchedArticle, setSearchedArticle] = useState<WikiArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const localResults = useMemo(() => {
    if (!searchQuery.trim() || !user) {
      return { notes: [], tasks: [], decks: [] };
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    
    const notes = user.data.notes.filter(note => 
        note.title.toLowerCase().includes(lowercasedQuery) || 
        note.content.toLowerCase().includes(lowercasedQuery)
    );

    const tasks = user.data.tasks.filter(task => 
        task.title.toLowerCase().includes(lowercasedQuery)
    );

    const decks = user.data.flashcardDecks.map(deck => {
        const matchingCards = deck.cards.filter(card => 
            card.front.toLowerCase().includes(lowercasedQuery) ||
            card.back.toLowerCase().includes(lowercasedQuery)
        );
        const deckNameMatches = deck.name.toLowerCase().includes(lowercasedQuery);

        if (deckNameMatches || matchingCards.length > 0) {
            return { ...deck, cards: deckNameMatches ? deck.cards : matchingCards };
        }
        return null;
    }).filter((d): d is FlashcardDeck => d !== null);

    return { notes, tasks, decks };

  }, [searchQuery, user]);

  const handleSearch = async (query: string) => {
    setHasSearched(true);
    if (!query.trim()) {
        setSearchedArticle(null);
        setSearchError(null);
        return;
    };

    setIsLoadingSearch(true);
    setSearchError(null);
    setSearchedArticle(null);

    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      if (!response.ok) {
        if (response.status === 404) {
          // It's not really an error if no article is found, so we just won't show the card.
          setSearchedArticle(null);
        } else {
          throw new Error('Failed to fetch article from Wikipedia.');
        }
      } else {
        const data: WikiArticle = await response.json();
        setSearchedArticle(data);
      }
    } catch (error: any) {
      setSearchError(error.message);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  }

  const totalLocalResults = localResults.notes.length + localResults.tasks.length + localResults.decks.length;

  return (
    <div className="space-y-8">
      <form onSubmit={handleFormSubmit} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search through notes, tasks, materials, and flashcards..."
          className="pl-10 h-12 text-lg"
        />
        <Button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2" size="sm" disabled={isLoadingSearch}>
          {isLoadingSearch ? 'Searching...' : 'Search'}
        </Button>
      </form>

    {(hasSearched || searchQuery) && (
        <div className="space-y-6">
        {/* Local Search Results */}
        <Card>
            <CardHeader>
                <CardTitle>Local Results</CardTitle>
                <CardDescription>Found {totalLocalResults} results for "{searchQuery}" in your personal data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {totalLocalResults === 0 && !isLoadingSearch && <p>No local results found.</p>}

                {localResults.notes.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><Book className="h-5 w-5" /> Notes ({localResults.notes.length})</h3>
                        <div className="border rounded-md p-2 space-y-2 max-h-60 overflow-y-auto">
                        {localResults.notes.map(note => (
                            <Link key={note.id} href="/notes">
                                <div className="p-2 hover:bg-muted rounded-md">
                                    <p className="font-bold">{note.title}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                                </div>
                            </Link>
                        ))}
                        </div>
                    </div>
                )}

                {localResults.tasks.length > 0 && (
                     <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><ClipboardCheck className="h-5 w-5" /> Tasks ({localResults.tasks.length})</h3>
                        <div className="border rounded-md p-2 space-y-2 max-h-60 overflow-y-auto">
                        {localResults.tasks.map(task => (
                            <Link key={task.id} href="/tasks">
                                <div className="p-2 hover:bg-muted rounded-md flex items-center">
                                    <p className="font-bold">{task.title}</p>
                                    {task.completed && <Badge variant="secondary" className="ml-auto">Completed</Badge>}
                                </div>
                            </Link>
                        ))}
                        </div>
                    </div>
                )}
                
                {localResults.decks.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5" /> Flashcards ({localResults.decks.length})</h3>
                         <div className="border rounded-md p-2 space-y-2 max-h-60 overflow-y-auto">
                        {localResults.decks.map(deck => (
                            <Link key={deck.id} href={`/flashcards/${deck.id}`}>
                                <div className="p-2 hover:bg-muted rounded-md">
                                    <p className="font-bold">{deck.name}</p>
                                    <p className="text-sm text-muted-foreground">{deck.cards.length} cards match</p>
                                </div>
                            </Link>
                        ))}
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>

        {/* Wikipedia Search Results */}
        <Card>
            <CardHeader>
            <CardTitle>Wikipedia Results</CardTitle>
            <CardDescription>Web search results from Wikipedia for "{searchQuery}".</CardDescription>
            </CardHeader>
            <CardContent>
            {isLoadingSearch && <p>Loading Wikipedia results...</p>}
            {searchError && <p className="text-destructive">{searchError}</p>}
            {searchedArticle ? (
                <div className="pt-4 border-t">
                <h3 className="text-xl font-semibold mb-2">{searchedArticle.title}</h3>
                <p className="text-muted-foreground line-clamp-4">{searchedArticle.extract}</p>
                <a href={searchedArticle.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                    Read more on Wikipedia
                </a>
                </div>
            ) : (
                !isLoadingSearch && !searchError && <p>No Wikipedia article found for this query.</p>
            )}
            </CardContent>
        </Card>
        </div>
    )}

    {!(hasSearched || searchQuery) && (
        <Card>
            <CardHeader>
                <CardTitle>Search Everything</CardTitle>
                <CardDescription>Enter a query above to search your local notes, tasks, flashcards, and the web.</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-12">
                <SearchIcon className="mx-auto h-12 w-12" />
                <p>Your search results will appear here.</p>
            </CardContent>
        </Card>
    )}

    </div>
  );
}
