import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground prose prose-lg dark:prose-invert max-w-none">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>

          <p>
            Please read these Terms and Conditions ("Terms") carefully before using the StudyMate Lite application (the "Service"). Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms.
          </p>

          <h3>1. Use of Service</h3>
          <p>
            StudyMate Lite is provided for your personal, non-commercial use. You agree not to use the service for any illegal or unauthorized purpose.
          </p>

          <h3>2. Data Responsibility</h3>
          <p>
            All data you create is stored locally on your device. You are solely responsible for managing and backing up your data. The developers of StudyMate Lite are not liable for any data loss or corruption.
          </p>

          <h3>3. AI Feature Usage</h3>
          <p>
            Use of the AI-powered features is subject to the terms and acceptable use policies of the underlying third-party generative model provider. You agree not to use these features to generate harmful, illegal, or unethical content.
          </p>

          <h3>4. Disclaimer of Warranty</h3>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>

          <h3>5. Limitation of Liability</h3>
          <p>
            In no event shall the developers of StudyMate Lite be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your use of the service.
          </p>

          <h3>6. Changes to Terms</h3>
          <p>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
