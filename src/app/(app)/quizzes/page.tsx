
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type Question = {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type QuizApiResponse = {
  response_code: number;
  results: Question[];
};

type Category = {
    id: number;
    name: string;
}

type QuizSettings = {
    amount: number;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

// Function to decode HTML entities
function decodeHtml(html: string) {
    if (typeof window === 'undefined') {
        return html;
    }
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export default function QuizzesPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'settings' | 'playing' | 'finished'>('settings');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<QuizSettings>({
      amount: 10,
      category: 'any',
      difficulty: 'medium',
  });

  useEffect(() => {
    async function fetchCategories() {
        try {
            const response = await fetch('https://opentdb.com/api_category.php');
            const data = await response.json();
            setCategories(data.trivia_categories);
        } catch (e) {
            console.error("Failed to fetch categories", e);
        }
    }
    fetchCategories();
  }, []);


  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuizState('playing');
    
    const { amount, category, difficulty } = settings;
    const categoryParam = category === 'any' ? '' : `&category=${category}`;

    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${amount}${categoryParam}&difficulty=${difficulty}&type=multiple`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions from the trivia API.');
      }
      const data: QuizApiResponse = await response.json();
      if (data.response_code !== 0) {
         throw new Error('The trivia API could not return questions for your selection. Try a different category.');
      } else {
        setQuestions(data.results.map(q => ({...q, question: decodeHtml(q.question)})));
      }

      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } catch (err: any) {
      setError(err.message);
      setQuizState('settings');
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const currentQuestion = questions[currentQuestionIndex];
  
  const answers = useMemo(() => {
    if (!currentQuestion) return [];
    const answs = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    return answs.sort(() => Math.random() - 0.5).map(a => decodeHtml(a));
  }, [currentQuestion]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === decodeHtml(currentQuestion.correct_answer)) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
        setIsAnswered(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        setQuizState('finished');
    }
  };

  const restartQuiz = () => {
    setQuizState('settings');
    setQuestions([]);
    setError(null);
  };
  
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (quizState === 'settings' || isLoading) {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Customize Your Quiz</CardTitle>
                <CardDescription>Choose your settings and start the quiz!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && <p className="text-destructive mb-4 text-center">{error}</p>}
                <div className="space-y-2">
                    <Label htmlFor="num-questions">Number of Questions</Label>
                    <Select value={String(settings.amount)} onValueChange={(val) => setSettings(s => ({...s, amount: Number(val)}))}>
                        <SelectTrigger id="num-questions"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={settings.category} onValueChange={(val) => setSettings(s => ({...s, category: val}))}>
                        <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any Category</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                     <Select value={settings.difficulty} onValueChange={(val) => setSettings(s => ({...s, difficulty: val as any}))}>
                        <SelectTrigger id="difficulty"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={fetchQuestions} disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Starting...</> : 'Start Quiz'}
                </Button>
            </CardFooter>
        </Card>
    );
  }

  if (quizState === 'finished') {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">Your Score: {score} / {questions.length}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={restartQuiz} className="mx-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> Play Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center">No questions available. Try fetching again.</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personalized Quiz</CardTitle>
        <CardDescription>Category: {decodeHtml(currentQuestion.category)} | Difficulty: {currentQuestion.difficulty}</CardDescription>
        <div className="flex items-center pt-2">
            <span className="text-sm text-muted-foreground mr-2">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <Progress value={progress} className="flex-grow" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-semibold">{currentQuestion.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {answers.map((answer, index) => {
            const isCorrect = answer === decodeHtml(currentQuestion.correct_answer);
            const isSelected = answer === selectedAnswer;
            
            return (
              <Button
                key={index}
                variant="outline"
                className={cn(
                    "h-auto justify-start text-left whitespace-normal py-3",
                    isAnswered && isCorrect && "bg-green-100 border-green-400 text-green-800 hover:bg-green-200",
                    isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-400 text-red-800 hover:bg-red-200"
                )}
                onClick={() => handleAnswerSelect(answer)}
                disabled={isAnswered}
              >
                {isAnswered && isCorrect && <CheckCircle className="mr-2 text-green-600"/>}
                {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 text-red-600"/>}
                {answer}
              </Button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
          <Button variant="ghost" onClick={restartQuiz}>Quit Quiz</Button>
          {isAnswered && (
             <Button onClick={handleNextQuestion}>
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
             </Button>
          )}
      </CardFooter>
    </Card>
  );
}
