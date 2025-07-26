import { useEffect, useState } from 'react'
import {
  Search,
  Plus,
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeleteConfirmationDialog } from '@/components/shared'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'

const ProfessorManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfessor, setSelectedProfessor] = useState<any>(null)
  const [sideSheetOpen, setSideSheetOpen] = useState(false)
  const [createProfessorModal, setCreateProfessorModal] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [professorToDelete, setProfessorToDelete] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editProfessor, setEditProfessor] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    status: '',
    subjects: [],
    phone: '',
    classes: [],
  })
  const [professorList, setProfessorList] = useState([])
  const [subjectsList, setSubjectsList] = useState([])
  const [createProfessorForm, setCreateProfessorForm] = useState({
    name: '',
    email: '',
    subjects: [],
    phone: '',
    classes: [],
  })
  const [isCreating, setIsCreating] = useState(false)
  const [classesList, setClassesList] = useState([])

  const getProfessorList = async () => {
    const response = await api.get('/users', {
      params: {
        role: 'teacher',
      },
    })
    setProfessorList(response.data.data)
  }

  const getSubjectsList = async () => {
    const response = await api.get('/subjects')
    setSubjectsList(response.data.data)
  }

  const getClassesList = async () => {
    const response = await api.get('/classes')
    setClassesList(response.data.data)
  }

  useEffect(() => {
    getProfessorList()
    getSubjectsList()
    getClassesList()
  }, [])

  const filterProfessor = professorList.filter((professor) => {
    const name = professor.name || '';
    const email = professor.email || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  })

  const handleRowClick = (professor: any) => {
    setSelectedProfessor(professor)
    setSideSheetOpen(true)
  }

  const handleNewProfessor = () => {
    setCreateProfessorModal(true)
  }

  const handleDeleteClick = (e: React.MouseEvent, professor: any) => {
    e.stopPropagation()
    setProfessorToDelete(professor)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (e: React.MouseEvent, professor: any) => {
    e.stopPropagation()
    setEditProfessor(professor)
    setEditForm({
      name: professor.name,
      email: professor.email,
      status: professor.UserSchool?.[0]?.status,
      phone: professor.phone,
      subjects: professor.UserSubject.map(
        (userSubject: any) => userSubject.subject.id
      ),
      classes: professor.UserClass.map((userClass: any) => userClass.class.id),
    })
    setEditModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await api.delete(`/users/${professorToDelete.id}`)
      getProfessorList()
    } catch (error) {
    } finally {
      setDeleteDialogOpen(false)
      setProfessorToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setProfessorToDelete(null)
  }

  const handleSaveEdit = async () => {
    try {
      await api.put(`/users/${editProfessor.id}`, {
        name: editForm.name,
        email: editForm.email,
        status: editForm.status,
        subjects: editForm.subjects,
        phone: editForm.phone,
        classes: editForm.classes,
      })
      getProfessorList()
    } catch (error) {
    } finally {
      setEditModalOpen(false)
      setEditProfessor(null)
      setEditForm({
        name: '',
        email: '',
        status: '',
        subjects: [],
        phone: '',
        classes: [],
      })
    }
  }

  const handleCancelEdit = () => {
    setEditModalOpen(false)
    setEditProfessor(null)
    setEditForm({
      name: '',
      email: '',
      status: '',
      subjects: [],
      phone: '',
      classes: [],
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Ativo' : 'Inativo'
  }

  const handleCreateProfessor = async () => {
    try {
      setIsCreating(true)
      const response = await api.post('/users', {
        name: createProfessorForm.name,
        email: createProfessorForm.email,
        subjects: createProfessorForm.subjects,
        role: 'teacher',
        phone: createProfessorForm.phone,
        classes: createProfessorForm.classes,
      })
      getProfessorList()
      setCreateProfessorForm({
        name: '',
        email: '',
        subjects: [],
        phone: '',
        classes: [],
      })
      setCreateProfessorModal(false)
    } catch (error) {
    } finally {
      setIsCreating(false)
    }
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
                {filterProfessor.map((professor) => (
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
                        {professor.UserSubject.map((userSubject, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {userSubject.subject.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {professor.UserClass.length}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(professor.UserSchool?.[0]?.status)}>
                        {getStatusText(professor.UserSchool?.[0]?.status)}
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
                  {selectedProfessor.UserSchool?.map(
                    (userSchool: any, index: number) => (
                      <Badge key={index} variant="secondary">
                        {userSchool.school.name}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h4 className="font-medium mb-2">Matérias</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfessor.UserSubject.map(
                    (subject: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {subject.subject.name}
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
        open={createProfessorModal}
        onOpenChange={setCreateProfessorModal}
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
              <Input
                id="name"
                placeholder="Dr. John Doe"
                value={createProfessorForm.name}
                onChange={(e) =>
                  setCreateProfessorForm({
                    ...createProfessorForm,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@school.edu"
                value={createProfessorForm.email}
                onChange={(e) =>
                  setCreateProfessorForm({
                    ...createProfessorForm,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={createProfessorForm.phone}
                onChange={(e) =>
                  setCreateProfessorForm({
                    ...createProfessorForm,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Matérias</Label>
              <div className="grid grid-cols-2 gap-2">
                {subjectsList.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={subject.id}
                      className="rounded border-gray-300"
                      checked={createProfessorForm.subjects.includes(
                        subject.id
                      )}
                      onChange={(e) =>
                        setCreateProfessorForm({
                          ...createProfessorForm,
                          subjects: e.target.checked
                            ? [...createProfessorForm.subjects, subject.id]
                            : createProfessorForm.subjects.filter(
                                (id: string) => id !== subject.id
                              ),
                        })
                      }
                    />
                    <Label htmlFor={subject.id} className="text-sm font-normal">
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Turmas</Label>
              <div className="grid grid-cols-2 gap-2">
                {classesList.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={classItem.id}
                      className="rounded border-gray-300"
                      checked={createProfessorForm.classes.includes(
                        classItem.id
                      )}
                      onChange={(e) =>
                        setCreateProfessorForm({
                          ...createProfessorForm,
                          classes: e.target.checked
                            ? [...createProfessorForm.classes, classItem.id]
                            : createProfessorForm.classes.filter(
                                (id: string) => id !== classItem.id
                              ),
                        })
                      }
                    />
                    <Label
                      htmlFor={classItem.id}
                      className="text-sm font-normal"
                    >
                      {classItem.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateProfessor} disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Professor'}
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
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="(11) 99999-9999"
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
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Matérias</Label>
              <div className="grid grid-cols-2 gap-2">
                {subjectsList.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${subject.id}`}
                      className="rounded border-gray-300"
                      checked={editForm.subjects.includes(subject.id)}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          subjects: e.target.checked
                            ? [...editForm.subjects, subject.id]
                            : editForm.subjects.filter(
                                (id: string) => id !== subject.id
                              ),
                        })
                      }
                    />
                    <Label
                      htmlFor={`edit-${subject.id}`}
                      className="text-sm font-normal"
                    >
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Turmas</Label>
              <div className="grid grid-cols-2 gap-2">
                {classesList.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`edit-${classItem.id}`}
                      className="rounded border-gray-300"
                      checked={editForm.classes.includes(classItem.id)}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          classes: e.target.checked
                            ? [...editForm.classes, classItem.id]
                            : editForm.classes.filter(
                                (id: string) => id !== classItem.id
                              ),
                        })
                      }
                    />
                    <Label
                      htmlFor={`edit-${classItem.id}`}
                      className="text-sm font-normal"
                    >
                      {classItem.name}
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
