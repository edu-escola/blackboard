import { createContext, useContext, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast as useToastOriginal } from "@/hooks/use-toast";

interface ToastContextType {
  showSuccess: (message: string, description?: string) => void;
  showError: (message: string, description?: string) => void;
  showWarning: (message: string, description?: string) => void;
  showInfo: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const { toast } = useToastOriginal();

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "default"
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "destructive"
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "default" // Note: shadcn doesn't have warning variant by default
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "default"
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};