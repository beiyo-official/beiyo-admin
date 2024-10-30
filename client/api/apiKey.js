// src/utils/axiosInstance.js
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'https://beiyo-admin.in', // Replace with your API base URL
});

// Interceptor to add apiKey to each request as a header
api.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_SERVER_APP_API_KEY;  // Get the API key from environment variables
    
    // Add the apiKey to headers
    if (apiKey) {
      config.headers = {
        ...config.headers, // Preserve existing headers, if any
        'apikey': apiKey, // Use 'api-key' or any preferred header key
      };
    }

    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Reject if there's an error
  }
);

export default api;


