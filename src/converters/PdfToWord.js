import React, { useState } from "react";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import { saveAs } from "file-saver";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { Document, Packer, Paragraph } from "docx";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const PdfToWordConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setPdfFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setPdfFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const convertPdfToWord = async () => {
    if (!pdfFile) {
      alert("No PDF file selected.");
      return;
    }

    if (pdfFile.type !== "application/pdf") {
      alert("Selected file is not a PDF.");
      return;
    }

    try {
      setLoading(true);
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const pdfData = await pdfjsLib.getDocument({ data: new Uint8Array(fileReader.result) }).promise;
        const textContent = await Promise.all(
          Array.from({ length: pdfData.numPages }, (_, i) =>
            pdfData.getPage(i + 1).then((page) => page.getTextContent())
          )
        );

        const docContent = textContent
          .map((page) => page.items.map((item) => item.str).join(" "))
          .join("\n");

        const doc = new Document({
          sections: [
            {
              children: docContent.split("\n").map((line) => new Paragraph(line)),
            },
          ],
        });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "converted.docx");
        setDownloadUrl(URL.createObjectURL(blob));
      };
      fileReader.readAsArrayBuffer(pdfFile);
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
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          textAlign: "center",
          padding: "50px",
          backgroundColor: isDragOver ? "#e8f0fe" : "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          border: isDragOver ? "2px dashed #3f51b5" : "2px dashed #ccc",
          transition: "border-color 0.3s ease",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Typography variant="h4" sx={{ marginBottom: "40px" }}>
          PDF to Word Converter
        </Typography>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          id="file-upload"
          style={{ display: "none" }}
        />
        <label htmlFor="file-upload">
          <Button variant="outlined" component="span" sx={{ marginBottom: "20px", padding: "10px 20px" }}>
            {fileName !== "No file chosen" ? fileName : "Select PDF File"}
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={convertPdfToWord}
          disabled={loading || !pdfFile}
          sx={{ marginBottom: "20px" }}
        >
          Convert to Word
        </Button>
        {loading && <CircularProgress sx={{ marginTop: "20px" }} />}
        {downloadUrl && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="body1">Conversion complete!</Typography>
            <a href={downloadUrl} download="converted.docx">
              <Button variant="contained" color="secondary">
                Download Word File
              </Button>
            </a>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PdfToWordConverter;
