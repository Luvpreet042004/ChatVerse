import React, { useState } from 'react';
import axios from 'axios';

type Props = {
    setIsCPOpen : (value : boolean) => void
}

const ChangePassword: React.FC<Props> = ({setIsCPOpen}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(
                'http://localhost:5000/api/users/update',
                { 
                  oldPassword,
                  newPassword,
                },
                { 
                  headers: {
                    Authorization: `Bearer ${token}`, // Add the token
                  },
                }
            );
            console.log('Password changed successfully', response.data);
        } catch (error) {
            console.error('Error changing password', error);
        }
    };

    const handleCancel = () => {
        setIsCPOpen(false)
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-Inter">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-indigo-800">
            Change Password
        </h2>
        <p className="mt-2 text-sm text-center text-gray-500">
            Update your password for a secure account.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
                <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700"
                >
                    Old Password:
                </label>
                <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                />
            </div>
            <div>
                <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                >
                    New Password:
                </label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                />
            </div>
            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-md shadow-lg hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>


    );
};

export default ChangePassword;
