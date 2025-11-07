'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { FlashcardDeck, Flashcard } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, BookOpenCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

function FlashcardViewer({ card }: { card: Flashcard }) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  return (
    <div className="w-full h-64 [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={cn(
          "relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d]",
          { "[transform:rotateY(180deg)]": isFlipped }
        )}
      >
        <Card className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center">
          <CardContent className="p-6 text-xl md:text-2xl font-semibold">{card.front}</CardContent>
        </Card>
        <Card className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
          <CardContent className="p-6 text-lg md:text-xl">{card.back}</CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DeckPage() {
  const { deckId } = useParams();
  const { user } = useAuth();
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    if (user && deckId) {
      const foundDeck = user.data.flashcardDecks?.find(d => d.id === deckId);
      setDeck(foundDeck || null);
    }
  }, [user, deckId]);

  if (!deck) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading deck or deck not found...</p>
      </div>
    );
  }

  const { cards } = deck;
  const currentCard = cards[currentCardIndex];

  const goToNextCard = () => {
    setCurrentCardIndex(prev => (prev + 1) % cards.length);
  };

  const goToPrevCard = () => {
    setCurrentCardIndex(prev => (prev - 1 + cards.length) % cards.length);
  };
  
  const progress = cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/flashcards" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Decks
      </Link>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold font-headline">{deck.name}</h1>
        <div className="flex items-center gap-2 text-lg">
          <BookOpenCheck className="h-6 w-6" />
          <span>{currentCardIndex + 1} / {cards.length}</span>
        </div>
      </div>
      
      <Progress value={progress} className="mb-6" />

      {cards.length > 0 ? (
        <div className="space-y-6">
          <FlashcardViewer card={currentCard} />
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={goToPrevCard} disabled={cards.length <= 1}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <p className="text-muted-foreground">Click card to flip</p>
            <Button variant="outline" onClick={goToNextCard} disabled={cards.length <= 1}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
            <CardContent>
                <p>This deck has no cards. Add some!</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
