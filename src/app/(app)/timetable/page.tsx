
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { TimetableEntry } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Clock, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 19 }, (_, i) => `${String(i + 5).padStart(2, '0')}:00`); // 05:00 to 23:00

function TimetableForm({ entry, onSave, onDelete }: { entry?: Partial<TimetableEntry> | null, onSave: (entry: Partial<TimetableEntry>) => void, onDelete?: (id: string) => void }) {
    const [subject, setSubject] = useState(entry?.subject || '');
    const [day, setDay] = useState(entry?.day || '');
    const [startTime, setStartTime] = useState(entry?.startTime || '');
    const [endTime, setEndTime] = useState(entry?.endTime || '');
    const { toast } = useToast();

    const handleSubmit = () => {
        if (!subject || !day || !startTime || !endTime) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }

        if (new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)) {
            toast({ variant: 'destructive', title: 'Invalid Time', description: 'End time must be after start time.' });
            return;
        }

        onSave({ ...entry, subject, day, startTime, endTime });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
            </div>
            <div>
                <Label htmlFor="day">Day of Week</Label>
                <Select value={day} onValueChange={setDay}>
                    <SelectTrigger><SelectValue placeholder="Select a day" /></SelectTrigger>
                    <SelectContent>
                        {daysOfWeek.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between pt-4 gap-2">
                {entry?.id && onDelete && (
                     <DialogClose asChild>
                        <Button variant="destructive" onClick={() => onDelete(entry.id!)} className="w-full sm:w-auto">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </DialogClose>
                )}
                <DialogClose asChild>
                    <Button onClick={handleSubmit} className="w-full sm:w-auto ml-auto">Save Entry</Button>
                </DialogClose>
            </DialogFooter>
        </div>
    );
}

export default function TimetablePage() {
    const { user, updateUserData } = useAuth();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<Partial<TimetableEntry> | null>(null);

    const [currentDay, setCurrentDay] = useState(daysOfWeek[new Date().getDay() - 1] || daysOfWeek[0]);
    
    useEffect(() => {
        const todayIndex = new Date().getDay(); // Sunday is 0, Monday is 1, etc.
        const todayName = daysOfWeek[todayIndex === 0 ? 6 : todayIndex - 1]; // Adjust index
        if (todayName) {
            setCurrentDay(todayName);
        }
    }, []);

    const entries = user?.data.timetable || [];

    const handleSave = (entryData: Partial<TimetableEntry>) => {
        let updatedEntries;
        const newEntryData = { ...selectedEntry, ...entryData };
        
        if (newEntryData.id) { // Editing existing entry
            updatedEntries = entries.map(e => e.id === newEntryData.id ? { ...e, ...newEntryData } as TimetableEntry : e);
            toast({ title: "Success", description: "Timetable entry updated." });
        } else { // Creating new entry
            const newEntry: TimetableEntry = {
                 ...newEntryData,
                 id: crypto.randomUUID(),
            } as TimetableEntry;
            updatedEntries = [...entries, newEntry];
            toast({ title: "Success", description: "New timetable entry added." });
        }
        updateUserData({ timetable: updatedEntries });
        setIsDialogOpen(false);
        setSelectedEntry(null);
    };

    const handleDelete = (id: string) => {
        const updatedEntries = entries.filter(e => e.id !== id);
        updateUserData({ timetable: updatedEntries });
        toast({ variant: 'destructive', title: "Deleted", description: "Timetable entry removed." });
        setIsDialogOpen(false);
        setSelectedEntry(null);
    };

    const handleCellClick = (entry: TimetableEntry | Partial<TimetableEntry> | null) => {
        setSelectedEntry(entry);
        setIsDialogOpen(true);
    }
    
    const getEntryForSlot = (day: string, time: string): TimetableEntry | undefined => {
      const slotHour = parseInt(time.split(':')[0]);
      return entries.find(entry => {
        if (entry.day !== day) return false;
        const startHour = parseInt(entry.startTime.split(':')[0]);
        const endHour = parseInt(entry.endTime.split(':')[0]);
        return slotHour >= startHour && slotHour < endHour;
      });
    }

    const entriesByDay = useMemo(() => {
        return entries.reduce((acc, entry) => {
            const day = entry.day as (typeof daysOfWeek)[number];
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(entry);
            acc[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
            return acc;
        }, {} as Record<(typeof daysOfWeek)[number], TimetableEntry[]>);
    }, [entries]);

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedEntry(null); }}>
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle>Study Timetable</CardTitle>
                            <CardDescription>Your weekly study schedule.</CardDescription>
                        </div>
                         <DialogTrigger asChild>
                            <Button onClick={() => setSelectedEntry(null)} className="w-full sm:w-auto">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Entry
                            </Button>
                        </DialogTrigger>
                    </CardHeader>
                    <CardContent>
                        {/* Mobile View */}
                        <div className="md:hidden">
                             <Tabs value={currentDay} onValueChange={setCurrentDay} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7 mb-4">
                                    {daysOfWeek.map(day => (
                                        <TabsTrigger key={day} value={day}>{day.substring(0,3)}</TabsTrigger>
                                    ))}
                                </TabsList>
                                {daysOfWeek.map(day => (
                                    <TabsContent key={day} value={day}>
                                        {(entriesByDay[day as keyof typeof entriesByDay] && entriesByDay[day as keyof typeof entriesByDay].length > 0) ? (
                                            <div className="space-y-3">
                                                {entriesByDay[day as keyof typeof entriesByDay].map(entry => (
                                                    <Card key={entry.id} className="w-full">
                                                        <CardContent className="p-4 flex items-center justify-between">
                                                            <div>
                                                                <p className="font-semibold">{entry.subject}</p>
                                                                <p className="text-sm text-muted-foreground flex items-center">
                                                                    <Clock className="w-4 h-4 mr-1.5" />
                                                                    {entry.startTime} - {entry.endTime}
                                                                </p>
                                                            </div>
                                                            <Button variant="ghost" size="icon" onClick={() => handleCellClick(entry)}>
                                                                <Edit className="h-5 w-5" />
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                                <p className="text-muted-foreground">No classes scheduled for {day}.</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <p className="text-sm text-muted-foreground mb-2">Click any slot to add or edit.</p>
                            <Table className="border min-w-[800px] md:min-w-full">
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
                                        <TableRow key={time} className="h-16">
                                            <TableCell className="font-medium">{time}</TableCell>
                                            {daysOfWeek.map(day => {
                                                const entry = getEntryForSlot(day, time);
                                                const isFirstSlotOfEntry = entry && parseInt(entry.startTime.split(':')[0]) === parseInt(time.split(':')[0]);

                                                return (
                                                    <TableCell key={day} onClick={() => handleCellClick(entry || { day, startTime: time })} className="cursor-pointer hover:bg-muted/50 p-1">
                                                        {isFirstSlotOfEntry ? (
                                                            <div className="bg-primary/20 text-primary-foreground p-2 rounded-md text-center h-full flex flex-col justify-center">
                                                                <p className="font-semibold text-sm">{entry.subject}</p>
                                                                <p className="text-xs">{entry.startTime} - {entry.endTime}</p>
                                                            </div>
                                                        ) : (entry ? null : <div className="h-full"></div>)}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEntry && 'id' in selectedEntry ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
                    </DialogHeader>
                    <TimetableForm 
                        entry={selectedEntry} 
                        onSave={handleSave}
                        onDelete={handleDelete}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

    