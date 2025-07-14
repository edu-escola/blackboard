import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, FileEdit, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/shared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ProfessorDashboard = () => {
  const navigate = useNavigate()
  const [greeting, setGreeting] = useState('')
  const [selectedSchool, setSelectedSchool] = useState(() => {
    const savedSchool = localStorage.getItem('selectedSchool')
    return savedSchool || 'lincoln'
  })

  // Mock professor data
  const professor = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    title: 'Dr.',
  }

  // Mock schools data
  const schools = [
    { id: 'lincoln', name: 'Lincoln Elementary' },
    { id: 'washington', name: 'Washington High School' },
    { id: 'roosevelt', name: 'Roosevelt Middle School' },
  ]

  // Mock upcoming lessons data
  const upcomingLessons = [
    {
      id: 1,
      class: '1-A',
      subject: 'Algebra Fundamental',
      date: '2024-01-15',
      time: '09:00 AM',
      students: 28,
      room: 'Sala A101',
    },
    {
      id: 2,
      class: '1-A',
      subject: 'Geometria Básica',
      date: '2024-01-16',
      time: '10:30 AM',
      students: 28,
      room: 'Sala A101',
    },
    {
      id: 3,
      class: '2-B',
      subject: 'Reações Químicas',
      date: '2024-01-17',
      time: '02:00 PM',
      students: 22,
      room: 'Sala B201',
    },
    {
      id: 4,
      class: '3-C',
      subject: 'Resolução de problemas',
      date: '2024-01-18',
      time: '09:00 AM',
      students: 28,
      room: 'Sala A101',
    },
    {
      id: 5,
      class: '3-B',
      subject: 'Segurança de laboratório',
      date: '2024-01-19',
      time: '02:00 PM',
      students: 22,
      room: 'Sala B201',
    },
  ]

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Bom dia')
    } else if (hour < 18) {
      setGreeting('Boa tarde')
    } else {
      setGreeting('Boa noite')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Greeting and School Selector */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting}, {professor.title} {professor.lastName}
              </h1>
              <p className="text-gray-600">
                Veja o que está acontecendo com suas turmas hoje
              </p>
            </div>

            <div>
              <Select
                value={selectedSchool}
                onValueChange={(value) => {
                  setSelectedSchool(value)
                  localStorage.setItem('selectedSchool', value)
                }}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Action Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Ações Rápidas
              </h3>

              <Card
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate('/professor/attendance')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ClipboardCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Registrar Presença
                      </h4>
                      <p className="text-sm text-gray-600">
                        Marque a presença dos alunos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate('/professor/lesson-planner')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileEdit className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Planejar Aulas
                      </h4>
                      <p className="text-sm text-gray-600">
                        Crie planos de aula
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate('/professor/evaluations')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Avaliações
                      </h4>
                      <p className="text-sm text-gray-600">
                        Registre atividades dos alunos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Upcoming Lessons */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Próximas Aulas</CardTitle>
                <p className="text-sm text-gray-600">Próximos 7 dias</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {lesson.class}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {lesson.students} alunos
                        </span>
                      </div>
                      <h4 className="font-medium text-sm text-gray-900">
                        {lesson.subject}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                        <span>
                          {new Date(lesson.date).toLocaleDateString()}
                        </span>
                        <span>{lesson.time}</span>
                        <span>{lesson.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfessorDashboard
