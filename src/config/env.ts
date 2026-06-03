/**
 * Environment Configuration
 */

const ENV = {
  DEV: {
    API_URL: 'http://localhost:3000',
    API_TIMEOUT: 10000,
    LOG_LEVEL: 'debug',
  },
  STAGING: {
    API_URL: 'https://staging-api.example.com',
    API_TIMEOUT: 15000,
    LOG_LEVEL: 'info',
  },
  PROD: {
    API_URL: 'https://api.example.com',
    API_TIMEOUT: 15000,
    LOG_LEVEL: 'warn',
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.DEV;
  }

  return ENV.PROD;
};

export default getEnvVars();
