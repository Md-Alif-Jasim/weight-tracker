import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnpOyeWgIIofik_ewgeGnSVtU8bu0qSKs",
  authDomain: "weight-tracker-be276.firebaseapp.com",
  projectId: "weight-tracker-be276",
  storageBucket: "weight-tracker-be276.firebasestorage.app",
  messagingSenderId: "691210632477",
  appId: "1:691210632477:web:18d35bd6ab4b2367c2b5f4",
  measurementId: "G-YV9N096GGM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);