import React, { useState } from "react";
import { auth } from "../firebase-config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent.");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCredential.user);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-lg font-bold text-center mb-4">Firebase Auth</h2>
        <input
          type="email"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full p-2 mb-2 text-white bg-blue-500 rounded"
        >
          Login
        </button>
        <button
          onClick={handleRegister}
          className="w-full p-2 mb-4 text-white bg-green-500 rounded"
        >
          Register
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full p-2 text-white bg-red-500 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Auth;
