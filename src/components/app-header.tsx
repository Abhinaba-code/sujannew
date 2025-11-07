'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { AppSidebar } from './app-sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { WorldClock } from './world-clock';

const getTitleFromPath = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'dashboard';
  
  if (lastSegment === 'dashboard') return 'Dashboard';
  if (lastSegment === 'edit') {
    const parentSegment = segments[segments.length - 2] || '';
    return `Edit ${parentSegment.charAt(0).toUpperCase() + parentSegment.slice(1)}`;
  }
  if (lastSegment.match(/^[a-zA-Z0-9]{8}-([a-zA-Z0-9]{4}-){3}[a-zA-Z0-9]{12}$/)) {
      const parentSegment = segments[segments.length - 2] || 'Items';
      return parentSegment.charAt(0).toUpperCase() + parentSegment.slice(1, -1) + ' Detail';
  }


  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

export function AppHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getTitleFromPath(pathname);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearchFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.blur();
      if (pathname !== '/search') {
          router.push('/search');
      }
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = e.currentTarget.search.value;
      if(query) {
        router.push(`/search?q=${query}`);
      }
  }
  
  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 md:px-6">
      <div className="md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AppSidebar isMobile={true} closeSheet={closeSheet}/>
          </SheetContent>
        </Sheet>
      </div>

      <h1 className="text-xl font-semibold md:text-2xl font-headline hidden sm:block">{pageTitle}</h1>

      <div className="flex w-full items-center justify-end gap-2 md:ml-auto md:gap-4">
        <WorldClock />
        <form onSubmit={handleSearchSubmit} className="flex-1 md:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search..."
              className="pl-8 sm:w-[200px] md:w-[200px] lg:w-[300px]"
              onFocus={handleSearchFocus}
            />
          </div>
        </form>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`} />
                <AvatarFallback>{(user?.data.name || user?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
