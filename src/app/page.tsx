'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit, BookOpen, ClipboardList, Calendar, Timer, Wand2 } from 'lucide-react';

const features = [
  { icon: BookOpen, text: 'Detailed Notes' },
  { icon: ClipboardList, text: 'Task Management' },
  { icon: Calendar, text: 'Study Timetables' },
  { icon: Timer, text: 'Pomodoro Timer' },
  { icon: Wand2, text: 'AI Flashcard Generation' },
];

const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-lg border-b sticky top-0 z-10">
        <Link href="/" className="flex items-center justify-center">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="ml-2 font-semibold font-headline">StudyBrain</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
            {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium hover:underline underline-offset-4">
                    {link.label}
                </Link>
            ))}
        </nav>
        <div className="ml-auto md:ml-4 flex gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Elevate Your Learning with <span className="text-primary">StudyBrain</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your all-in-one local solution for organized, efficient, and AI-powered studying. Take notes, manage tasks, and generate flashcards with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                  <BrainCircuit className="h-48 w-48 text-primary/10" strokeWidth={0.5} />
                  <Wand2 className="absolute h-32 w-32 text-primary/20 animate-pulse" strokeWidth={1} />
                  <BookOpen className="absolute h-40 w-40 text-primary/15 animate-pulse delay-500" strokeWidth={1} />
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  StudyBrain is packed with features to help you stay on top of your studies. All your data is stored locally on your device.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {features.map((feature) => (
                 <div key={feature.text} className="flex flex-col items-center text-center p-4">
                    <feature.icon className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="text-xl font-bold">{feature.text}</h3>
                 </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 StudyBrain. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/help" className="text-xs hover:underline underline-offset-4">
            Help
          </Link>
        </nav>
      </footer>
    </div>
  );
}
