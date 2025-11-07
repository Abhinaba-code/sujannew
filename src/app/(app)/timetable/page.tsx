'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { TimetableEntry } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`); // 00:00 to 23:00

function TimetableForm({ entry, onSave, onDelete }: { entry?: Partial<TimetableEntry> | null, onSave: (entry: Omit<TimetableEntry, 'id'>) => void, onDelete?: (id: string) => void }) {
    const [subject, setSubject] = useState(entry?.subject || '');
    const [day, setDay] = useState(entry?.day || '');
    const [startTime, setStartTime] = useState(entry?.startTime || '');
    const [endTime, setEndTime] = useState(entry?.endTime || '');

    const handleSubmit = () => {
        if (subject && day && startTime && endTime) {
            onSave({ subject, day, startTime, endTime } as Omit<TimetableEntry, 'id'>);
        }
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
            <DialogFooter className="sm:justify-between pt-4">
                {entry?.id && onDelete && (
                    <Button variant="destructive" onClick={() => onDelete(entry.id!)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                )}
                <DialogClose asChild>
                    <Button onClick={handleSubmit} disabled={!subject || !day || !startTime || !endTime}>Save Entry</Button>
                </DialogClose>
            </DialogFooter>
        </div>
    );
}

export default function TimetablePage() {
    const { user, updateUserData } = useAuth();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null | { day: string, startTime: string }>(null);

    const entries = user?.data.timetable || [];

    const handleSave = (entryData: Omit<TimetableEntry, 'id'> & { id?: string }) => {
        let updatedEntries;
        if (entryData.id) { // Editing existing entry
            updatedEntries = entries.map(e => e.id === entryData.id ? { ...e, ...entryData } : e);
            toast({ title: "Success", description: "Timetable entry updated." });
        } else { // Creating new entry
            const newEntry = { ...entryData, id: crypto.randomUUID() };
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

    const handleCellClick = (day: string, time: string) => {
        const entry = getEntryForSlot(day, time);
        setSelectedEntry(entry || { day, startTime: time });
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

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Study Timetable</CardTitle>
                            <CardDescription>Your weekly study schedule. Click any slot to add or edit.</CardDescription>
                        </div>
                         <DialogTrigger asChild>
                            <Button onClick={() => setSelectedEntry(null)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Entry
                            </Button>
                        </DialogTrigger>
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
                                        <TableRow key={time} className="h-16">
                                            <TableCell className="font-medium">{time}</TableCell>
                                            {daysOfWeek.map(day => {
                                                const entry = getEntryForSlot(day, time);
                                                const isFirstSlotOfEntry = entry && parseInt(entry.startTime.split(':')[0]) === parseInt(time.split(':')[0]);

                                                return (
                                                    <TableCell key={day} onClick={() => handleCellClick(day, time)} className="cursor-pointer hover:bg-muted/50 p-1">
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
                        entry={selectedEntry as TimetableEntry} 
                        onSave={(data) => handleSave({...selectedEntry, ...data})}
                        onDelete={handleDelete}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
