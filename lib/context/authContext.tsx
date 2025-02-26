import React, { useContext, createContext } from 'react';

import { useStorageState } from './useStorageState';

import { demoUsers } from '~/lib/demoData';
import { store } from '~/store';

interface AuthContextType {
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    message: string;
    error?: Error;
  }>;
  signOut: () => Promise<{
    success: boolean;
    message: string;
    error?: Error;
  }>;
  session: any;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => ({ success: false, message: '', error: new Error() }),
  signOut: async () => ({ success: false, message: '', error: new Error() }),
  session: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [[isLoading, session], setSession] = useStorageState('session');

  const signIn = async (email: string, password: string) => {
    setSession(email);
    if (email.includes('admin')) {
      store.setUserType('super');
    }
    store.setUser(demoUsers[0]);
    return { success: true, message: 'Signed In' };
  };

  const signOutUser = async () => {
    setSession(null);
    return { success: true, message: 'Signed out' };
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut: signOutUser, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
