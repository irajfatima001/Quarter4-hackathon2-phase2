import * as React from "react"
import { cn } from "@/lib/utils"

const Dialog = ({ children, open, onOpenChange }: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  // Simple dialog implementation for now
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 max-w-lg w-full mx-4 p-6">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("", className)}>
    {children}
  </div>
);

const DialogHeader = ({ children }: {
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`text-lg font-semibold ${className || ''}`}>
    {children}
  </h3>
);

export { Dialog, DialogContent, DialogHeader, DialogTitle };