// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth , signInWithEmailAndPassword} from "firebase/auth"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhOsbLCwYMno6t31QoGVpehmxcCBsVnHs",
  authDomain: "proj-5f207.firebaseapp.com",
  projectId: "proj-5f207",
  storageBucket: "proj-5f207.appspot.com",
  messagingSenderId: "454128898003",
  appId: "1:454128898003:web:d1ca0376ab90b658f6a926",
  measurementId: "G-5TY1TBXKYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


export { app, auth, signInWithEmailAndPassword }; 