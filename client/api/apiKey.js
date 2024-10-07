
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'https://beiyo-admin.in', // Replace with your API base URL
});

// Interceptor to add apiKey to each request as a query parameter
api.interceptors.request.use(
  (config) => {
    const api = import.meta.env.VITE_SERVER_APP_API_KEY;  // Get the API key from environment variables
    // Log the API key for debugging

    // Add the apiKey to query parameters
    if (api) {
      config.params = {
        ...config.params, // Preserve existing query parameters, if any
        api: api,   // Add the apiKey as a query parameter
      };
     // Log the API key in query params
    }

    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Reject if there's an error
  }
);

export default api;

