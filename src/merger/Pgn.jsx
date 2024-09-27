import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const PgnMerger = () => {
  const [pgnFiles, setPgnFiles] = useState([]);
  const [mergedPgn, setMergedPgn] = useState('');

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const readers = files.map(file => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsText(file);
      });
    });

    Promise.all(readers).then(contents => {
      setPgnFiles(contents);
      setMergedPgn(contents.join('\n')); // Join the contents of all files
    });
  };

  const downloadMergedPgn = () => {
    const blob = new Blob([mergedPgn], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'merged_games.pgn');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>PGN Merger</h2>

      <input
        type="file"
        accept=".pgn"
        multiple
        style={{ display: 'none' }}
        id="upload-file"
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-file">
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadFileIcon />}
        >
          Upload PGN Files
        </Button>
      </label>

      <br /><br />

      {mergedPgn && (
        <div>
          <h3>Merged PGN Data</h3>
          <Box
            sx={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
              maxHeight: '150px',
              overflowY: 'scroll',
              backgroundColor: '#f9f9f9',
              whiteSpace: 'pre-wrap',
            }}
          >
            {mergedPgn}
          </Box>

          <br />

          <Button
            variant="contained"
            color="success"
            onClick={downloadMergedPgn}
          >
            Download Merged PGN
          </Button>
        </div>
      )}
    </div>
  );
};

export default PgnMerger;
