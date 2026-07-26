import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach JWT token in Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle unauthorized responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
