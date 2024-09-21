
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const ImageToWebPConverter = () => {
  const [images, setImages] = useState([]);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const imageArray = Array.from(files).map((file) => {
      return URL.createObjectURL(file);
    });
    setImages(imageArray);
    convertImagesToWebP(files);
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
    <div style={{ textAlign: 'center', padding: '20px', position: 'relative', width: '80%', margin: 'auto' }}>
      <h1>Image  to WebP Converter</h1>
      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        multiple
        style={{ display: 'none' }}
        id="fileInput"
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block', marginBottom: '20px', marginTop: '80px' }}>
        <Button variant="contained" component="span">Select Images</Button>
      </label>

      {images.length > 0 && (
        <div>
          <h3>Original Images:</h3>
          {images.map((imgSrc, index) => (
            <img key={index} src={imgSrc} alt={`Original ${index}`} style={{ width: '80%', marginBottom: '10px' }} />
          ))}
        </div>
      )}

      {images.length > 0 && convertedImages.length === 0 && !isConverting && (
        <Button variant="contained" color="primary" onClick={() => convertImagesToWebP(images.map((src) => URL.createObjectURL(src)))}>
          Convert to WebP
        </Button>
      )}

      {convertedImages.length > 0 && (
        <div>
          <h3>Converted to WebP:</h3>
          {convertedImages.map((image, index) => (
            <div key={index}>
              <img src={image.webPDataUrl} alt={`WebP ${index}`} style={{ width: '80%', marginBottom: '10px' }} />
              <p>{image.name.replace(/\.(jpg|jpeg|png)$/i, '.webp')}</p>
            </div>
          ))}
        </div>
      )}

      {convertedImages.length > 0 && (
        <div>
          <Button variant="contained" color="primary" onClick={downloadConvertedImages} style={{ marginRight: '10px' }}>
            Download All as WebP
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadAllAsZip}>
            Download All as ZIP
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageToWebPConverter;
