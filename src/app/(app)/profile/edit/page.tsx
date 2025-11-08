
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less').regex(/^[a-zA-Z\s'-]+$/, 'Full name cannot contain numbers or special characters.'),
  phone: z.string().min(1, 'Phone number is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  age: z.string().min(1, 'Age is required'),
  studyClass: z.string().min(1, 'Class/Grade is required'),
  favoriteSubject: z.string().min(1, 'Favorite subject is required'),
  hobby: z.string().min(1, 'Hobby is required'),
  futureAmbition: z.string().min(1, 'Future ambition is required'),
  bio: z.string().min(1, 'Bio is required').min(10, 'Bio should be at least 10 characters long.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfilePage() {
  const { user, updateUserData } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const isInitialSetup = !user?.data.name || user?.data.name.trim() === '' || !user?.data.phone;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.data.name || '',
      phone: user?.data.phone || '',
      city: user?.data.city || '',
      state: user?.data.state || '',
      country: user?.data.country || '',
      age: user?.data.age || '',
      studyClass: user?.data.studyClass || '',
      favoriteSubject: user?.data.favoriteSubject || '',
      hobby: user?.data.hobby || '',
      futureAmbition: user?.data.futureAmbition || '',
      bio: user?.data.bio || '',
    },
    mode: 'onChange',
  });

  function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    updateUserData(data);
    toast({
      title: isInitialSetup ? "Profile Created!" : "Profile Updated",
      description: isInitialSetup 
        ? "Welcome! You can now explore the app."
        : "Your details have been successfully saved.",
    });
    const destination = isInitialSetup ? '/dashboard' : '/profile';
    router.push(destination);
  }

  return (
    <div className="max-w-3xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>{isInitialSetup ? "Welcome! Complete Your Profile" : "Update Your Details"}</CardTitle>
                <CardDescription>
                    {isInitialSetup 
                        ? "Please fill in all your details to get started." 
                        : "Update your personal information below."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="give full name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 18" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="(123) 456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="studyClass"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Class / Grade</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 12th Grade or University" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. San Francisco" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>State / Province</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. California" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. USA" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="favoriteSubject"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Favorite Subject</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Physics" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="hobby"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Hobby</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Reading, coding" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="futureAmbition"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>What do you want to be in the future?</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Software Engineer, Doctor" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>About You (Bio)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Tell us a little bit about yourself..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <div className="flex justify-end gap-2 pt-4">
                             {!isInitialSetup && <Button type="button" variant="outline" onClick={() => router.push('/profile')}>Cancel</Button>}
                            <Button type="submit">
                                {isInitialSetup ? "Continue" : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
