'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { BookOpen, Calendar, ClipboardList, Timer, Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const navCards = [
    { title: "Notes", icon: BookOpen, href: "/notes", description: "Create & manage notes" },
    { title: "Tasks", icon: ClipboardList, href: "/tasks", description: "Organize your to-do list" },
    { title: "Timetable", icon: Calendar, href: "/timetable", description: "Plan your study week" },
    { title: "Pomodoro", icon: Timer, href: "/pomodoro", description: "Focus with the timer" },
];

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

export default function Dashboard() {
  const { user } = useAuth();
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
        if(response.status === 404) {
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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back, {user?.data.name || user?.username}!</h1>
        <p className="text-muted-foreground">Ready to be productive today?</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Wikipedia Search</CardTitle>
          <CardDescription>Search for any topic to get a quick summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Photosynthesis, Roman Empire..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoadingSearch}>
              <SearchIcon className="mr-2 h-4 w-4" /> 
              {isLoadingSearch ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </CardContent>
        {isLoadingSearch && <CardContent><p>Loading search results...</p></CardContent>}
        {searchError && <CardContent><p className="text-destructive">{searchError}</p></CardContent>}
        {searchedArticle && (
          <CardContent className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-2">{searchedArticle.title}</h3>
            <p className="text-muted-foreground line-clamp-4">{searchedArticle.extract}</p>
            <a href={searchedArticle.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
              Read more on Wikipedia
            </a>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {navCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card className="hover:border-primary transition-colors hover:shadow-xl h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">{card.title}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glassmorphism">
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>Tasks you should focus on today.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No tasks due today. Add some!</p>
          </CardContent>
        </Card>
        <Card className="col-span-3 glassmorphism">
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
            <CardDescription>Your weekly study activity.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">No progress yet. Start studying!</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
