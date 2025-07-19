import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Plus,
  MapPin,
  Users,
  Filter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeleteConfirmationDialog } from '@/components/shared'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'

const ClassTimetableManagement = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [rooms, setRooms] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [newClassModalOpen, setNewClassModalOpen] = useState(false)
  const [newRoomModalOpen, setNewRoomModalOpen] = useState(false)
  const [periodFilter, setPeriodFilter] = useState('all')
  const [roomFilter, setRoomFilter] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [classToDelete, setClassToDelete] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    room: '',
    shift: '',
  })
  const [editRoomModalOpen, setEditRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [editRoomForm, setEditRoomForm] = useState({
    name: '',
  })
  const [deleteRoomDialogOpen, setDeleteRoomDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<any>(null)
  const [newRoomName, setNewRoomName] = useState('')
  const [newClassName, setNewClassName] = useState('')
  const [newClassRoomId, setNewClassRoomId] = useState('')
  const [newClassPeriodId, setNewClassPeriodId] = useState('')

  // Funções da API
  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/rooms')
      setRooms(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar salas')
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const createRoom = async (name: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.post('/rooms', { name })
      await fetchRooms() // Recarrega a lista
    } catch (err) {
      setError('Erro ao criar sala')
      console.error('Error creating room:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRoom = async (id: string, name: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.put(`/rooms/${id}`, { name })
      await fetchRooms() // Recarrega a lista
    } catch (err) {
      setError('Erro ao atualizar sala')
      console.error('Error updating room:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteRoom = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.delete(`/rooms/${id}`)
      await fetchRooms() // Recarrega a lista
    } catch (err) {
      setError('Erro ao excluir sala')
      console.error('Error deleting room:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Função para buscar períodos
  const fetchPeriods = async () => {
    try {
      const response = await api.get('/periods')
      setPeriods(response.data.data || [])
    } catch (err) {
      console.error('Error fetching periods:', err)
    }
  }

  // Função para buscar turmas
  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/classes')
      setClasses(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar turmas')
      console.error('Error fetching classes:', err)
    } finally {
      setLoading(false)
    }
  }

  const createClass = async (name: string, roomId: string, periodId: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.post('/classes', { name, roomId, periodId })
      await fetchClasses() // Recarrega a lista
    } catch (err) {
      setError('Erro ao criar turma')
      console.error('Error creating class:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateClass = async (id: string, name: string, roomId: string, periodId: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.put(`/classes/${id}`, { name, roomId, periodId })
      await fetchClasses() // Recarrega a lista
    } catch (err) {
      setError('Erro ao atualizar turma')
      console.error('Error updating class:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteClass = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.delete(`/classes/${id}`)
      await fetchClasses() // Recarrega a lista
    } catch (err) {
      setError('Erro ao excluir turma')
      console.error('Error deleting class:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Carrega as salas, períodos e turmas ao montar o componente
  useEffect(() => {
    fetchRooms()
    fetchPeriods()
    fetchClasses()
  }, [])

  const getShiftColor = (periodName: string) => {
    switch (periodName?.toLowerCase()) {
      case 'manhã':
      case 'morning':
        return 'bg-yellow-100 text-yellow-800'
      case 'tarde':
      case 'afternoon':
        return 'bg-blue-100 text-blue-800'
      case 'noite':
      case 'night':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredClasses = classes.filter((classItem) => {
    const matchesPeriod =
      periodFilter === 'all' ||
      (classItem.period?.name && classItem.period.name.toLowerCase() === periodFilter.toLowerCase())
    const matchesRoom =
      roomFilter === 'all' ||
      (classItem.room?.name && classItem.room.name.toLowerCase().includes(roomFilter.toLowerCase()))
    return matchesPeriod && matchesRoom
  })

  const filteredRooms = rooms.filter((room) => {
    if (roomFilter === 'all') return true
    return room.name.toLowerCase().includes(roomFilter.toLowerCase())
  })

  const handleEditClass = (e: React.MouseEvent, classItem: any) => {
    e.stopPropagation()
    setEditingClass(classItem)
    setEditForm({
      name: classItem.name,
      room: classItem.roomId,
      shift: classItem.periodId,
    })
    setEditModalOpen(true)
  }

  const handleDeleteClass = (e: React.MouseEvent, classItem: any) => {
    e.stopPropagation()
    setClassToDelete(classItem)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteClass(classToDelete.id)
      setDeleteDialogOpen(false)
      setClassToDelete(null)
      toast({
        title: 'Turma excluída',
        description: `${classToDelete.name} foi excluída com sucesso.`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir turma.',
        variant: 'destructive',
      })
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setClassToDelete(null)
  }

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome da turma é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    try {
      await updateClass(editingClass.id, editForm.name.trim(), editForm.room, editForm.shift)
      setEditModalOpen(false)
      setEditingClass(null)
      setEditForm({ name: '', room: '', shift: '' })
      toast({
        title: 'Turma atualizada',
        description: `${editForm.name} foi atualizada com sucesso.`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar turma.',
        variant: 'destructive',
      })
    }
  }

  const handleCancelEdit = () => {
    setEditModalOpen(false)
    setEditingClass(null)
    setEditForm({ name: '', room: '', shift: '' })
  }

  const handleEditRoom = (e: React.MouseEvent, room: any) => {
    e.stopPropagation()
    setEditingRoom(room)
    setEditRoomForm({
      name: room.name,
    })
    setEditRoomModalOpen(true)
  }

  const handleDeleteRoom = (e: React.MouseEvent, room: any) => {
    e.stopPropagation()
    setRoomToDelete(room)
    setDeleteRoomDialogOpen(true)
  }

  const handleConfirmDeleteRoom = async () => {
    try {
      await deleteRoom(roomToDelete.id)
      setDeleteRoomDialogOpen(false)
      setRoomToDelete(null)
      toast({
        title: 'Sala excluída',
        description: `${roomToDelete.name} foi excluída com sucesso.`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir sala.',
        variant: 'destructive',
      })
    }
  }

  const handleCancelDeleteRoom = () => {
    setDeleteRoomDialogOpen(false)
    setRoomToDelete(null)
  }

  const handleSaveEditRoom = async () => {
    if (!editRoomForm.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome da sala é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    try {
      await updateRoom(editingRoom.id, editRoomForm.name.trim())
      setEditRoomModalOpen(false)
      setEditingRoom(null)
      setEditRoomForm({ name: '' })
      toast({
        title: 'Sala atualizada',
        description: `${editRoomForm.name} foi atualizada com sucesso.`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar sala.',
        variant: 'destructive',
      })
    }
  }

  const handleCancelEditRoom = () => {
    setEditRoomModalOpen(false)
    setEditingRoom(null)
    setEditRoomForm({ name: '' })
  }

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome da sala é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    try {
      await createRoom(newRoomName.trim())
      setNewRoomModalOpen(false)
      setNewRoomName('')
      toast({
        title: 'Sala criada',
        description: `${newRoomName} foi criada com sucesso.`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar sala.',
        variant: 'destructive',
      })
    }
  }

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome da turma é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    if (!newClassRoomId) {
      toast({
        title: 'Erro',
        description: 'Sala é obrigatória.',
        variant: 'destructive',
      })
      return
    }

    if (!newClassPeriodId) {
      toast({
        title: 'Erro',
        description: 'Período é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    try {
      await createClass(newClassName.trim(), newClassRoomId, newClassPeriodId)
      setNewClassModalOpen(false)
      setNewClassName('')
      setNewClassRoomId('')
      setNewClassPeriodId('')
      toast({
        title: 'Turma criada',
        description: `${newClassName} foi criada com sucesso.`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar turma.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/dashboard')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Turmas e Salas</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="classes">Turmas</TabsTrigger>
            <TabsTrigger value="rooms">Salas</TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Turmas</CardTitle>
                <div className="flex items-center space-x-4">
                  <Select value={roomFilter} onValueChange={setRoomFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Todas as salas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Salas</SelectItem>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.name}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Todos os períodos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Períodos</SelectItem>
                      {periods.map((period) => (
                        <SelectItem key={period.id} value={period.name}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setNewClassModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Turma
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">Carregando turmas...</div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome da Turma</TableHead>
                        <TableHead>Sala</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClasses.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell className="font-medium">
                            {classItem.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{classItem.room?.name || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getShiftColor(classItem.period?.name)}>
                              {classItem.period?.name || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleEditClass(e, classItem)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteClass(e, classItem)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Salas</CardTitle>
                <div className="flex items-center space-x-4">
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  <Button onClick={() => setNewRoomModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Sala
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">Carregando salas...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRooms.map((room) => (
                      <Card key={room.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleEditRoom(e, room)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteRoom(e, room)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* New Class Modal */}
      <Dialog open={newClassModalOpen} onOpenChange={setNewClassModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Nova Turma</DialogTitle>
            <DialogDescription>
              Adicione uma nova turma com atribuições de sala e horário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">Nome da Turma</Label>
              <Input 
                id="className" 
                placeholder="1A"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Sala</Label>
              <Select value={newClassRoomId} onValueChange={setNewClassRoomId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Sala" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Período</Label>
              <Select value={newClassPeriodId} onValueChange={setNewClassPeriodId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
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

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNewClassModalOpen(false)
                  setNewClassName('')
                  setNewClassRoomId('')
                  setNewClassPeriodId('')
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateClass} disabled={loading}>
                {loading ? 'Criando...' : 'Criar Turma'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Room Modal */}
      <Dialog open={newRoomModalOpen} onOpenChange={setNewRoomModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Sala</DialogTitle>
            <DialogDescription>Crie uma Nova Sala</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Nome da Sala</Label>
              <Input 
                id="roomName" 
                placeholder="Room A101"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNewRoomModalOpen(false)
                  setNewRoomName('')
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateRoom} disabled={loading}>
                {loading ? 'Criando...' : 'Adicionar Sala'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir a turma"
        itemName={classToDelete?.name}
      />

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Turma</DialogTitle>
            <DialogDescription>
              Edite as informações da turma.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Nome da Turma</Label>
              <Input
                id="editName"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editRoom">Sala</Label>
              <Select
                value={editForm.room}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, room: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Sala" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editShift">Período</Label>
              <Select
                value={editForm.shift}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, shift: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog open={editRoomModalOpen} onOpenChange={setEditRoomModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Sala</DialogTitle>
            <DialogDescription>Edite as informações da sala.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editRoomName">Nome da Sala</Label>
              <Input
                id="editRoomName"
                value={editRoomForm.name}
                onChange={(e) =>
                  setEditRoomForm({ ...editRoomForm, name: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEditRoom}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEditRoom} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Room Dialog */}
      <DeleteConfirmationDialog
        open={deleteRoomDialogOpen}
        onOpenChange={setDeleteRoomDialogOpen}
        onConfirm={handleConfirmDeleteRoom}
        onCancel={handleCancelDeleteRoom}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir a sala"
        itemName={roomToDelete?.name}
      />
    </div>
  )
}

export default ClassTimetableManagement
