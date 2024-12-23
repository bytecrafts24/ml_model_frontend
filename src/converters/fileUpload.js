
// import React, { useState } from 'react';
// import { Button, Typography, Box } from '@mui/material';
// import Dropzone from 'react-dropzone';
// import { convertFile } from '../api/convertApi.js';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [downloadUrl, setDownloadUrl] = useState('');

//   const handleDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file first');
//       return;
//     }

//     try {
//       const response = await convertFile(file);
//       if (response.error) {
//         throw new Error(response.error);
//       }
//       setDownloadUrl(response.downloadUrl); // Ensure your backend sends this URL
//     } catch (error) {
//       console.error(error);
//       alert(`File conversion failed: ${error.message}`);
//     }
//   };

//   return (
//     <Box p={4} textAlign="center">
//       <Typography variant="h5">Upload a File for Conversion</Typography>
//       <Dropzone onDrop={handleDrop}>
//         {({ getRootProps, getInputProps }) => (
//           <Box
//             {...getRootProps()}
//             p={4}
//             border="2px dashed #ccc"
//             borderRadius="4px"
//             mt={2}
//           >
//             <input {...getInputProps()} />
//             <Typography>Drag and drop a file here, or click to select one</Typography>
//           </Box>
//         )}
//       </Dropzone>
//       {file && <Typography mt={2}>Selected File: {file.name}</Typography>}
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleUpload}
//         disabled={!file}
//         sx={{ mt: 2 }}
//       >
//         Upload and Convert
//       </Button>
//       {downloadUrl && (
//         <Box mt={2}>
//           <Typography>
//             File converted successfully! Download it{' '}
//             <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
//               here
//             </a>.
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default FileUpload;

import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import Dropzone from 'react-dropzone';
import { convertFile } from '../api/convertApi.js';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    setLoading(true);
    try {
      const response = await convertFile(file);
      if (response.error) {
        throw new Error(response.error);
      }
      setDownloadUrl(response.downloadUrl); // Ensure your backend sends this URL
    } catch (error) {
      console.error(error);
      alert(`File conversion failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h5">Upload a File for Conversion</Typography>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <Box
            {...getRootProps()}
            p={4}
            border="2px dashed #ccc"
            borderRadius="4px"
            mt={2}
          >
            <input {...getInputProps()} />
            <Typography>Drag and drop a file here, or click to select one</Typography>
          </Box>
        )}
      </Dropzone>
      {file && <Typography mt={2}>Selected File: {file.name}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Uploading...' : 'Upload and Convert'}
      </Button>
      {downloadUrl && (
        <Box mt={2}>
          <Typography>
            File converted successfully! Download it{' '}
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              here
            </a>.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;