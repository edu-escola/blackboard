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
import { DeleteConfirmationDialog } from '@/components/shared'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const StudentManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [classFilter, setClassFilter] = useState<string | undefined>(undefined)
  const [periodFilter, setPeriodFilter] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [sideSheetOpen, setSideSheetOpen] = useState(false)
  const [newStudentModalOpen, setNewStudentModalOpen] = useState(false)
  const [editStudentModalOpen, setEditStudentModalOpen] = useState(false)
  const [editStudent, setEditStudent] = useState<any>(null)

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

  const periods = ['Manhã', 'Tarde', 'Noite', 'Integral']

  const studentSituations = {
    TR: 'Transferência recebida (foi transferido de outra escola para essa)',
    RM: 'Mudança de sala (apenas mudou de sala)',
    TE: 'Transferência emitida (foi transferido para outra escola)',
    AB: 'Abandono/Baixa (abandono/baixa)',
  } as const

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
      studentSituation: 'TR',
      situationDate: '2024-08-20',
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
      studentSituation: 'RM',
      situationDate: '2024-09-01',
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
      studentSituation: 'TE',
      situationDate: '2024-10-10',
    },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool =
      schoolFilter === 'all' ||
      schools.find((s) => s.id === schoolFilter)?.name === student.school
    const matchesClass = !classFilter || student.class === classFilter
    const matchesPeriod = !periodFilter || periods.includes(periodFilter) // Ajuste se necessário
    const matchesStatus = !statusFilter || student.status === statusFilter
    return matchesSearch && matchesSchool && matchesClass && matchesPeriod && matchesStatus
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
      status: student.status,
      class: student.class,
      address: student.address,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
    })
    setEditModalOpen(true)
  }

  const handleConfirmDelete = () => {
    // Aqui você implementaria a lógica para deletar o aluno
    console.log('Deletando aluno:', studentToDelete)
    setDeleteDialogOpen(false)
    setStudentToDelete(null)
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setStudentToDelete(null)
  }

  const handleSaveEdit = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Salvando alterações:', editForm)
    setEditModalOpen(false)
    setEditingStudent(null)
    setEditForm({
      name: '',
      status: '',
      class: '',
      address: '',
      parentName: '',
      parentPhone: '',
    })
  }

  const handleCancelEdit = () => {
    setEditModalOpen(false)
    setEditingStudent(null)
    setEditForm({
      name: '',
      status: '',
      class: '',
      address: '',
      parentName: '',
      parentPhone: '',
    })
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
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
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
                  <TableHead>Ações</TableHead>
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
                    <TableCell>
                      <Badge variant="secondary">{student.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            setEditStudent(student);
                            setEditStudentModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => { e.stopPropagation(); /* handler remover */ }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Matrícula</Label>
                    <p className="text-sm font-mono mt-1">
                      {selectedStudent.enrollmentNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Data de Matrícula</Label>
                    <p className="text-sm mt-1">
                      {selectedStudent.enrollmentDate ? new Date(selectedStudent.enrollmentDate).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedStudent.status)}>
                        {selectedStudent.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Situação do Aluno</Label>
                    <div className="mt-1 flex items-center gap-2">
                      {selectedStudent.studentSituation && (
                        <span
                          className="inline-block cursor-help"
                          title={studentSituations[(selectedStudent.studentSituation as keyof typeof studentSituations) || 'TR']}
                        >
                          <Badge variant="outline">
                            {selectedStudent.studentSituation}
                          </Badge>
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {selectedStudent.situationDate ? `(${new Date(selectedStudent.situationDate).toLocaleDateString()})` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">               
                <div>
                  <Label className="text-sm font-medium">Endereço</Label>
                  <p className="text-sm mt-1">{selectedStudent.address}</p>
                </div>
              </div>

              {/* Academic Info */}
              <div className="space-y-3">                
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
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input id="fullName" placeholder="João Silva" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentNumber">Número de Matrícula</Label>
              <Input id="enrollmentNumber" placeholder="LN2024001" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Data da Matrícula</Label>
              <Input id="enrollmentDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
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

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <textarea id="address" placeholder="Rua Exemplo, 123, Bairro, Cidade" className="w-full min-h-[60px] border rounded-md p-2 text-sm" />
            </div>

            <div className="space-y-2 border-t pt-4">
              <h4 className="font-medium">Responsável</h4>
              <div className="space-y-2">
                <Label htmlFor="parentName">Nome do Responsável</Label>
                <Input id="parentName" placeholder="Maria da Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Telefone do Responsável</Label>
                <Input id="parentPhone" placeholder="(99) 99999-9999" />
              </div>
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

      {/* Edit Student Modal */}
      <Dialog open={editStudentModalOpen} onOpenChange={setEditStudentModalOpen}>
        <DialogContent className="max-w-xs sm:max-w-sm p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription>Edite os dados do aluno.</DialogDescription>
          </DialogHeader>
          {editStudent && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-6 pb-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="editFullName">Nome Completo</Label>
                <Input id="editFullName" value={editStudent.name} onChange={e => setEditStudent({ ...editStudent, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEnrollmentNumber">Número de Matrícula</Label>
                <Input id="editEnrollmentNumber" value={editStudent.enrollmentNumber} onChange={e => setEditStudent({ ...editStudent, enrollmentNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEnrollmentDate">Data da Matrícula</Label>
                <Input id="editEnrollmentDate" type="date" value={editStudent.enrollmentDate} onChange={e => setEditStudent({ ...editStudent, enrollmentDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPeriod">Período</Label>
                <Select value={editStudent.period || ''} onValueChange={value => setEditStudent({ ...editStudent, period: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period} value={period}>{period}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClass">Turma</Label>
                <Select value={editStudent.class || ''} onValueChange={value => setEditStudent({ ...editStudent, class: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAddress">Endereço</Label>
                <textarea id="editAddress" className="w-full min-h-[60px] border rounded-md p-2 text-sm" value={editStudent.address} onChange={e => setEditStudent({ ...editStudent, address: e.target.value })} />
              </div>
              <div className="space-y-2 border-t pt-4">
                <h4 className="font-medium">Responsável</h4>
                <div className="space-y-2">
                  <Label htmlFor="editParentName">Nome do Responsável</Label>
                  <Input id="editParentName" value={editStudent.parentName} onChange={e => setEditStudent({ ...editStudent, parentName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editParentPhone">Telefone do Responsável</Label>
                  <Input id="editParentPhone" value={editStudent.parentPhone} onChange={e => setEditStudent({ ...editStudent, parentPhone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select value={editStudent.status || ''} onValueChange={value => setEditStudent({ ...editStudent, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSituation">Situação do Aluno</Label>
                <Select value={editStudent.studentSituation || ''} onValueChange={value => setEditStudent({ ...editStudent, studentSituation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(studentSituations).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSituationDate">Data da Situação</Label>
                <Input id="editSituationDate" type="date" value={editStudent.situationDate || ''} onChange={e => setEditStudent({ ...editStudent, situationDate: e.target.value })} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditStudentModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setEditStudentModalOpen(false)}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StudentManagement
