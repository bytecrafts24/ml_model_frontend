import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Fab, Typography, TextField, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";

const MicButton = () => {
  const [listening, setListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [editableText, setEditableText] = useState("");
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  // Define commands and corresponding actions
  const commands = [
    {
      pattern: /recommend movie (.+)/,
      action: (match) => {
        const movieName = match[1].trim();
        navigate("/movie-recommender", { state: { movieName } });
      },
    },
    {
      pattern: /go to sudoku/,
      action: () => {
        navigate("/sudoku-solver");
      },
    },
    {
      pattern: /show my profile/,
      action: () => {
        navigate("/profile");
      },
    },
    // Add more commands here
  ];

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Your browser doesn't support speech recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.toLowerCase();
      setRecognizedText(spokenText);
      setEditableText(spokenText);
      console.log("Recognized speech:", spokenText);

      setListening(false); // Stop listening after capturing speech
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognitionRef.current.onend = () => {
      // Automatically restart listening if `listening` state is still true
      if (listening) {
        recognitionRef.current.start();
      }
    };
  }, [navigate, listening]);

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleTextChange = (e) => {
    setEditableText(e.target.value);
  };

  const handleSubmit = () => {
    for (const command of commands) {
      const match = editableText.match(command.pattern);
      if (match) {
        command.action(match); // Execute the action with match data
        break;
      }
    }
    setRecognizedText(""); // Clear the displayed recognized text after submission
  };

  return (
    <>
      {recognizedText && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 16,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <TextField
            variant="outlined"
            value={editableText}
            onChange={handleTextChange}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      )}

      <Fab
        color={listening ? "secondary" : "primary"}
        onClick={toggleListening}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <MicIcon />
      </Fab>
    </>
  );
};

export default MicButton;