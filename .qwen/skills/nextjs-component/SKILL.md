# Next.js Component Skill

## Name
nextjs-component

## Description
Generates reusable Next.js TypeScript components with Tailwind, forms, and API calls using axios with Bearer token

## Allowed Tools
- code_write
- file_edit

## Instructions
1. Use TypeScript for type safety
2. Implement using Next.js App Router
3. Style components with Tailwind CSS
4. Create reusable components like TodoList, TaskForm
5. Set up axios instance with token interceptor
6. Handle loading and error states appropriately
7. Implement proper form validation and submission
8. Include proper error handling and user feedback

## Implementation Example

### Axios Instance with Token Interceptor

```typescript
// lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized access
    if (error.response?.status === 401) {
      // Redirect to login or clear token
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Reusable TodoList Component

```typescript
// components/TodoList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import apiClient from '@/lib/api';

interface TodoListProps {
  userId: string;
}

const TodoList = ({ userId }: TodoListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/${userId}/tasks`);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      await apiClient.patch(`/api/${userId}/tasks/${taskId}/complete`, {
        is_completed: !completed
      });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, is_completed: !completed } : task
      ));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiClient.delete(`/api/${userId}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-4">Loading tasks...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <h2 className="text-xl font-bold p-4 border-b">Your Tasks</h2>
      <ul className="divide-y divide-gray-200">
        {tasks.length === 0 ? (
          <li className="p-4 text-center text-gray-500">No tasks found</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => toggleTaskCompletion(task.id, task.is_completed)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`ml-3 ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;
```

### Reusable TaskForm Component

```typescript
// components/TaskForm.tsx
'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import apiClient from '@/lib/api';

interface TaskFormProps {
  userId: string;
  onTaskCreated?: (task: Task) => void;
}

const TaskForm = ({ userId, onTaskCreated }: TaskFormProps) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`/api/${userId}/tasks`, {
        title,
        description,
        user_id: userId
      });

      setTitle('');
      setDescription('');
      
      if (onTaskCreated) {
        onTaskCreated(response.data);
      }
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description (optional)"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
```

### Type Definitions

```typescript
// types/task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}
```

## Usage Example

```tsx
// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import TodoList from '@/components/TodoList';
import TaskForm from '@/components/TaskForm';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">Please log in to continue</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <TaskForm 
        userId={user.id} 
        onTaskCreated={(task) => console.log('New task created:', task)} 
      />
      
      <TodoList userId={user.id} />
    </div>
  );
}
```

## Important Notes
- Always handle loading and error states in components
- Use TypeScript interfaces for type safety
- Implement proper form validation
- Use Tailwind utility classes for consistent styling
- Ensure the Bearer token is properly attached to API requests
- Handle unauthorized access (401) responses appropriately
- Components should be reusable and accept props as needed