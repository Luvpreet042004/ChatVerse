import React ,{useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useConnections } from "../hooks/useConnections";

type Props = {
    setIsLoggingOut : (value : boolean) => void
}


export const LogoutModal : React.FC<Props> = ({setIsLoggingOut})=>{
    const navigate = useNavigate();


    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-Inter">
                <div className="bg-white p-8 rounded-lg shadow-lg hover:scale-105 transition duration-300 max-w-sm w-full text-center space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Are you sure you want to log out?</h2>
                  <p className="text-gray-600 text-sm">
                    You will need to log in again to access your account.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                      onClick={() => {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("userName");
                        localStorage.removeItem("userEmail");
                        navigate("/login");
                      }}
                    >
                      Logout
                    </button>
                    <button
                      className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                      onClick={() => setIsLoggingOut(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
    )
}


type AddUserProps = {
    setIsAddUserOpen: (value: boolean) => void;
};

export const AddUserModal: React.FC<AddUserProps> = ({ setIsAddUserOpen }) => {
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
                `${import.meta.env.VITE_BASE_URL}/users/check`,
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
                `${import.meta.env.VITE_BASE_URL}/users/connect`,
                { connectionEmail: email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/connections`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConnections(response.data.connections); 

            alert('User added successfully!');


            closeAddUser(); // Reset modal state after successful addition
        } catch (err) {
            console.log(err);
            
            setError('Failed to add user. Please try again.');
        } finally {
            setAddingUser(false);
        }
    };

    // Function to close the modal and reset its state
    const closeAddUser = () => {
        setIsAddUserOpen(false);
        setEmail('');
        setUserExists(null);
        setError(null);
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] font-Inter">
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <h3 className="text-xl font-bold text-gray-800 mb-6">Add New User</h3>

    {/* Input Field */}
    <input
      type="email"
      placeholder="Enter user's email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Check User Button */}
    <button
      onClick={handleCheckUser}
      className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition ${
        loading || email.trim() === ''
          ? 'bg-blue-300 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 shadow-md'
      }`}
      disabled={loading || email.trim() === ''}
    >
      {loading ? 'Checking...' : 'Check User'}
    </button>

    {/* User Status Messages */}
    {userExists === true && (
      <div className="text-green-600 mt-4 text-center font-medium">User exists! You can add them.</div>
    )}
    {userExists === false && (
      <div className="text-red-500 mt-4 text-center font-medium">User does not exist.</div>
    )}
    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

    {/* Add User Button */}
    {userExists && (
      <button
        onClick={handleAddUser}
        className={`w-full px-4 py-2 mt-4 rounded-lg text-white font-semibold transition ${
          addingUser
            ? 'bg-green-300 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 shadow-md'
        }`}
        disabled={addingUser}
      >
        {addingUser ? 'Adding...' : 'Add User'}
      </button>
    )}

    {/* Cancel Button */}
    <button
      onClick={closeAddUser}
      className="w-full px-4 py-2 mt-4 text-gray-600 font-medium hover:text-gray-800 transition"
    >
      Cancel
    </button>
  </div>
</div>

    );
};