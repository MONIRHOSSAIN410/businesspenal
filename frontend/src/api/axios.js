import axios from 'axios';

// ---------------------------------------------------------------------------
// API base URL
// ---------------------------------------------------------------------------
// Production builds read VITE_API_URL (see .env.production, or the Vercel
// project's Environment Variables which override it).
//
// If it is missing we fall back to the same-origin "/api" path. On Vercel that
// only works because frontend/vercel.json proxies /api/* to the backend BEFORE
// the SPA catch-all rewrite. Without that proxy rule the catch-all sends
// POST /api/auth/login to the static index.html, and Vercel answers
// "405 Method Not Allowed" - which is exactly the login error this fixes.
const fallbackBaseURL = import.meta.env.PROD ? '/api' : 'http://localhost:5011/api';

const rawBaseURL = import.meta.env.VITE_API_URL || fallbackBaseURL;

// Trailing slashes produce "//auth/login" style URLs, which some hosts reject.
export const API_BASE_URL = rawBaseURL.replace(/\/+$/, '');

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn(
    '[business-panel] VITE_API_URL is not set - falling back to the same-origin /api path.'
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  // Render's free tier puts the service to sleep; the first request after that
  // takes ~30-60s to wake it. Without a generous timeout that first login
  // looks like a failure.
  timeout: 120000,
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
  const status = error?.response?.status;

  // A request that never reached the server has no `response` at all - that is
  // the classic "Network Error", and it is almost always a wrong API base URL
  // or a CORS rejection rather than a genuine credentials problem.
  if (!error?.response && error?.code !== 'ERR_CANCELED') {
    if (error?.code === 'ECONNABORTED') {
      return 'The server took too long to answer - it may be waking up. Please try again in a moment.';
    }
    return `Cannot reach the API at ${API_BASE_URL} (network or CORS error).`;
  }

  // 404/405 on an API call means the request landed on the static site instead
  // of the backend, i.e. the API base URL / proxy rewrite is misconfigured.
  if (status === 405 || (status === 404 && !error?.response?.data?.message)) {
    return `API base URL looks wrong: ${API_BASE_URL} answered ${status}. Set VITE_API_URL to your backend's /api URL and redeploy.`;
  }

  return error?.response?.data?.message || error?.message || 'Something went wrong';
};

export default api;
