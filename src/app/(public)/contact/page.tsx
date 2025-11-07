
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Heart } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
        <Card className="max-w-xl mx-auto text-center">
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</CardTitle>
                <CardDescription className="text-muted-foreground md:text-xl">
                    Have questions or feedback? We'd love to hear from you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6">
                    This is a demo application, so direct support is not available. However, we appreciate you exploring StudyMate Lite!
                </p>
                <Button variant="outline" disabled>
                    <Mail className="mr-2 h-4 w-4" /> Email Support
                </Button>
            </CardContent>
            <CardFooter className="bg-muted/50 p-6 justify-center">
                <p className="text-muted-foreground text-center">
                    Made with <Heart className="inline-block h-5 w-5 text-red-500 animate-pulse" /> by <br className="sm:hidden" />
                    <span className="font-semibold text-lg bg-gradient-to-r from-primary via-accent to-secondary-foreground bg-clip-text text-transparent transition-all duration-300 hover:tracking-wider">
                        Abhinaba Roy Pradhan
                    </span> & 
                    <span className="font-semibold text-lg bg-gradient-to-r from-secondary-foreground via-accent to-primary bg-clip-text text-transparent transition-all duration-300 hover:tracking-wider">
                        Sujan Roy
                    </span>
                </p>
            </CardFooter>
        </Card>
    </div>
  );
}
