// src/converters/WordToPdf.js
import React, { useState } from "react";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

const WordToPdfConverter = () => {
  const [wordFile, setWordFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setWordFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setWordFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const convertWordToPdf = async () => {
    if (!wordFile) {
      alert("No Word file selected.");
      return;
    }

    if (!wordFile.name.endsWith(".docx")) {
      alert("Selected file is not a Word document.");
      return;
    }

    try {
      setLoading(true);
      const arrayBuffer = await wordFile.arrayBuffer();
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      page.drawText(text, { x: 50, y: 350, size: 12 });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error during conversion:", error);
      alert("Error during conversion. Please try again.");
    } finally {
      setLoading(false);
    }
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
          width: "100%", // Set width to 80%
          maxWidth: "800px", // Optional: set a maximum width
          textAlign: "center", 
          padding: "50px", 
          backgroundColor: "#f9f9f9", 
          borderRadius: "8px", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)", 
          border: isDragOver ? "2px dashed #3f51b5" : "2px dashed #ccc", // Change border color on drag over
          transition: "border-color 0.3s ease" // Smooth transition for border color
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Typography variant="h4" sx={{ marginBottom: "40px" }}>Word to PDF Converter</Typography>
        
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          id="file-upload"
          style={{ display: "none" }} // Hide the default input
        />
        <label htmlFor="file-upload">
          <Button variant="outlined" component="span" sx={{ marginBottom: "20px", padding: "10px 20px" }}>
            {fileName !== "No file chosen" ? fileName : "Select Word Document"}
          </Button>
        </label>

        <Typography variant="body2" sx={{ marginBottom: "50px", color: "#888" }}>
          {fileName === "No file chosen" ? "No file chosen. Drag and drop your file here or click to select." : ""}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={convertWordToPdf}
          disabled={loading || !wordFile}
          sx={{ marginBottom: "20px" }}
        >
          Convert to PDF
        </Button>

        {loading && <CircularProgress sx={{ marginTop: "20px" }} />}
        {downloadUrl && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="body1">Conversion complete!</Typography>
            <a href={downloadUrl} download="converted.pdf">
              <Button variant="contained" color="secondary">
                Download PDF File
              </Button>
            </a>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WordToPdfConverter;