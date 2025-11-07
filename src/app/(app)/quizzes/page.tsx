
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
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

type Difficulty = 'easy' | 'medium' | 'hard';

type ClassLevel = 'elementary' | 'middle' | 'high' | 'university';

type QuizSettings = {
    amount: number;
    category: string;
    classLevel: ClassLevel;
    timeLimit: number; // in seconds, 0 for no limit
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

const classLevelToDifficulty: Record<ClassLevel, Difficulty> = {
    elementary: 'easy',
    middle: 'medium',
    high: 'hard',
    university: 'hard',
};


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
      classLevel: 'middle',
      timeLimit: 0,
  });
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
  
  useEffect(() => {
    if (quizState !== 'playing' || timeLeft === null) return;

    if (timeLeft === 0) {
        setQuizState('finished');
        return;
    }

    const timer = setInterval(() => {
        setTimeLeft(prev => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, timeLeft]);


  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const { amount, category, classLevel, timeLimit } = settings;
    const difficulty = classLevelToDifficulty[classLevel];
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
      
      setQuizState('playing');
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      if (timeLimit > 0) {
        setTimeLeft(timeLimit);
      } else {
        setTimeLeft(null);
      }
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
    setTimeLeft(null);
  };
  
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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
                    <Label htmlFor="class-level">Class Level (sets difficulty)</Label>
                     <Select value={settings.classLevel} onValueChange={(val) => setSettings(s => ({...s, classLevel: val as ClassLevel}))}>
                        <SelectTrigger id="class-level"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="elementary">Elementary (Easy)</SelectItem>
                            <SelectItem value="middle">Middle School (Medium)</SelectItem>
                            <SelectItem value="high">High School (Hard)</SelectItem>
                            <SelectItem value="university">University (Hard)</SelectItem>
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
                    <Label htmlFor="time-limit">Time Limit</Label>
                    <Select value={String(settings.timeLimit)} onValueChange={(val) => setSettings(s => ({...s, timeLimit: Number(val)}))}>
                        <SelectTrigger id="time-limit"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">No Limit</SelectItem>
                            <SelectItem value="60">1 Minute</SelectItem>
                            <SelectItem value="300">5 Minutes</SelectItem>
                            <SelectItem value="600">10 Minutes</SelectItem>
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
          {timeLeft === 0 && <CardDescription>Time's up!</CardDescription>}
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
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Personalized Quiz</CardTitle>
                <CardDescription>Category: {decodeHtml(currentQuestion.category)} | Difficulty: {currentQuestion.difficulty}</CardDescription>
            </div>
            {timeLeft !== null && (
                <div className="flex items-center gap-2 text-lg font-mono p-2 rounded-md bg-muted">
                    <Clock className="h-5 w-5"/>
                    <span>{formatTime(timeLeft)}</span>
                </div>
            )}
        </div>
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
                    isAnswered && isCorrect && "bg-green-100 border-green-400 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900",
                    isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-400 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                )}
                onClick={() => handleAnswerSelect(answer)}
                disabled={isAnswered}
              >
                {isAnswered && isCorrect && <CheckCircle className="mr-2 text-green-600 dark:text-green-400"/>}
                {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 text-red-600 dark:text-red-400"/>}
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

    