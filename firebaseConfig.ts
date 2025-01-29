// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyA2mKrt9iGuu71K0kIes5PIV3MrpWB-z6I",
    authDomain: "wheelfit-2db5d.firebaseapp.com",
    projectId: "wheelfit-2db5d",
    storageBucket: "wheelfit-2db5d.firebasestorage.app",
    messagingSenderId: "145344049006",
    appId: "1:145344049006:web:a626271a7de91aeafb1b7f"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
