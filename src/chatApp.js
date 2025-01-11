// // ChatApp.js

// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const socket = io('ws://localhost:3000', { transports: ['websocket'] });

// const ChatApp = () => {
//     const [status, setStatus] = useState('Disconnected');
//     const [username, setUsername] = useState('');
//     const [roomId, setRoomId] = useState('');
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [currentRoom, setCurrentRoom] = useState('');
//     const [shareLink, setShareLink] = useState('');

//     useEffect(() => {
//         socket.on('connect', () => {
//             setStatus('Connected');
//         });

//         socket.on('disconnect', () => {
//             setStatus('Disconnected');
//         });

//         socket.on('user_joined', (data) => {
//             log(`${data.username} joined the room.`);
//         });

//         socket.on('receive_message', (data) => {
//             log(`${data.username}: ${data.message}`);
//         });

//         return () => {
//             socket.off('connect');
//             socket.off('disconnect');
//             socket.off('user_joined');
//             socket.off('receive_message');
//         };
//     }, []);

//     const createRoom = () => {
//         const newRoomId = Math.random().toString(36).substring(7);
//         setCurrentRoom(newRoomId);
//         const link = `${window.location.origin}?room=${newRoomId}`;
//         setShareLink(link);
//         setRoomId(newRoomId);
//     };

//     const joinRoom = () => {
//         if (!username) {
//             alert('Please enter your name');
//             return;
//         }
//         socket.emit('join_room', { username, roomId: currentRoom });
//     };

//     const sendMessage = () => {
//         if (!message) return;
//         socket.emit('send_message', { roomId: currentRoom, message });
//         setMessage('');
//     };

//     const log = (msg) => {
//         setMessages((prev) => [...prev, msg]);
//     };

//     return (
//         <div className="p-6">
//             <div className={`p-4 mb-4 text-white ${status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}>
//                 {status}
//             </div>
//             {!currentRoom && (
//                 <div className="mb-4">
//                     <button onClick={createRoom} className="bg-blue-500 text-white px-4 py-2 rounded">
//                         Create New Room
//                     </button>
//                 </div>
//             )}
//             {shareLink && (
//                 <div className="mb-4">
//                     <span>Share this link: {shareLink}</span>
//                     <button
//                         onClick={() => navigator.clipboard.writeText(shareLink)}
//                         className="bg-gray-300 ml-2 px-2 py-1 rounded"
//                     >
//                         Copy
//                     </button>
//                 </div>
//             )}
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     placeholder="Your name"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="border p-2 rounded mr-2"
//                 />
//                 <button onClick={joinRoom} className="bg-green-500 text-white px-4 py-2 rounded">
//                     Join Chat
//                 </button>
//             </div>
//             {currentRoom && (
//                 <div>
//                     <h2 className="mb-2">Room: {currentRoom}</h2>
//                     <div className="border h-64 overflow-y-auto p-2 mb-4" style={{ borderColor: '#ccc' }}>
//                         {messages.map((msg, index) => (
//                             <div key={index}>{msg}</div>
//                         ))}
//                     </div>
//                     <input
//                         type="text"
//                         placeholder="Type message"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         className="border p-2 rounded mr-2"
//                     />
//                     <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
//                         Send
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChatApp;

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const socket = io("ws://localhost:3000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
const ChatApp = () => {
  const [status, setStatus] = useState("Connected");
  const [username, setUsername] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const location = useLocation(); // Use the useLocation hook

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    const params = new URLSearchParams(location.search);
    const roomId = params.get("room");
    if (roomId) {
      setCurrentRoom(roomId);
    }
    const handleConnect = () => {
      console.log("🟢 Connected to WebSocket");
      setStatus("Connected");
    };

    const handleDisconnect = () => {
      console.log("🔴 Disconnected from WebSocket");
      setStatus("Disconnected");
    };

    const handleError = (error) => {
      console.error("⚠️ WebSocket error:", error);
      setStatus("Error connecting");
    };
    const handleMessage = (data) => {
      log(`${data.username}: ${data.message}`);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("user_joined", (data) =>
      log(`${data.username} joined the room.`)
    );
    socket.on("receive_message", handleMessage);

    return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleError);
        socket.off('user_joined');
        socket.off('receive_message'); // Ensure to remove the specific listener
    };
  }, [location]);
  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    setCurrentRoom(newRoomId);
    const link = `${window.location.origin}/chat-app?room=${newRoomId}`; // Correct path
    setShareLink(link);
  };

  const joinRoom = () => {
    if (!username) {
      alert("Please enter your name");
      return;
    }
    socket.emit("join_room", { username, roomId: currentRoom });
  };

  const sendMessage = () => {
    if (!message) return;
    socket.emit("send_message", { roomId: currentRoom, username, message });
    log(`${username}: ${message}`);
    setMessage("");
  };

  const log = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="p-6">
      <div
        className={`p-4 mb-4 text-white ${
          status === "Connected" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {status}
      </div>
      {!currentRoom && (
        <div className="mb-4">
          <button
            onClick={createRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create New Room
          </button>
        </div>
      )}
      {shareLink && (
        <div className="mb-4">
          <span>Share this link: {shareLink}</span>
          <button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="bg-gray-300 ml-2 px-2 py-1 rounded"
          >
            Copy
          </button>
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={joinRoom}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Join Chat
        </button>
      </div>
      {currentRoom && (
        <div>
          <h2 className="mb-2">Room: {currentRoom}</h2>
          <div
            className="border h-64 overflow-y-auto p-2 mb-4"
            style={{ borderColor: "#ccc" }}
          >
            {messages.map((msg, index) => {
              const isCurrentUser = msg.startsWith(username);
              return (
                <div
                  key={index}
                  className={`mb-2 ${
                    isCurrentUser ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded ${
                      isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300"
                    }`}
                  >
                    {msg}
                  </span>
                </div>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Type message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
