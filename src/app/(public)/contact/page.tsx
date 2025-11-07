import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

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
        </Card>
    </div>
  );
}
