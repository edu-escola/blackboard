import { useState } from 'react'
import { ArrowLeft, Plus, Calendar, Copy, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

interface LessonRow {
  id: string
  date: Date | undefined
  hour: string // nova coluna
  theme: string // agora é Tema
  objectives: string // agora é Objetivos de aprendizagem
  skills: string // nova coluna Habilidades
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
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
    "22:00", "22:30", "23:00"
  ]

  const bimesters = [
    { value: '1', label: '1° Bimestre' },
    { value: '2', label: '2° Bimestre' },
    { value: '3', label: '3° Bimestre' },
    { value: '4', label: '4° Bimestre' },
  ]

  // Mock de semanas
  const weeks = [
    '01/01-05/01', '06/01-10/01', '11/01-15/01', '16/01-20/01', '21/01-25/01', '26/01-30/01', '01/02-05/02', '06/02-10/02', '11/02-15/02'
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
    const newLesson: LessonRow = {
      id: generateId(),
      date: undefined,
      hour: '',
      theme: '',
      objectives: '',
      skills: '',
      subject: '',
    }
    setLessons((prev) => [...prev, newLesson])
  }

  // Update lesson field
  const updateLesson = (id: string, field: keyof LessonRow, value: any) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id ? { ...lesson, [field]: value } : lesson
      )
    )
  }

  // Delete lesson row
  const deleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((lesson) => lesson.id !== id))
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
      </header>

      {/* Controls */}
      <div className="p-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                <div className="space-y-2">
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

                <div className="space-y-2">
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

              <div className="flex items-center space-x-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Semana</label>
                  <Select
                    value={selectedWeek}
                    onValueChange={setSelectedWeek}
                  >
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
      <div className="px-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle>
              Plano de Aula -{' '}
              {bimesters.find((b) => b.value === selectedBimester)?.label}
            </CardTitle>
            <Button onClick={addLessonRow} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Linha
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Data</TableHead>
                    <TableHead className="w-42">Hora</TableHead>
                    <TableHead className="w-80">Tema</TableHead>
                    <TableHead className="min-w-80">Objetivos de aprendizagem</TableHead>
                    <TableHead className="w-55">Habilidades</TableHead>
                    <TableHead className="w-48">Matéria</TableHead>
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !lesson.date && 'text-muted-foreground'
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {lesson.date ? (
                                format(lesson.date, 'PPP')
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={lesson.date}
                              onSelect={(date) =>
                                updateLesson(lesson.id, 'date', date)
                              }
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lesson.hour}
                          onValueChange={(value) =>
                            updateLesson(lesson.id, 'hour', value)
                          }
                        >
                          <SelectTrigger className="border-0 focus:ring-1 focus:ring-blue-500">
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {hours.map((h) => (
                              <SelectItem key={h} value={h}>
                                {h}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={lesson.theme}
                          onChange={(e) =>
                            updateLesson(lesson.id, 'theme', e.target.value)
                          }
                          placeholder="Descreva o tema da lição"
                          className="border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={lesson.objectives}
                          onChange={(e) =>
                            updateLesson(lesson.id, 'objectives', e.target.value)
                          }
                          placeholder="Descreva os objetivos de aprendizagem"
                          className="border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={lesson.skills}
                          onChange={(e) =>
                            updateLesson(lesson.id, 'skills', e.target.value)
                          }
                          placeholder="Descreva as habilidades"
                          className="border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lesson.subject}
                          onValueChange={(value) =>
                            updateLesson(lesson.id, 'subject', value)
                          }
                        >
                          <SelectTrigger className="border-0 focus:ring-1 focus:ring-blue-500">
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
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLesson(lesson.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Deletar
                        </Button>
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
            onClick={() => setOpenDropdown(openDropdown === 'detalhamento' ? null : 'detalhamento')}
          >
            Detalhamento das Aulas
            <span>{openDropdown === 'detalhamento' ? '▲' : '▼'}</span>
          </button>
          {openDropdown === 'detalhamento' && (
            <div className="px-4 pb-4">
              <textarea
                className="w-full border rounded p-2 mt-2 min-h-[80px] focus:ring-1 focus:ring-blue-500"
                value={detalhamento}
                onChange={e => setDetalhamento(e.target.value)}
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
            onClick={() => setOpenDropdown(openDropdown === 'avaliacao' ? null : 'avaliacao')}
          >
            Forma de Avaliação
            <span>{openDropdown === 'avaliacao' ? '▲' : '▼'}</span>
          </button>
          {openDropdown === 'avaliacao' && (
            <div className="px-4 pb-4">
              <textarea
                className="w-full border rounded p-2 mt-2 min-h-[80px] focus:ring-1 focus:ring-blue-500"
                value={avaliacao}
                onChange={e => setAvaliacao(e.target.value)}
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
            onClick={() => setOpenDropdown(openDropdown === 'consideracoes' ? null : 'consideracoes')}
          >
            Considerações
            <span>{openDropdown === 'consideracoes' ? '▲' : '▼'}</span>
          </button>
          {openDropdown === 'consideracoes' && (
            <div className="px-4 pb-4">
              <textarea
                className="w-full border rounded p-2 mt-2 min-h-[80px] focus:ring-1 focus:ring-blue-500"
                value={consideracoes}
                onChange={e => setConsideracoes(e.target.value)}
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
            onClick={() => setOpenDropdown(openDropdown === 'observacoes' ? null : 'observacoes')}
          >
            Observações do Coordenador
            <span>{openDropdown === 'observacoes' ? '▲' : '▼'}</span>
          </button>
          {openDropdown === 'observacoes' && (
            <div className="px-4 pb-4">
              <textarea
                className="w-full border rounded p-2 mt-2 min-h-[80px] focus:ring-1 focus:ring-blue-500"
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Digite as observações do coordenador..."
              />
            </div>
          )}
        </div>
      </div>

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
