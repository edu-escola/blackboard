import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServerError = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 500 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 select-none">
              500
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="h-16 w-16 text-red-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 leading-relaxed">
            We're experiencing some technical difficulties. Our team has been 
            notified and we're working to fix this as soon as possible.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleReturnHome}
            className="w-full"
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Dashboard
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Error Code:</strong> 500 - Internal Server Error
          </p>
          <p className="text-sm text-gray-500 mt-2">
            If this problem persists, please contact technical support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;