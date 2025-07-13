import { useState } from "react";
import { ArrowLeft, Plus, Calendar, Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LessonRow {
  id: string;
  date: Date | undefined;
  title: string;
  theme: string;
  subject: string;
}

const LessonPlannerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBimester, setSelectedBimester] = useState("1");
  const [lessons, setLessons] = useState<LessonRow[]>([
    {
      id: "1",
      date: new Date("2024-01-15"),
      title: "Introdução à Álgebra",
      theme: "Conceitos algébricos básicos e variáveis",
      subject: "Matemática"
    },
    {
      id: "2", 
      date: new Date("2024-01-17"),
      title: "Equações Lineares",
      theme: "Resolução de equações lineares com uma variável",
      subject: "Matemática"
    },
    {
      id: "3",
      date: new Date("2024-01-19"),
      title: "Funções gráficas",
      theme: "Introdução aos planos de coordenadas e gráficos",
      subject: "Matemática"
    }
  ]);

  // Mock data
  const schools = [
    { id: "lincoln", name: "Lincoln Elementary" },
    { id: "washington", name: "Washington High School" },
    { id: "roosevelt", name: "Roosevelt Middle School" }
  ];

  const classes = [
    { id: "math101", name: "Mathematics 101", schoolId: "lincoln" },
    { id: "science102", name: "Science 102", schoolId: "lincoln" },
    { id: "english201", name: "English 201", schoolId: "washington" }
  ];

  const subjects = ["Matemática", "Ciências", "Inglês", "História", "Física", "Química", "Artes", "Educação Física"];

  const bimesters = [
    { value: "1", label: "1° Bimestre" },
    { value: "2", label: "2° Bimestre" },
    { value: "3", label: "3° Bimestre" },
    { value: "4", label: "4° Bimestre" }
  ];

  // Filter classes by selected school
  const filteredClasses = classes.filter(cls => cls.schoolId === selectedSchool);

  // Generate new lesson ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add new lesson row
  const addLessonRow = () => {
    const newLesson: LessonRow = {
      id: generateId(),
      date: undefined,
      title: "",
      theme: "",
      subject: ""
    };
    setLessons(prev => [...prev, newLesson]);
  };

  // Update lesson field
  const updateLesson = (id: string, field: keyof LessonRow, value: any) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === id ? { ...lesson, [field]: value } : lesson
    ));
  };

  // Delete lesson row
  const deleteLesson = (id: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== id));
  };


  // Save lesson plan
  const saveLessonPlan = () => {
    if (!selectedSchool || !selectedClass) {
      toast({
        title: "Faltando Informação",
        description: "Selecione a escola e a turma antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    const validLessons = lessons.filter(lesson => 
      lesson.title.trim() !== "" || lesson.theme.trim() !== ""
    );

    toast({
      title: "Plano de aula salvo com sucesso!",
      description: `${validLessons.length} lições salvas para ${bimesters.find(b => b.value === selectedBimester)?.label}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/professor/dashboard")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Planner</h1>
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-64">
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
      </header>

      {/* Controls */}
      <div className="p-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">School</label>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger className="w-48">
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
                  <label className="text-sm font-medium">Class</label>
                  <Select 
                    value={selectedClass} 
                    onValueChange={setSelectedClass}
                    disabled={!selectedSchool}
                  >
                    <SelectTrigger className="w-48">
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
                  <label className="text-sm font-medium">Bimester</label>
                  <Select value={selectedBimester} onValueChange={setSelectedBimester}>
                    <SelectTrigger className="w-40">
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
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Lesson Plan Table */}
      <div className="px-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Lesson Plan - {bimesters.find(b => b.value === selectedBimester)?.label}
            </CardTitle>
            <Button onClick={addLessonRow} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Data</TableHead>
                    <TableHead className="w-64">Título da lição</TableHead>
                    <TableHead className="min-w-80">Tema/Descrição</TableHead>
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
                                "w-full justify-start text-left font-normal",
                                !lesson.date && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {lesson.date ? format(lesson.date, "PPP") : <span>Escolha uma data</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={lesson.date}
                              onSelect={(date) => updateLesson(lesson.id, "date", date)}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLesson(lesson.id, "title", e.target.value)}
                          placeholder="Insira o título da lição"
                          className="border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          value={lesson.theme}
                          onChange={(e) => updateLesson(lesson.id, "theme", e.target.value)}
                          placeholder="Descreva o tema e os objetivos da lição"
                          className="border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Select 
                          value={lesson.subject} 
                          onValueChange={(value) => updateLesson(lesson.id, "subject", value)}
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
  );
};

export default LessonPlannerPage;