// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOqcL6RTP9HI8JurtfK8_YcCAbH5HKw8M",
  authDomain: "restaurant-orders-7cbe1.firebaseapp.com",
  projectId: "restaurant-orders-7cbe1",
  storageBucket: "restaurant-orders-7cbe1.appspot.com",
  messagingSenderId: "232357893064",
  appId: "1:232357893064:web:7f70b16e44792b5960e6fd",
  measurementId: "G-MG18ED9MDJ"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);