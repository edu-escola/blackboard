import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  ChevronDown,
  Users,
} from 'lucide-react'
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
import { DeleteConfirmationDialog } from '@/components/shared'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'

const StudentManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [sideSheetOpen, setSideSheetOpen] = useState(false)
  const [newStudentModalOpen, setNewStudentModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [academicDetailsModalOpen, setAcademicDetailsModalOpen] =
    useState(false)
  const [selectedStudentForAcademic, setSelectedStudentForAcademic] =
    useState<any>(null)
  const [openAccordions, setOpenAccordions] = useState<string[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    registrationNumber: '',
    registrationDate: '',
    periodId: '',
    classId: '',
    status: 'active',
    enrollmentStatus: '',
    enrollmentDate: '',
    guardianName: '',
    guardianPhone: '',
    guardianAddress: '',
  })

  const [editForm, setEditForm] = useState({
    name: '',
    classId: '',
    address: '',
    parentName: '',
    parentPhone: '',
    enrollmentDate: '',
    registrationDate: '',
    periodId: '',
    enrollmentStatus: '',
    enrollmentNumber: '',
    status: '',
  })

  const subjects = [
    'Matemática',
    'Ciências',
    'Inglês',
    'História',
    'Física',
    'Química',
    'Artes',
    'Educação Física',
    'Música',
  ]

  const toggleAccordion = (subject: string) => {
    setOpenAccordions((prev) =>
      prev.includes(subject)
        ? prev.filter((item) => item !== subject)
        : [...prev, subject]
    )
  }

  // Mock data para notas e faltas por matéria e bimestre
  const getAcademicData = (subject: string) => {
    const bimesters = [
      { id: 1, name: '1° Bimestre' },
      { id: 2, name: '2° Bimestre' },
      { id: 3, name: '3° Bimestre' },
      { id: 4, name: '4° Bimestre' },
    ]

    return bimesters.map((bimester) => ({
      bimestre: bimester.name,
      nota: Math.floor(Math.random() * 4) + 6, // Nota entre 6-10
      faltas: Math.floor(Math.random() * 8) + 1, // 1-8 faltas
      faltasCompensadas: Math.floor(Math.random() * 3), // 0-2 faltas compensadas
      aulasDadas: Math.floor(Math.random() * 10) + 15, // 15-25 aulas dadas
      aulasPrevistas: 20, // 20 aulas previstas por bimestre
    }))
  }

  const enrollmentStatuss = {
    TR: 'Transferência recebida (foi transferido de outra escola para essa)',
    RM: 'Mudança de sala (apenas mudou de sala)',
    TE: 'Transferência emitida (foi transferido para outra escola)',
    AB: 'Abandono/Baixa (abandono/baixa)',
  } as const

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    const matchesClass =
      classFilter === 'all' || student.class?.name === classFilter
    return matchesSearch && matchesClass
  })

  const handleRowClick = (student: any) => {
    setSelectedStudent(student)
    setSideSheetOpen(true)
  }

  const handleDeleteClick = (e: React.MouseEvent, student: any) => {
    e.stopPropagation()
    setStudentToDelete(student)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (e: React.MouseEvent, student: any) => {
    e.stopPropagation()
    setEditingStudent(student)

    setEditForm({
      name: student.name,
      classId: student.class?.id,
      address: student.guardianAddress,
      parentName: student.guardianName,
      parentPhone: student.guardianPhone,
      registrationDate: formatDateForInput(student.registrationDate),
      periodId: student.period?.id,
      enrollmentStatus: student.enrollmentStatus,
      enrollmentDate: formatDateForInput(student.enrollmentDate),
      enrollmentNumber: student.registrationNumber,
      status: student.status,
    })
    setEditModalOpen(true)
  }

  const handleAcademicDetailsClick = (e: React.MouseEvent, student: any) => {
    e.stopPropagation()
    setSelectedStudentForAcademic(student)
    setAcademicDetailsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/students/${studentToDelete.id}`)
      getStudents()
    } catch (error) {
    } finally {
      setDeleteDialogOpen(false)
      setStudentToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setStudentToDelete(null)
  }

  const handleSaveEdit = async () => {
    try {
      await api.put(`/students/${editingStudent.id}`, {
        name: editForm.name,
        registrationNumber: editForm.enrollmentNumber,
        guardianName: editForm.parentName,
        guardianPhone: editForm.parentPhone,
        guardianAddress: editForm.address,
        enrollmentStatus: editForm.enrollmentStatus,
        enrollmentDate: editForm.enrollmentDate
          ? new Date(editForm.enrollmentDate).toISOString()
          : undefined,
        registrationDate: editForm.registrationDate
          ? new Date(editForm.registrationDate).toISOString()
          : undefined,
        periodId: editForm.periodId,
        classId: editForm.classId,
        status: editForm.status,
      })
      getStudents()
    } catch (error) {
    } finally {
      setEditModalOpen(false)
      setEditingStudent(null)
      setEditForm({
        name: '',
        classId: '',
        address: '',
        parentName: '',
        parentPhone: '',
        periodId: '',
        enrollmentStatus: '',
        registrationDate: '',
        enrollmentDate: '',
        enrollmentNumber: '',
        status: '',
      })
    }
  }

  const handleCancelEdit = () => {
    setEditModalOpen(false)
    setEditingStudent(null)
    setEditForm({
      name: '',
      classId: '',
      address: '',
      parentName: '',
      parentPhone: '',
      enrollmentDate: '',
      registrationDate: '',
      periodId: '',
      enrollmentStatus: '',
      enrollmentNumber: '',
      status: '',
    })
  }

  const handleCreateStudent = async () => {
    // Validação só dos obrigatórios
    if (
      !newStudentForm.name.trim() ||
      !newStudentForm.registrationNumber.trim() ||
      !newStudentForm.registrationDate ||
      !newStudentForm.periodId ||
      !newStudentForm.classId
    ) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    try {
      setLoading(true)
      const studentData = {
        ...newStudentForm,
        enrollmentDate: newStudentForm.enrollmentDate
          ? new Date(newStudentForm.enrollmentDate).toISOString()
          : undefined,
        registrationDate: new Date(newStudentForm.registrationDate).toISOString(),
      }
      await api.post('/students', studentData)
      getStudents()
      setNewStudentForm({
        name: '',
        registrationNumber: '',
        registrationDate: '',
        periodId: '',
        classId: '',
        status: 'active',
        enrollmentStatus: '',
        enrollmentDate: '',
        guardianName: '',
        guardianPhone: '',
        guardianAddress: '',
      })
      setNewStudentModalOpen(false)
    } catch (error) {
      setError('Erro ao criar aluno')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelCreate = () => {
    setNewStudentModalOpen(false)
    setNewStudentForm({
      name: '',
      registrationNumber: '',
      registrationDate: '',
      periodId: '',
      classId: '',
      status: 'active',
      enrollmentStatus: '',
      enrollmentDate: '',
      guardianName: '',
      guardianPhone: '',
      guardianAddress: '',
    })
  }

  const formatDateForInput = (dateString: string | Date | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const getClasses = async () => {
    try {
      const response = await api.get('/classes')
      setClasses(response.data.data || [])
    } catch (err) {
      console.error('Error fetching classes:', err)
    }
  }

  const getPeriods = async () => {
    try {
      const response = await api.get('/periods')
      setPeriods(response.data.data || [])
    } catch (err) {
      console.error('Error fetching periods:', err)
    }
  }

  const getStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/students')
      setStudents(response.data.data || [])
    } catch (err: any) {
      console.error('Error fetching students:', err)
      setError(
        err.response?.data?.error || err.message || 'Erro ao carregar alunos'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getClasses()
    getPeriods()
    getStudents()
  }, [])

  const getStatusColor = (status: string) => {
    return status === 'active'
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
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Turmas</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
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
                  <TableHead>Turma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Carregando alunos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-red-600"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || classFilter !== 'all'
                              ? 'Nenhum aluno encontrado'
                              : 'Nenhum aluno cadastrado'}
                          </h3>
                          <p className="text-gray-500 mb-4">
                            {searchTerm || classFilter !== 'all'
                              ? 'Tente ajustar os filtros de busca ou turma.'
                              : 'Cadastre o primeiro aluno para começar a gerenciar a lista de estudantes.'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(student)}
                    >
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {student.registrationNumber}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {student.class?.name || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) =>
                              handleAcademicDetailsClick(e, student)
                            }
                            title="Detalhes Acadêmicos"
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditClick(e, student)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteClick(e, student)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                    {selectedStudent.registrationNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Data de Matrícula
                  </Label>
                  <p className="text-sm mt-1">
                    {selectedStudent.registrationDate
                      ? new Date(
                          selectedStudent.registrationDate
                        ).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Período</Label>
                  <p className="text-sm mt-1">
                    {selectedStudent.period?.name || '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Turma</Label>
                  <p className="text-sm mt-1">
                    {selectedStudent.class?.name || '-'}
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
                <div>
                  <Label className="text-sm font-medium">
                    Situação do Aluno
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    {selectedStudent.enrollmentStatus && (
                      <span
                        className="inline-block cursor-help"
                        title={
                          enrollmentStatuss[
                            (selectedStudent.enrollmentStatus as keyof typeof enrollmentStatuss) ||
                              'TR'
                          ]
                        }
                      >
                        <Badge variant="outline">
                          {selectedStudent.enrollmentStatus}
                        </Badge>
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {selectedStudent.enrollmentDate
                        ? `(${new Date(selectedStudent.enrollmentDate).toLocaleDateString('pt-BR')})`
                        : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Endereço</Label>
                  <p className="text-sm mt-1">
                    {selectedStudent.guardianAddress || '-'}
                  </p>
                </div>
              </div>

              {/* Parent Info */}
              <div className="space-y-3">
                <h4 className="font-medium">Informações dos Responsáveis</h4>
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm mt-1">
                    {selectedStudent.guardianName || '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm mt-1">
                    {selectedStudent.guardianPhone || '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Student Modal */}
      <Dialog open={newStudentModalOpen} onOpenChange={setNewStudentModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            <DialogDescription>Crie um novo perfil de aluno.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primeira linha: Nome e Turma */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  placeholder="João Silva"
                  value={newStudentForm.name}
                  onChange={(e) =>
                    setNewStudentForm({
                      ...newStudentForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Turma *</Label>
                <Select
                  value={newStudentForm.classId}
                  onValueChange={(value) =>
                    setNewStudentForm({ ...newStudentForm, classId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Segunda linha: Período e Status */}
              <div className="space-y-2">
                <Label htmlFor="period">Período *</Label>
                <Select
                  value={newStudentForm.periodId}
                  onValueChange={(value) =>
                    setNewStudentForm({ ...newStudentForm, periodId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={newStudentForm.status || 'active'}
                  onValueChange={(value) =>
                    setNewStudentForm({ ...newStudentForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Terceira linha: Matrícula e Data da Matrícula */}
              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Número de Matrícula *</Label>
                <Input
                  id="enrollmentNumber"
                  placeholder="LN2024001"
                  value={newStudentForm.registrationNumber}
                  onChange={(e) =>
                    setNewStudentForm({
                      ...newStudentForm,
                      registrationNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Data da Matrícula *</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={newStudentForm.registrationDate}
                  onChange={(e) =>
                    setNewStudentForm({
                      ...newStudentForm,
                      registrationDate: e.target.value,
                    })
                  }
                />
              </div>
              {/* Quarta linha: Situação do Aluno e Data da Situação */}
              <div className="space-y-2">
                <Label htmlFor="enrollmentStatus">Situação do Aluno</Label>
                <Select
                  value={newStudentForm.enrollmentStatus}
                  onValueChange={(value) =>
                    setNewStudentForm({
                      ...newStudentForm,
                      enrollmentStatus: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(enrollmentStatuss).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Data da Situação</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={newStudentForm.enrollmentDate}
                  onChange={(e) =>
                    setNewStudentForm({
                      ...newStudentForm,
                      enrollmentDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {/* Responsável */}
            <div className="col-span-2 border-t pt-4 mb-2">
              <h4 className="font-medium mb-2">Dados do Responsável</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Nome do Responsável</Label>
                  <Input
                    id="parentName"
                    placeholder="Maria da Silva"
                    value={newStudentForm.guardianName}
                    onChange={(e) =>
                      setNewStudentForm({
                        ...newStudentForm,
                        guardianName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Telefone do Responsável</Label>
                  <Input
                    id="parentPhone"
                    placeholder="(99) 99999-9999"
                    value={newStudentForm.guardianPhone}
                    onChange={(e) =>
                      setNewStudentForm({
                        ...newStudentForm,
                        guardianPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <textarea
                id="address"
                placeholder="Rua Exemplo, 123, Bairro, Cidade"
                className="w-full min-h-[60px] border rounded-md p-2 text-sm"
                value={newStudentForm.guardianAddress}
                onChange={(e) =>
                  setNewStudentForm({
                    ...newStudentForm,
                    guardianAddress: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCancelCreate}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateStudent}
                disabled={loading}
                type="button"
              >
                {loading ? 'Criando...' : 'Criar Aluno'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription>
              Edite as informações do aluno.
            </DialogDescription>
          </DialogHeader>
          {editForm && (
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primeira linha: Nome e Turma */}
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome Completo</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-class">Turma</Label>
                  <Select
                    value={editForm.classId}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, classId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Segunda linha: Período e Status */}
                <div className="space-y-2">
                  <Label htmlFor="edit-period">Período</Label>
                  <Select
                    value={editForm.periodId}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, periodId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status || 'active'}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Terceira linha: Matrícula e Data da Matrícula */}
                <div className="space-y-2">
                  <Label htmlFor="edit-enrollmentNumber">Número de Matrícula</Label>
                  <Input
                    id="edit-enrollmentNumber"
                    value={editForm.enrollmentNumber || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        enrollmentNumber: e.target.value,
                      })
                    }
                    placeholder="Digite o número de matrícula"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-registrationDate">Data da Matrícula</Label>
                  <Input
                    id="edit-registrationDate"
                    type="date"
                    value={editForm.registrationDate}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        registrationDate: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Quarta linha: Situação do Aluno e Data da Situação */}
                <div className="space-y-2">
                  <Label htmlFor="edit-enrollmentStatus">Situação do Aluno</Label>
                  <Select
                    value={editForm.enrollmentStatus}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, enrollmentStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(enrollmentStatuss).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-enrollmentDate">Data da Situação</Label>
                  <Input
                    id="edit-enrollmentDate"
                    type="date"
                    value={editForm.enrollmentDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, enrollmentDate: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* Responsável e endereço permanecem como estão */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-address">Endereço</Label>
                <textarea
                  id="edit-address"
                  className="w-full min-h-[60px] border rounded-md p-2 text-sm"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  placeholder="Digite o endereço completo"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  type="button"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir o aluno"
        itemName={studentToDelete?.name}
        loading={loading}
      />

      {/* Academic Details Modal */}
      <Dialog
        open={academicDetailsModalOpen}
        onOpenChange={setAcademicDetailsModalOpen}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes Acadêmicos</DialogTitle>
            <DialogDescription>
              Informações acadêmicas completas do aluno
            </DialogDescription>
          </DialogHeader>

          {selectedStudentForAcademic && (
            <div className="space-y-6">
              {/* Header do aluno */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedStudentForAcademic.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Matrícula: {selectedStudentForAcademic.registrationNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Turma: {selectedStudentForAcademic.class?.name || '-'}
                </p>
              </div>

              {/* Accordion de Matérias */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Disciplinas e Notas
                </h4>

                {subjects.map((subject) => (
                  <div key={subject} className="border rounded-lg">
                    <button
                      onClick={() => toggleAccordion(subject)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {subject}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          openAccordions.includes(subject) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {openAccordions.includes(subject) && (
                      <div className="px-4 pb-4 border-t">
                        <div className="pt-4">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-center">
                                    Bimestre
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Nota
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Faltas
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Faltas Compensadas
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Aulas Dadas
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Aulas Previstas
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getAcademicData(subject).map((data, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="text-center font-medium">
                                      {data.bimestre}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge
                                        variant={
                                          data.nota >= 7
                                            ? 'default'
                                            : 'destructive'
                                        }
                                        className="font-mono"
                                      >
                                        {data.nota}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge
                                        variant="outline"
                                        className="font-mono"
                                      >
                                        {data.faltas}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge
                                        variant="secondary"
                                        className="font-mono"
                                      >
                                        {data.faltasCompensadas}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-mono">
                                      {data.aulasDadas}
                                    </TableCell>
                                    <TableCell className="text-center font-mono">
                                      {data.aulasPrevistas}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setAcademicDetailsModalOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StudentManagement
