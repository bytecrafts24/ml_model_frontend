import React, { useState } from 'react';
import { solveSudoku } from './api/Sudoku-ws'

const SudokuSolver = ({ recognizedBoard }) => {
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const solveSudokuHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await solveSudoku(recognizedBoard);
      setSolvedBoard(response.data.solved_board);
    } catch (err) {
      setError('Failed to solve Sudoku.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div>
      <h3>Sudoku Solver</h3>
      <button onClick={solveSudokuHandler} disabled={loading}>
        {loading ? 'Solving...' : 'Solve Sudoku'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {solvedBoard && (
        <div>
          <h3>Solved Sudoku Board:</h3>
          <pre>{JSON.stringify(solvedBoard, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SudokuSolver;
