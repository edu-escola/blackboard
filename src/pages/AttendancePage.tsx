import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AttendancePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendance, setAttendance] = useState<{[key: string]: boolean}>({});

  // Mock data
  const schools = [
    { id: "lincoln", name: "Lincoln Elementary" },
    { id: "washington", name: "Washington High School" },
    { id: "roosevelt", name: "Roosevelt Middle School" }
  ];

  const classes = [
    { id: "math101", name: "Matemática 101", schoolId: "lincoln" },
    { id: "science102", name: "Ciências 102", schoolId: "lincoln" },
    { id: "english201", name: "Inglês 201", schoolId: "washington" },
    { id: "history301", name: "História 301", schoolId: "washington" }
  ];

  const subjects = ["Matemática", "Ciências", "Inglês", "História", "Física", "Química"];

  const students = [
    { id: "1", name: "Alice Johnson", enrollmentNumber: "LN2024001", classId: "math101" },
    { id: "2", name: "Bob Wilson", enrollmentNumber: "LN2024002", classId: "math101" },
    { id: "3", name: "Carol Brown", enrollmentNumber: "LN2024003", classId: "math101" },
    { id: "4", name: "David Miller", enrollmentNumber: "LN2024004", classId: "math101" },
    { id: "5", name: "Eva Davis", enrollmentNumber: "LN2024005", classId: "math101" },
    { id: "6", name: "Frank Garcia", enrollmentNumber: "LN2024006", classId: "math101" },
    { id: "7", name: "Grace Lee", enrollmentNumber: "LN2024007", classId: "math101" },
    { id: "8", name: "Henry Chen", enrollmentNumber: "LN2024008", classId: "math101" }
  ];

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isPast = date < today && !isToday;

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isPast
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // Initialize attendance for all students as present by default
    const initialAttendance: {[key: string]: boolean} = {};
    students.forEach(student => {
      initialAttendance[student.id] = true;
    });
    setAttendance(initialAttendance);
  };

  // Handle attendance toggle
  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // Mark all present
  const markAllPresent = () => {
    const allPresent: {[key: string]: boolean} = {};
    students.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendance(allPresent);
  };

  // Save attendance
  const saveAttendance = () => {
    if (!selectedDate || !selectedSchool || !selectedClass || !selectedSubject) {
      toast({
        title: "Erro",
        description: "Selecione a data, escola, turma e disciplina antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalStudents = students.length;

    toast({
      title: "Presença salva com sucesso!",
      description: `${presentCount}/${totalStudents} alunos marcados como presentes para ${selectedDate.toLocaleDateString()}`,
    });
  };

  // Filter classes by selected school
  const filteredClasses = classes.filter(cls => cls.schoolId === selectedSchool);

  // Filter students by selected class
  const filteredStudents = students.filter(student => student.classId === selectedClass);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/professor/dashboard")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Presença</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Calendar */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
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
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
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
        <div className="w-1/2 p-6 flex flex-col overflow-hidden">
          {selectedDate ? (
            <Card className="border-0 shadow-sm flex-1 flex flex-col overflow-hidden">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="text-lg">
                  Attendance for {selectedDate.toLocaleDateString()}
                </CardTitle>
                
                {/* Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School</label>
                    <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a escola" />
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
                    <label className="text-sm font-medium">Class</label>
                    <Select 
                      value={selectedClass} 
                      onValueChange={setSelectedClass}
                      disabled={!selectedSchool}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma" />
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
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a matéria" />
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
                </div>

                {selectedClass && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {Object.values(attendance).filter(Boolean).length}/{filteredStudents.length} present
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllPresent}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Marcar todos com presença
                    </Button>
                  </div>
                )}
              </CardHeader>

              {/* Student List */}
              {selectedClass && (
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600 font-mono">
                            {student.enrollmentNumber}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">
                            {attendance[student.id] ? 'Present' : 'Absent'}
                          </span>
                          <Switch
                            checked={attendance[student.id] || false}
                            onCheckedChange={() => toggleAttendance(student.id)}
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
                  Select a Date
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
      {selectedDate && selectedClass && (
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex justify-end">
            <Button
              onClick={saveAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Salvar chamada
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;