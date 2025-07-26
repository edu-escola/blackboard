import { useEffect, useState } from 'react'
import {
  Search,
  Plus,
  ArrowLeft,
  Mail,
  User,
  Shield,
  Edit,
  Trash2,
} from 'lucide-react'
import api from '@/lib/api'
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

const AdministratorManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAdmin, setSelectAdmin] = useState(null)
  const [sideSheetOpen, setSideSheetOpen] = useState(false)
  const [newAdministratorModalOpen, setCreateAdminModal] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editAdmin, setEditAdmin] = useState(null)
  const [adminList, setAdminList] = useState([])

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    status: '',
  })

  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
  })

  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const getAdminList = async () => {
    const response = await api.get('/users', {
      params: {
        role: 'admin',
      },
    })
    setAdminList(response.data.data)
  }

  useEffect(() => {
    getAdminList()
  }, [])

  const filterAdmin = adminList.filter((administrator) => {
    const name = administrator.name || '';
    const email = administrator.email || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  })

  const handleRowClick = (administrator: any) => {
    setSelectAdmin(administrator)
    setSideSheetOpen(true)
  }

  const handleNewAdmin = () => {
    setCreateAdminModal(true)
    setAdminForm({
      name: '',
      email: '',
    })
    setCreateError('')
  }

  const handleDeleteClick = (e: React.MouseEvent, admin: any) => {
    e.stopPropagation()
    setAdminToDelete(admin)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (e: React.MouseEvent, admin: any) => {
    e.stopPropagation()
    setEditAdmin(admin)
    setEditForm({
      name: admin.name,
      email: admin.email,
      status: admin.UserSchool?.[0]?.status || 'active',
    })
    setEditModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      console.log('Deletando administrador:', adminToDelete)
      await api.delete(`/users/${adminToDelete.id}`)
      getAdminList()
    } catch (error) {
      console.error('Erro ao deletar administrador:', error)
    } finally {
      setDeleteDialogOpen(false)
      setAdminToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setAdminToDelete(null)
  }

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true)
      console.log('Salvando alterações:', editForm)
      await api.put(`/users/${editAdmin.id}`, {
        name: editForm.name,
        email: editForm.email,
        status: editForm.status,
      })
      getAdminList()
    } catch (error) {
      console.error('Erro ao salvar alterações:', error)
    } finally {
      setEditModalOpen(false)
      setEditAdmin(null)
      setEditForm({ name: '', email: '', status: '' })
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditModalOpen(false)
    setEditAdmin(null)
    setEditForm({ name: '', email: '', status: '' })
  }

  const handleCreateAdmin = async () => {
    if (!adminForm.name.trim()) {
      setCreateError('Nome é obrigatório')
      return
    }
    if (!adminForm.email.trim()) {
      setCreateError('Email é obrigatório')
      return
    }

    setIsCreating(true)
    setCreateError('')

    try {
      const response = await api.post('/users', {
        name: adminForm.name,
        email: adminForm.email.trim().toLowerCase(),
        role: 'admin',
      })

      console.log('Administrador criado com sucesso:', response.data)

      setCreateAdminModal(false)
      setAdminForm({
        name: '',
        email: '',
      })
      getAdminList()
    } catch (error: any) {
      console.error('Erro ao criar administrador:', error)
      setCreateError('Erro desconhecido. Tente novamente mais tarde.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCancelCreate = () => {
    setCreateAdminModal(false)
    setAdminForm({
      name: '',
      email: '',
    })
    setCreateError('')
  }

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Ativo' : 'Inativo'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
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
            <h1 className="text-2xl font-bold text-gray-900">
              Administradores
            </h1>
          </div>
          <Button
            onClick={handleNewAdmin}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Administrador
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquise administradores por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Administrators Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterAdmin.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(admin)}
                  >
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{formatDate(admin.createdAt)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(admin.UserSchool?.[0]?.status || 'active')}>
                        {getStatusText(admin.UserSchool?.[0]?.status || 'active')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEditClick(e, admin)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(e, admin)}
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

      {/* Side Sheet for Administrator Details */}
      <Sheet open={sideSheetOpen} onOpenChange={setSideSheetOpen}>
        <SheetContent className="w-96 sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Detalhes do Administrador</SheetTitle>
            <SheetDescription>
              Informações do administrador selecionado.
            </SheetDescription>
          </SheetHeader>
          {selectedAdmin && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedAdmin.name}
                  </h3>
                  <p className="text-sm text-gray-600">Administrador</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedAdmin.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <div className="font-medium">Status:</div>
                      <Badge className={getStatusColor(selectedAdmin.UserSchool?.[0]?.status || 'active')}>
                        {getStatusText(selectedAdmin.UserSchool?.[0]?.status || 'active')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Administrator Modal */}
      <Dialog
        open={newAdministratorModalOpen}
        onOpenChange={setCreateAdminModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Administrador</DialogTitle>
            <DialogDescription>
              Adicione as informações básicas do novo administrador.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{createError}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Digite o nome completo"
                value={adminForm.name}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCancelCreate}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateAdmin} disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Administrador'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Administrator Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Administrador</DialogTitle>
            <DialogDescription>
              Edite as informações do administrador.
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
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
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
        description="Tem certeza que deseja excluir o administrador"
        itemName={adminToDelete?.name}
      />
    </div>
  )
}

export default AdministratorManagement
