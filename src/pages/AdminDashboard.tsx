import {
  Users,
  GraduationCap,
  BookOpen,
  School,
  User,
  Calendar,
  Printer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/shared'
import { api } from '@/lib'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const getApiHealth = async () => {
    const response = await api.get(`/health`)
    console.log(response)
  }

  getApiHealth()
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total de Estudantes',
      value: '1,234',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Professores',
      value: '89',
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Turma',
      value: '156',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Administradores',
      value: '10',
      icon: User,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Painel do Administrador
          </h1>
          <p className="text-gray-600">Bem-vindo de volta, Administrador</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Button
            onClick={() => navigate('/admin/schools')}
            variant="outline"
            className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <School className="h-4 w-4" />
            <span>Gerenciar Escolas</span>
          </Button>
          <Button
            onClick={() => navigate('/admin/professors')}
            variant="outline"
            className="flex items-center space-x-2 text-green-600 border-green-200 hover:bg-green-50"
          >
            <User className="h-4 w-4" />
            <span>Gerenciar Professores</span>
          </Button>
          <Button
            onClick={() => navigate('/admin/students')}
            variant="outline"
            className="flex items-center space-x-2 text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Users className="h-4 w-4" />
            <span>Gerenciar Alunos</span>
          </Button>
          <Button
            onClick={() => navigate('/admin/classes')}
            variant="outline"
            className="flex items-center space-x-2 text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            <Calendar className="h-4 w-4" />
            <span>Turmas e Horários</span>
          </Button>
          <Button
            onClick={() => navigate('/admin/reports')}
            variant="outline"
            className="flex items-center space-x-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir Presença e Notas</span>
          </Button>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
