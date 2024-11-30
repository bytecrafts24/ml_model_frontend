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
  const [loading, setLoading] = useState(false); 

  const handleFileChange = (event) => {
    const files = event.target.files;
    const imageArray = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages(imageArray);
    convertImagesToWebP(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    const imageArray = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages(imageArray);
    convertImagesToWebP(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const convertImagesToWebP = async (files) => {
    setIsConverting(true);
    const converted = [];
    for (const file of files) {
      const imageUrl = URL.createObjectURL(file);
      const webPDataUrl = await convertImageToWebP(imageUrl);
      converted.push({ name: file.name, webPDataUrl });
    }
    setConvertedImages(converted);
    setIsConverting(false);
  };

  const convertImageToWebP = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const webPDataUrl = canvas.toDataURL('image/webp');
        resolve(webPDataUrl);
      };
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
        // backgroundColor: "#000000" 
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
          backgroundColor: "#f9f9f9", 
          borderRadius: "8px", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)", 
          border: isDragOver ? "2px dashed #3f51b5" : "2px dashed #ccc", 
          transition: "border-color 0.3s ease" 
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "40px" }}>Image to WebP Converter</Typography>
{/*         
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          multiple
          style={{ display: 'none' }}
          id="fileInput"
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block', marginBottom: '20px' }}>
          <Button variant="contained" component="span">Select Images</Button>
        </label> */}

<input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileChange}
          id="file-upload"
          style={{ display: "none" }}
        />
                <label htmlFor="fileInput">
          <Button variant="outlined" component="span" sx={{ marginBottom: "20px", padding: "10px 20px" }}>
            {fileName !== "No file chosen" ? fileName : "Select Webp File"}
          </Button>
        </label>

        <Typography variant="body2" sx={{ marginBottom: "20px", color: "#888" }}>
          {fileName === "No file chosen" ? "No file chosen. Drag and drop your file here or click to select." : ""}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={convertImageToWebP}
          disabled={loading || !convertedImages}
          sx={{ marginBottom: "20px" }}
        >
          Converted to WebP
        </Button>

        {images.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6">Original Images:</Typography>
            <Box sx={gridStyle}>
              {images.map((imgSrc, index) => (
                <Box key={index} sx={imageContainerStyle}>
                  <img src={imgSrc} alt={`Original ${index}`} style={styledImage} />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {convertedImages.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6">Converted to WebP:</Typography>
            <Box sx={gridStyle}>
              {convertedImages.map((image, index) => (
                <Box key={index} sx={imageContainerStyle}>
                  <img src={image.webPDataUrl} alt={`WebP ${index}`} style={styledImage} />
                  <Typography variant="body2">{image.name.replace(/\.(jpg|jpeg|png)$/i, '.webp')}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {convertedImages.length > 0 && (
          <Box>
            <Button variant="contained" color="primary" onClick={downloadConvertedImages} sx={{ marginRight: '10px' }}>
              Download All as WebP
            </Button>
            <Button variant="contained" color="secondary" onClick={downloadAllAsZip}>
              Download All as ZIP
            </Button>
          </Box>
        )}

        {isConverting && <CircularProgress sx={{ marginTop: "20px" }} />}
      </Box>
    </Box>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
  marginBottom: '20px',
};

const styledImage = {
  width: '100%',
  height: 'auto',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  border: '2px solid #ddd',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
};

const imageContainerStyle = {
  textAlign: 'center',
  padding: '10px',
  backgroundColor: '#f9f9f9',
  borderRadius: '12px',
  transition: 'background-color 0.3s ease',
};

export default ImageToWebPConverter;

