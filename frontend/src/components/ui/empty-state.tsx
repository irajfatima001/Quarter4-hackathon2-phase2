import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function EmptyState({ 
  title = "No tasks yet", 
  description = "Get started by creating your first task", 
  showButton = true, 
  buttonText = "Create Task",
  onButtonClick 
}: EmptyStateProps) {
  return (
    <Card className="text-center border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-none">
      <CardHeader className="pb-4">
        <div className="mx-auto bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4" />
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>
        {showButton && onButtonClick && (
          <Button 
            onClick={onButtonClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}