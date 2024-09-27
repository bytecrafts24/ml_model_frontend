import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const PgnToCsvConverter = () => {
  const [pgn, setPgn] = useState('');
  const [csv, setCsv] = useState('');


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      setPgn(fileContent);
    };

    if (file) {
      reader.readAsText(file);
    }
  };


  const convertPGNtoCSV = () => {
    const lines = pgn.split('\n');
    let metadata = {};
    let moves = [];


    lines.forEach((line) => {
      if (line.startsWith('[')) {
        const key = line.match(/\[(\w+)\s/)[1];
        const value = line.match(/"(.*?)"/)[1];
        metadata[key] = value;
      } else if (line && !line.startsWith('[') && !line.includes('{')) {

        moves.push(line);
      }
    });


    let csvOutput = 'Event,Site,Date,Round,White,Black,Result,Moves\n';
    csvOutput += `${metadata.Event || ''},${metadata.Site || ''},${
      metadata.Date || ''
    },${metadata.Round || ''},${metadata.White || ''},${
      metadata.Black || ''
    },${metadata.Result || ''},"${moves.join(' ')}"`;

    setCsv(csvOutput);
  };

  return (
    <div>
      <h2>PGN to CSV Converter</h2>


      <input
        type="file"
        accept=".pgn"
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
          Upload PGN
        </Button>
      </label>

      <br /><br />


      {pgn && (
        <div>
          <h3>PGN Data</h3>


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
            {pgn}
          </Box>

          <br />


          <Button
            variant="contained"
            color="primary"
            onClick={convertPGNtoCSV}
          >
            Convert to CSV
          </Button>
        </div>
      )}


      {csv && (
        <div>
          <h3>CSV Output</h3>

          <Box
            sx={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
              maxHeight: '100px',  
              overflowY: 'scroll',
              backgroundColor: '#f9f9f9',
              whiteSpace: 'pre-wrap',
            }}
          >
            {csv}
          </Box>
          <Box sx={{ marginTop: '16px' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', 'games.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download CSV
            </Button>
          </Box>

        </div>
      )}
    </div>
  );
};

export default PgnToCsvConverter;
