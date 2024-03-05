import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAKGaQU1T3oXHtOI72GATPm4Uwwh8yS8A",
  authDomain: "trelloclone-4a2ba.firebaseapp.com",
  projectId: "trelloclone-4a2ba",
  storageBucket: "trelloclone-4a2ba.appspot.com",
  messagingSenderId: "770093316743",
  appId: "1:770093316743:web:3f4d1fe5d3e678c7d35622",
  measurementId: "G-W4Y0Q5YK1E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };