import {
  Bell,
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  Plus,
  UserPlus,
  School,
  User,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
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
      title: 'Pending Verifications',
      value: '23',
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'Student Added',
      name: 'Alice Johnson',
      school: 'Lincoln Elementary',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'Professor Added',
      name: 'Dr. Smith',
      school: 'Washington High',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'Student Added',
      name: 'Bob Wilson',
      school: 'Roosevelt Middle',
      time: '6 hours ago',
    },
    {
      id: 4,
      type: 'Professor Added',
      name: 'Ms. Davis',
      school: 'Lincoln Elementary',
      time: '1 day ago',
    },
    {
      id: 5,
      type: 'Student Added',
      name: 'Carol Brown',
      school: 'Washington High',
      time: '1 day ago',
    },
  ]

  const quickActions = [
    {
      title: 'Add Student',
      icon: UserPlus,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Add Professor',
      icon: GraduationCap,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Create Class',
      icon: BookOpen,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Invite Admin',
      icon: Plus,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EduEscola</span>
            </div>

            <Select defaultValue="lincoln">
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lincoln">Lincoln Elementary</SelectItem>
                <SelectItem value="washington">
                  Washington High School
                </SelectItem>
                <SelectItem value="roosevelt">
                  Roosevelt Middle School
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile">View Profile</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Painel do Administrador
          </h1>
          <p className="text-gray-600">Bem-vindo de volta, Administrador</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Table */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {activity.type}
                      </TableCell>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>{activity.school}</TableCell>
                      <TableCell className="text-gray-500">
                        {activity.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  className={`w-full justify-start text-white ${action.color} transition-colors duration-200`}
                  size="lg"
                >
                  <action.icon className="h-5 w-5 mr-2" />
                  {action.title}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
