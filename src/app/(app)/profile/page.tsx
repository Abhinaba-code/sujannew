
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil, User, Mail, Phone, MapPin, Hash, Book, Heart, Gamepad2, Rocket, FileText, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
import { useRouter } from 'next/navigation';


function ProfileDetail({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4">
            <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium break-words">{value}</p>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { user, deleteUser } = useAuth();
    const router = useRouter();

    if (!user) {
        return <div>Loading...</div>;
    }

    const { username, email, data } = user;
    const location = [data.city, data.state, data.country].filter(Boolean).join(', ');
    
    const handleDeleteAccount = () => {
        deleteUser();
        router.push('/signup');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card>
                <CardHeader className="flex flex-col items-center text-center space-y-2 pb-4">
                    <Avatar className="h-24 w-24 mb-2">
                        <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`} />
                        <AvatarFallback>{(data.name || username).charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="relative">
                        <CardTitle className="text-3xl font-bold font-headline">{data.name || username}</CardTitle>
                    </div>
                    <CardDescription>{username} &middot; {email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {data.bio && (
                        <div className="text-center border-t border-b py-4">
                             <p className="text-sm text-muted-foreground italic">"{data.bio}"</p>
                        </div>
                    )}
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <ProfileDetail icon={User} label="Full Name" value={data.name} />
                       <ProfileDetail icon={Hash} label="Age" value={data.age} />
                       <ProfileDetail icon={Mail} label="Email" value={email} />
                       <ProfileDetail icon={Phone} label="Phone Number" value={data.phone} />
                       <ProfileDetail icon={MapPin} label="Location" value={location} />
                       <ProfileDetail icon={Book} label="Class/Grade" value={data.studyClass} />
                       <ProfileDetail icon={Heart} label="Favorite Subject" value={data.favoriteSubject} />
                       <ProfileDetail icon={Gamepad2} label="Hobby" value={data.hobby} />
                       <ProfileDetail icon={Rocket} label="Future Ambition" value={data.futureAmbition} />
                    </div>
                </CardContent>
                <CardContent className="flex justify-end gap-2 border-t pt-6">
                     <Button asChild className="w-full">
                        <Link href="/profile/edit">
                            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Delete Account</CardTitle>
                    <CardDescription>
                        This action is permanent and cannot be undone. This will permanently delete your account and remove all your data.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="bg-destructive/10">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                                <Trash2 className="mr-2 h-4 w-4" />
                                I want to delete my account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
