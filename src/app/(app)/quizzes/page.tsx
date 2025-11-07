
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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

// Map subjects to OpenTDB category IDs
const categoryMap: { [key: string]: number } = {
    'history': 23,
    'geography': 22,
    'science': 17,
    'computers': 18,
    'math': 19,
    'mythology': 20,
    'sports': 21,
    'art': 25,
    'animals': 27,
    'general knowledge': 9,
    'physics': 17, // Science & Nature
    'chemistry': 17,
    'biology': 17,
};


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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Personalize quiz based on user data
    const subject = user?.data.favoriteSubject?.toLowerCase() || '';
    const age = user?.data.age ? parseInt(user?.data.age) : 0;

    let categoryId = categoryMap[subject] || 9; // Default to General Knowledge
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';

    if (age > 0) {
        if (age < 12) difficulty = 'easy';
        else if (age > 18) difficulty = 'hard';
    }

    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions from the trivia API.');
      }
      const data: QuizApiResponse = await response.json();
      if (data.response_code !== 0) {
         // If API can't return questions for the specific category, fallback to General Knowledge
         const fallbackResponse = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
         const fallbackData: QuizApiResponse = await fallbackResponse.json();
         if(fallbackData.response_code !== 0) {
            throw new Error('The trivia API could not return any questions.');
         }
         setQuestions(fallbackData.results.map(q => ({...q, question: decodeHtml(q.question)})));
      } else {
        setQuestions(data.results.map(q => ({...q, question: decodeHtml(q.question)})));
      }

      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchQuestions();
    }
  }, [fetchQuestions, user]);

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
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prev => prev + 1);
  };
  
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchQuestions}>
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  if (currentQuestionIndex >= questions.length && questions.length > 0) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">Your Score: {score} / {questions.length}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchQuestions} className="mx-auto">
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
      <CardFooter className="justify-end">
          {isAnswered && (
             <Button onClick={handleNextQuestion}>
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
             </Button>
          )}
      </CardFooter>
    </Card>
  );
}
