import { HttpMethod } from '../utils/network.js';
import { API } from '../utils/request.js';

/**
 * Download emails as a CSV file.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise} - API request promise.
 */
export const downloadEmails = (email, password) => {
  const urlPath = '/email/downloadEmails';

  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: { email, password },
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob', // Ensure the server responds with a blob (binary data)
  }).then(response => {
    // Generate a Blob URL and trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "emails.csv"); // Set the file name for the download
    document.body.appendChild(link);
    link.click();
    link.remove(); // Remove the link from the document after triggering the download

    return response; // Optionally return the response if you want to handle it in the calling function
  }).catch(error => {
    console.error("Error downloading the file:", error);
    throw error; // Propagate the error for error handling in the component
  });
};
