import { API } from '../utils/request';

/**
 * Generate image from prompt
 * @param {Object} data - Generation parameters
 * @param {string} data.prompt - Text prompt
 * @param {string} data.model - Model name
 * @returns {Promise} Generated image data
 */
export const generateImage = (data) => {
  return API.request({
    method: 'POST',
    urlPath: '/generator/image-generate',
    body: data,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * Get list of available AI models
 * @returns {Promise<Array>} List of model names
 */
export const getAvailableModels = () => {
  return API.request({
    method: 'GET',
    urlPath: '/generator/image-models'
  });
};