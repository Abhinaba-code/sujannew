'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

type WorldTime = {
  datetime: string;
  timezone: string;
};

export function WorldClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTime() {
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata');
        if (!response.ok) {
          throw new Error('Failed to fetch time');
        }
        const data: WorldTime = await response.json();
        setTime(new Date(data.datetime));
        setError(null);
      } catch (err: any) {
        setError('Could not load time.');
        console.error(err);
      }
    }

    fetchTime();
    const intervalId = setInterval(fetchTime, 60000); // Fetch every minute to stay in sync

    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
      if(time){
          const timer = setInterval(() => {
              setTime(new Date(time.getTime() + 1000));
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [time]);

  return (
    <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Clock className="h-4 w-4" />
      {error ? (
        <span>{error}</span>
      ) : time ? (
        <span>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} (IST)
        </span>
      ) : (
        <span>Loading time...</span>
      )}
    </div>
  );
}
