import { HttpMethod } from '../utils/network.js';
import { API } from '../utils/request.js';

/**
 * Extract Sudoku board from the uploaded image.
 * @param {string} base64Image - The base64-encoded image.
 * @returns {Promise} - API request promise.
 */
export const extract = (base64Image) => {
  const urlPath = '/sudoku/extract';
  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: { image: base64Image },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Solve a Sudoku puzzle given a recognized board.
 * @param {Array} recognizedBoard - The 2D array representing the Sudoku board.
 * @returns {Promise} - API request promise.
 */
export const solve = (recognizedBoard) => {
  const urlPath = '/sudoku/solve';
  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: { recognized_board: recognizedBoard },
  });
};
