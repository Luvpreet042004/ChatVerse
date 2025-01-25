import React,{useEffect} from "react";
import SideBar from "../components/SideBar";
import { IsOpenProvider } from "../context/isOpen";
import Logo from '../assets/Dashboard/image_transparent 1.png';
import UserSection from "../components/UserSection";
import { useSocket } from "../hooks/useSocket";
import { ConnectionsProvider } from "../context/ConnectionsProvider";
import { Route, Routes } from "react-router-dom";
import UserProfile from "../components/UserProfile";

const Dashboard: React.FC = () => {
    const {socket} = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on("welcome", (message: string) => {
                console.log("Message from server:", message);
            });

            return () => {
                socket.off("welcome"); // Clean up the listener
            };
        }
    }, [socket]);


    return (
        <IsOpenProvider>
            <ConnectionsProvider>
              <div className="bg-[#ffffff] font-Inter">
                {/* uppar name bar */}
                <div className="h-[50px] w-screen fixed top-0 flex items-center text-black font-Inter justify-start px-4 bg-gradient-to-l from-gray-100 to-blue-50 border-b-2 font-normal">
                  <img src={Logo} className="w-[40px]" alt={"logo"} /> ChatVerse
                </div>
                <div className="fixed flex pt-[50px] flex-grow rounded-md">
                    <div className="flex h-[calc(100vh-50px)] ml-[60px] w-[calc(100vw-60px)]">
                      <Routes>
                        <Route path="/friend/*" element={<UserSection />} />
                        <Route path="/profile" element={<UserProfile />} />
                      </Routes>
                    </div>
                  <SideBar />
                </div>
            </div>
            </ ConnectionsProvider>
        </IsOpenProvider>
    );
};

export default Dashboard;
