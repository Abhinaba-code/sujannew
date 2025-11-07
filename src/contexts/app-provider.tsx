
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
  deleteUser: () => void;
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
    localStorage.setItem('users', JSON.stringify(users));
  };

  useEffect(() => {
    try {
      const loggedInUserEmail = localStorage.getItem('currentUser');
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
      console.error("Failed to load user from localStorage", error);
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
      localStorage.setItem('currentUser', userToLogin.email);
      toast({ title: 'Login successful', description: `Welcome back, ${userToLogin.username}!` });
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
    localStorage.setItem('currentUser', newUser.email);

    toast({ title: 'Signup successful!', description: 'Welcome! Please complete your profile.' });
    return true;
  }, [toast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('currentUser');
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

  const deleteUser = useCallback(() => {
    if(!user) return;

    const allUsers = getUsersFromStorage();
    delete allUsers[user.username];
    saveUsersToStorage(allUsers);

    setUser(null);
    localStorage.removeItem('currentUser');
    toast({ variant: 'destructive', title: 'Account Deleted', description: 'Your account has been permanently removed.' });
  }, [user, toast]);

  return (
    <AppContext.Provider value={{ user, isLoading, login, logout, signup, updateUserData, deleteUser, getUserPassword }}>
      {children}
    </AppContext.Provider>
  );
};
