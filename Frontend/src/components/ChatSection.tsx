import React, { useEffect, useRef, useState,useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../hooks/useSocket';

interface Message {
  id?: number;
  content: string;
  senderId: number;
  receiverId: number;
  timestamp: Date;
}

type User = {
  id: number;
  name: string;
  email: string;
};


const ChatComponent: React.FC = () => {
  console.log("in Chat Component");
  
  const { socket } = useSocket();
  const { smaller, larger } = useParams<{ smaller: string; larger: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const senderId = localStorage.getItem('userId');
  const receiverId = senderId === smaller ? larger : smaller;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [otherUser,setOtherUser] = useState<User | null>()

  const scrollToLatestMessage = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  
  const scrollToLatestMessageSmooth = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };
  

  useEffect(() => {
    if (socket && senderId && receiverId) {
      setMessages([]); // Clear messages when sender or receiver changes

      // Join the chat room
      socket.emit('inchat', Number(senderId), Number(receiverId));

      const fetchUser = async ()=>{
        const token = localStorage.getItem('authToken')
        try {
          
          const response= await axios.get(`${import.meta.env.VITE_BASE_URL}/users/getfriend/${receiverId}`,{headers: {
            Authorization: `Bearer ${token}`,
        }})

        const friend : User = response.data;
        setOtherUser(friend);
        
        
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }

      fetchUser();

      const fetchMessages = async () => {
        const token = localStorage.getItem("authToken")
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/messages/chat/${Math.min(Number(senderId), Number(receiverId))}/${Math.max(
              Number(senderId),
              Number(receiverId)
            )}`,{headers: {
              Authorization: `Bearer ${token}`,
          }}
          );
          if (Array.isArray(response.data)) {
            setMessages(response.data);
          } else {
            console.error('Invalid message data format:', response.data);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();

      const handleNewMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
        scrollToLatestMessageSmooth();
      };

      socket.on('receiveMessage', handleNewMessage);

      return () => {
        socket.off('receiveMessage', handleNewMessage);
      };
    }
  }, [socket, senderId, receiverId]); // Re-run when senderId or receiverId changes

  useLayoutEffect(() => {
    scrollToLatestMessage()
  }, [messages]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      content: input,
      senderId: Number(senderId),
      receiverId: Number(receiverId),
      timestamp : new Date()
    };
    
    scrollToLatestMessage();
    setInput('');

    try {
      socket?.emit('sendMessage', newMessage, (response: { status: string }) => {
        if (response.status !== 'ok') {
          alert('Message failed to send. Please try again.');
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div
  className="flex relative flex-col h-[calc(100vh-50px)] w-full bg-gray-100 bg-cover bg-center"
>
  {/* Top Name Bar */}
  <div className="absolute top-0 z-10 w-full h-14 shadow-md bg-white font-Inter flex items-center px-4 font-medium text-lg text-gray-800">
    {otherUser?.name}
  </div>

  {/* Message List */}
  <div 
  className="flex-grow overflow-y-auto scroll-smooth custom-scrollbar bg-[#faf5ee] p-4 mb-[76px] mt-14 rounded-lg"
  >
    {Array.isArray(messages) &&
      messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex ${
            message.senderId === Number(senderId) ? "justify-end" : "justify-start"
          } mb-3`}
        >
          <div
            className={`relative p-3 rounded-lg max-w-xs shadow-md ${
              message.senderId === Number(senderId)
                ? "bg-blue-600 text-white"
                : "bg-green-300 text-gray-800"
            }`}
            style={{
              borderRadius: message.senderId === Number(senderId)
                ? "16px 16px 4px 16px"
                : "16px 16px 16px 4px",
            }}
          >
            <p className="text-sm break-words">{message.content}</p>
            <div className="flex items-center justify-end mt-1 space-x-1 text-xs opacity-80">
              <span>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {message.senderId === Number(senderId) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      ))}
    <div ref={messagesEndRef}></div>
  </div>

  {/* Input Box */}
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSend();
    }}
    className="p-4 border-t-2 bg-white absolute bottom-0 w-full flex items-center"
  >
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type a message..."
      className="flex-grow p-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 focus:outline-none"
    >
      Send
    </button>
  </form>
</div>

  );
};

export default ChatComponent;
