import {useState} from "react";
import axios from "axios";
import { useConnections } from "../hooks/useConnections";

export const AddUser : React.FC = ()=>{
    const {setConnections} = useConnections();
    const [email, setEmail] = useState('');
        const [userExists, setUserExists] = useState<boolean | null>(null);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState(false);
        const [addingUser, setAddingUser] = useState(false);

    const handleCheckUser = async () => {
        setLoading(true);
        setError(null);
        setUserExists(null); // Reset state before checking
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                'http://localhost:5000/api/users/check',
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUserExists(response.data.exists);
        } catch (err) {
            console.log(err);
            
            setError('Failed to check user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to add a new user
    const handleAddUser = async () => {
        setAddingUser(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                'http://localhost:5000/api/users/connect',
                { connectionEmail: email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const response = await axios.get('http://localhost:5000/api/users/connections', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConnections(response.data.connections); 

            alert('User added successfully!'); // Reset modal state after successful addition
        } catch (err) {
            console.log(err);
            
            setError('Failed to add user. Please try again.');
        } finally {
            setAddingUser(false);
        }
    };

    return (
        <div className="fixed inset-0 flex font-Inter items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h3 className="text-lg font-Inter font-bold mb-4">Add New User</h3>
                        <input
                            type="email"
                            placeholder="Enter user's email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCheckUser}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 mb-4 w-full"
                            disabled={loading || email.trim() === ''}
                        >
                            {loading ? 'Checking...' : 'Check User'}
                        </button>
                        {userExists === true && (
                            <div className="text-green-500 font-Inter mb-4">User exists! You can add them.</div>
                        )}
                        {userExists === false && (
                            <div className="text-red-500 mb-4">User does not exist.</div>
                        )}
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {userExists && (
                            <button
                                onClick={handleAddUser}
                                className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 w-full"
                                disabled={addingUser}
                            >
                                {addingUser ? 'Adding...' : 'Add User'}
                            </button>
                        )}
                        <button
                            className="text-gray-500 hover:text-gray-700 mt-2 w-full"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}