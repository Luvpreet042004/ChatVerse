import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = { name, email, password };

        try {
            
            const response = await axios.post("http://localhost:5000/api/users/register", body);

            if (response.status === 201) {
                console.log("Sign-in successful");
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("userId", response.data.id);
                localStorage.setItem("userName", response.data.name);
                localStorage.setItem('userEmail',response.data.email);
                
                navigate('/dashboard/friend');
            }
        } catch (error) {
            console.error("Sign-in failed:", error);
        }
    };
    

    return (
        <div className="flex font-Inter items-center justify-center min-h-screen bg-[#faf5ee]">
  <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
    <h2 className="text-3xl font-Inter font-extrabold text-center text-[#2b4b91]">Sign In</h2>
    <p className="text-center text-sm text-gray-600">
    Welcome! Create an account to get started.
    </p>
    <form onSubmit={handleSubmit} className="space-y-5">
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
        Sign In
      </button>
    </form>
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

export default SignIn;