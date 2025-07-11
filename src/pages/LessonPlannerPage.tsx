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
      title: "Introduction to Algebra",
      theme: "Basic algebraic concepts and variables",
      subject: "Mathematics"
    },
    {
      id: "2", 
      date: new Date("2024-01-17"),
      title: "Linear Equations",
      theme: "Solving linear equations with one variable",
      subject: "Mathematics"
    },
    {
      id: "3",
      date: new Date("2024-01-19"),
      title: "Graphing Functions",
      theme: "Introduction to coordinate planes and graphing",
      subject: "Mathematics"
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

  const subjects = ["Mathematics", "Science", "English", "History", "Physics", "Chemistry", "Art", "Physical Education"];

  const bimesters = [
    { value: "1", label: "1st Bimester" },
    { value: "2", label: "2nd Bimester" },
    { value: "3", label: "3rd Bimester" },
    { value: "4", label: "4th Bimester" }
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

  // Import from previous bimester
  const importFromPrevious = () => {
    const currentBimester = parseInt(selectedBimester);
    if (currentBimester <= 1) {
      toast({
        title: "No Previous Bimester",
        description: "Cannot import from previous bimester for 1st bimester.",
        variant: "destructive"
      });
      return;
    }

    // Mock previous bimester data
    const previousLessons: LessonRow[] = [
      {
        id: generateId(),
        date: undefined, // Will need to be updated for new bimester
        title: "Review of Previous Concepts",
        theme: "Reviewing key concepts from previous bimester",
        subject: "Mathematics"
      },
      {
        id: generateId(),
        date: undefined,
        title: "Advanced Problem Solving",
        theme: "Building on previous knowledge with complex problems",
        subject: "Mathematics"
      }
    ];

    setLessons(prev => [...prev, ...previousLessons]);
    
    toast({
      title: "Lessons Imported Successfully",
      description: `${previousLessons.length} lessons imported from ${currentBimester - 1}${currentBimester - 1 === 1 ? 'st' : currentBimester - 1 === 2 ? 'nd' : currentBimester - 1 === 3 ? 'rd' : 'th'} bimester.`,
    });
  };

  // Save lesson plan
  const saveLessonPlan = () => {
    if (!selectedSchool || !selectedClass) {
      toast({
        title: "Missing Information",
        description: "Please select school and class before saving.",
        variant: "destructive"
      });
      return;
    }

    const validLessons = lessons.filter(lesson => 
      lesson.title.trim() !== "" || lesson.theme.trim() !== ""
    );

    toast({
      title: "Lesson Plan Saved Successfully!",
      description: `${validLessons.length} lessons saved for ${bimesters.find(b => b.value === selectedBimester)?.label}.`,
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <Select 
                    value={selectedClass} 
                    onValueChange={setSelectedClass}
                    disabled={!selectedSchool}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select class" />
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
                <Button
                  variant="outline"
                  onClick={importFromPrevious}
                  disabled={!selectedClass}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Import from Previous Bimester
                </Button>
                
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
                    <TableHead className="w-40">Date</TableHead>
                    <TableHead className="w-64">Lesson Title</TableHead>
                    <TableHead className="min-w-80">Theme/Description</TableHead>
                    <TableHead className="w-48">Subject</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
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
                              {lesson.date ? format(lesson.date, "PPP") : <span>Pick a date</span>}
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
                          placeholder="Enter lesson title"
                          className="border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          value={lesson.theme}
                          onChange={(e) => updateLesson(lesson.id, "theme", e.target.value)}
                          placeholder="Describe the lesson theme and objectives"
                          className="border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Select 
                          value={lesson.subject} 
                          onValueChange={(value) => updateLesson(lesson.id, "subject", value)}
                        >
                          <SelectTrigger className="border-0 focus:ring-1 focus:ring-blue-500">
                            <SelectValue placeholder="Select subject" />
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
                          Delete
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
          Save Plan
        </Button>
      </div>
    </div>
  );
};

export default LessonPlannerPage;