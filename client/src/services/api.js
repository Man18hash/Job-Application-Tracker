import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const jobAPI = {
  // Get all jobs with optional filters
  getJobs: (params = {}) => {
    return api.get('/jobs', { params });
  },

  // Get single job by ID
  getJob: (id) => {
    return api.get(`/jobs/${id}`);
  },

  // Create new job
  createJob: (jobData) => {
    return api.post('/jobs', jobData);
  },

  // Update job
  updateJob: (id, jobData) => {
    return api.put(`/jobs/${id}`, jobData);
  },

  // Delete job
  deleteJob: (id) => {
    return api.delete(`/jobs/${id}`);
  },

  // Get job statistics
  getJobStats: () => {
    return api.get('/jobs/stats/summary');
  },
};

export default api;



