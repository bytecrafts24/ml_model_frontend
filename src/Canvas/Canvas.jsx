import React, { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useParams, useNavigate } from "react-router-dom";
import { debounce } from 'lodash';
import { useCallback } from 'react';
import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
} from "../api/canvas-ws"; // Import API helpers

const Canvas = ({ wsUrl }) => {
  const [roomId, setRoomId] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [elements, setElements] = useState([]);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [previousElements, setPreviousElements] = useState([]);

  useEffect(() => {
    if (sessionId) {
      const ws = new WebSocket(`${wsUrl}/canvas/${sessionId}`);
      ws.onopen = () => {
        console.log("🟢 WebSocket Connected");
        setSocket(ws);
        ws.send(JSON.stringify({ type: "GET_INITIAL_STATE" }));
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Received WebSocket message:", data);

        switch (data.type) {
          case "DRAW_UPDATE":
            console.log("🎨 Drawing Update:", data.elements);
            const flattenedElements = data.elements.flat().filter(Boolean);
            setElements(prevElements => {
              return [...flattenedElements];
            });
            break;
          case "USERS_UPDATE":
            console.log("👥 Users Update:", data.count);
            setConnectedUsers(data.count);
            break;
          case "INITIAL_STATE":
            console.log("🔄 Initial State:", data);
            setElements(data.elements);
            setIsSessionActive(data.isActive);
            break;
          default:
            console.log("⚠️ Unknown message type:", data.type);
            break;
        }
      };
      ws.onclose = () => {
        console.log("🔴 WebSocket Disconnected");
      };
      return () => ws.close();
    }
  }, [sessionId, wsUrl]);


  const debouncedUpdate = useCallback(
    debounce((updatedElements, currentSessionId) => {
      // Only send if elements actually changed
      if (JSON.stringify(previousElements) !== JSON.stringify(updatedElements)) {
        if (socket && isSessionActive) {
          socket.send(
            JSON.stringify({
              type: "DRAW_UPDATE",
              elements: updatedElements,
              sessionId: currentSessionId,
            })
          );
        }
        setPreviousElements(updatedElements);
      }
    }, 100),
    [socket, isSessionActive, previousElements]
  );
  
  useEffect(() => {
    const fetchSession = async () => {
      if (sessionId) {
        try {
          console.log("📡 Fetching session:", sessionId);
          const session = await getSession(sessionId);
          console.log("📦 Session data:", session);
          setElements(session.session.elements);
          setIsSessionActive(session.session.isActive);
        } catch (error) {
          console.error("❌ Error fetching session:", error);
          navigate("/");
        }
      }
    };

    fetchSession();
  }, [sessionId, navigate]);

  const toggleSession = async () => {
    if (!isSessionActive && !sessionId) {
      try {
        // Generate new session ID
        const newSessionId = Math.random().toString(36).substring(7);
        console.log("🆕 Creating new session with ID:", newSessionId);

        // Create session first
        const session = await createSession(newSessionId);
        console.log("✅ Session created:", session);

        // Update state only after successful creation
        if (session) {
          setRoomId(newSessionId);
          setIsSessionActive(true);
          navigate(`/canvas/${newSessionId}`);
        }
      } catch (error) {
        console.error("❌ Error creating session:", error);
        alert("Failed to create session");
      }
    } else if (sessionId) {
      // Toggle existing session
      setIsSessionActive(!isSessionActive);
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "SESSION_TOGGLE",
            active: !isSessionActive,
            sessionId: sessionId,
          })
        );
      }
    }
  };

  const fetchSession = async () => {
    if (!sessionId || sessionId === "null") {
      console.log("⚠️ Invalid sessionId, redirecting...");
      navigate("/");
      return;
    }

    try {
      console.log("📡 Fetching session:", sessionId);
      const session = await getSession(sessionId);
      console.log("📦 Session data:", session);

      if (session && session.session) {
        setElements(session.session.elements);
        setIsSessionActive(session.session.isActive);
        setRoomId(sessionId);
      }
    } catch (error) {
      console.error("❌ Error fetching session:", error);
      navigate("/");
    }
  };

  const onChangeHandler = async (updatedElements) => {
    setElements(updatedElements);
    
    const currentSessionId = sessionId || roomId;
    if (!currentSessionId || currentSessionId === "null") {
      console.error("❌ Invalid session ID");
      return;
    }
    debouncedUpdate(updatedElements, currentSessionId);
  };

  const deleteCurrentSession = async () => {
    try {
      if (roomId) {
        await deleteSession(roomId); // Call API to delete session
        console.log("Session deleted");
        setRoomId(null);
        setElements([]);
        setIsSessionActive(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };
  console.log('ele',elements);
  return (
    <div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          gap: "10px",
          position: "absolute",
          top: 60,
          left: 240,
          right: 0,
          zIndex: 1,
          background: "white",
        }}
      >
        {!sessionId && !isSessionActive ? (
          <button onClick={toggleSession}>Start New Session</button>
        ) : (
          <>
            <button onClick={toggleSession}>
              {isSessionActive ? "Stop Session" : "Resume Session"}
            </button>
            <span>Connected Users: {connectedUsers}</span>
            {roomId && (
              <button
                onClick={() => {
                  const url = `${window.location.origin}/canvas/${roomId}`;
                  navigator.clipboard.writeText(url);
                  alert("Invite link copied!");
                }}
              >
                Copy Invite Link
              </button>
            )}
            <button onClick={deleteCurrentSession}>Delete Session</button>
          </>
        )}
      </div>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 100px)",
          position: "absolute",
          top: 100,
          left: 240,
          right: 0,
          bottom: 0,
        }}
      >
        <Excalidraw
        onChange={onChangeHandler}
        initialData={{
          elements: elements || [],
          appState: {
            viewBackgroundColor: "#FFFFFF",
            currentItemStrokeColor: "#000000",
          },
        }}
        viewModeEnabled={!isSessionActive}
        zenModeEnabled={false}
        gridModeEnabled={false}
        // key={JSON.stringify(elements)}
      />
      </div>
    </div>
  );
};

export default Canvas;
