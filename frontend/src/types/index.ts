// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Task type definition
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Theme type definition
export interface Theme {
  mode: 'light' | 'dark' | 'system';
  updatedAt: string; // ISO date string
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Task creation/update DTO
export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}