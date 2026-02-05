import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true, // Required for HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Define public paths that shouldn't trigger an automatic redirect to login
            const publicPaths = ['/login', '/signup', '/'];
            const isPublicPath = typeof window !== 'undefined' && publicPaths.includes(window.location.pathname);

            // Redirect to login if unauthorized and not on a public page
            if (typeof window !== 'undefined' && !isPublicPath) {
                // Clear local storage if any
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Dashboard API functions
export const dashboardApi = {
    /**
     * Get user status from User table
     * @param {string|number} userId - User ID
     * @returns {Promise} Response with status
     */
    getUserStatus: async (userId) => {
        const response = await api.get(`/api/dashboard/status/${userId}`);
        return response.data;
    }
};

export default api;