'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { authApi } from '@/lib/api';
import { Task } from '@/types';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todos, setTodos] = useState<Task[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadTodos = async () => {
      const session = await authApi.getSession();
      if (!session?.data?.user) {
        setIsLoggedIn(false); // user not logged in
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      // Load todos if needed
      setLoading(false);
    };

    checkAuthAndLoadTodos();
  }, [router]);

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      userId: 'current-user-id', 
      title: newTodo,
      description: '',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos([newTask, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = async (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = async (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // If user is not logged in, show Sign Up / Login options
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black gap-4">
        <p className="text-lg text-gray-600 dark:text-gray-400">You are not logged in.</p>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/login')}>Login</Button>
          <Button onClick={() => router.push('/signup')} variant="outline">
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Todo App
          </h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            Logout
          </Button>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                className="flex-grow"
              />
              <Button onClick={addTodo}>Add</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">My Tasks</h2>
          <Badge variant="secondary">{todos.length} {todos.length === 1 ? 'task' : 'tasks'}</Badge>
        </div>

        {todos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add a new task to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <Card key={todo.id} className="p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5"
                  />
                  <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                    {todo.title}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}>
                      {todo.priority}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
