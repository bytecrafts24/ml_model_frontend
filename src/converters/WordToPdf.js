// src/converters/WordToPdf.js
import React, { useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

const WordToPdfConverter = () => {
  const [wordFile, setWordFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setFileName(file.name);
      setWordFile(file);
    } else {
      console.log("No file selected.");
    }
  };

  const convertWordToPdf = async () => {
    if (!wordFile) {
      console.log("No Word file selected.");
      return;
    }


    if (!wordFile.name.endsWith(".docx")) {
      console.error("Selected file is not a Word document.");
      return;
    }

    try {
      setLoading(true);
      const arrayBuffer = await wordFile.arrayBuffer();
      console.log("ArrayBuffer loaded:", arrayBuffer);


      const { value: text } = await mammoth.extractRawText({ arrayBuffer });
      console.log("Extracted text:", text);


      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]); // Create a new page


      page.drawText(text, {
        x: 50,
        y: 350,
        size: 12,
      });


      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `${fileName.replace(".docx", "")}.pdf`);
    } catch (error) {
      console.error("Error during conversion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", width: "80%", margin: "auto" }}>
      <h1>Word to PDF Converter</h1>
      <input
        type="file"
        accept=".docx"
        style={{ display: "none" }}
        id="fileInput"
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput" style={{ cursor: "pointer", marginBottom: "20px" }}>
        <Button variant="contained" component="span">
          Select Word Document
        </Button>
        <Typography variant="body2">{fileName}</Typography>
      </label>

      <Button
        variant="contained"
        color="primary"
        onClick={convertWordToPdf}
        disabled={!wordFile || loading}
      >
        Convert to PDF
      </Button>
      {loading && <CircularProgress style={{ marginTop: "20px" }} />}
    </div>
  );
};

export default WordToPdfConverter;