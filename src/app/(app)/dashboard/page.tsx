'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { BookOpen, Calendar, ClipboardList, Timer } from 'lucide-react';

const navCards = [
    { title: "Notes", icon: BookOpen, href: "/notes", description: "Create & manage notes" },
    { title: "Tasks", icon: ClipboardList, href: "/tasks", description: "Organize your to-do list" },
    { title: "Timetable", icon: Calendar, href: "/timetable", description: "Plan your study week" },
    { title: "Pomodoro", icon: Timer, href: "/pomodoro", description: "Focus with the timer" },
];

type Quote = {
  q: string;
  a: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Fallback quote
    setQuote({ q: "The secret of getting ahead is getting started.", a: "Mark Twain" });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back, {user?.data.name || user?.username}!</h1>
        <p className="text-muted-foreground">Ready to be productive today?</p>
      </div>

      {quote && (
          <Card className="glassmorphism">
              <CardContent className="p-6">
                  <blockquote className="text-lg italic">"{quote.q}"</blockquote>
                  <p className="text-right mt-2 font-medium text-primary">- {quote.a}</p>
              </CardContent>
          </Card>
      )}

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
