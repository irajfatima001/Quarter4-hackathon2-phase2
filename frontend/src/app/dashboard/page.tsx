"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/ui/task-card";
import { AddEditTaskModal } from "@/components/ui/add-edit-task-modal";
import { useTasks } from "@/hooks/use-tasks";
import { Task } from "@/types";
import Navbar from "@/components/navbar";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleComplete } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async (taskData: Partial<Task>, taskId?: string) => {
    if (taskId) {
      // Update existing task
      await updateTask(taskId, taskData);
    } else {
      // Create new task
      await createTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    await toggleComplete(taskId, completed);
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • {tasks.filter(t => t.completed).length} completed
            </p>
          </div>
          <Button
            onClick={openNewTaskModal}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </header>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            Error loading tasks: {error.message || 'Unknown error'}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first task
            </p>
            <Button
              onClick={openNewTaskModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => handleEditTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
                onToggleComplete={(completed) => handleToggleComplete(task.id, completed)}
              />
            ))}
          </div>
        )}

        <AddEditTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          task={editingTask || undefined}
        />
      </div>
    </div>
  );
}