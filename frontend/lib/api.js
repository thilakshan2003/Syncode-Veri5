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

// Clinic API functions
export const clinicApi = {
    /**
     * Get all clinics or search by name
     * @param {string} search - Optional search query for clinic name
     * @returns {Promise} Response with clinics array
     */
    getClinics: async (search = '') => {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const response = await api.get(`/clinics${query}`);
        return response.data;
    },

    /**
     * Get a specific clinic by ID
     * @param {number|string} id - Clinic ID
     * @returns {Promise} Response with clinic data
     */
    getClinicById: async (id) => {
        const response = await api.get(`/clinics/${id}`);
        return response.data;
    },

    /**
     * Get practitioners for a clinic
     * @param {number|string} id - Clinic ID
     * @returns {Promise} Response with practitioners array
     */
    getClinicPractitioners: async (id) => {
        const response = await api.get(`/clinics/${id}/practitioners`);
        return response.data;
    }
};

// Test Kit API functions
export const testKitApi = {
    /**
     * Get all active test kits
     * @returns {Promise} Response with test kits array
     */
    getTestKits: async () => {
        const response = await api.get('/test-kits');
        return response.data;
    },

    /**
     * Get a specific test kit by ID
     * @param {number|string} id - Test kit ID
     * @returns {Promise} Response with test kit data
     */
    getTestKitById: async (id) => {
        const response = await api.get(`/test-kits/${id}`);
        return response.data;
    }
};

// Practitioner API functions
export const practitionerApi = {
    /**
     * Get all practitioners
     * @returns {Promise} Response with practitioners array
     */
    getPractitioners: async () => {
        const response = await api.get('/practitioners');
        return response.data;
    }
};

// Order API functions
export const orderApi = {
    /**
     * Create a new order
     * @param {Object} orderData - Order data
     * @param {string} orderData.deliveryAddress - Delivery address
     * @param {Array} orderData.items - Array of order items [{testKitId, qty, unitPriceCents}]
     * @returns {Promise} Response with created order
     */
    createOrder: async (orderData) => {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    },

    /**
     * Get all orders for the authenticated user
     * @returns {Promise} Response with orders array
     */
    getOrders: async () => {
        const response = await api.get('/api/orders');
        return response.data;
    },

    /**
     * Get a specific order by ID
     * @param {number|string} id - Order ID
     * @returns {Promise} Response with order data
     */
    getOrderById: async (id) => {
        const response = await api.get(`/api/orders/${id}`);
        return response.data;
    }
};

// Resource API functions
export const resourceApi = {
    /**
     * Get all resources or filter by category
     * @param {string} category - Optional category filter
     * @returns {Promise} Response with resources array
     */
    getResources: async (category = '') => {
        const query = category ? `?category=${encodeURIComponent(category)}` : '';
        const response = await api.get(`/api/resources${query}`);
        return response.data;
    },

    /**
     * Get a specific article by ID
     * @param {string} id - Article ID
     * @returns {Promise} Response with article data
     */
    getArticleById: async (id) => {
        const response = await api.get(`/api/resources/${id}`);
        return response.data;
    }
};

export default api;