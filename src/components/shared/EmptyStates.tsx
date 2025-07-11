import { ReactNode } from "react";
import { 
  Inbox, 
  Users, 
  Calendar, 
  FileText, 
  Search, 
  Plus,
  Database,
  BookOpen,
  ClipboardList,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = "" 
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Predefined empty states for common scenarios
export const EmptyStates = {
  // Table empty states
  NoStudents: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Users className="h-12 w-12" />}
      title="No students found"
      description="There are no students in this class yet. Add students to get started with managing attendance and grades."
      {...props}
    />
  ),

  NoProfessors: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<GraduationCap className="h-12 w-12" />}
      title="No professors found"
      description="No professors have been added to the system yet. Create professor profiles to assign them to classes."
      {...props}
    />
  ),

  NoClasses: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<BookOpen className="h-12 w-12" />}
      title="No classes available"
      description="There are no classes scheduled yet. Create your first class to start organizing your curriculum."
      {...props}
    />
  ),

  NoEvaluations: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<ClipboardList className="h-12 w-12" />}
      title="No evaluations created"
      description="You haven't created any quizzes, tests, or assignments yet. Create your first evaluation to assess student progress."
      {...props}
    />
  ),

  // Search empty states
  NoSearchResults: (searchTerm?: string, props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="No results found"
      description={searchTerm 
        ? `We couldn't find anything matching "${searchTerm}". Try adjusting your search terms or filters.`
        : "No results match your current search criteria. Try adjusting your filters or search terms."
      }
      {...props}
    />
  ),

  // Calendar empty states
  NoEvents: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Calendar className="h-12 w-12" />}
      title="No events scheduled"
      description="There are no classes or events scheduled for this date. Select a different date or create a new event."
      {...props}
    />
  ),

  NoLessons: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="No lessons planned"
      description="You haven't planned any lessons for this period yet. Start creating lesson plans to organize your curriculum."
      {...props}
    />
  ),

  // Data empty states
  NoData: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Database className="h-12 w-12" />}
      title="No data available"
      description="There's no data to display at the moment. Check back later or contact your administrator if this seems incorrect."
      {...props}
    />
  ),

  // Generic empty inbox
  EmptyInbox: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Inbox className="h-12 w-12" />}
      title="All caught up!"
      description="You don't have any new notifications or messages at the moment. We'll let you know when something needs your attention."
      {...props}
    />
  )
};

// Loading state component
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState = ({ 
  message = "Loading...", 
  className = "" 
}: LoadingStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

// Error state component
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  className = ""
}: ErrorStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4 text-red-400">
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-sm leading-relaxed mb-6">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
};