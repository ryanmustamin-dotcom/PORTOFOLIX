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
    // Check if we have the minimum required config
    const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

    if (typeof window === 'undefined') {
        if (!isConfigValid) {
            console.warn("Firebase config is missing or incomplete during build. This is expected if you haven't set Environment Variables in Vercel yet.");
            // Return a proxy/dummy app object to prevent crashes during static generation
            return { options: {} } as any;
        }
    }
    
    try {
        if (getApps().length > 0) {
            return getApp();
        }
        return initializeApp(firebaseConfig);
    } catch (error) {
        if (typeof window !== 'undefined') {
            console.error("Firebase initialization failed:", error);
        }
        return { options: {} } as any;
    }
}

export { initializeFirebase };
