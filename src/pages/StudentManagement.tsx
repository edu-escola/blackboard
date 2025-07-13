import { useState } from 'react'
import { Search, Plus, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useNavigate } from 'react-router-dom'

const StudentManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [sideSheetOpen, setSideSheetOpen] = useState(false)
  const [newStudentModalOpen, setNewStudentModalOpen] = useState(false)

  // Mock data
  const schools = [
    { id: 'lincoln', name: 'Lincoln Elementary' },
    { id: 'washington', name: 'Washington High School' },
    { id: 'roosevelt', name: 'Roosevelt Middle School' },
    { id: 'jefferson', name: 'Jefferson Academy' },
  ]

  const classes = [
    'Turma 1A',
    'Turma 2B',
    'Turma 3C',
    'Turma 4A',
    'Turma 5B',
    'Matemática 101',
    'Ciências 102',
    'Inglês 201',
    'História 301',
  ]

  const students = [
    {
      id: 1,
      name: 'Alice Johnson',
      enrollmentNumber: 'LN2024001',
      email: 'alice.johnson@student.edu',
      phone: '+1 (555) 123-4567',
      school: 'Lincoln Elementary',
      class: 'Turma 3C',
      status: 'Ativo',
      parentName: 'Robert Johnson',
      parentPhone: '+1 (555) 987-6543',
      address: '123 Main St, Springfield, IL',
      enrollmentDate: '2024-08-15',
      dateOfBirth: '2015-05-12',
    },
    {
      id: 2,
      name: 'Bob Wilson',
      enrollmentNumber: 'WH2024002',
      email: 'bob.wilson@student.edu',
      phone: '+1 (555) 234-5678',
      school: 'Washington High School',
      class: 'Math 101',
      status: 'Ativo',
      parentName: 'Susan Wilson',
      parentPhone: '+1 (555) 876-5432',
      address: '456 Oak Ave, Springfield, IL',
      enrollmentDate: '2024-08-20',
      dateOfBirth: '2008-03-18',
    },
    {
      id: 3,
      name: 'Carol Brown',
      enrollmentNumber: 'RM2024003',
      email: 'carol.brown@student.edu',
      phone: '+1 (555) 345-6789',
      school: 'Roosevelt Middle School',
      class: 'Turma 5B',
      status: 'Inativo',
      parentName: 'David Brown',
      parentPhone: '+1 (555) 765-4321',
      address: '789 Pine St, Springfield, IL',
      enrollmentDate: '2024-01-10',
      dateOfBirth: '2013-11-08',
    },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool =
      schoolFilter === 'all' ||
      schools.find((s) => s.id === schoolFilter)?.name === student.school
    const matchesClass = classFilter === 'all' || student.class === classFilter
    return matchesSearch && matchesSchool && matchesClass
  })

  const handleRowClick = (student: any) => {
    setSelectedStudent(student)
    setSideSheetOpen(true)
  }

  const getStatusColor = (status: string) => {
    return status === 'Ativo'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/dashboard')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setNewStudentModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Search and Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquise alunos por nome ou número de matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por escola" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Escolas</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Turmas</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(student)}
                  >
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {student.enrollmentNumber}
                    </TableCell>
                    <TableCell>{student.school}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Student Profile Side Sheet */}
      <Sheet open={sideSheetOpen} onOpenChange={setSideSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{selectedStudent?.name}</SheetTitle>
            <SheetDescription>Perfil do aluno e informações</SheetDescription>
          </SheetHeader>

          {selectedStudent && (
            <div className="space-y-6 mt-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Matrícula</Label>
                  <p className="text-sm font-mono mt-1">
                    {selectedStudent.enrollmentNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedStudent.status)}>
                      {selectedStudent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm mt-1">{selectedStudent.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm mt-1">{selectedStudent.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Endereço</Label>
                  <p className="text-sm mt-1">{selectedStudent.address}</p>
                </div>
              </div>

              {/* Academic Info */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Escola</Label>
                  <p className="text-sm mt-1">{selectedStudent.school}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Turma</Label>
                  <p className="text-sm mt-1">{selectedStudent.class}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Data de Matrícula
                  </Label>
                  <p className="text-sm mt-1">
                    {new Date(
                      selectedStudent.enrollmentDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Parent Info */}
              <div className="space-y-3">
                <h4 className="font-medium">Informações dos Responsáveis</h4>
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm mt-1">{selectedStudent.parentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm mt-1">{selectedStudent.parentPhone}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t">
                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button className="w-full" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Aluno
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Student Modal */}
      <Dialog open={newStudentModalOpen} onOpenChange={setNewStudentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            <DialogDescription>Crie um novo perfil de aluno.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" placeholder="João" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" placeholder="Silva" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentNumber">Número de Matrícula</Label>
              <Input id="enrollmentNumber" placeholder="LN2024001" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentEmail">Email</Label>
              <Input
                id="studentEmail"
                type="email"
                placeholder="john.doe@student.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">Escola</Label>
              <Select>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="class">Turma</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setNewStudentModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setNewStudentModalOpen(false)}>
                Criar Aluno
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StudentManagement
