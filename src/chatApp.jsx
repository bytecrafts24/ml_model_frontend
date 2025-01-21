
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

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";


const socket = io("ws://localhost:3000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

const ChatApp = () => {
  const [status, setStatus] = useState("Connected");
  const [username, setUsername] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [peerConnections, setPeerConnections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    const params = new URLSearchParams(location.search);
    const roomId = params.get("room");
    if (roomId) {
      setCurrentRoom(roomId);
    }

    socket.on("connect", () => setStatus("Connected"));
    socket.on("disconnect", () => setStatus("Disconnected"));
    socket.on("connect_error", () => setStatus("Error connecting"));

    socket.on("receive_message", (data) => {
      setMessages(prev => [...prev, { 
        id: Date.now(),
        text: `${data.username}: ${data.message}`,
        isSent: data.username === username
      }]);
    });

    socket.on("user_joined", (data) => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: `${data.username} joined the room.`,
        isSystem: true 
      }]);
    });

    socket.on("call_started", async ({ callerId }) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(stream);
        myVideo.current.srcObject = stream;
        
        const pc = new RTCPeerConnection(configuration);
        setPeerConnections(prev => ({ ...prev, [callerId]: pc }));

        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        pc.ontrack = event => {
          userVideo.current.srcObject = event.streams[0];
        };

        pc.onicecandidate = event => {
          if (event.candidate) {
            socket.emit("ice_candidate", {
              roomId: currentRoom,
              candidate: event.candidate
            });
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { roomId: currentRoom, offer });
      } catch (error) {
        console.error("Error handling call:", error);
      }
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnections).forEach(pc => pc.close());
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("receive_message");
      socket.off("user_joined");
      socket.off("call_started");
    };
  }, [location, currentRoom, username, stream, peerConnections]);

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
    setIsJoined(true);
    navigate(`/chat-app?room=${currentRoom}`, { replace: true });

  };

  const sendMessage = () => {
    if (!message) return;
    socket.emit("send_message", { roomId: currentRoom, message });
    setMessage("");
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(stream);
      myVideo.current.srcObject = stream;
      socket.emit("start_call", { roomId: currentRoom });
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setIsMuted(!isMuted);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    Object.values(peerConnections).forEach(pc => pc.close());
    setPeerConnections({});
    setCallEnded(true);
    setCallAccepted(false);
    setStream(null);
    socket.emit("end_call", { roomId: currentRoom });
  };

  return (
    <div className="p-6">
      <div className={`p-4 mb-4 text-white ${status === "Connected" ? "bg-green-500" : "bg-red-500"}`}>
        {status}
      </div>

            {currentRoom && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <span className="font-semibold">Room: </span>
          <span>{currentRoom}</span>
        </div>
      )}

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

      {currentRoom && !isJoined && (
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
      )}

      {currentRoom && isJoined && (
        <div className="bg-white rounded-lg shadow-lg">
                  {/* <div className="bg-white rounded-lg shadow-lg"> */}
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
              <button 
                onClick={() => setIsSearching(!isSearching)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <button 
                onClick={() => {
                  socket.disconnect();
                  setMessages([]);
                  setCurrentRoom("");
                  setIsJoined(false);
                  setShareLink("");
                  navigate("/chat-app", { replace: true });
                  ;
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {isSearching && (
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          <div className="flex justify-center gap-4 p-4 border-b">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-1/2 max-w-[300px] rounded"
              style={{ display: stream ? 'block' : 'none' }}
            />
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="w-1/2 max-w-[300px] rounded"
              style={{ display: callAccepted && !callEnded ? 'block' : 'none' }}
            />
          </div>

          <div className="flex justify-center gap-4 p-4">
            {!stream ? (
              <button onClick={startCall} className="bg-green-500 text-white px-4 py-2 rounded">
                Start Video Call
              </button>
            ) : (
              <>
                <button
                  onClick={toggleVideo}
                  className={`${isVideoOff ? 'bg-red-500' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
                >
                  {isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
                </button>
                <button
                  onClick={toggleMute}
                  className={`${isMuted ? 'bg-red-500' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button onClick={endCall} className="bg-red-500 text-white px-4 py-2 rounded">
                  End Call
                </button>
              </>
            )}
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
                placeholder="Type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 outline-none border p-2 rounded"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
