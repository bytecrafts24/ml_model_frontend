
// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useLocation } from "react-router-dom";

// const socket = io("ws://localhost:3000", {
//   transports: ["websocket"],
//   autoConnect: true,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });
// const ChatApp = () => {
//   const [status, setStatus] = useState("Connected");
//   const [username, setUsername] = useState("");
//   const [currentRoom, setCurrentRoom] = useState("");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [shareLink, setShareLink] = useState("");
//   const location = useLocation(); // Use the useLocation hook

//   useEffect(() => {
//     if (!socket.connected) {
//       socket.connect();
//     }
//     const params = new URLSearchParams(location.search);
//     const roomId = params.get("room");
//     if (roomId) {
//       setCurrentRoom(roomId);
//     }
//     const handleConnect = () => {
//       console.log("🟢 Connected to WebSocket");
//       setStatus("Connected");
//     };

//     const handleDisconnect = () => {
//       console.log("🔴 Disconnected from WebSocket");
//       setStatus("Disconnected");
//     };

//     const handleError = (error) => {
//       console.error("⚠️ WebSocket error:", error);
//       setStatus("Error connecting");
//     };
//     const handleMessage = (data) => {
//       log(`${data.username}: ${data.message}`);
//     };

//     socket.on("connect", handleConnect);
//     socket.on("disconnect", handleDisconnect);
//     socket.on("connect_error", handleError);
//     socket.on("user_joined", (data) =>
//       log(`${data.username} joined the room.`)
//     );
//     socket.on("receive_message", handleMessage);

//     return () => {
//         socket.off('connect', handleConnect);
//         socket.off('disconnect', handleDisconnect);
//         socket.off('connect_error', handleError);
//         socket.off('user_joined');
//         socket.off('receive_message');
//     };
//   }, [location]);
//   const createRoom = () => {
//     const newRoomId = Math.random().toString(36).substring(7);
//     setCurrentRoom(newRoomId);
//     const link = `${window.location.origin}/chat-app?room=${newRoomId}`; // Correct path
//     setShareLink(link);
//   };

//   const joinRoom = () => {
//     if (!username) {
//       alert("Please enter your name");
//       return;
//     }
//     socket.emit("join_room", { username, roomId: currentRoom });
//   };

//   const sendMessage = () => {
//     if (!message) return;
//     socket.emit("send_message", { roomId: currentRoom, username, message });
//     log(`${username}: ${message}`);
//     setMessage("");
//   };

//   const log = (msg) => {
//     setMessages((prev) => [...prev, msg]);
//   };

//   return (
//     <div className="p-6">
//       <div
//         className={`p-4 mb-4 text-white ${
//           status === "Connected" ? "bg-green-500" : "bg-red-500"
//         }`}
//       >
//         {status}
//       </div>
//       {!currentRoom && (
//         <div className="mb-4">
//           <button
//             onClick={createRoom}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Create New Room
//           </button>
//         </div>
//       )}
//       {shareLink && (
//         <div className="mb-4">
//           <span>Share this link: {shareLink}</span>
//           <button
//             onClick={() => navigator.clipboard.writeText(shareLink)}
//             className="bg-gray-300 ml-2 px-2 py-1 rounded"
//           >
//             Copy
//           </button>
//         </div>
//       )}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Your name"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="border p-2 rounded mr-2"
//         />
//         <button
//           onClick={joinRoom}
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Join Chat
//         </button>
//       </div>
//       {currentRoom && (
//         <div>
//           <h2 className="mb-2">Room: {currentRoom}</h2>
//           <div
//             className="border h-64 overflow-y-auto p-2 mb-4"
//             style={{ borderColor: "#ccc" }}
//           >
//             {messages.map((msg, index) => {
//               const isCurrentUser = msg.startsWith(username);
//               return (
//                 <div
//                   key={index}
//                   className={`mb-2 ${
//                     isCurrentUser ? "text-right" : "text-left"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block p-2 rounded ${
//                       isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300"
//                     }`}
//                   >
//                     {msg}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//           <input
//             type="text"
//             placeholder="Type message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="border p-2 rounded mr-2"
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Send
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatApp;


import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";


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
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
//   const navigate = useNavigate();


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
      setStatus("Connected");
    };

    const handleDisconnect = () => {
      setStatus("Disconnected");
    };

    const handleError = (error) => {
      setStatus("Error connecting");
    };

    const handleSearch = () => {
        setIsSearching(!isSearching);
        setSearchQuery("");
      };
    
      const handleClose = () => {
        socket.disconnect();
        setMessages([]);
        setCurrentRoom("");
        // navigate("/");
      };
    
      const filteredMessages = isSearching && searchQuery
        ? messages.filter(msg => 
            msg.text.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : messages;
    

    const handleMessage = (data) => {
      const messageId = `${data.username}-${Date.now()}`;
      setMessages(prev => {
        if (!prev.some(msg => msg.id === messageId)) {
          return [...prev, { ...data, id: messageId, text: `${data.username}: ${data.message}` }];
        }
        return prev;
      });
    };
    
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("user_joined", (data) => {
      const joinMessage = `${data.username} joined the room.`;
      setMessages(prev => [...prev, { id: Date.now(), text: joinMessage, isSystem: true }]);
    });
    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("user_joined");
      socket.off("receive_message");
    };
  }, [location]);

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    setCurrentRoom(newRoomId);
    const link = `${window.location.origin}/chat-app?room=${newRoomId}`;
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
    if (!message.trim()) return;
    const messageData = {
      roomId: currentRoom,
      username,
      message: message.trim(),
      id: Date.now()
    };
    socket.emit("send_message", messageData);
    setMessages(prev => [...prev, { ...messageData, text: `${username}: ${message}`, isSent: true }]);
    setMessage("");
  };

  return (
    <div className="p-6">
      <div className={`p-4 mb-4 text-white ${status === "Connected" ? "bg-green-500" : "bg-red-500"}`}>
        {status}
      </div>

      {!currentRoom && (
        <div className="mb-4">
          <button onClick={createRoom} className="bg-blue-500 text-white px-4 py-2 rounded">
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
        <button onClick={joinRoom} className="bg-green-500 text-white px-4 py-2 rounded">
          Join Chat
        </button>
      </div>

      {currentRoom && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold">{username}</h2>
                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
  <FontAwesomeIcon icon={faSearch} />
</button>
<button className="text-gray-500 hover:text-gray-700">
  <FontAwesomeIcon icon={faTimes} />
</button>

      </div>
    </div>


          <div className="h-[500px] overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  msg.isSent ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 outline-none"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
