import React, { useState } from "react";
import { ChatIcon, AddUser, ProfileIcon, LogoutIcon, HamburgerMenu } from "./SvgComponents";
import { useIsOpenContext } from "../hooks/useIsOpen";
import {LogoutModal , AddUserModal} from "./LogoutModal";
import { useNavigate } from "react-router-dom";

const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const { isOpen } = useIsOpenContext();
    const [isAddOpen, setIsAddUserOpen] = useState(false);
    const [isLoggingOut,setIsLoggingOut] = useState(false);

    console.log('in sidebar');
    

    // Function to check if the user exists

    return (
        <div
            className={`flex fixed top-[50px] shadow-sm flex-col lg:justify-between border-r-2 h-[calc(100vh-50px)] bg-[#ffffff] transition-all duration-100 p-2 ${
                isOpen ? "lg:w-[210px]" : "lg:w-[60px]"
            }`}
        >
            {/* Sidebar Buttons */}
            <div className="space-y-3 w-full">
                <div>
                    <HamburgerMenu />
                </div>
                <div>
                    <Buttons name="Chat" onClick={()=>{
                        navigate('/dashboard/friend');
                    }} svg={<ChatIcon />} />
                    <Buttons
                        name="New User"
                        svg={<AddUser />}
                        onClick={() => setIsAddUserOpen(true)} // Open modal
                    />
                </div>
                <div className="w-[97%] h-[1px] bg-[#DCDCDC]"></div>
            </div>

            {/* Bottom Buttons */}
            <div className="w-full">
                <div className="w-[97%] h-[1px] bg-[#DCDCDC]"></div>
                <Buttons name="Logout" onClick={()=> setIsLoggingOut(true)} svg={<LogoutIcon />} />
                <Buttons name="Profile" onClick={()=>{navigate("/dashboard/profile")}} svg={<ProfileIcon />} />
            </div>

            {/* Modal */}
            {isAddOpen && <AddUserModal setIsAddUserOpen={setIsAddUserOpen}/>}

            {isLoggingOut && <LogoutModal setIsLoggingOut={setIsLoggingOut}/>}
        </div>
    );
};

export default SideBar;

interface ComponentProps {
    name: string;
    svg: React.ReactNode;
    onClick?: () => void; // Optional click handler
}

const Buttons: React.FC<ComponentProps> = ({ name, svg, onClick }) => {
    const { isOpen } = useIsOpenContext();

    return (
        <div
            className="flex items-center hover:bg-[#EBEBEB] font-Inter text-md text-black fill-slate-600 space-x-4 p-2 rounded-md cursor-pointer"
            onClick={onClick}
        >
            <div>{svg}</div>
            <div className={`font-light ${isOpen ? "flex" : "hidden"}`}>{name}</div>
        </div>
    );
};
