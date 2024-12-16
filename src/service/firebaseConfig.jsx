// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOD7l0Uienb8L_4A9Ee0coXt1aUQNl4AI",
  authDomain: "prepsmart-62ac1.firebaseapp.com",
  projectId: "prepsmart-62ac1",
  storageBucket: "prepsmart-62ac1.firebasestorage.app",
  messagingSenderId: "515587732428",
  appId: "1:515587732428:web:c88253459a0cd3f9eda369",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db;
export const auth = getAuth(app);
