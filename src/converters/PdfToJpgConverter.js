import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import JSZip from 'jszip'; // For creating zip files
import { saveAs } from 'file-saver'; // For downloading zip files
import { Button, CircularProgress, Typography } from '@mui/material';

const PdfToJpgConverter = () => {
  const [pdfFile, setPdfFile] = useState(null); // Store the selected PDF file
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // PDF file preview URL
  const [images, setImages] = useState([]); // Converted JPG images
  const [loading, setLoading] = useState(false); // Loading state for conversion
  const [fileName, setFileName] = useState('No file chosen');
  const [zipBlob, setZipBlob] = useState(null); // Store the zip blob

  // Handle file input change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setPdfFile(file); // Set the PDF file
      const pdfUrl = URL.createObjectURL(file); // Create a preview URL
      setPdfPreviewUrl(pdfUrl);
    }
  };

  // Convert PDF to images
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

    const images = await Promise.all(imagePromises);
    setImages(images);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    setZipBlob(zipBlob);
    setLoading(false);
  };

  // Download ZIP file
  const downloadZip = () => {
    if (zipBlob) {
      saveAs(zipBlob, `${fileName.replace('.pdf', '')}-images.zip`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', position: 'relative', width: '80%', margin: 'auto' }}>
      <input type="file" accept="application/pdf" style={{ display: 'none' }} id="fileInput" onChange={handleFileChange} />
      <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block', marginBottom: '20px' }}>
        <Button variant="contained" component="span">Select PDF</Button>
        <Typography variant="body2">{fileName}</Typography>
      </label>

      {/* Step 1: Preview PDF before conversion */}
      {pdfPreviewUrl && (
        <div>
          <Typography variant="h6">PDF Preview:</Typography>
          <iframe
            src={pdfPreviewUrl}
            title="PDF Preview"
            width="80%"
            height="500px"
            style={{ marginBottom: '20px' }}
          />
          <Button variant="contained" color="primary" onClick={convertPdfToImages}>
            Convert to JPG
          </Button>
        </div>
      )}

      {/* Step 2: Loading Indicator */}
      {loading && <CircularProgress />}

      {/* Step 3: Preview Converted JPG Images */}
      {!loading && images.length > 0 && (
        <div>
          <Typography variant="h6" style={{ marginTop: '20px' }}>JPG Preview:</Typography>
          {images.map((imgSrc, index) => (
            <img key={index} src={imgSrc} alt={`Page ${index + 1}`} style={{ width: '50%', marginBottom: '10px' }} />
          ))}
          <Button variant="contained" color="primary" onClick={downloadZip} style={{ marginTop: '20px' }}>
            Download All Pages as ZIP
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfToJpgConverter;
