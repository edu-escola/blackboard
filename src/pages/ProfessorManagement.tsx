import { useState } from 'react'
import {
  Search,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeleteConfirmationDialog } from '@/components/shared'
import { useNavigate } from 'react-router-dom'

const ProfessorManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfessor, setSelectedProfessor] = useState<any>(null)
  const [sideSheetOpen, setSideSheetOpen] = useState(false)
  const [newProfessorModalOpen, setNewProfessorModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [professorToDelete, setProfessorToDelete] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingProfessor, setEditingProfessor] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    status: '',
  })

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
    return matchesSearch
  })

  const handleRowClick = (professor: any) => {
    setSelectedProfessor(professor)
    setSideSheetOpen(true)
  }

  const handleNewProfessor = () => {
    setNewProfessorModalOpen(true)
  }

  const handleDeleteClick = (e: React.MouseEvent, professor: any) => {
    e.stopPropagation()
    setProfessorToDelete(professor)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (e: React.MouseEvent, professor: any) => {
    e.stopPropagation()
    setEditingProfessor(professor)
    setEditForm({
      name: professor.name,
      email: professor.email,
      status: professor.status,
    })
    setEditModalOpen(true)
  }

  const handleConfirmDelete = () => {
    // Aqui você implementaria a lógica para deletar o professor
    console.log('Deletando professor:', professorToDelete)
    setDeleteDialogOpen(false)
    setProfessorToDelete(null)
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setProfessorToDelete(null)
  }

  const handleSaveEdit = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Salvando alterações:', editForm)
    setEditModalOpen(false)
    setEditingProfessor(null)
    setEditForm({ name: '', email: '', status: '' })
  }

  const handleCancelEdit = () => {
    setEditModalOpen(false)
    setEditingProfessor(null)
    setEditForm({ name: '', email: '', status: '' })
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
                  <TableHead>Matérias</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
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
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEditClick(e, professor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(e, professor)}
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

          <div className="space-y-4 mt-4">
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
              <Label>Matérias</Label>
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
            <div className="flex justify-end">
              <Button onClick={() => setNewProfessorModalOpen(false)}>
                Criar Professor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Professor Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Professor</DialogTitle>
            <DialogDescription>
              Edite as informações do professor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: value })
                }
              >
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
              <Label>Matérias</Label>
              <div className="grid grid-cols-2 gap-2">
                {subjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${subject}`}
                      className="rounded border-gray-300"
                    />
                    <Label
                      htmlFor={`edit-${subject}`}
                      className="text-sm font-normal"
                    >
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir o professor"
        itemName={professorToDelete?.name}
      />
    </div>
  )
}

export default ProfessorManagement
