import { useState } from 'react'
import {
  ArrowLeft,
  Plus,
  Calendar,
  Copy,
  Save,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { DeleteConfirmationDialog } from '@/components/shared'

interface LessonRow {
  id: string
  date: Date | undefined
  hour: string
  theme: string
  objectives: string
  skills: string
  subject: string
}

const LessonPlannerPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedSchool, setSelectedSchool] = useState(() => {
    const savedSchool = localStorage.getItem('selectedSchool')
    return savedSchool || ''
  })
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedBimester, setSelectedBimester] = useState('1')
  const [lessons, setLessons] = useState<LessonRow[]>([
    {
      id: '1',
      date: new Date('2024-01-15'),
      hour: '',
      theme: 'Conceitos algébricos básicos e variáveis',
      objectives: 'Compreender conceitos básicos de álgebra',
      skills: '',
      subject: 'Matemática',
    },
    {
      id: '2',
      date: new Date('2024-01-17'),
      hour: '',
      theme: 'Resolução de equações lineares com uma variável',
      objectives: 'Resolver equações lineares simples',
      skills: '',
      subject: 'Matemática',
    },
    {
      id: '3',
      date: new Date('2024-01-19'),
      hour: '',
      theme: 'Introdução aos planos de coordenadas e gráficos',
      objectives: 'Interpretar gráficos simples',
      skills: '',
      subject: 'Matemática',
    },
  ])
  const [detalhamento, setDetalhamento] = useState('')
  const [avaliacao, setAvaliacao] = useState('')
  const [consideracoes, setConsideracoes] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Estados para modal de edição
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonRow | null>(null)
  const [editForm, setEditForm] = useState<LessonRow>({
    id: '',
    date: undefined,
    hour: '',
    theme: '',
    objectives: '',
    skills: '',
    subject: '',
  })

  // Estados para modal de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<LessonRow | null>(null)

  // Estados para modal de nova aula
  const [newLessonModalOpen, setNewLessonModalOpen] = useState(false)
  const [newLessonForm, setNewLessonForm] = useState<Omit<LessonRow, 'id'>>({
    date: undefined,
    hour: '',
    theme: '',
    objectives: '',
    skills: '',
    subject: '',
  })

  // Mock data
  const schools = [
    { id: 'lincoln', name: 'Lincoln Elementary' },
    { id: 'washington', name: 'Washington High School' },
    { id: 'roosevelt', name: 'Roosevelt Middle School' },
  ]

  const classes = [
    { id: 'math101', name: 'Mathematics 101', schoolId: 'lincoln' },
    { id: 'science102', name: 'Science 102', schoolId: 'lincoln' },
    { id: 'english201', name: 'English 201', schoolId: 'washington' },
  ]

  const subjects = [
    'Matemática',
    'Ciências',
    'Inglês',
    'História',
    'Física',
    'Química',
    'Artes',
    'Educação Física',
  ]

  // Horários disponíveis para seleção
  const hours = [
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
  ]

  const bimesters = [
    { value: '1', label: '1° Bimestre' },
    { value: '2', label: '2° Bimestre' },
    { value: '3', label: '3° Bimestre' },
    { value: '4', label: '4° Bimestre' },
  ]

  // Mock de semanas
  const weeks = [
    '01/01-05/01',
    '06/01-10/01',
    '11/01-15/01',
    '16/01-20/01',
    '21/01-25/01',
    '26/01-30/01',
    '01/02-05/02',
    '06/02-10/02',
    '11/02-15/02',
  ]
  const [selectedWeek, setSelectedWeek] = useState('')

  // Filter classes by selected school
  const filteredClasses = classes.filter(
    (cls) => cls.schoolId === selectedSchool
  )

  // Generate new lesson ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Add new lesson row
  const addLessonRow = () => {
    setNewLessonModalOpen(true)
  }

  // Handle save new lesson
  const handleSaveNewLesson = () => {
    const newLesson: LessonRow = {
      id: generateId(),
      ...newLessonForm,
    }
    setLessons((prev) => [...prev, newLesson])
    setNewLessonModalOpen(false)
    setNewLessonForm({
      date: undefined,
      hour: '',
      theme: '',
      objectives: '',
      skills: '',
      subject: '',
    })
  }

  // Handle cancel new lesson
  const handleCancelNewLesson = () => {
    setNewLessonModalOpen(false)
    setNewLessonForm({
      date: undefined,
      hour: '',
      theme: '',
      objectives: '',
      skills: '',
      subject: '',
    })
  }

  // Handle edit click
  const handleEditClick = (e: React.MouseEvent, lesson: LessonRow) => {
    e.stopPropagation()
    setEditingLesson(lesson)
    setEditForm({
      id: lesson.id,
      date: lesson.date,
      hour: lesson.hour,
      theme: lesson.theme,
      objectives: lesson.objectives,
      skills: lesson.skills,
      subject: lesson.subject,
    })
    setEditModalOpen(true)
  }

  // Handle delete click
  const handleDeleteClick = (e: React.MouseEvent, lesson: LessonRow) => {
    e.stopPropagation()
    setLessonToDelete(lesson)
    setDeleteDialogOpen(true)
  }

  // Handle save edit
  const handleSaveEdit = () => {
    if (editingLesson) {
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === editingLesson.id ? editForm : lesson
        )
      )
      setEditModalOpen(false)
      setEditingLesson(null)
      setEditForm({
        id: '',
        date: undefined,
        hour: '',
        theme: '',
        objectives: '',
        skills: '',
        subject: '',
      })
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditModalOpen(false)
    setEditingLesson(null)
    setEditForm({
      id: '',
      date: undefined,
      hour: '',
      theme: '',
      objectives: '',
      skills: '',
      subject: '',
    })
  }

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (lessonToDelete) {
      setLessons((prev) =>
        prev.filter((lesson) => lesson.id !== lessonToDelete.id)
      )
      setDeleteDialogOpen(false)
      setLessonToDelete(null)
    }
  }

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setLessonToDelete(null)
  }

  // Save lesson plan
  const saveLessonPlan = () => {
    if (!selectedSchool || !selectedClass) {
      toast({
        title: 'Faltando Informação',
        description: 'Selecione a escola e a turma antes de salvar.',
        variant: 'destructive',
      })
      return
    }

    const validLessons = lessons.filter(
      (lesson) => lesson.theme.trim() !== '' || lesson.objectives.trim() !== ''
    )

    toast({
      title: 'Plano de aula salvo com sucesso!',
      description: `${validLessons.length} lições salvas para ${bimesters.find((b) => b.value === selectedBimester)?.label}.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
            <h1 className="text-2xl font-bold text-gray-900">Plano de Aula</h1>
          </div>
          <Button
            onClick={addLessonRow}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Aula
          </Button>
        </div>
      </header>

      {/* Controls */}
      <div className="p-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 w-full">
                <div className="space-y-2 w-full sm:w-auto">
                  <label className="text-sm font-medium">Escola</label>
                  <Select
                    value={selectedSchool}
                    onValueChange={(value) => {
                      setSelectedSchool(value)
                      localStorage.setItem('selectedSchool', value)
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Selecione a Escola" />
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

                <div className="space-y-2 w-full sm:w-auto">
                  <label className="text-sm font-medium">Turma</label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                    disabled={!selectedSchool}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Selecione a Turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 w-full sm:w-auto">
                <div className="space-y-2 w-full sm:w-auto">
                  <label className="text-sm font-medium">Bimestre</label>
                  <Select
                    value={selectedBimester}
                    onValueChange={setSelectedBimester}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
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
                <div className="space-y-2 w-full sm:w-auto">
                  <label className="text-sm font-medium">Semana</label>
                  <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Selecione a Semana" />
                    </SelectTrigger>
                    <SelectContent>
                      {weeks.map((week) => (
                        <SelectItem key={week} value={week}>
                          {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Lesson Plan Table */}
      <div className="px-2 sm:px-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>
              Plano de Aula -{' '}
              {bimesters.find((b) => b.value === selectedBimester)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[90px] w-auto">Data</TableHead>
                    <TableHead className="min-w-[90px] w-auto">Hora</TableHead>
                    <TableHead className="min-w-[120px] w-auto">Tema</TableHead>
                    <TableHead className="min-w-[140px] w-auto">
                      Objetivos de aprendizagem
                    </TableHead>
                    <TableHead className="min-w-[100px] w-auto">
                      Habilidades
                    </TableHead>
                    <TableHead className="min-w-[100px] w-auto">
                      Matéria
                    </TableHead>
                    <TableHead className="min-w-[80px] w-auto">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="min-w-[90px] w-auto max-w-[120px] truncate">
                        {lesson.date ? format(lesson.date, 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell className="min-w-[90px] w-auto max-w-[120px] truncate">
                        {lesson.hour || '-'}
                      </TableCell>
                      <TableCell className="min-w-[120px] w-auto max-w-[180px] truncate">
                        {lesson.theme || '-'}
                      </TableCell>
                      <TableCell className="min-w-[140px] w-auto max-w-[220px] truncate">
                        {lesson.objectives || '-'}
                      </TableCell>
                      <TableCell className="min-w-[100px] w-auto max-w-[160px] truncate">
                        {lesson.skills || '-'}
                      </TableCell>
                      <TableCell className="min-w-[100px] w-auto max-w-[140px] truncate">
                        {lesson.subject || '-'}
                      </TableCell>
                      <TableCell className="min-w-[80px] w-auto">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditClick(e, lesson)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteClick(e, lesson)}
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
          </CardContent>
        </Card>
      </div>

      {/* Dropdowns de textos adicionais */}
      <div className="px-6 pt-4 space-y-3 pb-32">
        {/* Detalhamento das Aulas */}
        <div className="border rounded shadow-sm bg-white">
          <button
            type="button"
            className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50 focus:outline-none"
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'detalhamento' ? null : 'detalhamento'
              )
            }
          >
            Detalhamento das Aulas
            <span>{openDropdown === 'detalhamento' ? '▲' : '▼'}</span>
          </button>
          {openDropdown === 'detalhamento' && (
            <div className="px-4 pb-4">
              <textarea
                className="w-full border rounded p-2 mt-2 min-h-[80px] focus:ring-1 focus:ring-blue-500"
                value={detalhamento}
                onChange={(e) => setDetalhamento(e.target.value)}
                placeholder="Digite o detalhamento das aulas..."
              />
            </div>
          )}
        </div>
        {/* Forma de Avaliação */}
        <div className="border rounded shadow-sm bg-white">
          <button
            type="button"
            className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50 focus:outline-none"
            onClick={() =>
              setOpenDropdown(openDropdown === 'avaliacao' ? null : 'avaliacao')
            }
          >
            Forma de Avaliação
            <span>{openDropdown === 'avaliacao' ? '▲' : '▼'}</span>
          </button>
          {openDropdown === 'avaliacao' && (
            <div className="px-4 pb-4">
              <textarea
                className="w-full border rounded p-2 mt-2 min-h-[80px] focus:ring-1 focus:ring-blue-500"
                value={avaliacao}
                onChange={(e) => setAvaliacao(e.target.value)}
                placeholder="Digite a forma de avaliação..."
              />
            </div>
          )}
        </div>
        {/* Considerações */}
        <div className="border rounded shadow-sm bg-white">
          <button
            type="button"
            className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50 focus:outline-none"
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'consideracoes' ? null : 'consideracoes'
              )
            }
          >
            Considerações
            <span>{openDropdown === 'consideracoes' ? '▲' : '▼'}</span>
          </button>
          {openDropdown === 'consideracoes' && (
            <div className="px-4 pb-4">
              <textarea
                className="w-full border rounded p-2 mt-2 min-h-[80px] focus:ring-1 focus:ring-blue-500"
                value={consideracoes}
                onChange={(e) => setConsideracoes(e.target.value)}
                placeholder="Digite as considerações..."
              />
            </div>
          )}
        </div>
        {/* Observações do Coordenador */}
        <div className="border rounded shadow-sm bg-white">
          <button
            type="button"
            className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50 focus:outline-none"
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'observacoes' ? null : 'observacoes'
              )
            }
          >
            Observações do Coordenador
            <span>{openDropdown === 'observacoes' ? '▲' : '▼'}</span>
          </button>
          {openDropdown === 'observacoes' && (
            <div className="px-4 pb-4">
              <textarea
                className="w-full border rounded p-2 mt-2 min-h-[80px] focus:ring-1 focus:ring-blue-500"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Digite as observações do coordenador..."
              />
            </div>
          )}
        </div>
      </div>

      {/* New Lesson Modal */}
      <Dialog open={newLessonModalOpen} onOpenChange={setNewLessonModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Aula</DialogTitle>
            <DialogDescription>
              Adicione as informações da nova aula.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-date">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !newLessonForm.date && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newLessonForm.date ? (
                        format(newLessonForm.date, 'PPP')
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newLessonForm.date}
                      onSelect={(date) =>
                        setNewLessonForm({ ...newLessonForm, date })
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-hour">Hora</Label>
                <Input
                  id="new-hour"
                  value={newLessonForm.hour}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '') // Remove caracteres não numéricos
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + ':' + value.slice(2, 4)
                    }
                    setNewLessonForm({ ...newLessonForm, hour: value })
                  }}
                  placeholder="HH:MM (ex: 08:30)"
                  maxLength={5}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-theme">Tema</Label>
              <Input
                id="new-theme"
                value={newLessonForm.theme}
                onChange={(e) =>
                  setNewLessonForm({ ...newLessonForm, theme: e.target.value })
                }
                placeholder="Descreva o tema da lição"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-objectives">Objetivos de aprendizagem</Label>
              <Input
                id="new-objectives"
                value={newLessonForm.objectives}
                onChange={(e) =>
                  setNewLessonForm({
                    ...newLessonForm,
                    objectives: e.target.value,
                  })
                }
                placeholder="Descreva os objetivos de aprendizagem"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-skills">Habilidades</Label>
              <Input
                id="new-skills"
                value={newLessonForm.skills}
                onChange={(e) =>
                  setNewLessonForm({ ...newLessonForm, skills: e.target.value })
                }
                placeholder="Descreva as habilidades"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-subject">Matéria</Label>
              <Select
                value={newLessonForm.subject}
                onValueChange={(value) =>
                  setNewLessonForm({ ...newLessonForm, subject: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Matéria" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelNewLesson}>
                Cancelar
              </Button>
              <Button onClick={handleSaveNewLesson}>Criar Aula</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Aula</DialogTitle>
            <DialogDescription>Edite as informações da aula.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !editForm.date && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {editForm.date ? (
                        format(editForm.date, 'PPP')
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={editForm.date}
                      onSelect={(date) => setEditForm({ ...editForm, date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hour">Hora</Label>
                <Input
                  id="edit-hour"
                  value={editForm.hour}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '') // Remove caracteres não numéricos
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + ':' + value.slice(2, 4)
                    }
                    setEditForm({ ...editForm, hour: value })
                  }}
                  placeholder="HH:MM (ex: 08:30)"
                  maxLength={5}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-theme">Tema</Label>
              <Input
                id="edit-theme"
                value={editForm.theme}
                onChange={(e) =>
                  setEditForm({ ...editForm, theme: e.target.value })
                }
                placeholder="Descreva o tema da lição"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-objectives">Objetivos de aprendizagem</Label>
              <Input
                id="edit-objectives"
                value={editForm.objectives}
                onChange={(e) =>
                  setEditForm({ ...editForm, objectives: e.target.value })
                }
                placeholder="Descreva os objetivos de aprendizagem"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-skills">Habilidades</Label>
              <Input
                id="edit-skills"
                value={editForm.skills}
                onChange={(e) =>
                  setEditForm({ ...editForm, skills: e.target.value })
                }
                placeholder="Descreva as habilidades"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Matéria</Label>
              <Select
                value={editForm.subject}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, subject: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Matéria" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        description="Tem certeza que deseja excluir a aula"
        itemName={lessonToDelete?.theme || lessonToDelete?.objectives}
      />

      {/* Sticky Save Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={saveLessonPlan}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Save className="h-5 w-5 mr-2" />
          Salvar Plano
        </Button>
      </div>
    </div>
  )
}

export default LessonPlannerPage
