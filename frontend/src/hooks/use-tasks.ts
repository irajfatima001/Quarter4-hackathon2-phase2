import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fake "user" for frontend-only
  const fakeUser = { id: 'user-123', name: 'Frontend User' };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate delay
      await new Promise(res => setTimeout(res, 500));
      // Fake tasks
      setTasks([
        { id: '1', userId: fakeUser.id, title: 'Test Task 1', description: '', priority: 'medium', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', userId: fakeUser.id, title: 'Test Task 2', description: '', priority: 'high', completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ]);
    } catch (err: any) {
      setError(err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 300));
      const newTask: Task = {
        id: Date.now().toString(),
        userId: fakeUser.id,
        title: taskData.title || 'New Task',
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully');
      return newTask;
    } catch (err: any) {
      setError(err);
      toast.error('Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 300));
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task));
      toast.success('Task updated successfully');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 300));
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (taskId: string, completed: boolean) => {
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 300));
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, completed, updatedAt: new Date().toISOString() } : task));
      toast.success(completed ? 'Task marked as complete' : 'Task marked as incomplete');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete
  };
}
