// API URLs
const DEV_API_URL = 'http://localhost:3001';
const PROD_API_URL = process.env.RAILWAY_STATIC_URL || 'https://your-app-name.railway.app';

// Determine if we're in development
const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

// Choose the appropriate API URL
export const API_BASE_URL = isDevelopment ? DEV_API_URL : PROD_API_URL;

// API Endpoints
export const API_ENDPOINTS = {
  KNOCKOUT: `${API_BASE_URL}/api/knockout`,
  PLAYERS: `${API_BASE_URL}/api/players`,
  TABLA: `${API_BASE_URL}/api/tabla`,
  UPLOADS: `${API_BASE_URL}/uploads`
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT_MS: 5000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  HEADERS: {
    'Content-Type': 'application/json',
    // Add any additional headers here
  }
}; 