// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCATllEc1_XykTuu1c3V-QBw20EV_oTPvU",
  authDomain: "safezone-80027.firebaseapp.com",
  projectId: "safezone-80027",
  storageBucket: "safezone-80027.firebasestorage.app",
  messagingSenderId: "4114557787",
  appId: "1:4114557787:web:8d8299f6e8b3eef349487e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
