
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { Loader2 } from 'lucide-react';
import { MotivationalQuote } from '@/components/motivational-quote';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isLoading || !isClient) return;

    // If no user, redirect to landing page (unless it's a public auth page)
    if (!user) {
      if (!['/login', '/signup', '/'].includes(pathname)) {
        router.push('/');
      }
      return;
    }

    // If user exists but hasn't filled out their name, force them to the edit page
    const hasUserDetails = user.data.name && user.data.name.trim() !== '';
    if (!hasUserDetails && pathname !== '/profile/edit') {
      router.push('/profile/edit');
    } else if (hasUserDetails && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, isClient, pathname]);

  if (!isClient || isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Special case for the edit page to show a limited layout
  if (!user.data.name && pathname === '/profile/edit') {
      return (
          <main className="flex min-h-screen flex-col items-center justify-center p-4">
              <div className="w-full max-w-3xl">
                  {children}
              </div>
          </main>
      );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <MotivationalQuote />
          <div className="mt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
