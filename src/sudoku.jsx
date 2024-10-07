// // import React, { useState } from 'react';
// // import { Button, Grid, Typography, Box, CircularProgress } from '@mui/material';
// // import { solveSudoku } from './api/Sudoku-ws';

// // const SudokuSolver = () => {
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [recognizedBoard, setRecognizedBoard] = useState(null);
// //   const [solvedBoard, setSolvedBoard] = useState(null);
// //   const [loading, setLoading] = useState(false);

 
// //   const handleFileChange = (e) => {
// //     setSelectedFile(e.target.files[0]); 
// //   };


// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!selectedFile) {
// //       alert('Please select an image first');
// //       return;
// //     }

// //     setLoading(true);

// //     try {

// //       const response = await solveSudoku(selectedFile); 

// //       const { success, recognized_board, solved_board } = response;

// //       if (success) {
// //         setRecognizedBoard(recognized_board);
// //         setSolvedBoard(solved_board);
// //       } else {
// //         alert('Failed to solve the Sudoku');
// //       }
// //     } catch (error) {
// //       console.error('Error while solving Sudoku:', error);
// //       alert('Error while solving Sudoku.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const renderSudokuGrid = (board) => {
// //     return (
// //       <Box mt={2} p={2} border={1} borderRadius="8px">
// //         <Grid container spacing={1}>
// //           {board.map((row, rowIndex) =>
// //             row.map((cell, colIndex) => (
// //               <Grid item xs={1} key={`${rowIndex}-${colIndex}`} style={{ border: '1px solid #000', padding: '10px' }}>
// //                 <Typography variant="body1" align="center">
// //                   {cell !== 0 ? cell : ''}
// //                 </Typography>
// //               </Grid>
// //             ))
// //           )}
// //         </Grid>
// //       </Box>
// //     );
// //   };

// //   return (
// //     <div style={{ textAlign: 'center', marginTop: '20px' }}>
// //       <Typography variant="h4" gutterBottom>
// //         Sudoku Solver
// //       </Typography>

// //       <form onSubmit={handleSubmit}>
// //         <input type="file" onChange={handleFileChange} accept="image/*" />
// //         <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
// //           Upload & Solve
// //         </Button>
// //       </form>

// //       {loading && <CircularProgress style={{ marginTop: '20px' }} />}

// //       {recognizedBoard && (
// //         <>
// //           <Typography variant="h6" style={{ marginTop: '20px' }}>
// //             Recognized Board:
// //           </Typography>
// //           {renderSudokuGrid(recognizedBoard)}
// //         </>
// //       )}

// //       {solvedBoard && (
// //         <>
// //           <Typography variant="h6" style={{ marginTop: '20px' }}>
// //             Solved Board:
// //           </Typography>
// //           {renderSudokuGrid(solvedBoard)}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default SudokuSolver;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';

