import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Disaster API
export const disasterAPI = {
  getAllDisasters: () => api.get('/api/disasters'),
  getDisasterById: (id) => api.get(`/api/disasters/${id}`),
  createDisaster: (data) => api.post('/api/disasters', data),
  updateDisaster: (id, data) => api.put(`/api/disasters/${id}`, data),
  deleteDisaster: (id) => api.delete(`/api/disasters/${id}`),
};

// Location API
export const locationAPI = {
  extractLocation: (description) => api.post('/api/location/extract', { description }),
  geocodeLocation: (location) => api.post('/api/location/geocode', { location }),
};

// Social Media API
export const socialMediaAPI = {
  getPosts: (params) => api.get('/api/social-media/posts', { params }),
  getPostsByLocation: (location, radius) => api.get('/api/social-media/posts/location', {
    params: { location, radius }
  }),
  linkPostToDisaster: (postId, disasterId) => api.post('/api/social-media/link', {
    post_id: postId,
    disaster_id: disasterId
  }),
};

// Resources API
export const resourceAPI = {
  getNearbyResources: (params) => api.get('/api/resources/nearby', { params }),
  getResourceById: (id) => api.get(`/api/resources/${id}`),
  createResource: (data) => api.post('/api/resources', data),
  updateResource: (id, data) => api.put(`/api/resources/${id}`, data),
};

// Official Updates API
export const updatesAPI = {
  getOfficialUpdates: (params) => api.get('/api/updates/official', { params }),
  refreshUpdates: () => api.post('/api/updates/refresh'),
};

// Image Verification API
export const imageAPI = {
  verifyImage: (formData) => {
    return api.post('/api/images/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Longer timeout for image processing
    });
  },
  uploadImage: (formData) => {
    return api.post('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Audit API
export const auditAPI = {
  getAuditLogs: (params) => api.get('/api/audit/logs', { params }),
  getAuditLogsByEntity: (entityType, entityId) => api.get(`/api/audit/logs/${entityType}/${entityId}`),
};

export default api;