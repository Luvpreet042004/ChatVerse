import { Route, Routes ,useLocation } from 'react-router-dom';
import ChatComponent from './ChatSection'
import UpparBar from './UpparBar';
import Logo from '../assets/Dashboard/image_transparent 2.png'

const UserSection: React.FC = () => {
    const location = useLocation();
    const isChatOpen = location.pathname.includes("chat")

    return (
        <div className=" grid grid-cols-1 md:grid-cols-3 h-full w-full">
            {/* Chats Sidebar */}
            <div className={`${isChatOpen? "hidden":"grid grid-cols-1" } md:block`}>
                <UpparBar />
            </div>

            {/* Chat Section */}
            <div className={`${isChatOpen? "block":"hidden"} md:col-span-2 z-0 md:flex justify-center items-center bg-gray-100 rounded-md shadow-md`}>
            <Routes>
                <Route path="/" element={<div className="bg-[#f2f2f2] justify-center flex flex-col"><img src={Logo} alt="" /><div className=''>Select Friend to start chat....</div></div>} />
                <Route path="chat/:smaller/:larger" element={<ChatComponent />} />
              </Routes>
            </div>
        </div>

    );
};

export default UserSection;
