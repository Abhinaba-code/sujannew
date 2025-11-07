
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground prose prose-lg dark:prose-invert max-w-none">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <p>
            Your privacy is our top priority. This Privacy Policy explains how StudyMate Lite handles your information. By using our application, you agree to the terms of this policy.
          </p>

          <h3>1. Data Storage</h3>
          <p>
            All data you create and use within StudyMate Lite, including notes, tasks, schedules, and flashcards, is stored exclusively in your web browser's local storage on your device.
          </p>

          <h3>2. Data Collection</h3>
          <p>
            We do not collect, transmit, view, or store any of your personal data or content on our servers. We have no access to the information you input into the application.
          </p>

          <h3>3. AI Features</h3>
          <p>
            The AI-powered flashcard generation feature sends the text you provide to a third-party generative AI service (such as Google's Gemini) to create flashcards. This data is processed ephemerally by the AI provider to generate a response and is not stored or used to train their models. We do not log or store the content you send or the flashcards you receive.
          </p>

          <h3>4. Data Security & Loss</h3>
          <p>
            Because your data is stored locally, you are in full control. However, this also means you are responsible for it. If you clear your browser's cache or local storage, your data will be permanently deleted. We are not responsible for any data loss.
          </p>

          <h3>5. Cookies</h3>
          <p>
            StudyMate Lite does not use tracking cookies. We only use essential local storage to save your application state and data.
          </p>

          <h3>6. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page.
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
