import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDv-vXyxdQT7YmIxaCCgzNu7jbBQCbYGA",
  authDomain: "todoapp-eb6cc.firebaseapp.com",
  projectId: "todoapp-eb6cc",
  storageBucket: "todoapp-eb6cc.appspot.com",
  messagingSenderId: "74657182983",
  appId: "1:74657182983:web:57869d7314b4eb96f281a2",
  measurementId: "G-H76WTBPKVS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);