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
import { ArrowLeft, BrainCircuit } from 'lucide-react';

const formSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, 'Username must contain both letters and numbers (e.g., sujan2025)'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await signup(values.username, values.email, values.password);
    if (success) {
      router.push('/profile/edit');
    }
  }

  return (
    <Card className="glassmorphism">
      <CardHeader className="text-center">
        <Link href="/" className="flex justify-center items-center gap-2 mb-2 text-current hover:text-primary transition-colors">
           <BrainCircuit className="h-8 w-8" />
           <CardTitle className="text-3xl font-headline">StudyBrain</CardTitle>
         </Link>
        <CardDescription>Create your local-only account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input type="password" placeholder="Choose a password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" asChild className="p-0">
            <Link href="/login">Log in</Link>
          </Button>
        </p>
         <Button variant="ghost" asChild className="text-sm text-muted-foreground">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
