// Import the Axios library for making HTTP requests
import axios from 'axios'

// Create a pre-configured Axios instance with the base API URL
const api = axios.create({
    baseURL: "http://localhost:3002", // Base URL of the backend server
}) 

// Export the instance to use it across the application
export default api
