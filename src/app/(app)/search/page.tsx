'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="space-y-8">
       <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search through notes, tasks, materials, and flashcards..."
              className="pl-10 h-12 text-lg"
            />
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Search results will appear here. The search functionality is coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
