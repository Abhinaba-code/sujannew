
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, UserData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type AppContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_?: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, email: string, password_?: string) => Promise<boolean>;
  updateUserData: (data: Partial<UserData>) => void;
  deleteUser: (username: string) => void;
  getUserPassword: (username: string) => string | undefined;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUserData: UserData = {
  name: '',
  phone: '',
  city: '',
  state: '',
  country: '',
  age: '',
  studyClass: '',
  favoriteSubject: '',
  hobby: '',
  futureAmbition: '',
  bio: '',
  notes: [],
  tasks: [],
  timetable: [],
  materials: [],
  flashcardDecks: [],
  notifications: [
    {
      id: 'notif-1',
      title: 'Welcome to StudyMate Lite!',
      description: 'Your new study dashboard is ready. Explore the features!',
      createdAt: new Date().toISOString(),
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Profile Completion',
      description: 'Don\'t forget to complete your profile to personalize your experience.',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      read: false,
    },
     {
      id: 'notif-3',
      title: 'AI Flashcards',
      description: 'Try the new AI flashcard generator to boost your learning.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
    },
    {
      id: 'notif-4',
      title: 'New Feature: Quizzes!',
      description: 'Test your knowledge with the new quiz feature. Try it now!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
    },
    {
      id: 'notif-5',
      title: 'Plan Your Week',
      description: 'Set up your weekly schedule in the Timetable section to stay organized.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      read: true,
    }
  ],
  stats: {
    studyHoursWeekly: {},
    tasksCompleted: 0,
    flashcardsReviewed: 0,
  },
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getUsersFromStorage = (): Record<string, User> => {
    try {
      if (typeof window === 'undefined') return {};
      const usersRaw = localStorage.getItem('users');
      return usersRaw ? JSON.parse(usersRaw) : {};
    } catch (e) {
      return {};
    }
  };
  
  const getUserPassword = (username: string): string | undefined => {
    const allUsers = getUsersFromStorage();
    return allUsers[username]?.password;
  };

  const saveUsersToStorage = (users: Record<string, User>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('users', JSON.stringify(users));
  };

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const loggedInUserEmail = sessionStorage.getItem('currentUser');
      if (loggedInUserEmail) {
        const allUsers = getUsersFromStorage();
        // Find user by email
        const foundUserEntry = Object.entries(allUsers).find(([_, u]) => u.email === loggedInUserEmail);
        if (foundUserEntry) {
          const [username, userData] = foundUserEntry;
          setUser({ username, ...userData });
        }
      }
    } catch (error) {
      console.error("Failed to load user from sessionStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password_?: string): Promise<boolean> => {
    const allUsers = getUsersFromStorage();
    const foundUserEntry = Object.entries(allUsers).find(([_, u]) => u.email === email && u.password === password_);
    
    if (foundUserEntry) {
      const [username, userData] = foundUserEntry;
      const userToLogin: User = { username, ...userData };
      setUser(userToLogin);
      if (typeof window !== 'undefined') sessionStorage.setItem('currentUser', userToLogin.email);
      toast({ title: 'Login successful', description: `Welcome back, ${userToLogin.data.name || userToLogin.username}!` });
      return true;
    }
    toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
    return false;
  }, [toast]);

  const signup = useCallback(async (username: string, email: string, password_?: string): Promise<boolean> => {
    const allUsers = getUsersFromStorage();
    if (Object.values(allUsers).some(u => u.email === email)) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'An account with this email already exists.' });
      return false;
    }
    if (allUsers[username]) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'Username already exists.' });
      return false;
    }
    
    const newUser: User = { 
        username,
        email,
        password: password_, 
        data: { ...initialUserData, name: '' } 
    };
    allUsers[username] = newUser;
    saveUsersToStorage(allUsers);
    
    setUser(newUser);
    if (typeof window !== 'undefined') sessionStorage.setItem('currentUser', newUser.email);

    toast({ title: 'Signup successful!', description: 'Welcome! Please complete your profile.' });
    return true;
  }, [toast]);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') sessionStorage.removeItem('currentUser');
    toast({ title: 'Logged out' });
  }, [toast]);
  
  const updateUserData = useCallback((data: Partial<UserData>) => {
    if(!user) return;
    
    setUser(currentUser => {
      if(!currentUser) return null;
      
      const newUserData = { ...currentUser.data, ...data };
      const updatedUser = { ...currentUser, data: newUserData };
      
      const allUsers = getUsersFromStorage();
      allUsers[currentUser.username] = { 
        ...allUsers[currentUser.username],
        data: newUserData 
      };
      saveUsersToStorage(allUsers);

      return updatedUser;
    });

  }, [user]);

  const deleteUser = useCallback((username: string) => {
    const allUsers = getUsersFromStorage();
    delete allUsers[username];
    saveUsersToStorage(allUsers);
    
    setUser(null);
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('currentUser');
    }

    toast({ variant: 'destructive', title: 'Account Deleted', description: 'Your account has been permanently removed.' });
  }, [toast]);

  return (
    <AppContext.Provider value={{ user, isLoading, login, logout, signup, updateUserData, deleteUser, getUserPassword }}>
      {children}
    </AppContext.Provider>
  );
};
