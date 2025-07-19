import { useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const bimesters = [
  { value: '1', label: '1º Bimestre' },
  { value: '2', label: '2º Bimestre' },
  { value: '3', label: '3º Bimestre' },
  { value: '4', label: '4º Bimestre' },
]

const periods = ['Manhã', 'Tarde', 'Noite', 'Integral']
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
const subjects = [
  'Matemática',
  'Ciências',
  'Inglês',
  'História',
  'Física',
  'Química',
]

const students = [
  {
    id: 1,
    name: 'Alice Johnson',
    average: 8.2,
    absences: 3,
    justifiedAbsences: 1,
  },
  {
    id: 2,
    name: 'Bob Wilson',
    average: 7.5,
    absences: 2,
    justifiedAbsences: 0,
  },
  {
    id: 3,
    name: 'Carol Brown',
    average: 6.9,
    absences: 5,
    justifiedAbsences: 2,
  },
]

// Mock de fechamentos já realizados
const closedGrades = [
  {
    id: 1,
    bimester: '1',
    period: 'Manhã',
    class: 'Turma 1A',
    subject: 'Matemática',
    plannedLessons: 20,
    givenLessons: 18,
    students,
  },
  {
    id: 2,
    bimester: '2',
    period: 'Tarde',
    class: 'Turma 2B',
    subject: 'História',
    plannedLessons: 22,
    givenLessons: 21,
    students,
  },
]

const GradesManagement = () => {
  const navigate = useNavigate()
  const [bimester, setBimester] = useState<string | undefined>(undefined)
  const [period, setPeriod] = useState<string | undefined>(undefined)
  const [classFilter, setClassFilter] = useState<string | undefined>(undefined)
  const [subject, setSubject] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [plannedLessons, setPlannedLessons] = useState('')
  const [givenLessons, setGivenLessons] = useState('')
  const [selectedClosing, setSelectedClosing] = useState<any>(null)
  const [newClosingModalOpen, setNewClosingModalOpen] = useState(false)
  const [newClosing, setNewClosing] = useState({
    bimester: undefined,
    period: undefined,
    class: undefined,
    subject: undefined,
    plannedLessons: undefined,
    givenLessons: undefined,
  })
  // Novo estado para saber se está criando novo fechamento
  const [isCreating, setIsCreating] = useState(false)
  // Novo estado para modal de edição de aulas
  const [editLessonsModalOpen, setEditLessonsModalOpen] = useState(false)
  const [editLessons, setEditLessons] = useState({ plannedLessons: '', givenLessons: '' })

  // Filtro para alunos só na tela de detalhes
  const filteredStudents = (selectedClosing?.students || students).filter((student: any) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (selectedClosing) {
                  setSelectedClosing(null)
                } else {
                  navigate('/professor/dashboard')
                }
              }}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedClosing ? 'Detalhes do Fechamento de Notas' : 'Fechamentos de Notas'}
            </h1>
          </div>
          {/* Botão e subtítulo só na tela inicial */}
          {!selectedClosing && (
            <div className="flex flex-col sm:items-end">              
              <Button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                onClick={() => setNewClosingModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Fechamento
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filtros - só na tela inicial */}
        {!selectedClosing && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-[180px]">
                  <Label htmlFor="bimester">Bimestre</Label>
                  <Select value={bimester} onValueChange={setBimester}>
                    <SelectTrigger id="bimester">
                      <SelectValue placeholder="Bimestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {bimesters.map((b) => (
                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <Label htmlFor="period">Período</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <Label htmlFor="class">Turma</Label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <Label htmlFor="subject">Matéria</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Listagem de fechamentos ou detalhes */}
        {!selectedClosing ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fechamentos Concluídos</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bimestre</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Matéria</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {closedGrades.map((closing) => (
                    <TableRow
                      key={closing.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedClosing(closing)}
                    >
                      <TableCell>{bimesters.find(b => b.value === closing.bimester)?.label}</TableCell>
                      <TableCell>{closing.period}</TableCell>
                      <TableCell>{closing.class}</TableCell>
                      <TableCell>{closing.subject}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Gerenciamento de aulas */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Gerenciamento de aulas
                  <span className="ml-4 text-sm font-normal text-gray-500">
                    {bimesters.find(b => b.value === selectedClosing.bimester)?.label}
                    {selectedClosing.period ? ` | Período: ${selectedClosing.period}` : ''}
                    {selectedClosing.class ? ` | Turma: ${selectedClosing.class}` : ''}
                    {selectedClosing.subject ? ` | Matéria: ${selectedClosing.subject}` : ''}
                  </span>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aulas Previstas</TableHead>
                      <TableHead>Aulas Dadas</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{selectedClosing.plannedLessons}</TableCell>
                      <TableCell>{selectedClosing.givenLessons}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditLessons({
                              plannedLessons: selectedClosing.plannedLessons,
                              givenLessons: selectedClosing.givenLessons,
                            })
                            setEditLessonsModalOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Tabela de alunos */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[22%]">Nome</TableHead>
                      <TableHead className="w-[18%] text-center">Nota (Média)</TableHead>
                      <TableHead className="w-[18%] text-center">Faltas</TableHead>
                      <TableHead className="w-[18%] text-center">Faltas Compensadas</TableHead>
                      {!isCreating && <TableHead className="w-[18%] text-center">Ações</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student: any, idx: number) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-center">
                          {isCreating ? (
                            <Input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={selectedClosing.students[idx].average}
                              onChange={e => {
                                const updated = [...selectedClosing.students]
                                updated[idx].average = e.target.value
                                setSelectedClosing({ ...selectedClosing, students: updated })
                              }}
                            />
                          ) : (
                            student.average
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isCreating ? (
                            <Input
                              type="number"
                              min={0}
                              value={selectedClosing.students[idx].absences}
                              onChange={e => {
                                const updated = [...selectedClosing.students]
                                updated[idx].absences = e.target.value
                                setSelectedClosing({ ...selectedClosing, students: updated })
                              }}
                            />
                          ) : (
                            student.absences
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isCreating ? (
                            <Input
                              type="number"
                              min={0}
                              value={selectedClosing.students[idx].justifiedAbsences}
                              onChange={e => {
                                const updated = [...selectedClosing.students]
                                updated[idx].justifiedAbsences = e.target.value
                                setSelectedClosing({ ...selectedClosing, students: updated })
                              }}
                            />
                          ) : (
                            student.justifiedAbsences
                          )}
                        </TableCell>
                        {!isCreating && (
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingStudent(student)
                                setEditModalOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Botão de salvar fechamento no topo da tela de criação */}
            {isCreating && (
              <div className="flex justify-end mb-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // Aqui você pode implementar a lógica de salvar o fechamento
                    setIsCreating(false)
                  }}
                >
                  Salvar Fechamento
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Student Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Editar Dados do Aluno</DialogTitle>
            <DialogDescription>Altere as informações do aluno para este bimestre.</DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <p className="mt-1 text-gray-900 font-medium">{editingStudent.name}</p>
              </div>
              <div>
                <Label htmlFor="edit-average">Nota (Média)</Label>
                <Input
                  id="edit-average"
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={editingStudent.average}
                  onChange={e => setEditingStudent({ ...editingStudent, average: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-absences">Faltas</Label>
                <Input
                  id="edit-absences"
                  type="number"
                  min={0}
                  value={editingStudent.absences}
                  onChange={e => setEditingStudent({ ...editingStudent, absences: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-justified">Faltas Compensadas</Label>
                <Input
                  id="edit-justified"
                  type="number"
                  min={0}
                  value={editingStudent.justifiedAbsences}
                  onChange={e => setEditingStudent({ ...editingStudent, justifiedAbsences: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setEditModalOpen(false)}
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Closing Modal */}
      <Dialog open={newClosingModalOpen} onOpenChange={setNewClosingModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Novo Fechamento de Notas</DialogTitle>
            <DialogDescription>Preencha os dados para criar um novo fechamento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-bimester">Bimestre</Label>
              <Select
                value={newClosing.bimester}
                onValueChange={v => setNewClosing(c => ({ ...c, bimester: v }))}
              >
                <SelectTrigger id="new-bimester">
                  <SelectValue placeholder="Bimestre" />
                </SelectTrigger>
                <SelectContent>
                  {bimesters.map(b => (
                    <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-period">Período</Label>
              <Select
                value={newClosing.period}
                onValueChange={v => setNewClosing(c => ({ ...c, period: v }))}
              >
                <SelectTrigger id="new-period">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-class">Turma</Label>
              <Select
                value={newClosing.class}
                onValueChange={v => setNewClosing(c => ({ ...c, class: v }))}
              >
                <SelectTrigger id="new-class">
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-subject">Matéria</Label>
              <Select
                value={newClosing.subject}
                onValueChange={v => setNewClosing(c => ({ ...c, subject: v }))}
              >
                <SelectTrigger id="new-subject">
                  <SelectValue placeholder="Matéria" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-planned-lessons">Aulas Previstas</Label>
              <Input
                id="new-planned-lessons"
                type="number"
                min={0}
                value={newClosing.plannedLessons || ''}
                onChange={e => setNewClosing(c => ({ ...c, plannedLessons: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="new-given-lessons">Aulas Dadas</Label>
              <Input
                id="new-given-lessons"
                type="number"
                min={0}
                value={newClosing.givenLessons || ''}
                onChange={e => setNewClosing(c => ({ ...c, givenLessons: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewClosingModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (newClosing.bimester && newClosing.period && newClosing.class && newClosing.subject && newClosing.plannedLessons && newClosing.givenLessons) {
                    navigate('/professor/grades-managament/new', { state: newClosing })
                    setNewClosingModalOpen(false)
                    setNewClosing({ bimester: undefined, period: undefined, class: undefined, subject: undefined, plannedLessons: undefined, givenLessons: undefined })
                  }
                }}
                disabled={!(newClosing.bimester && newClosing.period && newClosing.class && newClosing.subject && newClosing.plannedLessons && newClosing.givenLessons)}
              >
                Criar Fechamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Lessons Modal */}
      <Dialog open={editLessonsModalOpen} onOpenChange={setEditLessonsModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Editar Aulas</DialogTitle>
            <DialogDescription>Altere a quantidade de aulas previstas e dadas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-planned">Aulas Previstas</Label>
              <Input
                id="edit-planned"
                type="number"
                min={0}
                value={editLessons.plannedLessons}
                onChange={e => setEditLessons(l => ({ ...l, plannedLessons: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-given">Aulas Dadas</Label>
              <Input
                id="edit-given"
                type="number"
                min={0}
                value={editLessons.givenLessons}
                onChange={e => setEditLessons(l => ({ ...l, givenLessons: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditLessonsModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setSelectedClosing({
                    ...selectedClosing,
                    plannedLessons: editLessons.plannedLessons,
                    givenLessons: editLessons.givenLessons,
                  })
                  setEditLessonsModalOpen(false)
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GradesManagement 