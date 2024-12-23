import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const ImageToWebPConverter = () => {
  const [images, setImages] = useState([]);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (event) => {
    const files = event.target.files;
    setFileName(files.length > 1 ? `${files.length} files selected` : files[0]?.name || "No file chosen");
    processFiles(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    setFileName(files.length > 1 ? `${files.length} files selected` : files[0]?.name || "No file chosen");
    processFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFiles = (files) => {
    const imageArray = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages(imageArray);
    convertImagesToWebP(files);
  };

  const convertImagesToWebP = async (files) => {
    setIsConverting(true);
    setConvertedImages([]); // Clear previous results
    const converted = [];
    for (const file of files) {
      const imageUrl = URL.createObjectURL(file);
      try {
        const webPDataUrl = await convertImageToWebP(imageUrl);
        converted.push({ name: file.name, webPDataUrl });
      } catch (error) {
        console.error("Error converting image:", file.name, error);
      }
    }
    setConvertedImages(converted);
    setIsConverting(false);
  };

  const convertImageToWebP = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const webPDataUrl = canvas.toDataURL('image/webp');
          resolve(webPDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
    });
  };

  const downloadConvertedImages = () => {
    convertedImages.forEach((image) => {
      const link = document.createElement('a');
      link.href = image.webPDataUrl;
      link.download = image.name.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      link.click();
    });
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    for (const image of convertedImages) {
      const response = await fetch(image.webPDataUrl);
      const blob = await response.blob();
      zip.file(image.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'), blob);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'images.zip');
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          textAlign: "center",
          padding: "50px",
          backgroundColor: isDragOver ? "#e3f2fd" : "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          border: "2px dashed #ccc",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "40px" }}>
          Image to WebP Converter
        </Typography>
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileChange}
          id="fileInput"
          multiple
          style={{ display: "none" }}
        />
        <label htmlFor="fileInput">
          <Button variant="contained" component="span" sx={{ marginBottom: "20px" }}>
            Select Images
          </Button>
        </label>
        <Typography variant="body2" sx={{ marginBottom: "20px", color: "#888" }}>
          {fileName}
        </Typography>

        {isConverting && <CircularProgress sx={{ marginBottom: "20px" }} />}

        {images.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
              Original Images:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
              {images.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`Original ${index}`} style={{ width: '100%', borderRadius: '8px' }} />
              ))}
            </Box>
          </Box>
        )}

        {convertedImages.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
              Converted to WebP:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
              {convertedImages.map((image, index) => (
                <img key={index} src={image.webPDataUrl} alt={`WebP ${index}`} style={{ width: '100%', borderRadius: '8px' }} />
              ))}
            </Box>
            <Button variant="contained" color="primary" onClick={downloadConvertedImages} sx={{ marginTop: "20px", marginRight: "10px" }}>
              Download All as WebP
            </Button>
            <Button variant="contained" color="secondary" onClick={downloadAllAsZip} sx={{ marginTop: "20px" }}>
              Download All as ZIP
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImageToWebPConverter;
