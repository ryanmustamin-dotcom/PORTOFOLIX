'use client';

import type { FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import React, { createContext, useContext, useMemo } from 'react';

import { initializeFirebase } from './config';

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  // Use useMemo to ensure initialization only happens once and handles missing keys gracefully
  const values = useMemo(() => {
    try {
      const app = initializeFirebase();
      
      // If app is a dummy object (no keys), handle it
      if (!app.options && typeof window === 'undefined') {
          return null;
      }

      const auth = getAuth(app);
      const firestore = getFirestore(app);
      return { app, auth, firestore };
    } catch (e) {
      console.error("Error setting up Firebase Provider:", e);
      return null;
    }
  }, []);

  // If we couldn't initialize (common during build), just render children
  // Hooks using these values should check for their existence
  if (!values) {
    return <>{children}</>;
  }

  return (
    <FirebaseContext.Provider value={values}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    // During build or if keys are missing, we might not have a context
    // We return a proxy or handle it in the calling hook
    return {} as FirebaseContextValue;
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
