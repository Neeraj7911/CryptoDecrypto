// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCmWBou3INAmvQnerlTESAeCPKBffEP2uk",
  authDomain: "cryptodecrypto-96808.firebaseapp.com",
  projectId: "cryptodecrypto-96808",
  storageBucket: "cryptodecrypto-96808.appspot.com",
  messagingSenderId: "1026005120178",
  appId: "1:1026005120178:web:5c89bb12021b2eed1785ab",
  measurementId: "G-8JETNZYXBE",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  googleProvider,
  analytics,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  db,
  storage,
};
