import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { 
  Edit3, 
  Trash2, 
  Calendar, 
  Circle, 
  CircleCheckBig,
  Clock
} from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: (completed: boolean) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const handleToggleComplete = (checked: boolean) => {
    onToggleComplete(checked);
  };

  // Determine priority badge style
  const priorityVariant =
    task.priority === 'high' ? 'destructive' :
    task.priority === 'medium' ? 'default' : 'secondary';

  return (
    <Card
      className="rounded-xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden transition-all hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500"
      tabIndex={0}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className={`h-5 w-5 rounded-full ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-semibold truncate ${
                  task.completed
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
                tabIndex={0}
                aria-label={task.completed ? `${task.title}, completed` : `${task.title}, pending`}
              >
                {task.title}
              </h3>
              <Badge variant={priorityVariant} className="ml-auto" aria-label={`Priority: ${task.priority}`}>
                {task.priority}
              </Badge>
            </div>

            {task.description && (
              <p
                className={`text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 ${
                  task.completed ? 'line-through' : ''
                }`}
                tabIndex={0}
              >
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1" tabIndex={0}>
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>{format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1" tabIndex={0}>
                {task.completed ? (
                  <>
                    <CircleCheckBig className="h-3 w-3 text-green-500" aria-hidden="true" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span>Pending</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={`Edit task: ${task.title}`}
          >
            <Edit3 className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            aria-label={`Delete task: ${task.title}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}