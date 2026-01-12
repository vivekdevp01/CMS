// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firestore
import { getFirestore } from "firebase/firestore";

// (Optional) Analytics – you can REMOVE this if you want
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and EXPORT it
export const db = getFirestore(app);

// export const auth=getAuth(app);
export const auth = getAuth(app);

// Optional: Analytics (safe to keep)
export const analytics = getAnalytics(app);
console.log("API KEY =", import.meta.env.VITE_FIREBASE_API_KEY);
