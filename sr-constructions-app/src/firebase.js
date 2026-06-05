import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyApqAqEapOu8yD1VEGiLT32isATQ-90IRQ",
  authDomain: "sr-constructions-69c73.firebaseapp.com",
  projectId: "sr-constructions-69c73",
  storageBucket: "sr-constructions-69c73.firebasestorage.app",
  messagingSenderId: "688559523437",
  appId: "1:688559523437:web:893768b4e7408acad6a164",
  measurementId: "G-S60CLNLZGL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
