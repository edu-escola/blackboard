import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, GraduationCap, ArrowRight, Shield, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header, LogoutButton } from '@/components/shared'

const DashboardSelection = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<
    'admin' | 'professor' | null
  >(null)

  const handleContinue = () => {
    if (selectedRole === 'admin') {
      window.location.href = '/admin/dashboard'
    } else if (selectedRole === 'professor') {
      window.location.href = '/professor/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Selecione seu Painel
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Você tem acesso tanto ao painel de administrador quanto ao painel de
            professor. Escolha qual painel deseja acessar:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Painel de Administrador */}
          <Card
            className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'admin'
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedRole('admin')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Painel de Administrador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Gerencie usuários, turmas, escolas e visualize relatórios do
                  sistema
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>Gerenciar Administradores</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                    <span>Gerenciar Professores</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <span>Gerenciar Alunos</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="h-4 w-4 text-orange-600" />
                    <span>Turmas e Salas</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Painel de Professor */}
          <Card
            className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'professor'
                ? 'border-green-500 bg-green-50 shadow-lg'
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setSelectedRole('professor')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Painel de Professor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Registre presenças, planeje aulas e avalie seus alunos
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span>Registrar Presença</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>Planejar Aulas</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span>Avaliar Alunos</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="h-4 w-4 text-orange-600" />
                    <span>Ver Relatórios</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed px-8 py-3 text-base font-medium"
          >
            <span>Continuar</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <LogoutButton
            variant="outline"
            className="px-8 py-3 text-base font-medium border-gray-300 hover:bg-gray-50"
          >
            Sair
          </LogoutButton>
        </div>

        {/* Informação adicional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Você pode alternar entre os painéis a qualquer momento através do
            menu de navegação
          </p>
        </div>
      </main>
    </div>
  )
}

export default DashboardSelection
