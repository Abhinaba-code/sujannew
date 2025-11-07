'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import type { TimetableEntry } from "@/lib/types";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 13 }, (_, i) => `${i + 8}:00`); // 8 AM to 8 PM

export default function TimetablePage() {
  const { user } = useAuth();
  const entries = user?.data.timetable || [];

  const getEntryForSlot = (day: string, time: string): TimetableEntry | undefined => {
    return entries.find(entry => entry.day === day && entry.startTime.startsWith(time.split(':')[0]));
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Study Timetable</CardTitle>
          <CardDescription>Your weekly study schedule. Add events from the settings page (coming soon).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Time</TableHead>
                  {daysOfWeek.map(day => (
                    <TableHead key={day}>{day}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map(time => (
                  <TableRow key={time}>
                    <TableCell className="font-medium">{time}</TableCell>
                    {daysOfWeek.map(day => {
                      const entry = getEntryForSlot(day, time);
                      return (
                        <TableCell key={day}>
                          {entry ? (
                            <div className="bg-primary/20 text-primary-foreground p-2 rounded-md text-center">
                                <p className="font-semibold">{entry.subject}</p>
                            </div>
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
