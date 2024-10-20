// // import React, { useState } from 'react';
// // import { Box, TextField, Button, Typography, Alert, Container } from '@mui/material';
// // import { extractTextFromImage } from './api/imagetextExtractor-ws';
// // import { saveAs } from 'file-saver';

// // const ImageTextExtractor = () => {
// //   const [image, setImage] = useState(null);
// //   const [extractedText, setExtractedText] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         setImage(event.target.result);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const fetchExtractedText = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await extractTextFromImage({ image });
// //       setExtractedText(response.data.extracted_text);
// //       setError('');
// //     } catch (err) {
// //       setError('Failed to extract text. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDownload = () => {
// //     const blob = new Blob([extractedText], { type: 'application/msword' });
// //     saveAs(blob, 'extracted_text.docx');
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (!image) {
// //       setError('Please upload an image');
// //       return;
// //     }
// //     fetchExtractedText();
// //   };

// //   return (
// //     <Container maxWidth="sm">
// //       <Box mt={4} mb={2}>
// //         <Typography variant="h4" component="h1" gutterBottom>
// //           Image Text Extractor
// //         </Typography>
// //         <form onSubmit={handleSubmit}>
// //           <Box mb={2}>
// //             <TextField
// //               type="file"
// //               inputProps={{ accept: 'image/*' }}
// //               onChange={handleImageChange}
// //               fullWidth
// //             />
// //           </Box>
// //           <Box>
// //             <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
// //               {loading ? 'Extracting...' : 'Extract Text'}
// //             </Button>
// //           </Box>
// //         </form>
// //         {error && <Alert severity="error">{error}</Alert>}
// //         {extractedText && (
// //           <Box mt={3}>
// //             <Typography variant="h6" component="h2">
// //               Extracted Text:
// //             </Typography>
// //             <Typography variant="body1" component="p">
// //               {extractedText}
// //             </Typography>
// //             <Box mt={2}>
// //               <Button variant="outlined" color="primary" onClick={handleDownload}>
// //                 Download as DOCX
// //               </Button>
// //             </Box>
// //           </Box>
// //         )}
// //       </Box>
// //     </Container>
// //   );
// // };

// // export default ImageTextExtractor;

// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Alert, Container } from '@mui/material';
// import { extractTextFromImage } from './api/imagetextExtractor-ws';
// import { saveAs } from 'file-saver';

// const ImageTextExtractor = () => {
//   const [image, setImage] = useState(null);
//   const [extractedText, setExtractedText] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImage(event.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const fetchExtractedText = async () => {
//     setLoading(true);
//     try {
//       const response = await extractTextFromImage({ image });
//       setExtractedText(response.data.extracted_text);
//       setError('');
//     } catch (err) {
//       console.error(err); // Log the error for debugging
//       setError('Failed to extract text. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     const blob = new Blob([extractedText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
//     saveAs(blob, 'extracted_text.docx');
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!image) {
//       setError('Please upload an image');
//       return;
//     }
//     fetchExtractedText();
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box mt={4} mb={2}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Image Text Extractor
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Box mb={2}>
//             <TextField
//               type="file"
//               inputProps={{ accept: 'image/*' }}
//               onChange={handleImageChange}
//               fullWidth
//             />
//           </Box>
//           <Box>
//             <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
//               {loading ? 'Extracting...' : 'Extract Text'}
//             </Button>
//           </Box>
//         </form>
//         {error && <Alert severity="error">{error}</Alert>}
//         {extractedText && (
//           <Box mt={3}>
//             <Typography variant="h6" component="h2">
//               Extracted Text:
//             </Typography>
//             <Typography variant="body1" component="p">
//               {extractedText}
//             </Typography>
//             <Box mt={2}>
//               <Button variant="outlined" color="primary" onClick={handleDownload} disabled={!extractedText}>
//                 Download as DOCX
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </Box>
//     </Container>
//   );
// };

// export default ImageTextExtractor;

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Container } from '@mui/material';
import { extractTextFromImage } from './api/imagetextExtractor-ws';
import { saveAs } from 'file-saver';

const ImageTextExtractor = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchExtractedText = async () => {
    setLoading(true);
    try {
      const response = await extractTextFromImage({ image });
      setExtractedText(response.data.extracted_text);
      setError('');
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Failed to extract text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, 'extracted_text.docx');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText)
      .then(() => setCopySuccess('Text copied to clipboard!'))
      .catch(() => setCopySuccess('Failed to copy text.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image');
      return;
    }
    fetchExtractedText();
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Image Text Extractor
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={handleImageChange}
              fullWidth
            />
          </Box>
          <Box>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Extracting...' : 'Extract Text'}
            </Button>
          </Box>
        </form>
        {error && <Alert severity="error">{error}</Alert>}
        {extractedText && (
          <Box mt={3}>
            <Typography variant="h6" component="h2">
              Extracted Text:
            </Typography>
            <Box
              mt={2}
              p={2}
              border="1px solid #ccc"
              borderRadius="4px"
              bgcolor="#f9f9f9"
              maxHeight="200px"
              overflow="auto"
            >
              <Typography variant="body1" component="p">
                {extractedText}
              </Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="outlined" color="primary" onClick={handleDownload}>
                Download as DOCX
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCopy}>
                Copy Text
              </Button>
            </Box>
            {copySuccess && (
              <Typography variant="body2" color="success" mt={1}>
                {copySuccess}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ImageTextExtractor;
