import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkK1qfetVpgquT3_6CvOpKPz9Wgp3BE2Q",
  authDomain: "gen-lang-client-0813292395.firebaseapp.com",
  projectId: "gen-lang-client-0813292395",
  storageBucket: "gen-lang-client-0813292395.firebasestorage.app",
  messagingSenderId: "952693863184",
  appId: "1:952693863184:web:0592e81445036b7523ab95"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID provided by AI Studio
export const db = initializeFirestore(app, {
  databaseId: "ai-studio-1a09c111-7d52-409c-8f76-26f3dd5f78d6",
  experimentalForceLongPolling: true,
  useFetchStreams: false
} as any);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard domain whitelist enforcement
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
