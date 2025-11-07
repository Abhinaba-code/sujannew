import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, LifeBuoy, Book } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">Help Center</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center"><HelpCircle className="mr-2 h-6 w-6 text-primary"/> Getting Started</h3>
                <p>Welcome to StudyMate Lite! To get started, simply sign up for a new account. Since this is a local-first application, your account information is stored right here in your browser. After logging in, you'll land on your dashboard where you can access all the features.</p>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center"><LifeBuoy className="mr-2 h-6 w-6 text-primary"/> Key Features</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Notes:</strong> Create and manage your study notes.</li>
                    <li><strong>Tasks:</strong> Keep track of your assignments and to-do items.</li>
                    <li><strong>Timetable:</strong> Plan your weekly study schedule.</li>
                    <li><strong>AI Flashcards:</strong> Paste any text and let our AI generate flashcards for you.</li>
                    <li><strong>Data Privacy:</strong> All your data stays on your device. We don't see it.</li>
                </ul>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center"><Book className="mr-2 h-6 w-6 text-primary"/> Important Note on Data</h3>
                <p>Because all your data is stored in your browser's local storage, clearing your browser's cache or data for this website will result in the permanent loss of all your notes, tasks, and flashcards. Please be careful and consider exporting important information periodically if needed.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
