import axios from "axios";

// Set the base URL for all API requests
const API_BASE_URL = "http://localhost:3000/api/canvas";

// Axios instance with common configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a new session
export const createSession = async (sessionId) => {
  const response = await apiClient.post("/", { sessionId });
  return response.data; // Return the session data
};

// Get a session by ID
export const getSession = async (sessionId) => {
  const response = await apiClient.get(`/${sessionId}`);
  return response.data; // Return the session data
};

// Update session elements
export const updateSession = async (sessionId, elements) => {
  const response = await apiClient.put(`/${sessionId}`, { elements });
  return response.data; // Return the updated session data
};

// Delete a session
export const deleteSession = async (sessionId) => {
  const response = await apiClient.delete(`/${sessionId}`);
  return response.data; // Return the delete confirmation
};