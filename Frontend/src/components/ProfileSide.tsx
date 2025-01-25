import React from 'react';

type Props = {
    setIsDelete :(value: boolean) =>void,
    setShowFriend: (value: boolean) =>void

}


const  ProfileSide : React.FC<Props> = ({setIsDelete,setShowFriend})=>{
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    return(
        <div className="col-span-1 flex h-full flex-col font-Inter justify-between bg-gradient-to-b from-white to-blue-50 shadow-lg rounded-lg ">
        <div className="p-6">
            <h2 className="pl-4 pt-4 text-5xl font-extrabold text-blue-700">{name}</h2>
            <p className="pl-4 pt-2 pb-4 text-sm text-blue-500">{email}</p>
            <div className="h-[1px] bg-blue-100 w-[97%] mx-auto"></div>
            <button onClick={()=>setShowFriend(true)} className="md:hidden  m-2 p-3 hover:scale-105 bg-blue-500 font-semibold text-white flex justify-center rounded-md hover:bg-blue-600 transition">Users</button>
        </div>
        <div className="grid grid-flow-row w-full p-6 gap-2">
            <div className="h-[1px] bg-blue-100 w-[97%] mx-auto"></div>
            <button onClick={()=>setIsDelete(true)} className="p-3 hover:scale-105 bg-red-500 font-semibold text-white flex justify-center rounded-md hover:bg-red-600 transition">
                Delete Account
            </button>
        </div>
    </div>
    )
}


export default ProfileSide;