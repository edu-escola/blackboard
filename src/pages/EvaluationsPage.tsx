import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Plus,
  Edit,
  Calendar,
  GraduationCap,
  FileText,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog'
import api from '@/lib/api'

const EvaluationsPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [gradeModalOpen, setGradeModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [studentGrades, setStudentGrades] = useState<{ [key: string]: number }>(
    {}
  )
  const [selectedSchool, setSelectedSchool] = useState('')
  const [classFilter, setClassFilter] = useState(undefined)
  const [subjectFilter, setSubjectFilter] = useState(undefined)
  const [newActivityModalOpen, setNewActivityModalOpen] = useState(false)
  const [editActivityModalOpen, setEditActivityModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<any>(null)

  // API Data States
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Bimesters - Lista estática pois não há API específica
  const bimesters = [
    { value: '1', label: '1° Bimestre' },
    { value: '2', label: '2° Bimestre' },
    { value: '3', label: '3° Bimestre' },
    { value: '4', label: '4° Bimestre' },
  ]

  const userId = localStorage.getItem('userId')
  const schoolId = localStorage.getItem('schoolId')

  // API Functions
  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes', {
        params: {
          userId,
        },
      })
      setClasses(response.data.data || [])
    } catch (error) {
      console.error('Error fetching classes:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar turmas',
        variant: 'destructive',
      })
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects', {
        params: {
          userId,
        },
      })
      setSubjects(response.data.data || [])
    } catch (error) {
      console.error('Error fetching subjects:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar disciplinas',
        variant: 'destructive',
      })
    }
  }

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools')
      setSchools(response.data.data || [])
    } catch (error) {
      console.error('Error fetching schools:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar escolas',
        variant: 'destructive',
      })
    }
  }

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await api.get('/evaluations')
      setActivities(response.data.data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar atividades',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students', {
        params: {
          userId,
        },
      })
      setStudents(response.data.data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar alunos',
        variant: 'destructive',
      })
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchClasses()
    fetchSubjects()
    fetchSchools()
    fetchActivities()
    fetchStudents()
  }, [])

  // Form state
  const [newActivity, setNewActivity] = useState<{
    title: string
    type: string
    schoolId: string
    bimester: string
    class: string
    subjectId: string
    date: Date | undefined
    description: string
  }>({
    title: '',
    type: '',
    schoolId: '',
    bimester: '',
    class: '',
    subjectId: '',
    date: undefined,
    description: '',
  })

  const handleActivityClick = async (activity: any) => {
    setSelectedActivity(activity)
    setLoading(true)
    
    try {
      // Buscar alunos da turma da atividade
      const studentsResponse = await api.get(`/evaluations/${activity.id}/students`)
      const classStudents = studentsResponse.data.data || []
      
      // Buscar notas existentes
      const gradesResponse = await api.get(`/evaluations/${activity.id}/grades`)
      const existingGrades = gradesResponse.data.data || []
      
      // Inicializar notas
      const initialGrades: { [key: string]: number } = {}
      classStudents.forEach((student: any) => {
        const existingGrade = existingGrades.find((g: any) => g.studentId === student.id)
        initialGrades[student.id] = existingGrade?.grade || 0
      })
      
      setStudents(classStudents)
      setStudentGrades(initialGrades)
      setGradeModalOpen(true)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar alunos e notas',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGradeChange = (studentId: string, grade: string) => {
    const numericGrade = parseFloat(grade)
    if (!isNaN(numericGrade)) {
      setStudentGrades((prev) => ({
        ...prev,
        [studentId]: numericGrade,
      }))
    }
  }

  const handleSaveAllGrades = async () => {
    if (!selectedActivity) return

    try {
      setLoading(true)
      
      // Preparar array de notas para envio
      const gradesToSave = Object.entries(studentGrades)
        .filter(([_, grade]) => grade > 0) // Só salvar notas maiores que 0
        .map(([studentId, grade]) => ({
          studentId,
          grade,
        }))

      if (gradesToSave.length === 0) {
        toast({
          title: 'Aviso',
          description: 'Nenhuma nota foi digitada',
          variant: 'destructive',
        })
        return
      }

      // Salvar todas as notas de uma vez
      await api.post(`/evaluations/${selectedActivity.id}/grades/bulk`, {
        grades: gradesToSave,
      })

      toast({
        title: 'Notas Salvas',
        description: `${gradesToSave.length} nota(s) salva(s) com sucesso!`,
      })

      setGradeModalOpen(false)
    } catch (error) {
      console.error('Error saving grades:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao salvar notas',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateActivity = async () => {
    if (
      !newActivity.title ||
      !newActivity.type ||
      !newActivity.bimester ||
      !newActivity.class ||
      !newActivity.subjectId ||
      !newActivity.date
    ) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      await api.post('/evaluations', {
        title: newActivity.title,
        type: newActivity.type,
        bimester: newActivity.bimester,
        classId: newActivity.class,
        subjectId: newActivity.subjectId,
        date: newActivity.date?.toISOString(),
        description: newActivity.description,
      })

      toast({
        title: 'Atividade criada com sucesso!',
        description: `${newActivity.title} foi criado e está pronto para envios dos alunos.`,
      })

      // Reset form
      setNewActivity({
        title: '',
        type: '',
        schoolId: '',
        bimester: '',
        class: '',
        subjectId: '',
        date: undefined,
        description: '',
      })

      // Close modal
      setNewActivityModalOpen(false)

      // Refresh activities list
      await fetchActivities()
    } catch (error) {
      console.error('Error creating activity:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao criar atividade',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (e: React.MouseEvent, activity: any) => {
    e.stopPropagation()
    setEditingActivity(activity)
    setNewActivity({
      title: activity.title,
      type: activity.type,
      schoolId: '',
      bimester: activity.bimester,
      class: activity.classId,
      subjectId: activity.subjectId,
      date: new Date(activity.date),
      description: activity.description,
    })
    setEditActivityModalOpen(true)
  }

  const handleDeleteClick = (e: React.MouseEvent, activity: any) => {
    e.stopPropagation()
    setActivityToDelete(activity)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      await api.delete(`/evaluations/${activityToDelete.id}`)
      setDeleteDialogOpen(false)
      setActivityToDelete(null)
      toast({
        title: 'Atividade excluída',
        description: `${activityToDelete?.title} foi excluída com sucesso.`,
      })
      
      // Refresh activities list
      await fetchActivities()
    } catch (error) {
      console.error('Error deleting activity:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao excluir atividade',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setActivityToDelete(null)
  }

  const handleSaveEdit = async () => {
    if (
      !newActivity.title ||
      !newActivity.type ||
      !newActivity.bimester ||
      !newActivity.class ||
      !newActivity.subjectId ||
      !newActivity.date
    ) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      await api.put(`/evaluations/${editingActivity.id}`, {
        title: newActivity.title,
        type: newActivity.type,
        bimester: newActivity.bimester,
        classId: newActivity.class,
        subjectId: newActivity.subjectId,
        date: newActivity.date?.toISOString(),
        description: newActivity.description,
      })

      setEditActivityModalOpen(false)
      setEditingActivity(null)
      setNewActivity({
        title: '',
        type: '',
        schoolId: '',
        bimester: '',
        class: '',
        subjectId: '',
        date: undefined,
        description: '',
      })
      toast({
        title: 'Atividade atualizada',
        description: `${newActivity.title} foi atualizada com sucesso.`,
      })

      // Refresh activities list
      await fetchActivities()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar atividade',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditActivityModalOpen(false)
    setEditingActivity(null)
    setNewActivity({
      title: '',
      type: '',
      schoolId: '',
      bimester: '',
      class: '',
      subjectId: '',
      date: undefined,
      description: '',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800'
      case 'Graded':
        return 'bg-blue-100 text-blue-800'
      case 'Draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Atividade':
        return <FileText className="h-4 w-4" />
      case 'Avaliação':
        return <GraduationCap className="h-4 w-4" />
      case 'Tarefa':
        return <Edit className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredActivities = activities.filter(
    (activity) =>
      (classFilter === 'all' || activity.class?.name === classFilter) &&
      (subjectFilter === 'all' || activity.subject?.name === subjectFilter)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/professor/dashboard')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
          </div>
          <Button
            onClick={() => setNewActivityModalOpen(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Activities List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-left whitespace-nowrap m-0">
              Atividades e Avaliações
            </CardTitle>
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <Select
                value={newActivity.bimester}
                onValueChange={(value) =>
                  setNewActivity((prev) => ({ ...prev, subject: value }))
                }
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Bimestre" />
                </SelectTrigger>
                <SelectContent>
                  {bimesters.map((bimester) => (
                    <SelectItem key={bimester.value} value={bimester.value}>
                      {bimester.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Carregando atividades...</div>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Média da Sala</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow
                      key={activity.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleActivityClick(activity)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(activity.type)}
                          <div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-gray-500">
                              {activity.type}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{activity.class?.name || 'N/A'}</TableCell>
                      <TableCell>{activity.subject?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-400">
                          Não classificado
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditClick(e, activity)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteClick(e, activity)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* New Activity Modal */}
      <Dialog
        open={newActivityModalOpen}
        onOpenChange={setNewActivityModalOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Atividade</DialogTitle>
            <DialogDescription>
              Preencha as informações da nova atividade.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newActivity.title}
                  onChange={(e) =>
                    setNewActivity((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="ex.: Prova Bimestral"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={newActivity.type}
                  onValueChange={(value) =>
                    setNewActivity((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Atividade">Atividade</SelectItem>
                    <SelectItem value="Avaliação">Avaliação</SelectItem>
                    <SelectItem value="Tarefa">Tarefa</SelectItem>
                  </SelectContent>
                </Select>
              </div>



              <div className="space-y-2">
                <Label htmlFor="shift">Período *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="class">Turma *</Label>
                <Select
                  value={newActivity.class}
                  onValueChange={(value) =>
                    setNewActivity((prev) => ({ ...prev, class: value }))
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

              <div className="space-y-2">
                <Label htmlFor="subject">Disciplina *</Label>
                <Select
                  value={newActivity.subjectId}
                  onValueChange={(value) =>
                    setNewActivity((prev) => ({ ...prev, subjectId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bimester">Bimestre *</Label>
                <Select
                  value={newActivity.bimester}
                  onValueChange={(value) =>
                    setNewActivity((prev) => ({ ...prev, bimester: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o bimestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {bimesters.map((bimester) => (
                      <SelectItem key={bimester.value} value={bimester.value}>
                        {bimester.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !newActivity.date && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newActivity.date ? (
                        format(newActivity.date, 'PPP')
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newActivity.date}
                      onSelect={(date) =>
                        setNewActivity((prev) => ({ ...prev, date }))
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={newActivity.description}
                onChange={(e) =>
                  setNewActivity((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Instruções ou detalhes adicionais..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setNewActivityModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateActivity} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Criando...' : 'Criar Atividade'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Modal */}
      <Dialog
        open={editActivityModalOpen}
        onOpenChange={setEditActivityModalOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Atividade</DialogTitle>
            <DialogDescription>
              Edite as informações da atividade.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título *</Label>
                <Input
                  id="edit-title"
                  value={newActivity.title}
                  onChange={(e) =>
                    setNewActivity((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="ex.: Prova Bimestral"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipo *</Label>
                <Select
                  value={newActivity.type}
                  onValueChange={(value) =>
                    setNewActivity((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Atividade">Atividade</SelectItem>
                    <SelectItem value="Avaliação">Avaliação</SelectItem>
                    <SelectItem value="Tarefa">Tarefa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-shift">Período *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="edit-class">Turma *</Label>
                <Select
                  value={newActivity.class}
                  onValueChange={(value) =>
                    setNewActivity((prev) => ({ ...prev, class: value }))
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

              <div className="space-y-2">
                <Label htmlFor="edit-subject">Disciplina *</Label>
                <Select
                  value={newActivity.subjectId}
                  onValueChange={(value) =>
                    setNewActivity((prev) => ({ ...prev, subjectId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bimester">Bimestre *</Label>
                <Select
                  value={newActivity.bimester}
                  onValueChange={(value) =>
                    setNewActivity((prev) => ({ ...prev, bimester: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o bimestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {bimesters.map((bimester) => (
                      <SelectItem key={bimester.value} value={bimester.value}>
                        {bimester.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-date">Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !newActivity.date && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newActivity.date ? (
                        format(newActivity.date, 'PPP')
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newActivity.date}
                      onSelect={(date) =>
                        setNewActivity((prev) => ({ ...prev, date }))
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição (Opcional)</Label>
              <Textarea
                id="edit-description"
                value={newActivity.description}
                onChange={(e) =>
                  setNewActivity((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Instruções ou detalhes adicionais..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
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
        description="Tem certeza que deseja excluir a atividade"
        itemName={activityToDelete?.title}
      />

      {/* Grade Modal */}
      <Dialog open={gradeModalOpen} onOpenChange={setGradeModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Avaliar Atividade: {selectedActivity?.title}
            </DialogTitle>
            <DialogDescription>
              Insira as notas de cada aluno. As alterações são salvas
              automaticamente.
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Turma</Label>
                  <p className="text-sm">{selectedActivity.class?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Disciplina</Label>
                  <p className="text-sm">{selectedActivity.subject?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Alunos</Label>
                  <p className="text-sm">{students.length} alunos</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Notas dos Alunos</h4>
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2"
                  >
                    <div className="flex-1">
                      <h5 className="font-medium">{student.name}</h5>
                      <p className="text-sm text-gray-600 font-mono">
                        {student.enrollmentNumber}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={studentGrades[student.id] || ''}
                        onChange={(e) =>
                          handleGradeChange(student.id, e.target.value)
                        }
                        placeholder="Nota"
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-gray-500">
                        / 10
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setGradeModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveAllGrades}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Notas'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EvaluationsPage
