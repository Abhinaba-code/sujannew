
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Heart } from 'lucide-react';
import Link from 'next/link';

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
                    You can reach out for support via email.
                </p>
                <Button asChild variant="outline">
                    <Link href="mailto:roysneha4569@gmail.com">
                        <Mail className="mr-2 h-4 w-4" /> Email Support
                    </Link>
                </Button>
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
