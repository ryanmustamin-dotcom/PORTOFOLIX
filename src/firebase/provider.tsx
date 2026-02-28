'use client';

import type { FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import React, { createContext, useContext, useMemo } from 'react';

import { initializeFirebase } from './config';

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const values = useMemo(() => {
    try {
      const app = initializeFirebase();
      
      if (!app.options && typeof window === 'undefined') {
          return null;
      }

      const auth = getAuth(app);
      const firestore = getFirestore(app);
      const storage = getStorage(app);
      return { app, auth, firestore, storage };
    } catch (e) {
      console.error("Error setting up Firebase Provider:", e);
      return null;
    }
  }, []);

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
    return {} as FirebaseContextValue;
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
export const useStorage = () => useFirebase().storage;
