// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDSJoqfblpeJ_Z2q8qEb6FlPArJTf4tsQ",
  authDomain: "locartist-c2410.firebaseapp.com",
  databaseURL: "https://locartist-c2410.firebaseio.com",
  projectId: "locartist-c2410",
  storageBucket: "locartist-c2410.appspot.com",
  messagingSenderId: "264476583185",
  appId: "1:264476583185:web:bc7603f3397da2d39018b0",
  measurementId: "G-6QG8YYZ4F2",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

export { app, db };
