import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = { email, password };

        try {
            const response = await axios.post("http://localhost:5000/api/users/login", body);

            if (response.status === 200) {
                console.log(response);
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("userId", response.data.id);
                localStorage.setItem("userName", response.data.name);
                localStorage.setItem("userEmail" , response.data.email);
                
                navigate('/dashboard/friend'); // Redirect to dashboard
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex font-Inter items-center justify-center min-h-screen bg-[#faf5ee]">
  <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
    <h2 className="text-3xl font-bold text-center text-[#2b4b91]">Login</h2>
    <p className="text-center text-sm text-gray-600">
      Welcome back! Please log in to your account.
    </p>
    <form onSubmit={handleSubmit} className="space-y-6">
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
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-semibold text-white bg-[#3a72e8] rounded-lg hover:bg-[#2b4b91] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#91c2f9] shadow-md"
      >
        Login
      </button>
    </form>
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
