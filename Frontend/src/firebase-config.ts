import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDpZj-sBDoh71FcJBEH9jL3vOWgBIRGXMY",
    authDomain: "chatverse-ca933.firebaseapp.com",
    projectId: "chatverse-ca933",
    storageBucket: "chatverse-ca933.firebasestorage.app",
    messagingSenderId: "796660727574",
    appId: "1:796660727574:web:876a57dcabd3a99ccc9a37",
    measurementId: "G-THV4H2C60R"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
