import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  IconButton,
  Snackbar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ImageToBase64Converter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64String, setBase64String] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const convertToBase64 = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64String(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64String);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Image to Base64 Converter
      </Typography>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button variant="contained" onClick={convertToBase64} sx={{ mt: 2 }}>
        Convert to Base64
      </Button>

      {base64String && (
        <Box
          sx={{
            mt: 2,
            p: 4,
            border: '1px solid #ccc',
            height: 300,
            width: 600,
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            component="pre"
            sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
          >
            {base64String}
          </Typography>
          <IconButton
            onClick={copyToClipboard}
            sx={{
              position: 'absolute',
              top: 8, 
              right: 8, 
              zIndex: 1,

            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard"
      />
    </Box>
  );
};

export default ImageToBase64Converter;
