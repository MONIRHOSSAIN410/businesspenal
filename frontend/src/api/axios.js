import axios from 'axios';

// In production VITE_API_URL must be set in the Vercel project settings, e.g.
//   VITE_API_URL=https://business-panel-api.vercel.app/api
// If it is missing we fall back to a same-origin "/api" so the app can also run
// behind a Vercel rewrite proxy instead of blowing up with a Network Error
// against localhost. Locally the fallback is the dev backend on port 5011.
const fallbackBaseURL = import.meta.env.PROD ? '/api' : 'http://localhost:5011/api';

export const API_BASE_URL = import.meta.env.VITE_API_URL || fallbackBaseURL;

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn(
    '[business-panel] VITE_API_URL is not set - falling back to the same-origin /api path.'
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bp-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bp-token');
      localStorage.removeItem('bp-user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  // A request that never reached the server has no `response` at all - that is
  // the classic "Network Error", and it is almost always a wrong API base URL
  // or a CORS rejection rather than a genuine credentials problem.
  if (!error?.response && error?.code !== 'ERR_CANCELED') {
    return `Cannot reach the API at ${API_BASE_URL} (network or CORS error).`;
  }
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};

export default api;
