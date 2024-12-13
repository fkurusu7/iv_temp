// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-test-c722c.firebaseapp.com",
  projectId: "blog-test-c722c",
  storageBucket: "blog-test-c722c.firebasestorage.app",
  messagingSenderId: "742503886099",
  appId: "1:742503886099:web:f99b4e07d4ba0ae6bd7ee6",
  measurementId: "G-3NB7YZX9CY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
