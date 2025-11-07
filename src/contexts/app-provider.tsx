'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, UserData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type AppContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password_?: string) => boolean;
  logout: () => void;
  signup: (username: string, password_?: string) => boolean;
  updateUserData: (data: Partial<UserData>) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUserData: UserData = {
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

  const getUsersFromStorage = (): Record<string, Omit<User, 'username'>> => {
    try {
      const usersRaw = localStorage.getItem('users');
      return usersRaw ? JSON.parse(usersRaw) : {};
    } catch (e) {
      return {};
    }
  };

  const saveUsersToStorage = (users: Record<string, Omit<User, 'username'>>) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem('currentUser');
      if (loggedInUser) {
        const allUsers = getUsersFromStorage();
        if (allUsers[loggedInUser]) {
          setUser({ username: loggedInUser, ...allUsers[loggedInUser] });
        }
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((username: string, password_?: string): boolean => {
    const allUsers = getUsersFromStorage();
    if (allUsers[username] && allUsers[username].password === password_) {
      const userData = { username, ...allUsers[username] };
      setUser(userData);
      localStorage.setItem('currentUser', username);
      toast({ title: 'Login successful', description: `Welcome back, ${username}!` });
      return true;
    }
    toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid username or password.' });
    return false;
  }, [toast]);

  const signup = useCallback((username: string, password_?: string): boolean => {
    const allUsers = getUsersFromStorage();
    if (allUsers[username]) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'Username already exists.' });
      return false;
    }
    allUsers[username] = { password: password_, data: initialUserData };
    saveUsersToStorage(allUsers);
    toast({ title: 'Signup successful', description: 'You can now log in.' });
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
      allUsers[currentUser.username] = { password: currentUser.password, data: newUserData };
      saveUsersToStorage(allUsers);

      return updatedUser;
    });

  }, [user]);

  return (
    <AppContext.Provider value={{ user, isLoading, login, logout, signup, updateUserData }}>
      {children}
    </AppContext.Provider>
  );
};
