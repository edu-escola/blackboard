import { useState } from 'react'
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Users,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useNavigate } from 'react-router-dom'

const ProfessorManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [selectedProfessor, setSelectedProfessor] = useState<any>(null)
  const [sideSheetOpen, setSideSheetOpen] = useState(false)
  const [newProfessorModalOpen, setNewProfessorModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState(1)

  // Mock data
  const schools = [
    { id: 'lincoln', name: 'Lincoln Elementary' },
    { id: 'washington', name: 'Washington High School' },
    { id: 'roosevelt', name: 'Roosevelt Middle School' },
    { id: 'jefferson', name: 'Jefferson Academy' },
  ]

  const subjects = [
    'Matemática',
    'Ciências',
    'Inglês',
    'História',
    'Artes',
    'Educação Física',
    'Música',
  ]

  const professors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@lincoln.edu',
      phone: '+1 (555) 123-4567',
      schools: ['Lincoln Elementary', 'Roosevelt Middle School'],
      subjects: ['Matemática', 'Ciências'],
      classes: 8,
      status: 'Ativo',
      joinDate: '2019-08-15',
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'm.chen@washington.edu',
      phone: '+1 (555) 234-5678',
      schools: ['Washington High School'],
      subjects: ['Inglês', 'História'],
      classes: 12,
      status: 'Ativo',
      joinDate: '2020-01-10',
    },
    {
      id: 3,
      name: 'Ms. Emily Rodriguez',
      email: 'emily.r@jefferson.edu',
      phone: '+1 (555) 345-6789',
      schools: ['Jefferson Academy'],
      subjects: ['Artes', 'Música'],
      classes: 6,
      status: 'Inativo',
      joinDate: '2021-03-22',
    },
  ]

  const filteredProfessors = professors.filter((professor) => {
    const matchesSearch =
      professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool =
      schoolFilter === 'all' ||
      professor.schools.some(
        (school) => schools.find((s) => s.id === schoolFilter)?.name === school
      )
    return matchesSearch && matchesSchool
  })

  const handleRowClick = (professor: any) => {
    setSelectedProfessor(professor)
    setSideSheetOpen(true)
  }

  const handleNewProfessor = () => {
    setModalStep(1)
    setNewProfessorModalOpen(true)
  }

  const nextStep = () => setModalStep(2)
  const prevStep = () => setModalStep(1)

  const getStatusColor = (status: string) => {
    return status === 'Active'
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
            <h1 className="text-2xl font-bold text-gray-900">Professores</h1>
          </div>
          <Button
            onClick={handleNewProfessor}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Professor
          </Button>
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
                  placeholder="Pesquise professores por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por escola" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Escolas</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Professors Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Escolas</TableHead>
                  <TableHead>Matérias</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.map((professor) => (
                  <TableRow
                    key={professor.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(professor)}
                  >
                    <TableCell className="font-medium">
                      {professor.name}
                    </TableCell>
                    <TableCell>{professor.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {professor.schools.map((school, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {school}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {professor.subjects.map((subject, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{professor.classes}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(professor.status)}>
                        {professor.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Professor Detail Side Sheet */}
      <Sheet open={sideSheetOpen} onOpenChange={setSideSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{selectedProfessor?.name}</SheetTitle>
            <SheetDescription>Perfil e gestão do professor</SheetDescription>
          </SheetHeader>

          {selectedProfessor && (
            <div className="space-y-6 mt-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedProfessor.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedProfessor.phone}</span>
                </div>
              </div>

              {/* Schools */}
              <div>
                <h4 className="font-medium mb-2">Escolas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfessor.schools.map(
                    (school: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {school}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h4 className="font-medium mb-2">Matérias</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfessor.subjects.map(
                    (subject: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {subject}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t">
                <Button className="w-full" variant="outline">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Atribuir escola
                </Button>
                <Button className="w-full" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Atribuir assunto
                </Button>
                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
                <Button className="w-full" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Professor
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Professor Modal */}
      <Dialog
        open={newProfessorModalOpen}
        onOpenChange={setNewProfessorModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Professor</DialogTitle>
            <DialogDescription>
              Crie um novo perfil de professor e atribua escolas e disciplinas.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={`step-${modalStep}`} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="step-1" disabled={modalStep < 1}>
                Informações pessoais
              </TabsTrigger>
              <TabsTrigger value="step-2" disabled={modalStep < 2}>
                Atribuição
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step-1" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Dr. John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@school.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="flex justify-end">
                <Button onClick={nextStep}>Próximo passo</Button>
              </div>
            </TabsContent>

            <TabsContent value="step-2" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Atribuir Escolas</Label>
                <div className="space-y-2">
                  {schools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={school.id}
                        className="rounded border-gray-300"
                      />
                      <Label
                        htmlFor={school.id}
                        className="text-sm font-normal"
                      >
                        {school.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assign Subjects</Label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={subject}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={subject} className="text-sm font-normal">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
                <Button onClick={() => setNewProfessorModalOpen(false)}>
                  Criar Professor
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfessorManagement
