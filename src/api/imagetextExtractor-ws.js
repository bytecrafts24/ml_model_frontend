import { HttpMethod } from '../utils/network.js';
import { API } from '../utils/request.js';

/**
 * Extract text from an image by sending base64 image data to the server.
 * @param {Object} imageData - Contains the base64 image data.
 * @returns {Promise} - Resolves with the extracted text.
 */
export const extractTextFromImage = (imageData) => {
  const urlPath = '/text/text-extract';
  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: imageData,
  });
};
