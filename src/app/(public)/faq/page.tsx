
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FaqPage() {
  return (
    <div className="container mx-auto py-12 sm:py-24 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is my data secure?</AccordionTrigger>
                        <AccordionContent>
                        Absolutely. StudyMate Lite stores all your data locally on your device in your browser's local storage. Nothing is ever sent to a server, ensuring your notes, tasks, and study materials remain completely private.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Can I use this app offline?</AccordionTrigger>
                        <AccordionContent>
                        Yes! Since everything is stored locally, the app is fully functional without an internet connection. The only exception is the AI flashcard generation, which requires an internet connection to communicate with the AI model.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is there a cost to use StudyMate Lite?</AccordionTrigger>
                        <AccordionContent>
                        StudyMate Lite is completely free to use. We believe in providing accessible tools for all students.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>On which devices can I use the app?</AccordionTrigger>
                        <AccordionContent>
                        The application is designed to run in a web browser on any modern desktop or laptop computer. While it may work on mobile browsers, it is optimized for a desktop experience.
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-5">
                        <AccordionTrigger>What happens if I clear my browser cache?</AccordionTrigger>
                        <AccordionContent>
                        Warning: Clearing your browser's local storage for this site will permanently delete all your data. Since StudyMate Lite stores everything on your computer, there is no cloud backup. Please be sure to back up any important information.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
            <CardFooter className="bg-muted/50 p-6 justify-center">
                <div className="text-muted-foreground text-center">
                    <p>
                        Developed By <br className="sm:hidden" />
                        <span className="font-semibold text-lg bg-gradient-to-r from-primary via-accent to-secondary-foreground bg-clip-text text-transparent transition-all duration-300 hover:tracking-wider">
                            Sneha Roy
                        </span>
                    </p>
                    <Link href="mailto:roysneha4569@gmail.com" className="text-sm hover:underline">
                        roysneha4569@gmail.com
                    </Link>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}
