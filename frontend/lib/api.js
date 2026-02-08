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
     * Get user status from User table (uses authenticated user from JWT)
     * @returns {Promise} Response with status
     */
    getUserStatus: async () => {
        const response = await api.get('/api/dashboard/status');
        return response.data;
    },

    /**
     * Get number of tests taken by user (uses authenticated user from JWT)
     * @returns {Promise} Response with test count
     */
    getUserTestCount: async () => {
        const response = await api.get('/api/dashboard/tests');
        return response.data;
    },

    /**
     * Get next test date (uses authenticated user from JWT)
     * @returns {Promise} Response with next test date
     */
    getNextTestDate: async () => {
        const response = await api.get('/api/dashboard/next-test');
        return response.data;
    },

    /**
     * Create a new status share
     * @param {Object} data - Share data {recipientUsername, expiryHours, maxViews}
     * @returns {Promise} Response with share token
     */
    createStatusShare: async (data) => {
        const response = await api.post('/api/dashboard/status-share', data);
        return response.data;
    },

    /**
     * Get all received status shares
     * @returns {Promise} Response with received shares
     */
    getReceivedShares: async () => {
        const response = await api.get('/api/dashboard/received-shares');
        return response.data;
    },

    /**
     * View a status share by token
     * @param {string} token - Share token
     * @returns {Promise} Response with sender's status
     */
    viewStatusShare: async (token) => {
        const response = await api.get(`/api/dashboard/view-share/${token}`);
        return response.data;
    },

    /**
     * Get user appointments
     * @returns {Promise} Response with appointments array
     */
    getUserAppointments: async () => {
        const response = await api.get('/api/dashboard/appointments');
        return response.data;
    },

    /**
     * Get user activity log
     * @param {number} limit - Maximum number of activities to return (default: 20)
     * @returns {Promise} Response with activity log array
     */
    getActivityLog: async (limit = 20) => {
        const response = await api.get(`/api/dashboard/activity-log?limit=${limit}`);
        return response.data;
    }
};

export default api;