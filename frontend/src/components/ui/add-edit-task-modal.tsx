import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectItem} from "@/components/ui/select";
import { Task } from "@/types";

interface AddEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>, taskId?: string) => void;
  task?: Task;
}

export function AddEditTaskModal({ isOpen, onClose, onSave, task }: AddEditTaskModalProps) {
  const isEditing = !!task;
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when task changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setPriority(task?.priority || 'medium');
      setError(null);
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim(),
        priority
      };

      await onSave(taskData, task?.id);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the task');
      console.error('Error saving task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md rounded-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl"
        aria-describedby="modal-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div
            className="bg-red-50 text-red-700 p-3 rounded-lg text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="py-5 px-4 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              autoFocus
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="resize-none py-3 px-4 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              aria-describedby="description-help-text"
            />
            <p id="description-help-text" className="text-xs text-gray-500 dark:text-gray-400">
              Optional details about the task
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-5 rounded-xl"
              aria-label="Cancel and close modal"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading || !title.trim()}
              aria-label={isEditing ? 'Update task' : 'Create task'}
            >
              {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}