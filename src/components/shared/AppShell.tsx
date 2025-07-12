import { ReactNode } from "react";
import { Bell, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "./Sidebar";
import { NavigationProvider } from "./NavigationContext";

interface AppShellProps {
  children: ReactNode;
  userRole: 'admin' | 'professor';
  userName?: string;
  schoolName?: string;
  onLogout?: () => void;
}

export const AppShell = ({ 
  children, 
  userRole, 
  userName = "User",
  schoolName,
  onLogout 
}: AppShellProps) => {
  return (
    <NavigationProvider userRole={userRole}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">EduCity</span>
                </div>
                
                {schoolName && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{schoolName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                <Select onValueChange={(value) => value === "logout" && onLogout?.()}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={userName} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profile">Ver Perfil</SelectItem>
                    <SelectItem value="settings">Configurações</SelectItem>
                    <SelectItem value="logout">Sair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </NavigationProvider>
  );
};