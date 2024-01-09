
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import {collection, getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCHXYMaDSEi5mtNJl1qebGd84tsaiWZ-VI",
  authDomain: "wastefreeapp.firebaseapp.com",
  projectId: "wastefreeapp",
  storageBucket: "wastefreeapp.appspot.com",
  messagingSenderId: "479310313794",
  appId: "1:479310313794:web:d4a1d2aec6ee774539b0db",
  measurementId: "G-P26MZY85M8"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

export const users = collection(FIRESTORE_DB, 'users');