
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
  GraduationCap,
  X,
  Settings,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import type { Notification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

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

const secondaryNavItems = [
    // { href: '/settings', icon: Settings, label: 'Settings' },
]

export function AppSidebar({ isMobile = false, closeSheet }: { isMobile?: boolean, closeSheet?: () => void }) {
  const pathname = usePathname();
  const { user, updateUserData } = useAuth();
  const notifications = user?.data.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    if (!user) return;
    const updatedNotifications = notifications.map(n => ({...n, read: true}));
    updateUserData({ notifications: updatedNotifications });
  }

  const handleDeleteNotification = (id: string) => {
    if(!user) return;
    const updatedNotifications = notifications.filter(n => n.id !== id);
    updateUserData({ notifications: updatedNotifications });
  }

  const handleClearAllNotifications = () => {
    if(!user) return;
    updateUserData({ notifications: [] });
  }


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
            <Link href="#" className="flex items-center gap-2 font-semibold" onClick={(e) => {e.preventDefault(); if (isMobile && closeSheet) closeSheet()}}>
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="">StudyMate Lite</span>
            </Link>
            {isMobile && closeSheet ? (
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={closeSheet}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            ) : null}
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:scale-105 hover:translate-x-1 w-full', isMobile && 'hover:scale-105 hover:translate-x-1')}>
                        <div className="relative">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <span>Notifications</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 md:w-96">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                          notifications.map((notif: Notification) => (
                              <DropdownMenuItem key={notif.id} className={cn("flex items-start gap-2 group", !notif.read && "bg-blue-500/10")}>
                                <div className="flex-grow">
                                    <p className="font-semibold">{notif.title}</p>
                                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notif.id); }}>
                                      <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                              </DropdownMenuItem>
                          ))
                      ) : (
                          <div className="flex justify-center text-muted-foreground p-4 text-sm">
                              You have no new notifications.
                          </div>
                      )}
                      </div>
                      {notifications.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <div className="flex flex-col sm:flex-row justify-end gap-1 p-1">
                                <Button variant="ghost" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0} className="w-full justify-start sm:w-auto">
                                  <CheckCheck className="mr-2 h-4 w-4"/>
                                  Mark all as read
                                </Button>
                               <Button variant="ghost" size="sm" onClick={handleClearAllNotifications} className="text-destructive hover:text-destructive w-full justify-start sm:w-auto">
                                  <Trash2 className="mr-2 h-4 w-4"/>
                                  Clear all
                              </Button>
                            </div>
                          </>
                      )}
                  </DropdownMenuContent>
              </DropdownMenu>

              {isMobile ? (
                  <>
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
                  </>
              ) : (
                   <>
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
                    </>
              )}
            </nav>
          </div>
          {secondaryNavItems.length > 0 && <div className="mt-auto border-t p-2">
             <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                 {secondaryNavItems.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                        <Tooltip key={href}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={href}
                                    onClick={closeSheet}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                        { 'bg-muted text-primary': isActive },
                                        isMobile && 'hover:scale-105 hover:translate-x-1'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                </Link>
                            </TooltipTrigger>
                            {!isMobile && <TooltipContent side="right">{label}</TooltipContent>}
                        </Tooltip>
                    );
                })}
             </nav>
          </div>}
        </div>
      </div>
    </TooltipProvider>
  );
}
