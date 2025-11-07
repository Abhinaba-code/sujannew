'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type TimeResponse = {
  datetime: string;
  utc_offset: string;
};

export function WorldClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTime() {
      try {
        // Fetch from the internal API route
        const response = await fetch('/api/time');
        if (!response.ok) {
          throw new Error('Failed to fetch time');
        }
        const data: TimeResponse = await response.json();
        const serverTime = parseISO(data.datetime);
        setTime(serverTime);
        setError(null);
      } catch (e: any) {
        setError('Could not load time');
        console.error(e);
      }
    }

    fetchTime();
  }, []);

  useEffect(() => {
    if (time) {
      const timer = setInterval(() => {
        setTime(prevTime => prevTime ? new Date(prevTime.getTime() + 1000) : null);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [time]);
  
  if (error) {
    return <div className="text-sm flex items-center gap-2"><Clock className="h-4 w-4" /> {error}</div>;
  }
  
  if (!time) {
    return <div className="text-sm flex items-center gap-2 animate-pulse"><Clock className="h-4 w-4" /> Loading time...</div>;
  }

  return (
    <div className="text-sm font-medium flex items-center gap-2">
      <Clock className="h-4 w-4" />
      <span>{format(time, 'hh:mm:ss a')}</span>
    </div>
  );
}
