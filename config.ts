// Server configuration
export const SERVER_BASE_URL = 'http://192.168.254.200:3001';
export const API_URL = `${SERVER_BASE_URL}/api`;
export const UPLOADS_URL = `${SERVER_BASE_URL}/uploads`;

// API request configuration
export const API_CONFIG = {
  TIMEOUT_MS: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000, // 1 second
};

export const API_ENDPOINTS = {
  EVENTS: `${API_URL}/events`,
  TABLA: `${API_URL}/tabla`,
  PLAYERS: `${API_URL}/players`,
  KNOCKOUT: `${API_URL}/knockout`,
}; 