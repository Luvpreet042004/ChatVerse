import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import {sendPasswordResetEmail,signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    const email = prompt("Please enter your email to reset your password:");
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert("Password reset email sent. Check your inbox!");
        })
        .catch((error) => {
          console.error("Error sending reset email:", error);
          alert("Failed to send password reset email. Please try again.");
        });
    }
  };
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      const response = await axios.get("http://localhost:5000/api/users/login",{
        headers :{
          Authorization :`Bearer ${token}`
        }
      });
      // Store user data in localStorage (if needed)
      localStorage.setItem('userEmail',user.email || '');
      localStorage.setItem("authToken",token)
      localStorage.setItem("userName",response.data.name)
      localStorage.setItem("userId",response.data.id)
      navigate('/dashboard/friend'); // Redirect to dashboard
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setError('Invalid password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await axios.get("http://localhost:5000/api/users/login",{
        headers :{
          Authorization :`Bearer ${token}`
        }
      });

      localStorage.setItem("authToken",token)
      localStorage.setItem("userName",response.data.name)
      localStorage.setItem("userEmail", response.data.email)
      localStorage.setItem("userId",response.data.id)

      // Store user data in localStorage (if needed)
      localStorage.setItem('userEmail', result.user.email || '');
      navigate('/dashboard/friend'); // Redirect to dashboard
    } catch (error: any) {
      setError('Google Sign-In failed. Please try again.');
      console.error('Google Sign-In failed:', error);
    }
  };

  return (
    <div className="flex font-Inter items-center justify-center min-h-screen bg-[#faf5ee]">
  <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
    <h2 className="text-3xl font-bold text-center text-[#2b4b91]">Login</h2>
    <p className="text-center text-sm text-gray-600">
      Welcome back! Please log in to your account.
    </p>

    {/* Display error message if it exists */}
    {error && (
      <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
        {error}
      </div>
    )}

    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#91c2f9] focus:outline-none shadow-sm"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#91c2f9] focus:outline-none shadow-sm"
          placeholder="Enter your password"
        />
        <div className="text-right mt-2">
          <button
            onClick={handleForgotPassword}
            type="button"
            className="text-sm text-[#3a72e8] hover:text-[#2b4b91] underline transition"
          >
            Forgot Password?
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-semibold text-white bg-[#3a72e8] rounded-lg hover:bg-[#2b4b91] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#91c2f9] shadow-md"
      >
        Login
      </button>
    </form>

    <button
      onClick={handleGoogleLogin}
      className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-md"
    >
      Login with Google
    </button>

    <div className="text-center">
      <button
        onClick={() => navigate('/signup')}
        className="text-[#3a72e8] hover:text-[#2b4b91] underline transition"
      >
        Don't have an account? Sign up
      </button>
    </div>
  </div>
</div>

  );
};

export default Login;
