const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const authPaths = ['/auth/login', '/auth/register'];

const request = async (path, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    const token = localStorage.getItem('token');
    const isAuthPath = authPaths.includes(path);

    if (token && !isAuthPath) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        if (response.status === 401 && !isAuthPath) {
            localStorage.clear();
            window.dispatchEvent(new CustomEvent('scribble:session-expired'));
        }

        const error = new Error(typeof data === 'string' ? data : data.message || 'Request failed');
        error.response = { data, status: response.status };
        throw error;
    }

    return { data, status: response.status };
};

const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, {
        method: 'POST',
        body: JSON.stringify(body)
    }),
    put: (path, body) => request(path, {
        method: 'PUT',
        body: JSON.stringify(body)
    }),
    delete: (path) => request(path, {
        method: 'DELETE'
    })
};

export default api;
