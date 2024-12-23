import { HttpMethod } from '../utils/network.js';
import { API } from '../utils/request.js';
/**
 * Convert a file using the /api/conversion/convert API.
 * @param {File} file - The file to be converted.
 * @returns {Promise} - API request promise.
 */
export const convertFile = (file) => {
  const urlPath = '/conversion/convert'; // Updated URL path

  const formData = new FormData();
  formData.append('inputFile', file); // Append the file to the FormData object
  // formData.append('outputFile', 'output_file.stl'); // Specify the output file name

  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: formData,  // Sending form data with the file
    headers: {
      // Do not set 'Content-Type' as 'multipart/form-data' manually when using FormData
      // The browser will automatically handle it.
    },
  });
};