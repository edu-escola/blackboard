
import { GraduationCap } from "lucide-react";

const LoadingSplash = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl animate-pulse">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">EduCity</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-lg text-gray-700 font-medium">Entrando…</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;
