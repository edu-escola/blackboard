import { useState } from 'react'
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

const ClassTimetableManagement = () => {
  const navigate = useNavigate()
  const [newClassModalOpen, setNewClassModalOpen] = useState(false)
  const [newRoomModalOpen, setNewRoomModalOpen] = useState(false)
  const [periodFilter, setPeriodFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
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

  // Mock data
  const rooms = [
    {
      id: 1,
      name: 'Room A101',
    },
    {
      id: 2,
      name: 'Lab B201',
    },
    {
      id: 3,
      name: 'Auditorium C301',
    },
  ]

  const classes = [
    {
      id: 1,
      name: 'Mathematics 101',
      year: '2024',
      room: 'Room A101',
      shift: 'Morning',
      students: 28,
      professors: ['Dr. Sarah Johnson'],
      capacity: 30,
    },
    {
      id: 2,
      name: 'Science Lab',
      year: '2024',
      room: 'Lab B201',
      shift: 'Afternoon',
      students: 22,
      professors: ['Prof. Michael Chen'],
      capacity: 25,
    },
    {
      id: 3,
      name: 'English Literature',
      year: '2024',
      room: 'Room A101',
      shift: 'Night',
      students: 25,
      professors: ['Ms. Emily Rodriguez'],
      capacity: 30,
    },
  ]

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'Morning':
        return 'bg-yellow-100 text-yellow-800'
      case 'Afternoon':
        return 'bg-blue-100 text-blue-800'
      case 'Night':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredClasses = classes.filter((classItem) => {
    const matchesPeriod =
      periodFilter === 'all' ||
      classItem.shift.toLowerCase() === periodFilter.toLowerCase()
    const matchesClass =
      classFilter === 'all' ||
      classItem.name.toLowerCase().includes(classFilter.toLowerCase())
    const matchesRoom =
      roomFilter === 'all' ||
      classItem.room.toLowerCase().includes(roomFilter.toLowerCase())
    return matchesPeriod && matchesClass && matchesRoom
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
      room: classItem.room,
      shift: classItem.shift,
    })
    setEditModalOpen(true)
  }

  const handleDeleteClass = (e: React.MouseEvent, classItem: any) => {
    e.stopPropagation()
    setClassToDelete(classItem)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    // Aqui você implementaria a lógica para deletar a turma
    console.log('Deletando turma:', classToDelete)
    setDeleteDialogOpen(false)
    setClassToDelete(null)
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setClassToDelete(null)
  }

  const handleSaveEdit = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Salvando alterações:', editForm)
    setEditModalOpen(false)
    setEditingClass(null)
    setEditForm({ name: '', room: '', shift: '' })
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

  const handleConfirmDeleteRoom = () => {
    // Aqui você implementaria a lógica para deletar a sala
    console.log('Deletando sala:', roomToDelete)
    setDeleteRoomDialogOpen(false)
    setRoomToDelete(null)
  }

  const handleCancelDeleteRoom = () => {
    setDeleteRoomDialogOpen(false)
    setRoomToDelete(null)
  }

  const handleSaveEditRoom = () => {
    // Aqui você implementaria a lógica para salvar as alterações da sala
    console.log('Salvando alterações da sala:', editRoomForm)
    setEditRoomModalOpen(false)
    setEditingRoom(null)
    setEditRoomForm({ name: '' })
  }

  const handleCancelEditRoom = () => {
    setEditRoomModalOpen(false)
    setEditingRoom(null)
    setEditRoomForm({ name: '' })
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
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Todas as turmas" />
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
                      <SelectItem value="morning">Manhã</SelectItem>
                      <SelectItem value="afternoon">Tarde</SelectItem>
                      <SelectItem value="night">Noite</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setNewClassModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Turma
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                            <span>{classItem.room}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(classItem.shift)}>
                            {classItem.shift}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Salas</CardTitle>
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
                  <Button onClick={() => setNewRoomModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Sala
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
              <Input id="className" placeholder="1A" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Sala</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Sala" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Período</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Manhã</SelectItem>
                  <SelectItem value="afternoon">Tarde</SelectItem>
                  <SelectItem value="night">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setNewClassModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setNewClassModalOpen(false)}>
                Criar Turma
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
              <Input id="roomName" placeholder="Room A101" />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setNewRoomModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setNewRoomModalOpen(false)}>
                Adicionar Sala
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
                    <SelectItem key={room.id} value={room.name}>
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
                  <SelectItem value="morning">Manhã</SelectItem>
                  <SelectItem value="afternoon">Tarde</SelectItem>
                  <SelectItem value="night">Noite</SelectItem>
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
              <Button onClick={handleSaveEditRoom}>Salvar</Button>
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
