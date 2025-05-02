import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

// Your web app's Firebase configuration
// Using environment variables for security
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings to improve reliability
const db = getFirestore(app);

// Configure Firestore for better performance and reliability
if (typeof window !== 'undefined') {
  // Only run this client-side
  const origin = window.location.origin;
  console.log('Firebase initializing from origin:', origin);
  
  // Enable offline persistence when possible
  // This can help with intermittent connection issues
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firebase persistence could not be enabled:', err.message);
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firebase persistence not supported in this browser');
    } else {
      console.error('Unknown error when enabling Firebase persistence:', err);
    }
  });
  
  // Log any Firestore errors to help with debugging
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.name === 'FirebaseError') {
      console.error('Unhandled Firebase error:', event.reason);
      // You could also send these errors to a monitoring service
    }
  });
}

export { db };
