import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Props = {
    setIsDelete : (vale : boolean) => void
}

const DeleteUser: React.FC<Props> = ({setIsDelete}) => {
  const navigate = useNavigate();

    const handleDelete = async(e : React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authToken"); // Retrieve the token
            const userId = localStorage.getItem("userId");
            const response = await axios.delete(`${process.env.BASE_URL}/api/users/delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('User account deleted successfully:', response.data);
            setIsDelete(false)
            navigate('/signup')
        } catch (error) {
            console.error('Delete failed:', error);
        }
        
    };

    const handleCancel = () => {
        // Add your cancel logic here
        console.log('Delete cancelled');
        setIsDelete(false)
    };

    return (
        <div className="fixed inset-0 flex font-inter items-center justify-center bg-black bg-opacity-70 z-50">
  <div className="bg-white hover:scale-105 transition transform duration-200 p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Delete User</h2>
    <p className="text-gray-600 text-sm mb-4">
      Are you sure you want to delete this user? This action cannot be undone.
    </p>
    <div className="flex justify-between items-center">
      <button
        onClick={handleCancel}
        className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={handleDelete}
        className="px-6 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Delete
      </button>
    </div>
  </div>
</div>

    );
};

export default DeleteUser;