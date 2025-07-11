
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Users, Calendar, Bell, ClipboardCheck, FileEdit, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
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

  // Calendar data with activity indicators
  const calendarActivities = {
    "2024-01-15": { lessons: true, attendance: false, evaluations: true },
    "2024-01-16": { lessons: true, attendance: true, evaluations: false },
    "2024-01-17": { lessons: true, attendance: false, evaluations: true },
    "2024-01-18": { lessons: true, attendance: true, evaluations: false },
    "2024-01-19": { lessons: true, attendance: false, evaluations: false },
    "2024-01-20": { lessons: false, attendance: true, evaluations: true }
  };

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
    const currentDateObj = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === currentDateObj.toDateString();
      const activities = calendarActivities[dateString];

      days.push({
        date,
        dateString,
        isCurrentMonth,
        isToday,
        activities
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduCity</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Button>
            
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile">View Profile</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
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
          <p className="text-gray-600">Here's what's happening with your classes today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Action Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              
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
                      <h4 className="font-medium text-gray-900">Take Attendance</h4>
                      <p className="text-sm text-gray-600">Mark student attendance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileEdit className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Plan Lessons</h4>
                      <p className="text-sm text-gray-600">Create lesson plans</p>
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
                      <h4 className="font-medium text-gray-900">Grade Evaluations</h4>
                      <p className="text-sm text-gray-600">Review student work</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Middle Column - Calendar Widget */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateMonth('prev')}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateMonth('next')}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        p-2 text-center text-sm relative cursor-pointer rounded hover:bg-gray-100
                        ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                        ${day.isToday ? 'bg-blue-100 text-blue-900 font-bold' : ''}
                      `}
                    >
                      {day.date.getDate()}
                      
                      {/* Activity dots */}
                      {day.activities && (
                        <div className="flex justify-center space-x-1 mt-1">
                          {day.activities.lessons && (
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          )}
                          {day.activities.attendance && (
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          )}
                          {day.activities.evaluations && (
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Lessons planned</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Attendance pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Evaluations due</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
