// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHn9dVWCKx2RpqYlTjOnuq491L-qYGn-I",
  authDomain: "householdnextjs.firebaseapp.com",
  projectId: "householdnextjs",
  storageBucket: "householdnextjs.firebasestorage.app",
  messagingSenderId: "90379289339",
  appId: "1:90379289339:web:44dfa1e6f4ecc681f8e65e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db } ;