import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    // Determine where to redirect based on user role
    // For now, we'll redirect to the login page since we don't have user context
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ops! Página não encontrada
          </h1>
          <p className="text-gray-600 leading-relaxed">
            A página que você procura não existe ou foi movida.
            Vamos levá-lo de volta ao início.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleReturnHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Voltar ao Painel
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Precisa de ajuda? Entre em contato com o administrador do sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
