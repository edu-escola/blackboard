import { useState } from "react";
import { 
  LayoutDashboard, 
  School, 
  Users, 
  User, 
  Calendar, 
  ClipboardCheck, 
  FileEdit, 
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigation } from "./NavigationContext";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles: ('admin' | 'professor')[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Painel',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
    roles: ['admin']
  },
  {
    id: 'schools',
    label: 'Escolas',
    icon: School,
    path: '/admin/schools',
    roles: ['admin']
  },
  {
    id: 'professors',
    label: 'Professores',
    icon: User,
    path: '/admin/professors',
    roles: ['admin']
  },
  {
    id: 'students',
    label: 'Alunos',
    icon: Users,
    path: '/admin/students',
    roles: ['admin']
  },
  {
    id: 'classes',
    label: 'Turmas e Horários',
    icon: Calendar,
    path: '/admin/classes',
    roles: ['admin']
  },
  {
    id: 'prof-dashboard',
    label: 'Painel',
    icon: LayoutDashboard,
    path: '/professor/dashboard',
    roles: ['professor']
  },
  {
    id: 'attendance',
    label: 'Presença',
    icon: ClipboardCheck,
    path: '/professor/attendance',
    roles: ['professor']
  },
  {
    id: 'evaluations',
    label: 'Avaliações',
    icon: Award,
    path: '/professor/evaluations',
    roles: ['professor']
  },
  {
    id: 'lesson-planner',
    label: 'Planejamento',
    icon: FileEdit,
    path: '/professor/lesson-planner',
    roles: ['professor']
  }
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useNavigation();

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.id}
                variant={active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "px-2",
                  active && "bg-blue-600 text-white hover:bg-blue-700"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Role Badge */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            {userRole} Painel
          </div>
        </div>
      )}
    </div>
  );
};