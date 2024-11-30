import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import JSZip from 'jszip'; 
import { saveAs } from 'file-saver'; 
import { Button, CircularProgress, Typography, Box } from '@mui/material';

const PdfToJpgConverter = () => {
  const [pdfFile, setPdfFile] = useState(null); 
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [fileName, setFileName] = useState('No file chosen');
  const [zipBlob, setZipBlob] = useState(null);  
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setPdfFile(file);  
      const pdfUrl = URL.createObjectURL(file); 
      setPdfPreviewUrl(pdfUrl);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setPdfFile(file);  
      const pdfUrl = URL.createObjectURL(file); 
      setPdfPreviewUrl(pdfUrl);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const convertPdfToImages = async () => {
    if (!pdfFile) return;

    setLoading(true);
    const url = URL.createObjectURL(pdfFile);
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const imagePromises = [];
    const zip = new JSZip();

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const imgDataUrl = canvas.toDataURL('image/jpeg');
      imagePromises.push(imgDataUrl);

      zip.file(`page-${pageNumber}.jpg`, imgDataUrl.split(',')[1], { base64: true });
    }

    await Promise.all(imagePromises);
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    setZipBlob(zipBlob);
    setLoading(false);
  };

  const downloadZip = () => {
    if (zipBlob) {
      saveAs(zipBlob, `${fileName.replace('.pdf', '')}-images.zip`);
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
        <Typography variant="h4" sx={{ marginBottom: "40px" }}>PDF to JPG Converter</Typography>
        
        {/* <input 
          type="file" 
          accept="application/pdf" 
          style={{ display: 'none' }} 
          id="fileInput" 
          onChange={handleFileChange} 
        /> */}
        {/* <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block', marginBottom: '20px' }}>
          <Button variant="contained" component="span">Select PDF</Button>
          <Typography variant="body2">{fileName}</Typography>
        </label> */}
                <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          id="file-upload"
          style={{ display: "none" }}
        />
                <label htmlFor="file-upload">
          <Button variant="outlined" component="span" sx={{ marginBottom: "20px", padding: "10px 20px" }}>
            {fileName !== "No file chosen" ? fileName : "Select PDF File"}
          </Button>
        </label>

        <Typography variant="body2" sx={{ marginBottom: "20px", color: "#888" }}>
          {fileName === "No file chosen" ? "No file chosen. Drag and drop your file here or click to select." : ""}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={convertPdfToImages}
          disabled={loading || !pdfPreviewUrl}
          sx={{ marginBottom: "20px" }}
        >
          Convert to JPG
        </Button>

        {pdfPreviewUrl && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6">PDF Preview:</Typography>
            <iframe
              src={pdfPreviewUrl}
              title="PDF Preview"
              width="80%"
              height="300px" // Adjusted height
              style={{ marginBottom: '20px' }}
            />
            {/* <Button variant="contained" color="primary" onClick={convertPdfToImages}>
              Convert to JPG
            </Button> */}
          </Box>
        )}

        {loading && <CircularProgress sx={{ marginTop: "20px" }} />}
        
        {!loading && zipBlob && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="body1">Conversion complete!</Typography>
            <Button variant="contained" color="primary" onClick={downloadZip} sx={{ marginTop: "20px" }}>
              Download All Pages as ZIP
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PdfToJpgConverter;
