
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 sm:py-24 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">About StudyMate Lite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <p>
                    StudyMate Lite was born from a simple idea: to create a powerful, private, and efficient study tool for students everywhere. We believe that your study data is yours alone. That's why our app runs entirely on your local machine, ensuring complete privacy and offline accessibility. 
                </p>
                <p>
                    Our mission is to empower learners with the tools they need to succeed without compromising their data. Whether you're taking notes, organizing your tasks, planning your schedule, or generating flashcards with AI, StudyMate Lite provides a seamless and secure experience.
                </p>
                <p>
                    We are committed to providing a free, high-quality tool that helps you focus on what matters most: your learning journey.
                </p>
            </CardContent>
            <CardFooter className="bg-muted/50 p-6 justify-center">
                <p className="text-muted-foreground text-center">
                    Made with <Heart className="inline-block h-5 w-5 text-red-500 animate-pulse" /> by <br className="sm:hidden" />
                    <span className="font-semibold text-lg bg-gradient-to-r from-primary via-accent to-secondary-foreground bg-clip-text text-transparent transition-all duration-300 hover:tracking-wider">
                        Developer - Abhinaba Roy Pradhan
                    </span> & 
                    <span className="font-semibold text-lg bg-gradient-to-r from-secondary-foreground via-accent to-primary bg-clip-text text-transparent transition-all duration-300 hover:tracking-wider">
                        WBP Constable - Sujan Roy
                    </span>
                </p>
            </CardFooter>
        </Card>
    </div>
  );
}
