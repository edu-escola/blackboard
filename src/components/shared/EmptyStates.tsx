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
      title="Nenhum aluno encontrado"
      description="Ainda não há alunos nesta turma. Adicione estudantes para começar a gerenciar presença e notas."
      {...props}
    />
  ),

  NoProfessors: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<GraduationCap className="h-12 w-12" />}
      title="Nenhum professor encontrado"
      description="Nenhum professor foi adicionado ao sistema ainda. Crie perfis para atribuí-los às turmas."
      {...props}
    />
  ),

  NoClasses: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<BookOpen className="h-12 w-12" />}
      title="Nenhuma turma disponível"
      description="Não há turmas agendadas ainda. Crie a primeira para organizar o currículo."
      {...props}
    />
  ),

  NoEvaluations: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<ClipboardList className="h-12 w-12" />}
      title="Nenhuma avaliação criada"
      description="Você ainda não criou provas ou atividades. Crie a primeira para avaliar o progresso dos alunos."
      {...props}
    />
  ),

  // Search empty states
  NoSearchResults: (searchTerm?: string, props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="Nenhum resultado encontrado"
      description={searchTerm
        ? `Não encontramos nada correspondente a "${searchTerm}". Tente ajustar sua pesquisa ou filtros.`
        : "Nenhum resultado corresponde aos critérios atuais. Tente ajustar os filtros ou termos de busca."
      }
      {...props}
    />
  ),

  // Calendar empty states
  NoEvents: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Calendar className="h-12 w-12" />}
      title="Nenhum evento agendado"
      description="Não há aulas ou eventos para esta data. Selecione outra ou crie um novo evento."
      {...props}
    />
  ),

  NoLessons: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="Nenhuma aula planejada"
      description="Você ainda não planejou aulas para este período. Comece criando planos de aula para organizar o currículo."
      {...props}
    />
  ),

  // Data empty states
  NoData: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Database className="h-12 w-12" />}
      title="Nenhum dado disponível"
      description="Não há dados para exibir no momento. Volte mais tarde ou contate o administrador se isso parecer incorreto."
      {...props}
    />
  ),

  // Generic empty inbox
  EmptyInbox: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={<Inbox className="h-12 w-12" />}
      title="Tudo em dia!"
      description="Você não tem novas notificações ou mensagens no momento. Avisaremos quando algo precisar da sua atenção."
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
  message = "Carregando...",
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
  title = "Algo deu errado",
  message = "Ocorreu um erro ao carregar o conteúdo. Tente novamente.",
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
          Tentar novamente
        </Button>
      )}
    </div>
  );
};