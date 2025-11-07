'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type Quote = {
  q: string;
  a: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Set a reliable fallback quote, as the API may have CORS issues.
    setQuote({ q: "The secret to getting ahead is getting started.", a: "Mark Twain" });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await login(values.email, values.password);
    if (success) {
      router.push('/dashboard');
    }
  }

  return (
    <Card className="glassmorphism">
      <CardHeader className="text-center">
         <Link href="/" className="flex justify-center items-center gap-2 mb-2 text-current hover:text-primary transition-colors">
           <GraduationCap className="h-8 w-8" />
           <CardTitle className="text-3xl font-headline">StudyMate Lite</CardTitle>
         </Link>
        <CardDescription>Log in to your local study hub</CardDescription>
      </CardHeader>
      <CardContent>
        {quote && (
          <div className="mb-4 p-4 border-l-4 border-primary bg-muted/50 text-sm italic">
            <p>"{quote.q}"</p>
            <p className="text-right font-medium not-italic">- {quote.a}</p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Button variant="link" asChild className="p-0">
            <Link href="/signup">Sign up</Link>
          </Button>
        </p>
         <Button variant="ghost" asChild className="text-sm text-muted-foreground">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
