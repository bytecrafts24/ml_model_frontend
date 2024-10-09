import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress, TextField, Snackbar, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useTheme, useMediaQuery } from '@mui/material'; // for responsive design
import { extract, solve } from './api/Sudoku-ws';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SudokuSolver = () => {
  const [image, setImage] = useState(null);
  const [recognizedBoard, setRecognizedBoard] = useState(null);
  const [editableBoard, setEditableBoard] = useState(null);
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // For small screens

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Please upload an image smaller than 5MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Set uploaded image
    };
    reader.readAsDataURL(file);
  };

  const handleExtractSudoku = async () => {
    try {
      setLoading(true);
      const response = await extract(image);
      if (response.data.success) {
        const sanitizedBoard = response.data.recognized_board.map(row =>
          row.map(cell => (cell < 0 || cell > 9 ? 0 : cell))
        );
        setRecognizedBoard(sanitizedBoard);
        setEditableBoard(sanitizedBoard);
        setSolvedBoard(null);
      } else {
        setError('Extraction failed: Success flag is false.');
      }
    } catch (error) {
      setError('Error extracting Sudoku board.');
    } finally {
      setLoading(false);
    }
  };

  const handleSolveSudoku = async () => {
    if (editableBoard) {
      try {
        setLoading(true);
        const response = await solve(editableBoard);
        if (response && response.data.success) {
          setSolvedBoard(response.data.solved_board);
        } else {
          setError('Could not solve the Sudoku puzzle.');
        }
      } catch (error) {
        setError('Error solving Sudoku puzzle.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedBoard = editableBoard.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex
          ? (value === '' || isNaN(value) ? 0 : parseInt(value, 10))
          : cell
      )
    );
    setEditableBoard(updatedBoard);
  };

  const renderEditableBoard = (board) => (
    <Stack direction="column" spacing={0} alignItems="center">
      {board.map((row, rowIndex) => (
        <Stack key={rowIndex} direction="row" justifyContent="center" spacing={0}>
          {row.map((cell, colIndex) => (
            <TextField
              key={colIndex}
              value={cell === 0 ? '' : cell}
              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
              inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
              style={{ width: isSmallScreen ? '38px' : '40px', height: isSmallScreen ? '55px' : '55px' }}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ p: 2 }}
    >
      <Typography variant="h4" textAlign="center" gutterBottom>
        Sudoku Solver
      </Typography>

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

      {image && (
        <Box sx={{ mt: 2 }}>
          <img src={image} alt="Uploaded Sudoku" style={{ maxWidth: '300px' }} />
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleExtractSudoku} disabled={!image || loading}>
          {loading ? <CircularProgress size={24} /> : 'Extract Sudoku'}
        </Button>
      </Box>

      {recognizedBoard && (
        <>
          <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
            Recognized Sudoku Board (Editable):
          </Typography>
          {renderEditableBoard(editableBoard)}

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleSolveSudoku} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Solve Sudoku'}
            </Button>
          </Box>
        </>
      )}

      {solvedBoard && (
        <>
          <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
            Solved Sudoku Board:
          </Typography>
          {renderEditableBoard(solvedBoard)}
        </>
      )}

      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default SudokuSolver;

// import React, { useState } from 'react';
// import { Button, Grid, Typography, CircularProgress, TextField, Snackbar } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';
// import { extract, solve } from './api/Sudoku-ws';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const SudokuSolver = () => {
//   const [image, setImage] = useState(null);
//   const [recognizedBoard, setRecognizedBoard] = useState(null);
//   const [editableBoard, setEditableBoard] = useState(null);
//   const [solvedBoard, setSolvedBoard] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];

//     if (file && !file.type.startsWith('image/')) {
//       setError('Please upload a valid image file.');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setError('File is too large. Please upload an image smaller than 5MB.');
//       return;
//     }

//     setError(null);
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImage(reader.result); // Set uploaded image
//     };
//     reader.readAsDataURL(file);
//   };

//   // Handle Sudoku extraction
//   // const handleExtractSudoku = async () => {
//   //   try {
//   //     setLoading(true);
//   //     console.log('Sending image for extraction:', image); // Debug log
//   //     const response = await extract(image); // Assuming `extract` is a function that calls your backend

//   //     console.log('Extraction Response:', response); // Debug log

//   //     // Check if the response is successful and if recognized_board exists
//   //     if (response.data.success) {
//   //       console.log('Response success:', response.success);
//   //       if (Array.isArray(response.recognized_board) && response.recognized_board.length === 9) {
//   //         console.log('Recognized board:', response.recognized_board);
          
//   //         // Sanitize board: Replace invalid numbers (>9 or <0) with 0
//   //         const sanitizedBoard = response.recognized_board.map(row =>
//   //           row.map(cell => (cell < 0 || cell > 9 ? 0 : cell))
//   //         );
//   //         setRecognizedBoard(sanitizedBoard);
//   //         setEditableBoard(sanitizedBoard);
//   //         setSolvedBoard(null);
//   //       } else {
//   //         setError('Extraction failed: Recognized board is not valid.');
//   //       }
//   //     } else {
//   //       console.error('Extraction failed: Success flag is false.');
//   //       setError('Extraction failed: Success flag is false.');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error during extraction:', error);
//   //     setError('Error extracting Sudoku board.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleExtractSudoku = async () => {
//     try {
//       setLoading(true);
//       console.log('Sending image for extraction:', image); // Debug log
//       const response = await extract(image); // Call your extraction function
  
//       console.log('Extraction Response:', response); // Debug log
  
//       // Check if the response is successful
//       if (response.data.success) {
//         console.log('Response success:', response.data.success);
//         console.log('Raw Recognized Board:', response.data.recognized_board); // Log raw recognized board
  
//         // Sanitize board: Replace invalid numbers (>9 or <0) with 0
//         const sanitizedBoard = response.data.recognized_board.map(row =>
//           row.map(cell => (cell < 0 || cell > 9 ? 0 : cell)) // Replace invalid numbers with 0
//         );
  
//         console.log('Sanitized Board:', sanitizedBoard); // Log sanitized board
//         setRecognizedBoard(sanitizedBoard);
//         setEditableBoard(sanitizedBoard);
//         setSolvedBoard(null);
//       } else {
//         setError('Extraction failed: Success flag is false.');
//       }
//     } catch (error) {
//       console.error('Error during extraction:', error);
//       setError('Error extracting Sudoku board.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
  
// // Handle Sudoku solving
// const handleSolveSudoku = async () => {
//   if (editableBoard) {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await solve(editableBoard);
      
//       if (response && response.data.success) {  // Corrected from response.success to response.data.success
//         console.log('Solved Board:', response.data.solved_board);
//         setSolvedBoard(response.data.solved_board);  // Update with solved board
//       } else {
//         setError('Could not solve the Sudoku puzzle.');
//       }
//     } catch (error) {
//       console.error('Error during solving:', error);
//       setError('Error solving Sudoku puzzle.');
//     } finally {
//       setLoading(false);
//     }
//   }
// };


//   // Handle Sudoku solving
//   // const handleSolveSudoku = async () => {
//   //   if (editableBoard) {
//   //     try {
//   //       setLoading(true);
//   //       setError(null);
//   //       const response = await solve(editableBoard);
//   //       if (response && response.success) {
//   //         console.log('Solved Board:', response.solved_board);
//   //         setSolvedBoard(response.solved_board);  // Update with solved board
//   //       } else {
//   //         setError('Could not solve the Sudoku puzzle.');
//   //       }
//   //     } catch (error) {
//   //       console.error('Error during solving:', error);
//   //       setError('Error solving Sudoku puzzle.');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   // };

//   // Handle editing the Sudoku board
//   const handleCellChange = (rowIndex, colIndex, value) => {
//     const updatedBoard = editableBoard.map((row, rIdx) =>
//       row.map((cell, cIdx) =>
//         rIdx === rowIndex && cIdx === colIndex
//           ? (value === '' || isNaN(value) ? 0 : parseInt(value, 10)) // Update cell
//           : cell
//       )
//     );
//     setEditableBoard(updatedBoard); // Update editable board
//   };

//   // Render editable Sudoku board
//   const renderEditableBoard = (board) => (
//     <Grid container spacing={1}>
//       {board.map((row, rowIndex) => (
//         <Grid container key={rowIndex} justifyContent="center">
//           {row.map((cell, colIndex) => (
//             <Grid item xs={0} key={colIndex} style={{ textAlign: 'center' }}>
//               <TextField
//                 value={cell === 0 ? '' : cell}
//                 onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
//                 inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
//                 style={{ width: '40px', height: '55px'}}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       ))}
//     </Grid>
//   );

//   return (
//     <Grid container spacing={2} direction="column" alignItems="center">
//       <Grid item>
//         <Typography variant="h4">Sudoku Solver</Typography>
//       </Grid>

//       <Grid item>
//         <input
//           accept="image/*"
//           type="file"
//           onChange={handleImageChange}
//           style={{ display: 'none' }}
//           id="upload-image"
//         />
//         <label htmlFor="upload-image">
//           <Button variant="contained" component="span">
//             Upload Sudoku Image
//           </Button>
//         </label>
//       </Grid>

//       {image && (
//         <Grid item>
//           <img src={image} alt="Uploaded Sudoku" style={{ maxWidth: '300px', marginTop: '10px' }} />
//         </Grid>
//       )}

//       <Grid item>
//         <Button variant="contained" color="primary" onClick={handleExtractSudoku} disabled={!image || loading}>
//           {loading ? <CircularProgress size={24} /> : 'Extract Sudoku'}
//         </Button>
//       </Grid>

//       {recognizedBoard && (
//         <>
//           <Grid item>
//             <Typography variant="h6">Recognized Sudoku Board (Editable):</Typography>
//             {renderEditableBoard(editableBoard)}
//           </Grid>

//           <Grid item>
//             <Button variant="contained" color="secondary" onClick={handleSolveSudoku} disabled={loading}>
//               {loading ? <CircularProgress size={24} /> : 'Solve Sudoku'}
//             </Button>
//           </Grid>
//         </>
//       )}

//       {solvedBoard && (
//         <Grid item>
//           <Typography variant="h6">Solved Sudoku Board:</Typography>
//           {renderEditableBoard(solvedBoard)} {/* Render solved board */}
//         </Grid>
//       )}

//       {error && (
//         <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
//           <Alert onClose={() => setError(null)} severity="error">
//             {error}
//           </Alert>
//         </Snackbar>
//       )}
//     </Grid>
//   );
// };

// export default SudokuSolver;



// import React, { useState } from 'react';
// import { Button, Grid, Typography, CircularProgress } from '@mui/material';
// import { extract, solve } from './api/Sudoku-ws'; 

// const SudokuSolver = () => {
//   const [image, setImage] = useState(null);
//   const [recognizedBoard, setRecognizedBoard] = useState(null);
//   const [solvedBoard, setSolvedBoard] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false); 


//   const handleImageChange = (event) => {
//     const file = event.target.files[0];

   
//     if (file && !file.type.startsWith('image/')) {
//       setError('Please upload a valid image file.');
//       return;
//     }

    
//     if (file.size > 5 * 1024 * 1024) { 
//       setError('File is too large. Please upload an image smaller than 5MB.');
//       return;
//     }

//     setError(null); 
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImage(reader.result); 
//     };
//     reader.readAsDataURL(file);
//   };

//   // Handle Sudoku extraction
//   const handleExtractSudoku = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await extract(image);
//       if (response.success) {
//         setRecognizedBoard(response.recognized_board);
//         setSolvedBoard(null); 
//       } 
//     } catch (error) {
//       setError(error.response?.data?.error || 'Error extracting Sudoku board.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Sudoku solving
//   const handleSolveSudoku = async () => {
//     if (recognizedBoard) {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await solve(recognizedBoard);
//         if (response.success) {
//           setSolvedBoard(response.solved_board);
//         } else {
//           setError('Could not solve the Sudoku puzzle.');
//         }
//       } catch (error) {
//         setError('Error solving Sudoku puzzle.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Function to render the Sudoku board in a grid format
//   const renderBoard = (board) => (
//     <Grid container spacing={1}>
//       {board.map((row, rowIndex) => (
//         <Grid container key={rowIndex} justifyContent="center">
//           {row.map((cell, colIndex) => (
//             <Grid item xs={1} key={colIndex} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
//               {cell || ''}
//             </Grid>
//           ))}
//         </Grid>
//       ))}
//     </Grid>
//   );

//   return (
//     <Grid container spacing={2} direction="column" alignItems="center">
//       <Grid item>
//         <Typography variant="h4">Sudoku Solver</Typography>
//       </Grid>

//       <Grid item>
//         <input
//           accept="image/*"
//           type="file"
//           onChange={handleImageChange}
//           style={{ display: 'none' }}
//           id="upload-image"
//         />
//         <label htmlFor="upload-image">
//           <Button variant="contained" component="span">
//             Upload Sudoku Image
//           </Button>
//         </label>
//       </Grid>

//       {image && (
//         <Grid item>
//           <img src={image} alt="Uploaded Sudoku" style={{ maxWidth: '300px', marginTop: '10px' }} />
//         </Grid>
//       )}

//       <Grid item>
//         <Button variant="contained" color="primary" onClick={handleExtractSudoku} disabled={!image || loading}>
//           {loading ? <CircularProgress size={24} /> : 'Extract Sudoku'}
//         </Button>
//       </Grid>

//       {recognizedBoard && (
//         <>
//           <Grid item>
//             <Typography variant="h6">Recognized Sudoku Board:</Typography>
//             {renderBoard(recognizedBoard)}
//           </Grid>

//           <Grid item>
//             <Button variant="contained" color="secondary" onClick={handleSolveSudoku} disabled={!recognizedBoard || loading}>
//               {loading ? <CircularProgress size={24} /> : 'Solve Sudoku'}
//             </Button>
//           </Grid>
//         </>
//       )}

//       {solvedBoard && (
//         <Grid item>
//           <Typography variant="h6">Solved Sudoku Board:</Typography>
//           {renderBoard(solvedBoard)}
//         </Grid>
//       )}

//       {error && (
//         <Grid item>
//           <Typography color="error">{error}</Typography>
//         </Grid>
//       )}
//     </Grid>
//   );
// };

// export default SudokuSolver;
