import { createContext, useContext, ReactNode } from "react";

interface NavigationContextType {
  userRole: 'admin' | 'professor';
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  userRole: 'admin' | 'professor';
}

export const NavigationProvider = ({ children, userRole }: NavigationProviderProps) => {
  return (
    <NavigationContext.Provider value={{ userRole }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};