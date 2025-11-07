'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateFlashcardsAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2, PartyPopper } from 'lucide-react';
import type { Flashcard, FlashcardDeck } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: null,
  errors: null,
  flashcards: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" /> Generate Flashcards
        </>
      )}
    </Button>
  );
}

export function FlashcardGenerator() {
  const [state, formAction] = useActionState(generateFlashcardsAction, initialState);
  const { user, updateUserData } = useAuth();
  const [deckName, setDeckName] = useState('');
  const { toast } = useToast();

  const handleSaveDeck = () => {
    if (!deckName.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a deck name.' });
      return;
    }
    if (!user || !state.flashcards) return;

    const newDeck: FlashcardDeck = {
      id: crypto.randomUUID(),
      name: deckName,
      cards: state.flashcards.map(card => ({...card, id: crypto.randomUUID()}))
    };
    
    const updatedDecks = [...(user.data.flashcardDecks || []), newDeck];
    updateUserData({ flashcardDecks: updatedDecks });
    
    toast({ title: 'Success!', description: `Deck "${deckName}" saved successfully.` });
    setDeckName('');
    // Ideally, we'd also clear the form state here, but that requires more complex state management.
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>AI Flashcard Generator</CardTitle>
          <CardDescription>Paste any text below, and AI will create flashcards for you.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <Textarea
              name="text"
              placeholder="Paste your notes, an article, or any text here... (minimum 50 characters)"
              className="min-h-[250px] font-code"
              required
            />
            {state.errors?.text && (
              <p className="text-sm font-medium text-destructive mt-2">{state.errors.text[0]}</p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated Cards</CardTitle>
          <CardDescription>Review the generated cards here before saving.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.flashcards && state.flashcards.length > 0 ? (
            <div className="space-y-4">
               <div className="flex items-center gap-2 p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <PartyPopper className="h-6 w-6 text-green-600 dark:text-green-400" />
                <p className="font-medium text-green-800 dark:text-green-200">Success! Here are your new flashcards. Name your deck and save it.</p>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter new deck name..." 
                  value={deckName} 
                  onChange={(e) => setDeckName(e.target.value)}
                />
                <Button onClick={handleSaveDeck}>Save Deck</Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {state.flashcards.map((card: Flashcard, index: number) => (
                  <div key={index} className="p-3 border rounded-md bg-muted/50">
                    <p className="font-semibold">Front: <span className="font-normal">{card.front}</span></p>
                    <p className="font-semibold">Back: <span className="font-normal">{card.back}</span></p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
              <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your generated cards will appear here.</p>
            </div>
          )}

          {state.message && state.message !== 'Success' && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
