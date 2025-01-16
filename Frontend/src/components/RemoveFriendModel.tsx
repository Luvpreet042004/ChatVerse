import React from "react";

type User = {
    id : number,
    email : string,
    name : string
  }
type Props = {
    setRemoveFriend : (value : boolean) =>void
    user : User
    handleRemove : (user : User)=>void
}


const RemoveFriendModal : React.FC<Props> = ({setRemoveFriend,handleRemove,user})=>{

    
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-Inter">
                <div className="bg-white p-8 rounded-lg shadow-lg hover:scale-105 transition duration-300 max-w-sm w-full text-center space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Are you sure you want to log out?</h2>
                  <p className="text-gray-600 text-sm">
                    You will not be connected to {user.name}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                      onClick={() => {
                        setRemoveFriend(false);
                        handleRemove(user)
                      }}
                    >
                      Remove
                    </button>
                    <button
                      className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                      onClick={() => setRemoveFriend(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
    )
}

export default RemoveFriendModal;