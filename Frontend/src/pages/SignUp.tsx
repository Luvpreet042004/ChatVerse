import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import {createUserWithEmailAndPassword,sendEmailVerification,signInWithPopup,GoogleAuthProvider,} from 'firebase/auth';
import axios from 'axios';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('authToken') && localStorage.getItem('userId') && localStorage.getItem('userName') && localStorage.getItem('userEmail')
    if(token){
      navigate('/dashboard/friend',{replace : true});
    }
  },[navigate])
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send email verification
      if (user) {
        try {
          await sendEmailVerification(user);
  
          // Get ID token and store it locally
          const token = await user.getIdToken();
          localStorage.setItem("authToken", token);

          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/register`,{name,email})

          localStorage.setItem("userName",name)
          localStorage.setItem("userId",response.data.id)
          alert('Sign-up successful');
          navigate('/dashboard/friend',{ replace: true });
          window.history.pushState(null,'','/dashboard/friend')
        } catch (backendError) {
          // If sendEmailVerification fails, delete the user
          console.log(backendError);
          
          await user.delete();
          throw new Error('Failed to send verification email. Please try again.');
        }
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
      } else if (error.message === 'Failed to send verification email. Please try again.') {
        setError(error.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Sign-up failed:', error);
    }
  };
  

  const handleGoogleSignUp = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const name = result.user.displayName;
      const email = result.user.email;
      const token = await result.user.getIdToken();
  
      // Store Firebase token in localStorage
      localStorage.setItem("authToken", token);
  
      // Send user data to backend
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/register`, { name, email });
        
        // Store backend response data in localStorage
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userId", response.data.id);
  
        alert('Sign-up successful.');
        navigate('/dashboard/friend',{ replace: true });
      } catch (backendError) {
        console.error("Backend error:", backendError);
        setError("Failed to create user on the backend. Please try again.");
      }
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      setError('Google Sign-In failed. Please try again.');
    }
  };
  

  return (
    <div className="flex font-Inter items-center justify-center min-h-screen bg-[#faf5ee]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-Inter font-extrabold text-center text-[#2b4b91]">Sign Up</h2>
        <p className="text-center text-sm text-gray-600">
          Welcome! Create an account to get started.
        </p>

        {/* Display error message if it exists */}
        {error && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#91c2f9] focus:outline-none shadow-sm"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#91c2f9] focus:outline-none shadow-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#91c2f9] focus:outline-none shadow-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-[#3a72e8] rounded-lg hover:bg-[#2b4b91] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#91c2f9] shadow-md"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={handleGoogleSignUp}
          className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-md"
        >
          Sign Up with Google
        </button>
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-[#3a72e8] hover:text-[#2b4b91] underline transition"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
