'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  Home,
  LayoutGrid,
  Scroll,
  Timer,
  FileQuestion,
  BrainCircuit,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/notes', icon: Scroll, label: 'Notes' },
  { href: '/tasks', icon: ClipboardList, label: 'Tasks' },
  { href: '/timetable', icon: Calendar, label: 'Timetable' },
  { href: '/flashcards', icon: BookOpen, label: 'Flashcards' },
  { href: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { href: '/quizzes', icon: FileQuestion, label: 'Quizzes' },
  { href: '/search', icon: LayoutGrid, label: 'Smart Search' },
];

export function AppSidebar({ isMobile = false, closeSheet }: { isMobile?: boolean, closeSheet?: () => void }) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div
        className={cn(
          'hidden border-r bg-muted/40 md:block',
          isMobile && 'block border-r-0'
        )}
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-20 items-center border-b px-4 lg:px-6">
            <Link href="#" className="flex items-center gap-2 font-semibold" onClick={(e) => e.preventDefault()}>
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="">StudyBrain</span>
            </Link>
            {isMobile && closeSheet ? (
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={closeSheet}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            ) : (
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-auto py-2">
            {isMobile ? (
              <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeSheet}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:scale-105 hover:translate-x-1',
                        { 'bg-muted text-primary': isActive }
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            ) : (
                 <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname.startsWith(href);
                        return (
                        <Tooltip key={href}>
                            <TooltipTrigger asChild>
                            <Link
                                href={href}
                                className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:scale-105 hover:translate-x-1',
                                { 'bg-muted text-primary': isActive }
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                            </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{label}</TooltipContent>
                        </Tooltip>
                        );
                    })}
                    </nav>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
