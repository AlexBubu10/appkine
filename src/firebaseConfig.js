// Configuración de Firebase 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjQI2tX3_1Iv1Y2EqI-l2wfx2cnqzpxrk",
  authDomain: "appkine-66122.firebaseapp.com",
  projectId: "appkine-66122",
  storageBucket: "appkine-66122.appspot.com",
  messagingSenderId: "679675023983",
  appId: "1:679675023983:web:4fae747865208b9896f39a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);