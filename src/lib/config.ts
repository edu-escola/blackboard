export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

  TIMEOUT: 10000,

  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },

  AUTH: {
    USER_KEY: 'user',
    TOKEN_KEY: 'token',
    LOGIN_ROUTE: '/',
  },
} as const

export type ApiConfig = typeof API_CONFIG
