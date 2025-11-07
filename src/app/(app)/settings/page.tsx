
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Label } from '@/components/ui/label';
import { Download, Upload, Trash2, User, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRef } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
    const { user, updateUserData } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        if (!user) return;
        try {
            const dataStr = JSON.stringify(user.data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `studybrain_backup_${user.username}_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            toast({
                title: "Export Successful",
                description: "Your data has been exported as a JSON file.",
            });
        } catch (error) {
            console.error("Export failed:", error);
            toast({
                variant: 'destructive',
                title: "Export Failed",
                description: "Could not export your data.",
            });
        }
    };
    
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File is not valid text.");
                }
                const importedData = JSON.parse(text);
                
                // Basic validation, you could improve this
                if (importedData && typeof importedData === 'object' && 'notes' in importedData && 'tasks' in importedData) {
                    updateUserData(importedData);
                    toast({
                        title: "Import Successful",
                        description: "Your data has been imported.",
                    });
                } else {
                     throw new Error("JSON file is not in the correct format.");
                }

            } catch (error: any) {
                console.error("Import failed:", error);
                toast({
                    variant: 'destructive',
                    title: "Import Failed",
                    description: error.message || "Could not import data. Make sure it's a valid backup file.",
                });
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClearData = () => {
        // A simplified clear, you might want to reset to initial state instead
        updateUserData({
            notes: [],
            tasks: [],
            timetable: [],
            flashcardDecks: [],
            materials: [],
        });
        toast({
            title: "Data Cleared",
            description: "All your local data has been removed.",
        });
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette className="h-6 w-6"/> Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Label>Theme</Label>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>

            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="h-6 w-6"/> Account</CardTitle>
                    <CardDescription>Manage your account settings and profile.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-2">
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="/profile/edit">Edit Profile</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="/profile">View Profile & Delete Account</Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-amber-500/50 glassmorphism">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">Data Management</CardTitle>
                    <CardDescription>Export, import, or clear your local application data. Use with caution.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4"/> Export Data
                        </Button>
                        <Button onClick={handleImportClick} variant="outline" className="w-full sm:w-auto">
                            <Upload className="mr-2 h-4 w-4"/> Import Data
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="bg-amber-500/10 p-4 border-t border-amber-500/20">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear All Local Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all your data from this browser, including notes, tasks, and flashcards. It will not delete your account.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearData}>
                                    Yes, clear my data
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
