
// import React, { useEffect, useState } from 'react';
// import { Html5QrcodeScanner } from "html5-qrcode";

// const QrCodeDecoder = () => {
//   const [decodedText, setDecodedText] = useState(null);
//   const scannerId = "qr-code-scanner";

//   useEffect(() => {
  
//     const scanner = new Html5QrcodeScanner(
//       scannerId,
//       { fps: 10, qrbox: 250 },
//       false
//     );


//     scanner.render(
//       (result) => {
//         setDecodedText(result);
//         scanner.clear();
//       },
//       (error) => {
//         console.warn(error);
//       }
//     );

//     return () => {
//       scanner.clear(); 
//     };
//   }, [scannerId]);

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2>QR Code Scanner</h2>
//       <div id={scannerId} style={{ width: '300px' }}></div> 
//       {decodedText && <p>Decoded Text: {decodedText}</p>}
//     </div>
//   );
// };

// export default QrCodeDecoder;

import React, { useEffect, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { Paper, Box, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const QrCodeDecoder = () => {
  const [decodedText, setDecodedText] = useState(null);
  const [error, setError] = useState(null);
  const scannerId = "qr-code-scanner";


  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      scannerId,
      { fps: 10, qrbox: 250 },
      false
    );

    if (document.getElementById(scannerId)) {
      scanner.render(
        (result) => {
          setDecodedText(result);
          scanner.clear();
        },
        (error) => {
          console.warn(error);
          setError("Scanning failed. Try again.");
        }
      );
    }

    return () => {
      scanner.clear();
    };
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode(scannerId);
    html5QrCode.scanFile(file, true)
      .then(result => {
        setDecodedText(result);
        setError(null);
      })
      .catch(err => {
        console.error("Error scanning file: ", err);
        setError("Failed to decode the QR code from the image.");
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>QR Code Scanner</h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
        <div>
          <h3>Scan with Camera</h3>
          <Paper elevation={3} style={{ padding: '20px', width: '300px' }}>
            <div id={scannerId} style={{ width: '100%' }}></div>
          </Paper>
        </div>

      
        <div>
          <h3>Upload Image</h3>
          <Paper elevation={3} style={{ padding: '20px', width: '300px', textAlign: 'center' }}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <ImageIcon style={{ fontSize: 60, color: '#3f51b5' }} /> 
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                Choose an image or drop an image to scan
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginTop: '15px' }}
              />
            </Box>
          </Paper>
        </div>
      </div>

      {/* Display decoded text or error messages */}
      {decodedText && <p>Decoded Text: {decodedText}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default QrCodeDecoder;
