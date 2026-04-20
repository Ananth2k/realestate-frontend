// API Configuration
const isProduction = import.meta.env.PROD

export const API_URL = isProduction 
  ? 'https://your-backend-url.onrender.com/api'  // Change this after backend deploy
  : 'http://localhost:5000/api'

export default { API_URL }