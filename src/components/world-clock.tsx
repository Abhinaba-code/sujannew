'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

export function WorldClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time
    setTime(new Date());

    // Update time every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);
  
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
