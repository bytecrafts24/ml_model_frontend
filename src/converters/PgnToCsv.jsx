import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const PgnToCsvConverter = () => {
  const [pgn, setPgn] = useState('');
  const [csv, setCsv] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      setPgn(fileContent);
      setFileName(file.name);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      setPgn(fileContent);
      setFileName(file.name);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const convertPgnToCsv = () => {
    if (!pgn) {
      alert("No PGN content to convert.");
      return;
    }

    // Simple conversion logic (you can customize this)
    const lines = pgn.split('\n');
    const csvContent = lines.map(line => line.replace(/;/g, ',')).join('\n');
    setCsv(csvContent);
  };

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'games.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        // backgroundColor: "#000000"
      }}
    >
      <Box 
        sx={{ 
          width: "100%",
          maxWidth: "800px",
          textAlign: "center", 
          padding: "50px", 
          backgroundColor: "#f9f9f9", 
          borderRadius: "8px", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)", 
          border: isDragOver ? "2px dashed #3f51b5" : "2px dashed #ccc",
          transition: "border-color 0.3s ease"
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Typography variant="h4" sx={{ marginBottom: "40px" }}>PGN to CSV Converter</Typography>
        
        <input
          type="file"
          accept=".pgn"
          onChange={handleFileUpload}
          id="file-upload"
          style={{ display: "none" }}
        />
        <label htmlFor="file-upload">
          <Button variant="outlined" component="span" sx={{ marginBottom: "20px", padding: "10px 20px" }}>
            {fileName !== "No file chosen" ? fileName : "Select PGN File"}
          </Button>
        </label>

        <Typography variant="body2" sx={{ marginBottom: "20px", color: "#888" }}>
          {fileName === "No file chosen" ? "No file chosen. Drag and drop your file here or click to select." : ""}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={convertPgnToCsv}
          disabled={loading || !pgn}
          sx={{ marginBottom: "20px" }}
        >
          Convert to CSV
        </Button>

        {loading && <CircularProgress sx={{ marginTop: "20px" }} />}
        
        {pgn && (
          <Box sx={{ marginTop: "20px", textAlign: "left", maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "4px" }}>
            <Typography variant="h6">Preview of PGN Content:</Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {pgn}
            </Typography>
          </Box>
        )}

        {csv && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="body1">Conversion complete!</Typography>
            <Button variant="contained" color="secondary" onClick={downloadCsv}>
              Download CSV
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PgnToCsvConverter;
