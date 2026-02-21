'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    conditions?: { adhd: boolean; dyslexia: boolean }
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const res = await api.get('/api/users/me');
          setDbUser(res.data);
        } catch {
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Auth not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    conditions = { adhd: false, dyslexia: false }
  ) => {
    if (!auth) throw new Error('Auth not initialized');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    const res = await api.post('/api/users/register', {
      email,
      displayName,
      conditions,
    });
    setDbUser(res.data);
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Auth not initialized');
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    try {
      await api.get('/api/users/me');
    } catch {
      const res = await api.post('/api/users/register', {
        email: cred.user.email,
        displayName: cred.user.displayName,
      });
      setDbUser(res.data);
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setDbUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ firebaseUser, dbUser, loading, signIn, signUp, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
