import { HttpMethod } from '../utils/network.js';
import { API } from '../utils/request.js';

/**
 * Solve a Sudoku puzzle by uploading an image.
 * @param {File} sudokuImage 
 * @returns {Promise} 
 */
export const solveSudoku = (sudokuImage) => {
  const urlPath = '/solve-sudoku';
  const formData = new FormData();
  formData.append('sudokuImage', sudokuImage);

  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const extract = (sudokuImage) => {
  const urlPath = '/sudoku/extract';
  const formData = new FormData();
  formData.append('sudokuImage', sudokuImage); // Ensure this matches the backend key

  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

