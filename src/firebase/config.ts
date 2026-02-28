import { FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function initializeFirebase() {
    // Check if we are on the server during build time without API keys
    if (!firebaseConfig.apiKey && typeof window === 'undefined') {
        console.warn("Firebase API Key is missing during build time. Ensure Environment Variables are set in Vercel.");
    }
    
    // Return the existing app if already initialized, or initialize a new one
    // We use a try-catch to prevent build-time crashes if keys are completely missing
    try {
        if (getApps().length > 0) {
            return getApp();
        }
        return initializeApp(firebaseConfig);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        // Return a dummy object if initialization fails to prevent total build failure
        return {} as any;
    }
}

export { initializeFirebase };
