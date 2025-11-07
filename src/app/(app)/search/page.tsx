'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

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
  const [searchedArticle, setSearchedArticle] = useState<WikiArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingSearch(true);
    setSearchError(null);
    setSearchedArticle(null);

    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No Wikipedia article found for "${searchQuery}".`);
        }
        throw new Error('Failed to fetch article from Wikipedia.');
      }
      const data: WikiArticle = await response.json();
      setSearchedArticle(data);
    } catch (error: any) {
      setSearchError(error.message);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="relative">
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

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>Currently searching Wikipedia. Local search coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSearch && <p>Loading search results...</p>}
          {searchError && <p className="text-destructive">{searchError}</p>}
          {searchedArticle ? (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-2">{searchedArticle.title}</h3>
              <p className="text-muted-foreground line-clamp-4">{searchedArticle.extract}</p>
              <a href={searchedArticle.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                Read more on Wikipedia
              </a>
            </div>
          ) : (
            !isLoadingSearch && !searchError && <p>Search results will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
