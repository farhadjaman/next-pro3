import React, { useContext, createContext } from 'react';
import { useStorageState } from './useStorageState';
import { store, User } from '~/store';

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
    const user: User = {
      id: 'u001',
      firstName: 'Mário',
      lastName: 'Afonso',
      email,
      onActiveDuty: true,
      backgroundLocationTracking: true,
      userType: email === 'admin@test.com' ? 'super' : 'user',
      jobsCompleted: 15,
      jobsCompletedWTD: 15,
      totalSetOfRepairs: 50,
      totalSetOfRepairsWTD: 15,
      successRate: '70%',
      responseRate: '80%',
    };
    store.setUser(user);
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
