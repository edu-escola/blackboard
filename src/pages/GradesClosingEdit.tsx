import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState } from 'react'

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
  { id: 1, name: 'Alice Johnson', average: '', absences: '', justifiedAbsences: '' },
  { id: 2, name: 'Bob Wilson', average: '', absences: '', justifiedAbsences: '' },
  { id: 3, name: 'Carol Brown', average: '', absences: '', justifiedAbsences: '' },
]

const GradesClosingEdit = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const initial = location.state || {}
  const [form, setForm] = useState({
    bimester: initial.bimester || '',
    period: initial.period || '',
    class: initial.class || '',
    subject: initial.subject || '',
    plannedLessons: '',
    givenLessons: '',
    students: students.map(s => ({ ...s })),
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Fechamento de Notas</h1>
            <div className="text-gray-600 text-sm mt-1">
              {form.bimester && `${bimesters.find(b => b.value === form.bimester)?.label}`}
              {form.period && ` | Período: ${form.period}`}
              {form.class && ` | Turma: ${form.class}`}
              {form.subject && ` | Matéria: ${form.subject}`}
            </div>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // Aqui você pode implementar a lógica de salvar o fechamento
              navigate('/professor/grades-closing')
            }}
          >
            Salvar Fechamento
          </Button>
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Gerenciamento de aulas
              </h3>
              <div className="text-gray-600 text-sm">
                {form.bimester && `${bimesters.find(b => b.value === form.bimester)?.label}`}
                {form.period && ` | Período: ${form.period}`}
                {form.class && ` | Turma: ${form.class}`}
                {form.subject && ` | Matéria: ${form.subject}`}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plannedLessons">Aulas Previstas</Label>
                <Input
                  id="plannedLessons"
                  type="number"
                  min={0}
                  value={form.plannedLessons}
                  onChange={e => setForm(f => ({ ...f, plannedLessons: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="givenLessons">Aulas Dadas</Label>
                <Input
                  id="givenLessons"
                  type="number"
                  min={0}
                  value={form.givenLessons}
                  onChange={e => setForm(f => ({ ...f, givenLessons: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nota (Média)</TableHead>
                  <TableHead>Faltas</TableHead>
                  <TableHead>Faltas Compensadas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.students.map((student, idx) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                        value={student.average}
                        onChange={e => {
                          const updated = [...form.students]
                          updated[idx].average = e.target.value
                          setForm(f => ({ ...f, students: updated }))
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={student.absences}
                        onChange={e => {
                          const updated = [...form.students]
                          updated[idx].absences = e.target.value
                          setForm(f => ({ ...f, students: updated }))
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={student.justifiedAbsences}
                        onChange={e => {
                          const updated = [...form.students]
                          updated[idx].justifiedAbsences = e.target.value
                          setForm(f => ({ ...f, students: updated }))
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default GradesClosingEdit 