// const SudokuSolver = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [recognizedBoard, setRecognizedBoard] = useState(null);
//   const [solvedBoard, setSolvedBoard] = useState(null);
//   const [error, setError] = useState('');

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setRecognizedBoard(null);
//     setSolvedBoard(null);
//     setError('');
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!selectedFile) {
//       setError('Please upload a Sudoku image first.');
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const response = await axios.post('/api/solve-sudoku', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const { recognized_board, solved_board } = response.data;
//       setRecognizedBoard(recognized_board);
//       setSolvedBoard(solved_board);
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to solve the Sudoku puzzle');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderBoard = (board) => (
//     <Grid container spacing={1} justifyContent="center">
//       {board.map((row, rowIndex) => (
//         <Grid item xs={12} key={rowIndex}>
//           <Grid container spacing={1} justifyContent="center">
//             {row.map((cell, colIndex) => (
//               <Grid item key={colIndex} xs={1}>
//                 <Paper elevation={3} style={{ padding: '10px', textAlign: 'center' }}>
//                   <Typography variant="body1">{cell === 0 ? '' : cell}</Typography>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>
//       ))}
//     </Grid>
//   );

//   return (
//     <div style={{ padding: '20px' }}>
//       <Typography variant="h4" gutterBottom>
//         Sudoku Solver
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//         <Button variant="contained" color="primary" type="submit" disabled={loading} style={{ marginLeft: '10px' }}>
//           {loading ? <CircularProgress size={24} /> : 'Solve Sudoku'}
//         </Button>
//       </form>

//       {error && (
//         <Typography variant="body1" color="error" style={{ marginTop: '20px' }}>
//           {error}
//         </Typography>
//       )}

//       {recognizedBoard && (
//         <div style={{ marginTop: '20px' }}>
//           <Typography variant="h6">Recognized Board</Typography>
//           {renderBoard(recognizedBoard)}
//         </div>
//       )}

//       {solvedBoard && (
//         <div style={{ marginTop: '20px' }}>
//           <Typography variant="h6">Solved Board</Typography>
//           {renderBoard(solvedBoard)}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SudokuSolver;

// import React, { useState } from 'react';
// import SudokuExtractor from './sudokuExtractor';
// import SudokuSolver from './sudokuSolver'

// const SudokuExtractorandSolver = () => {
//   const [recognizedBoard, setRecognizedBoard] = useState(null);

//   return (
//     <div>
//       <h1>Sudoku Extractor & Solver</h1>
//       <SudokuExtractor onExtract={setRecognizedBoard} />
//       {recognizedBoard && <SudokuSolver recognizedBoard={recognizedBoard} />}
//     </div>
//   );
// };

// export default SudokuExtractorandSolver;
// import React, { useState } from 'react';
// import { extract, solveSudoku } from './api/Sudoku-ws'; 

// const SudokuSolver = () => {
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState(null);
//   const [recognizedBoard, setRecognizedBoard] = useState(null);
//   const [solvedBoard, setSolvedBoard] = useState(null);
//   const [loading, setLoading] = useState(false);


//   const handleImageUpload = (event) => {
//     const file = event.target.files[0]; 
//     if (file) {
     
//       if (file.size > 5000000) {
//         setError('File size exceeds the 5MB limit.');
//         return;
//       }
//       if (!['image/jpeg', 'image/png'].includes(file.type)) {
//         setError('Please upload a valid image (JPEG/PNG).');
//         return;
//       }
//       setImage(file);
//       setError(null);
//     }
//   };


//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);  
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };


//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!image) {
//       setError('Please upload an image.');
//       return;
//     }

//     setError(null); // Clear any previous errors
//     setLoading(true); // Start loading

//     try {
//       const base64Image = await fileToBase64(image); 
 
//       const cleanBase64Image = base64Image.replace(/^data:image\/png;base64,/, "");

//       const response = await extract(cleanBase64Image); // Call API to extract Sudoku

//       if (response && response.data && response.data.success) {
//         setRecognizedBoard(response.data.recognized_board); // Update recognized Sudoku board
//         setSolvedBoard(null); // Reset solved board when new extraction happens
//       } else {
//         setError(response.data.message || 'Failed to recognize Sudoku from the image.');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       setError('Error extracting Sudoku from the image.');
//     } finally {
//       setLoading(false); 
//     }
//   };

//   const handleSolve = async () => {
//     if (!recognizedBoard) {
//       setError('No recognized board to solve.');
//       return;
//     }

//     setLoading(true); // Start loading
//     try {
//       const response = await solveSudoku(recognizedBoard); // Call API to solve Sudoku

//       if (response && response.data && response.data.success) {
//         setSolvedBoard(response.data.solved_board); // Update solved board
//       } else {
//         setError(response.data.message || 'Sudoku puzzle could not be solved.');
//       }
//     } catch (err) {
//       console.error('Error solving Sudoku:', err);
//       setError('Error solving the Sudoku puzzle.');
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   return (
//     <div>
//       <h1>Sudoku Solver</h1>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="file" 
//           accept="image/png, image/jpeg" 
//           onChange={handleImageUpload} 
//         />
//         <button type="submit" disabled={!image || loading}>Extract Sudoku</button>
//       </form>


//       {error && <p style={{ color: 'red' }}>{error}</p>}

  
//       {recognizedBoard && (
//         <div>
//           <h2>Recognized Sudoku Board</h2>
//           <pre>{JSON.stringify(recognizedBoard, null, 2)}</pre>
//           <button onClick={handleSolve} disabled={loading}>Solve Sudoku</button>
//         </div>
//       )}

//       {solvedBoard && (
//         <div>
//           <h2>Solved Sudoku Board</h2>
//           <pre>{JSON.stringify(solvedBoard, null, 2)}</pre>
//         </div>
//       )}

//       {loading && <p>Loading...</p>}
//     </div>
//   );
// };

// export default SudokuSolver;

import React, { useState } from 'react';
import { Button, Grid, Typography, TextField, CircularProgress } from '@mui/material';
import { extract, solve } from './api/Sudoku-ws'; // Ensure API functions are imported

const SudokuSolver = () => {
  const [image, setImage] = useState(null);
  const [recognizedBoard, setRecognizedBoard] = useState(null);
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  // Handle image upload and convert to base64
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 encoded image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Sudoku extraction
  const handleExtractSudoku = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await extract(image);
      if (response.success) {
        setRecognizedBoard(response.recognized_board);
        setSolvedBoard(null); 
      } else {
        setError('Error extracting Sudoku board');
      }
    } catch (error) {
      setError('Error extracting Sudoku board');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sudoku solving
  const handleSolveSudoku = async () => {
    if (recognizedBoard) {
      try {
        setLoading(true);
        setError(null);
        const response = await solve(recognizedBoard);
        if (response.success) {
          setSolvedBoard(response.solved_board);
        } else {
          setError('Could not solve the Sudoku puzzle');
        }
      } catch (error) {
        setError('Error solving Sudoku puzzle');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item>
        <Typography variant="h4">Sudoku Solver</Typography>
      </Grid>

      <Grid item>
        <input
          accept="image/*"
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="upload-image"
        />
        <label htmlFor="upload-image">
          <Button variant="contained" component="span">
            Upload Sudoku Image
          </Button>
        </label>
      </Grid>

      {image && (
        <Grid item>
          <img src={image} alt="Uploaded Sudoku" style={{ maxWidth: '300px', marginTop: '10px' }} />
        </Grid>
      )}

      <Grid item>
        <Button variant="contained" color="primary" onClick={handleExtractSudoku} disabled={!image || loading}>
          {loading ? <CircularProgress size={24} /> : 'Extract Sudoku'}
        </Button>
      </Grid>

      {recognizedBoard && (
        <>
          <Grid item>
            <Typography variant="h6">Recognized Sudoku Board:</Typography>
            <pre>{JSON.stringify(recognizedBoard, null, 2)}</pre>
          </Grid>

          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleSolveSudoku} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Solve Sudoku'}
            </Button>
          </Grid>
        </>
      )}

      {solvedBoard && (
        <Grid item>
          <Typography variant="h6">Solved Sudoku Board:</Typography>
          <pre>{JSON.stringify(solvedBoard, null, 2)}</pre>
        </Grid>
      )}

      {error && (
        <Grid item>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default SudokuSolver;
