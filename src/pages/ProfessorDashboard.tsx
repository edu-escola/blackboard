
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ClipboardCheck, FileEdit, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  // Mock professor data
  const professor = {
    firstName: "Sarah",
    lastName: "Johnson",
    title: "Dr."
  };

  // Mock upcoming lessons data
  const upcomingLessons = [
    {
      id: 1,
      class: "Mathematics 101",
      subject: "Algebra Fundamentals",
      date: "2024-01-15",
      time: "09:00 AM",
      students: 28,
      room: "Room A101"
    },
    {
      id: 2,
      class: "Mathematics 101",
      subject: "Geometry Basics",
      date: "2024-01-16",
      time: "10:30 AM",
      students: 28,
      room: "Room A101"
    },
    {
      id: 3,
      class: "Science Lab",
      subject: "Chemical Reactions",
      date: "2024-01-17",
      time: "02:00 PM",
      students: 22,
      room: "Lab B201"
    },
    {
      id: 4,
      class: "Mathematics 101",
      subject: "Problem Solving",
      date: "2024-01-18",
      time: "09:00 AM",
      students: 28,
      room: "Room A101"
    },
    {
      id: 5,
      class: "Science Lab",
      subject: "Lab Safety",
      date: "2024-01-19",
      time: "02:00 PM",
      students: 22,
      room: "Lab B201"
    }
  ];

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduCity</span>

            <Select defaultValue="lincoln">
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lincoln">Lincoln Elementary</SelectItem>
                <SelectItem value="washington">Washington High School</SelectItem>
                <SelectItem value="roosevelt">Roosevelt Middle School</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {professor.title} {professor.lastName}
          </h1>
          <p className="text-gray-600">Veja o que está acontecendo com suas turmas hoje</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Action Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
              
              <Card 
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate("/professor/attendance")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ClipboardCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Registrar Presença</h4>
                      <p className="text-sm text-gray-600">Marque a presença dos alunos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate("/professor/lesson-planner")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileEdit className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Planejar Aulas</h4>
                      <p className="text-sm text-gray-600">Crie planos de aula</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate("/professor/evaluations")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Corrigir Avaliações</h4>
                      <p className="text-sm text-gray-600">Revise o trabalho dos alunos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>


          {/* Right Column - Upcoming Lessons */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Lessons</CardTitle>
                <p className="text-sm text-gray-600">Next 7 days</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {lesson.class}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {lesson.students} students
                        </span>
                      </div>
                      <h4 className="font-medium text-sm text-gray-900">
                        {lesson.subject}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                        <span>{new Date(lesson.date).toLocaleDateString()}</span>
                        <span>{lesson.time}</span>
                        <span>{lesson.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessorDashboard;
