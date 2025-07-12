
import { useState } from "react";
import { Mail, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VerificationForm from "./VerificationForm";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleSendCode = async () => {
    if (!isValid) return;
    
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    
    console.log("Verification code sent to:", email);
    setShowVerification(true);
  };

  const handleBackToLogin = () => {
    setShowVerification(false);
    setEmail("");
    setIsValid(false);
  };

  if (showVerification) {
    return <VerificationForm email={email} onBackToLogin={handleBackToLogin} />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">EduCity</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Acesse com seu e-mail corporativo
          </h1>
          <p className="text-sm text-gray-600">
            Digite seu e-mail para receber um código de verificação
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={handleEmailChange}
                className="pl-10 h-12 text-base"
                required
              />
            </div>
            {email && !isValid && (
              <p className="text-sm text-red-600">Insira um e-mail válido</p>
            )}
          </div>

          <Button
            onClick={handleSendCode}
            disabled={!isValid || isSending}
            className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSending ? "Enviando..." : "Enviar código de verificação"}
          </Button>

          <div className="text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
              Está com problemas?
            </button>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2024 EduCity. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
