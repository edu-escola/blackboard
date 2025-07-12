import { useState } from "react";
import { ArrowLeft, Plus, Edit, Calendar, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EvaluationsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [studentGrades, setStudentGrades] = useState<{[key: string]: number}>({});
  const [selectedSchool, setSelectedSchool] = useState("");

  // Mock data
  const classes = [
    { id: "math101", name: "Mathematics 101" },
    { id: "science102", name: "Science 102" },
    { id: "english201", name: "English 201" }
  ];

  const schools = [
    { id: "lincoln", name: "Lincoln Elementary" },
    { id: "washington", name: "Washington High School" },
    { id: "roosevelt", name: "Roosevelt Middle School" }
  ];

  const subjects = ["Mathematics", "Science", "English", "History", "Physics", "Chemistry"];

  const activities = [
    {
      id: 1,
      title: "Algebra Quiz #1",
      class: "Mathematics 101",
      subject: "Mathematics",
      dueDate: "2024-01-20",
      status: "Open",
      avgScore: 8.5,
      maxScore: 10,
      type: "Quiz"
    },
    {
      id: 2,
      title: "Midterm Exam",
      class: "Mathematics 101",
      subject: "Mathematics", 
      dueDate: "2024-01-25",
      status: "Graded",
      avgScore: 7.8,
      maxScore: 100,
      type: "Test"
    },
    {
      id: 3,
      title: "Geometry Assignment",
      class: "Mathematics 101",
      subject: "Mathematics",
      dueDate: "2024-01-30",
      status: "Draft",
      avgScore: null,
      maxScore: 20,
      type: "Assignment"
    }
  ];

  const students = [
    { id: "1", name: "Alice Johnson", enrollmentNumber: "LN2024001" },
    { id: "2", name: "Bob Wilson", enrollmentNumber: "LN2024002" },
    { id: "3", name: "Carol Brown", enrollmentNumber: "LN2024003" },
    { id: "4", name: "David Miller", enrollmentNumber: "LN2024004" },
    { id: "5", name: "Eva Davis", enrollmentNumber: "LN2024005" },
    { id: "6", name: "Frank Garcia", enrollmentNumber: "LN2024006" }
  ];

  // Form state
  const [newActivity, setNewActivity] = useState({
    title: "",
    type: "",
    class: "",
    subject: "",
    date: "",
    maxScore: "",
    description: ""
  });

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    // Initialize grades for students
    const initialGrades: {[key: string]: number} = {};
    students.forEach(student => {
      // Mock some existing grades
      if (activity.status === "Graded") {
        initialGrades[student.id] = Math.floor(Math.random() * activity.maxScore);
      }
    });
    setStudentGrades(initialGrades);
    setGradeModalOpen(true);
  };

  const handleGradeChange = (studentId: string, grade: string) => {
    const numericGrade = parseFloat(grade);
    if (!isNaN(numericGrade)) {
      setStudentGrades(prev => ({
        ...prev,
        [studentId]: numericGrade
      }));
      
      // Auto-save simulation
      toast({
        title: "Grade Saved",
        description: `Grade for ${students.find(s => s.id === studentId)?.name} saved automatically`,
      });
    }
  };

  const handleCreateActivity = () => {
    if (!newActivity.title || !newActivity.type || !newActivity.class || !newActivity.subject || !newActivity.date || !newActivity.maxScore) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Activity Created Successfully!",
      description: `${newActivity.title} has been created and is ready for student submissions.`,
    });

    // Reset form
    setNewActivity({
      title: "",
      type: "",
      class: "",
      subject: "",
      date: "",
      maxScore: "",
      description: ""
    });

    // Redirect to activities list
    setTimeout(() => {
      // This would redirect to the activities list tab
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800";
      case "Graded": return "bg-blue-100 text-blue-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Quiz": return <FileText className="h-4 w-4" />;
      case "Test": return <GraduationCap className="h-4 w-4" />;
      case "Assignment": return <Edit className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select school" />
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

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activities">Lista de Atividades</TabsTrigger>
            <TabsTrigger value="create">Criar Nova</TabsTrigger>
          </TabsList>

          {/* Activities List Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Atividades e Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Data limite</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Média</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
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
                              <div className="text-sm text-gray-500">{activity.type}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{activity.class}</TableCell>
                        <TableCell>{activity.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{new Date(activity.dueDate).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {activity.avgScore !== null ? (
                            <span className="font-medium">
                              {activity.avgScore}/{activity.maxScore}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not graded</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create New Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Criar Nova Atividade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity(prev => ({...prev, title: e.target.value}))}
                      placeholder="ex.: Prova Bimestral"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select value={newActivity.type} onValueChange={(value) => setNewActivity(prev => ({...prev, type: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quiz">Quiz</SelectItem>
                        <SelectItem value="Test">Teste</SelectItem>
                        <SelectItem value="Assignment">Trabalho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class">Turma *</Label>
                    <Select value={newActivity.class} onValueChange={(value) => setNewActivity(prev => ({...prev, class: value}))}>
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
                    <Select value={newActivity.subject} onValueChange={(value) => setNewActivity(prev => ({...prev, subject: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina" />
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Data limite *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity(prev => ({...prev, date: e.target.value}))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxScore">Nota Máxima *</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      value={newActivity.maxScore}
                      onChange={(e) => setNewActivity(prev => ({...prev, maxScore: e.target.value}))}
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição (Opcional)</Label>
                  <Textarea
                    id="description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({...prev, description: e.target.value}))}
                    placeholder="Instruções ou detalhes adicionais..."
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setNewActivity({
                      title: "", type: "", class: "", subject: "", date: "", maxScore: "", description: ""
                    })}
                  >
                    Limpar Formulário
                  </Button>
                  <Button onClick={handleCreateActivity}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Atividade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Grade Modal */}
      <Dialog open={gradeModalOpen} onOpenChange={setGradeModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Avaliar Atividade: {selectedActivity?.title}</DialogTitle>
            <DialogDescription>
              Insira as notas de cada aluno. As alterações são salvas automaticamente.
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Turma</Label>
                  <p className="text-sm">{selectedActivity.class}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Disciplina</Label>
                  <p className="text-sm">{selectedActivity.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nota Máxima</Label>
                  <p className="text-sm">{selectedActivity.maxScore}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Notas dos Alunos</h4>
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium">{student.name}</h5>
                      <p className="text-sm text-gray-600 font-mono">{student.enrollmentNumber}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max={selectedActivity.maxScore}
                        value={studentGrades[student.id] || ""}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        onBlur={(e) => handleGradeChange(student.id, e.target.value)}
                        placeholder="Nota"
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-gray-500">/ {selectedActivity.maxScore}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setGradeModalOpen(false)}>
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluationsPage;