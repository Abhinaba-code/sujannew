'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Settings, Minus, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export default function PomodoroPage() {
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(sessionMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getMinutesForMode = useCallback((currentMode: TimerMode) => {
    switch (currentMode) {
      case 'pomodoro': return sessionMinutes;
      case 'shortBreak': return shortBreakMinutes;
      case 'longBreak': return longBreakMinutes;
      default: return sessionMinutes;
    }
  }, [sessionMinutes, shortBreakMinutes, longBreakMinutes]);
  
  useEffect(() => {
    setTimeLeft(getMinutesForMode(mode) * 60);
  }, [sessionMinutes, shortBreakMinutes, longBreakMinutes, mode, getMinutesForMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Handle mode switch when timer finishes (optional)
      setIsActive(false);
    }
    return () => {
      if(interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getMinutesForMode(mode) * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(getMinutesForMode(newMode) * 60);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalDuration = getMinutesForMode(mode) * 60;
  const progress = (totalDuration - timeLeft) / totalDuration * 100;
  
  const handleTimeChange = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number) => {
      setter(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold font-headline">Pomodoro Timer</CardTitle>
          <div className="flex justify-center gap-2 pt-4">
            <Button variant={mode === 'pomodoro' ? 'default' : 'secondary'} onClick={() => switchMode('pomodoro')}>Pomodoro</Button>
            <Button variant={mode === 'shortBreak' ? 'default' : 'secondary'} onClick={() => switchMode('shortBreak')}>Short Break</Button>
            <Button variant={mode === 'longBreak' ? 'default' : 'secondary'} onClick={() => switchMode('longBreak')}>Long Break</Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="text-8xl font-bold font-mono text-primary">
                {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="w-full" />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={toggleTimer} className="w-32">
              {isActive ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button size="lg" variant="outline" onClick={resetTimer}>
              <RotateCcw className="mr-2"/> Reset
            </Button>
          </div>
           <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="mr-2 h-4 w-4" />
                {showSettings ? 'Hide Settings' : 'Show Settings'}
            </Button>
        </CardFooter>
      </Card>
      
      {showSettings && (
         <Card className="mt-4">
            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <p>Pomodoro Duration</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleTimeChange(setSessionMinutes, -1)}><Minus/></Button>
                        <span>{sessionMinutes} min</span>
                        <Button variant="outline" size="icon" onClick={() => handleTimeChange(setSessionMinutes, 1)}><Plus/></Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <p>Short Break</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleTimeChange(setShortBreakMinutes, -1)}><Minus/></Button>
                        <span>{shortBreakMinutes} min</span>
                        <Button variant="outline" size="icon" onClick={() => handleTimeChange(setShortBreakMinutes, 1)}><Plus/></Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <p>Long Break</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleTime-change(setLongBreakMinutes, -1)}><Minus/></Button>
                        <span>{longBreakMinutes} min</span>
                        <Button variant="outline" size="icon" onClick={() => handleTimeChange(setLongBreakMinutes, 1)}><Plus/></Button>
                    </div>
                </div>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
