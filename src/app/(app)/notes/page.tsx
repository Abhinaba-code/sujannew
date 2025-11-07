'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';

export default function NotesPage() {
  const { user, updateUserData } = useAuth();
  const [notes, setNotes] = useState<Note[]>(user?.data.notes || []);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({ title: '', content: '', category: 'General' });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleSaveNote = () => {
    if (!currentNote.title || !currentNote.content) return;

    let updatedNotes;
    if (isEditing) {
      updatedNotes = notes.map(n => n.id === isEditing ? { ...n, ...currentNote } : n);
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...currentNote,
      } as Note;
      updatedNotes = [...notes, newNote];
    }
    
    setNotes(updatedNotes);
    updateUserData({ notes: updatedNotes });
    setCurrentNote({ title: '', content: '', category: 'General' });
    setIsEditing(null);
  };

  const handleEdit = (note: Note) => {
    setIsEditing(note.id);
    setCurrentNote(note);
  };

  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    updateUserData({ notes: updatedNotes });
  };
  
  const handleCancel = () => {
    setCurrentNote({ title: '', content: '', category: 'General' });
    setIsEditing(null);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Note' : 'Create Note'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <Input
                placeholder="Note Title"
                value={currentNote.title || ''}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
            />
             <Textarea
                placeholder="Note Content"
                value={currentNote.content || ''}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                className="min-h-[150px]"
            />
            <Button onClick={handleSaveNote} className="w-full">
              {isEditing ? 'Save Changes' : 'Add Note'}
            </Button>
            {isEditing && <Button variant="outline" onClick={handleCancel} className="w-full">Cancel</Button>}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
         <Card>
            <CardHeader>
                <CardTitle>Your Notes</CardTitle>
                <CardDescription>All your saved notes are listed here.</CardDescription>
            </CardHeader>
            <CardContent>
                {notes.length > 0 ? (
                    <div className="space-y-4">
                        {notes.map(note => (
                            <Card key={note.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex justify-between items-center">
                                        <span className="break-all">{note.title}</span>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(note)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </CardTitle>
                                    <CardDescription>{new Date(note.createdAt).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap break-words">{note.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You don't have any notes yet.</p>
                    </div>
                )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
