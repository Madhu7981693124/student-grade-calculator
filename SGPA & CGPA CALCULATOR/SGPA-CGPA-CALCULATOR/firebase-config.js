import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyA-WJkA-RreayE01_ay2n4aLOI9LtzMsEg",
  authDomain:        "login-page-5df2a.firebaseapp.com",
  projectId:         "login-page-5df2a",
  storageBucket:     "login-page-5df2a.firebasestorage.app",
  messagingSenderId: "853096033339",
  appId:             "1:853096033339:web:89b98288fee269bc91401e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
