import axios from 'axios';
import { authClient } from './auth-client';

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get the session to access the token
    const session = await authClient.getSession();
    if (session?.data?.session?.token) {
      config.headers.Authorization = `Bearer ${session.data.session.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Authentication API functions using Better Auth
export const authApi = {
  login: (email: string, password: string) => {
    return authClient.signIn.email({
      email,
      password,
      callbackURL: '/dashboard',
    });
  },

  signup: (name: string, email: string, password: string) => {
    return authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: '/dashboard',
    });
  },

  logout: () => {
    return authClient.signOut();
  },

  getSession: () => {
    return authClient.getSession();
  }
};

// Task API functions
export const taskApi = {
  getAll: (userId: string) => {
    return apiClient.get(`/users/${userId}/tasks`);
  },

  getById: (taskId: string) => {
    return apiClient.get(`/tasks/${taskId}`);
  },

  create: (userId: string, taskData: any) => {
    return apiClient.post(`/users/${userId}/tasks`, taskData);
  },

  update: (taskId: string, taskData: any) => {
    return apiClient.put(`/tasks/${taskId}`, taskData);
  },

  delete: (taskId: string) => {
    return apiClient.delete(`/tasks/${taskId}`);
  },

  toggleComplete: (taskId: string, completed: boolean) => {
    return apiClient.patch(`/tasks/${taskId}/complete`, { completed });
  }
};