import React,{useState,useEffect} from 'react';
import { useConnections } from '../hooks/useConnections';
import axios from 'axios';
import ProfileSide from './ProfileSide';
import RemoveFriendModal from './RemoveFriendModel';
import DeleteUser from '../pages/DeleteUser';

type UserType = {
  id : number,
  email : string,
  name : string
}


const UserProfile: React.FC = () => {
  const [showFriend,setShowFriend] = useState(false)
  const {connections,setConnections} = useConnections();
  const [RemoveFriend,setRemoveFriend] = useState(false);
  const [User,setUser] = useState<UserType>();
  const [isDeleteOpen,setIsDeleteOpen] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const fetchConnections = async () => {
      try {
          setLoading(true);
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/connections`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },});
          setConnections(response.data.connections);
        } catch (error) {
        setError('Failed to load users');
        console.error(error);
        } finally {
        setLoading(false);
        }};
  
   fetchConnections();
      }, [setConnections]);

  const [searchTerm, setSearchTerm] = useState('');
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);



    const users= searchTerm
            ? connections.filter((user) =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : connections;

  const handleRemove = async (user : UserType)=>{
    const token = localStorage.getItem("authToken");

  try {
    const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/users/deleteConnections`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure proper content type for JSON
      },
      data: {
        connectionId: user.id, // Pass the connection ID in the body
      },
    });

    console.log("Connection removed successfully:", response.data.newConnections);
    setConnections(response.data.newConnections.connections);
  } catch (error) {
    console.error("Error removing connection:", error);
  }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full rounded-md">
  <div className={`${showFriend? "hidden":"grid grid-cols-1"} md:block`}>
    <ProfileSide setShowFriend={setShowFriend} setIsDelete={setIsDeleteOpen} />
  </div>

  {/* Friends Section */ }
  <div className={`${showFriend ? "block" : "hidden"} col-span-2 md:flex flex-col bg-gradient-to-l from-gray-100 to-blue-50 rounded-md shadow-lg p-6 overflow-hidden`}>
    <button onClick={()=> setShowFriend(false)} className={`md:hidden bg-blue-500 text-white p-1 rounded-md`}>Back</button>
    <h2 className="text-2xl font-bold text-blue-800 mb-4">Friends</h2>
    <input
      type="text"
      placeholder="Search users..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
    />
    {loading ? (
      <p className="text-gray-500">Loading...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      // Render filtered users or all users
      <div className="overflow-y-auto h-full custom-scrollbar space-y-1">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="p-3 mx-6 flex justify-between bg-white rounded-md hover:bg-blue-100 transition shadow-sm items-center"
            >
              <span className="text-gray-700 font-medium">{user.name}</span>
              <button onClick={()=>{setRemoveFriend(true);setUser({id : user.id,email : user.email,name : user.name})}} className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 hover:scale-105 transition">
                Remove
              </button>
            </div>
          ))
        ) : (
          <li className="text-gray-500">No users found</li>
        )}
      </div>
    )}
  </div>

  {RemoveFriend && User &&<RemoveFriendModal setRemoveFriend={setRemoveFriend} handleRemove={handleRemove} user={User} />}

  {isDeleteOpen && <DeleteUser  setIsDelete={setIsDeleteOpen}/>}
</div>

  );
};

export default UserProfile;
