import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'

const AttendancePage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedAttendance, setSelectedAttendance] = useState('')
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({})
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const userId = localStorage.getItem('userId')

  const getClasses = async () => {
    const response = await api.get('/classes', {
      params: {
        userId,
      },
    })
    console.log('classes', response.data.data)
    setClasses(response.data.data)
  }

  const getSubjects = async () => {
    const response = await api.get('/subjects', {
      params: {
        userId,
      },
    })
    console.log('subjects', response.data.data)
    setSubjects(response.data.data)
  }

  const getStudents = async (attendanceId?: string) => {
    const response = await api.get('/students', {
      params: {
        classId: selectedClass,
        limit: 1000,
        attendanceId,
      },
    })
    console.log('students', response.data.data)
    setStudents(response.data.data)
  }

  const getAttendance = async () => {
    const response = await api.get('/attendance', {
      params: {
        userId,
        classId: selectedClass,
        subjectId: selectedSubject,
        date: selectedDate,
      },
    })
    if (response.data.data.length > 0) {
      console.log('selected attendance', response.data.data[0].id)
      setSelectedAttendance(response.data.data[0].id)
    } else {
      setSelectedAttendance('')
    }
  }

  const getStudentsAttendance = async (attendanceId: string) => {
    const response = await api.get('/students', {
      params: {
        attendanceId,
      },
    })
    console.log('students attendance', response.data.data)
  }

  useEffect(() => {
    getClasses()
    getSubjects()
  }, [])

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      if (selectedAttendance) {
        getStudents(selectedAttendance)
      } else {
        getStudents()
      }
    }
  }, [selectedClass, selectedSubject, selectedAttendance])

  useEffect(() => {
    if (selectedDate && selectedClass && selectedSubject) {
      getAttendance()
    }
  }, [selectedDate, selectedClass, selectedSubject])

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const isCurrentMonth = date.getMonth() === month
      const isToday = date.toDateString() === today.toDateString()
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString()
      const isPast = date < today && !isToday

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isPast,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    // Initialize attendance for all students as present by default [TEMP]
    // const initialAttendance: { [key: string]: boolean } = {}
    // students.forEach((student) => {
    //   initialAttendance[student.id] = true
    // })
    // setAttendance(initialAttendance)
  }

  // Handle attendance toggle
  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
  }

  // Mark all present
  const markAllPresent = () => {
    const allPresent: { [key: string]: boolean } = {}
    students.forEach((student) => {
      allPresent[student.id] = true
    })
    setAttendance(allPresent)
  }

  // Save attendance
  const saveAttendance = () => {
    if (!selectedDate || !selectedClass || !selectedSubject) {
      toast({
        title: 'Erro',
        description:
          'Selecione a data, escola, turma e disciplina antes de salvar.',
        variant: 'destructive',
      })
      return
    }

    const presentCount = Object.values(attendance).filter(Boolean).length
    const totalStudents = students.length

    toast({
      title: 'Presença salva com sucesso!',
      description: `${presentCount}/${totalStudents} alunos marcados como presentes para ${selectedDate.toLocaleDateString()}`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/professor/dashboard')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Presença</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Calendar */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]}{' '}
                  {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-sm font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`
                      p-3 text-center text-sm rounded-lg transition-colors border
                      ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                      ${day.isToday ? 'bg-blue-100 border-blue-300 text-blue-900 font-bold' : 'border-transparent'}
                      ${day.isSelected ? 'bg-blue-600 text-white border-blue-600' : ''}
                      ${day.isPast && !day.isSelected ? 'text-gray-400' : ''}
                      ${!day.isSelected ? 'hover:bg-gray-100' : ''}
                      ${day.isCurrentMonth ? 'cursor-pointer' : 'cursor-default'}
                    `}
                    disabled={!day.isCurrentMonth}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Attendance Panel */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col overflow-hidden">
          {selectedDate ? (
            <Card className="border-0 shadow-sm flex-1 flex flex-col overflow-hidden">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="text-lg">
                  Presença para {selectedDate.toLocaleDateString()}
                </CardTitle>

                {/* Selectors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Turma</label>
                    <Select
                      value={selectedClass}
                      onValueChange={setSelectedClass}
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
                    <label className="text-sm font-medium">Disciplina</label>
                    <Select
                      value={selectedSubject}
                      onValueChange={setSelectedSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a matéria" />
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
                </div>

                {selectedClass && selectedSubject && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {Object.values(attendance).filter(Boolean).length}/
                        {students.length} presentes
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllPresent}
                      className="text-green-600 border-green-200 hover:bg-green-50 w-full"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Marcar todos com presença
                    </Button>
                  </div>
                )}
              </CardHeader>

              {/* Student List */}
              {selectedClass && selectedSubject && (
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="space-y-3">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-sm text-gray-600 font-mono">
                            {student.registrationNumber}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-sm font-medium ${
                              attendance[student.id]
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {attendance[student.id] ? 'Presente' : 'Ausente'}
                          </span>
                          <Switch
                            checked={attendance[student.id] || false}
                            onCheckedChange={() => toggleAttendance(student.id)}
                            className={`${
                              attendance[student.id]
                                ? 'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600'
                                : 'data-[state=unchecked]:bg-red-600 data-[state=unchecked]:border-red-600'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ) : (
            <Card className="border-0 shadow-sm flex-1 flex items-center justify-center">
              <CardContent className="text-center">
                <div className="text-gray-400 mb-4">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione uma data
                </h3>
                <p className="text-gray-600">
                  Selecione uma data no calendário para fazer a chamada
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      {selectedDate && selectedClass && selectedSubject && (
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex justify-center lg:justify-end">
            <Button
              onClick={saveAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 w-full lg:w-auto"
            >
              Salvar chamada
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendancePage
