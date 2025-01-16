import React from 'react';

type Props = {
    setIsCPOpen : (value: boolean) =>void
    setIsDelete :(value: boolean) =>void
}


const  ProfileSide : React.FC<Props> = ({setIsCPOpen,setIsDelete})=>{
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    return(
        <div className="flex flex-col font-Inter justify-between bg-gradient-to-b from-white to-blue-50 shadow-lg rounded-lg max-w-lg">
        <div className="p-6">
            <h2 className="pl-4 pt-4 text-5xl font-extrabold text-blue-700">{name}</h2>
            <p className="pl-4 pt-2 pb-4 text-sm text-blue-500">{email}</p>
            <div className="h-[1px] bg-blue-100 w-[97%] mx-auto"></div>
        </div>
        <div className="grid grid-flow-row w-full p-6 gap-2">
            <div className="h-[1px] bg-blue-100 w-[97%] mx-auto"></div>
            <button onClick={()=>setIsCPOpen(true)} className="p-3 hover:scale-105 font-Inter bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition flex justify-center">
                Change Password
            </button>
            <button onClick={()=>setIsDelete(true)} className="p-3 hover:scale-105 bg-red-500 font-semibold text-white flex justify-center rounded-md hover:bg-red-600 transition">
                Delete Account
            </button>
        </div>
    </div>
    )
}


export default ProfileSide;