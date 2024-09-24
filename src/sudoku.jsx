import React, { useState } from 'react';
import { Button, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { solveSudoku } from './api/Sudoku-ws';

const SudokuSolver = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [recognizedBoard, setRecognizedBoard] = useState(null);
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);

    try {

      const response = await solveSudoku(selectedFile); 

      const { success, recognized_board, solved_board } = response;

      if (success) {
        setRecognizedBoard(recognized_board);
        setSolvedBoard(solved_board);
      } else {
        alert('Failed to solve the Sudoku');
      }
    } catch (error) {
      console.error('Error while solving Sudoku:', error);
      alert('Error while solving Sudoku.');
    } finally {
      setLoading(false);
    }
  };

  const renderSudokuGrid = (board) => {
    return (
      <Box mt={2} p={2} border={1} borderRadius="8px">
        <Grid container spacing={1}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Grid item xs={1} key={`${rowIndex}-${colIndex}`} style={{ border: '1px solid #000', padding: '10px' }}>
                <Typography variant="body1" align="center">
                  {cell !== 0 ? cell : ''}
                </Typography>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Sudoku Solver
      </Typography>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
          Upload & Solve
        </Button>
      </form>

      {loading && <CircularProgress style={{ marginTop: '20px' }} />}

      {recognizedBoard && (
        <>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Recognized Board:
          </Typography>
          {renderSudokuGrid(recognizedBoard)}
        </>
      )}

      {solvedBoard && (
        <>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Solved Board:
          </Typography>
          {renderSudokuGrid(solvedBoard)}
        </>
      )}
    </div>
  );
};

export default SudokuSolver;
