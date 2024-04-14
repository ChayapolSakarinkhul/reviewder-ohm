import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCx5mfolgQ6sHOpHo-ljdj9GHmc8MX3Lz0",
  authDomain: "chat-4cef1.firebaseapp.com",
  projectId: "chat-4cef1",
  storageBucket: "chat-4cef1.appspot.com",
  messagingSenderId: "594765926350",
  appId: "1:594765926350:web:fd911cf4765d2cc3a5a59f",
  measurementId: "G-K7LZPGSY3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);