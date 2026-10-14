import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App with user's project configuration
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Cloud Storage
export const storage = getStorage(app, firebaseConfig.storageBucket);

// Initialize Firebase Analytics safely for web
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('[Firebase] Analytics initialized successfully.');
      }
    })
    .catch(() => {});
}

// Validate initial connection to Firestore
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Cloud Firestore connected successfully to project life-vault-f36d3.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Warning: Client appears to be offline. Verify Firebase network connectivity.');
    } else {
      console.log('[Firebase] Initial connection check resolved.');
    }
    return false;
  }
}
