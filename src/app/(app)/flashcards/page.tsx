'use client';

import { FlashcardGenerator } from '@/components/flashcards/flashcard-generator';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FlashcardsPage() {
    const { user } = useAuth();
    const decks = user?.data.flashcardDecks || [];

    return (
      <div className="space-y-8">
        <FlashcardGenerator />

        <Card>
            <CardHeader>
                <CardTitle>Your Flashcard Decks</CardTitle>
                <CardDescription>Review your saved decks or create a new one.</CardDescription>
            </CardHeader>
            <CardContent>
                {decks.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {decks.map(deck => (
                            <Link href={`/flashcards/${deck.id}`} key={deck.id}>
                                <Card className="hover:border-primary transition-colors hover:shadow-lg h-full">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-lg">{deck.name}</CardTitle>
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <p>{deck.cards.length} cards</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">You don't have any flashcard decks yet.</p>
                        <p>Use the AI generator above to create your first deck!</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    );
}
