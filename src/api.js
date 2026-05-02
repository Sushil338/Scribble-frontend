const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Initialize token from localStorage
let authToken = localStorage.getItem('token') || '';

export const setAuthToken = (token) => {
  authToken = token || '';
};

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // 1. Check if this is an Auth request
  const isAuthRequest = path.includes('/auth/login') || path.includes('/auth/register');

  // 2. ONLY attach the token if one exists AND it's NOT a login/register request
  // This prevents the backend JwtFilter from seeing an expired token during login
  if (authToken && !isAuthRequest) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    // 3. Optional: If the server returns 401 specifically because of an expired token,
    // clear the local token so the next attempt is fresh.
    if (response.status === 401 && data.message?.includes("expired")) {
       localStorage.removeItem('token');
       setAuthToken('');
    }

    const error = new Error(
      typeof data === 'string' ? data : data.message || 'Request failed'
    );
    error.response = { data, status: response.status };
    throw error;
  }

  return { data, status: response.status };
};

export const API = {
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  get: (path) => request(path),
};

export default API;