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

import React, { useState } from 'react';
import SudokuExtractor from './sudokuExtractor';
import SudokuSolver from './sudokuSolver'

const SudokuExtractorandSolver = () => {
  const [recognizedBoard, setRecognizedBoard] = useState(null);

  return (
    <div>
      <h1>Sudoku Extractor & Solver</h1>
      <SudokuExtractor onExtract={setRecognizedBoard} />
      {recognizedBoard && <SudokuSolver recognizedBoard={recognizedBoard} />}
    </div>
  );
};

export default SudokuExtractorandSolver;
