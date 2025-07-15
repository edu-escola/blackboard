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
import { ArrowLeft } from 'lucide-react'
import { Edit } from 'lucide-react'
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

const FechamentoNotas = () => {
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

  const filteredStudents = students.filter((student) => {
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
            <button
              className="hover:bg-gray-100 rounded-full p-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Fechamento de Notas</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filtros */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Pesquise alunos por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={bimester} onValueChange={setBimester}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Bimestre" />
                </SelectTrigger>
                <SelectContent>
                  {bimesters.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Sala" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Matéria" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gerenciamento de aulas */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Gerenciamento de aulas
                  <span className="ml-4 text-sm font-normal text-gray-500">
                    {bimester ? `Bimestre: ${bimesters.find(b => b.value === bimester)?.label}` : ''}
                    {period ? ` | Período: ${period}` : ''}
                    {classFilter ? ` | Turma: ${classFilter}` : ''}
                    {subject ? ` | Matéria: ${subject}` : ''}
                  </span>
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="planned-lessons">Aulas Previstas</Label>
                  <Input
                    id="planned-lessons"
                    type="number"
                    min={0}
                    value={plannedLessons}
                    onChange={e => setPlannedLessons(e.target.value)}
                    placeholder="Quantidade de aulas previstas"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="given-lessons">Aulas Dadas</Label>
                  <Input
                    id="given-lessons"
                    type="number"
                    min={0}
                    value={givenLessons}
                    onChange={e => setGivenLessons(e.target.value)}
                    placeholder="Quantidade de aulas dadas"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de alunos */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nota (Média)</TableHead>
                  <TableHead>Faltas</TableHead>
                  <TableHead>Faltas Compensadas</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.average}</TableCell>
                    <TableCell>{student.absences}</TableCell>
                    <TableCell>{student.justifiedAbsences}</TableCell>
                    <TableCell>
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        title="Editar"
                        onClick={() => {
                          setEditingStudent(student)
                          setEditModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
                <Input id="edit-name" value={editingStudent.name} disabled />
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
    </div>
  )
}

export default FechamentoNotas 