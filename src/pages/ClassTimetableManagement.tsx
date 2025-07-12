import { useState } from "react";
import { ArrowLeft, Plus, Calendar, MapPin, Users, Clock, Monitor, Projector, Wifi, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const ClassTimetableManagement = () => {
  const navigate = useNavigate();
  const [newClassModalOpen, setNewClassModalOpen] = useState(false);
  const [newRoomModalOpen, setNewRoomModalOpen] = useState(false);
  const [draggedClass, setDraggedClass] = useState<any>(null);

  // Mock data
  const rooms = [
    {
      id: 1,
      name: "Room A101",
      capacity: 30,
      equipment: ["Projector", "WiFi", "Whiteboard"],
      type: "Classroom",
      building: "Main Building"
    },
    {
      id: 2,
      name: "Lab B201",
      capacity: 25,
      equipment: ["Computers", "WiFi", "Air Conditioning"],
      type: "Computer Lab",
      building: "Science Wing"
    },
    {
      id: 3,
      name: "Auditorium C301",
      capacity: 150,
      equipment: ["Sound System", "Projector", "Stage"],
      type: "Auditorium",
      building: "Arts Center"
    }
  ];

  const classes = [
    {
      id: 1,
      name: "Mathematics 101",
      year: "2024",
      room: "Room A101",
      shift: "Morning",
      students: 28,
      professors: ["Dr. Sarah Johnson"],
      capacity: 30
    },
    {
      id: 2,
      name: "Science Lab",
      year: "2024",
      room: "Lab B201",
      shift: "Afternoon",
      students: 22,
      professors: ["Prof. Michael Chen"],
      capacity: 25
    },
    {
      id: 3,
      name: "English Literature",
      year: "2024",
      room: "Room A101",
      shift: "Night",
      students: 25,
      professors: ["Ms. Emily Rodriguez"],
      capacity: 30
    }
  ];

  const timetableData = {
    Monday: {
      Morning: { id: 1, name: "Mathematics 101", room: "A101", professor: "Dr. Johnson" },
      Afternoon: { id: 2, name: "Science Lab", room: "B201", professor: "Prof. Chen" },
      Night: { id: 3, name: "English Literature", room: "A101", professor: "Ms. Rodriguez" }
    },
    Tuesday: {
      Morning: null,
      Afternoon: { id: 2, name: "Science Lab", room: "B201", professor: "Prof. Chen" },
      Night: null
    },
    Wednesday: {
      Morning: { id: 1, name: "Mathematics 101", room: "A101", professor: "Dr. Johnson" },
      Afternoon: null,
      Night: { id: 3, name: "English Literature", room: "A101", professor: "Ms. Rodriguez" }
    },
    Thursday: {
      Morning: null,
      Afternoon: { id: 2, name: "Science Lab", room: "B201", professor: "Prof. Chen" },
      Night: null
    },
    Friday: {
      Morning: { id: 1, name: "Mathematics 101", room: "A101", professor: "Dr. Johnson" },
      Afternoon: null,
      Night: null
    }
  };

  const shifts = ["Morning", "Afternoon", "Night"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "Morning": return "bg-yellow-100 text-yellow-800";
      case "Afternoon": return "bg-blue-100 text-blue-800";
      case "Night": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment) {
      case "Projector": return <Projector className="h-4 w-4" />;
      case "WiFi": return <Wifi className="h-4 w-4" />;
      case "Computers": return <Monitor className="h-4 w-4" />;
      case "Sound System": return <Coffee className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const handleDragStart = (e: React.DragEvent, classItem: any) => {
    setDraggedClass(classItem);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, day: string, shift: string) => {
    e.preventDefault();
    if (draggedClass) {
      console.log(`Dropped ${draggedClass.name} on ${day} ${shift}`);
      // TODO: Update timetable data
      setDraggedClass(null);
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
            onClick={() => navigate("/admin/dashboard")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Aulas e Horários</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes">Turmas</TabsTrigger>
            <TabsTrigger value="rooms">Salas</TabsTrigger>
            <TabsTrigger value="timetable">Daily Timetable</TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Turmas</CardTitle>
                <Button onClick={() => setNewClassModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Turma
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Turma</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Estudantes</TableHead>
                      <TableHead>Assigned Professors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">{classItem.name}</TableCell>
                        <TableCell>{classItem.year}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{classItem.room}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(classItem.shift)}>
                            {classItem.shift}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{classItem.students}/{classItem.capacity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {classItem.professors.map((professor, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {professor}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Salas</CardTitle>
                <Button onClick={() => setNewRoomModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Sala
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <Card key={room.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <Badge variant="secondary">{room.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{room.building}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Capacity: {room.capacity}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Equipment:</p>
                          <div className="flex flex-wrap gap-2">
                            {room.equipment.map((item, index) => (
                              <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                                {getEquipmentIcon(item)}
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timetable Tab */}
          <TabsContent value="timetable" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Weekly Timetable</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                    {/* Header */}
                    <div className="p-3 bg-gray-100 font-medium text-center rounded">
                      Time / Day
                    </div>
                    {days.map((day) => (
                      <div key={day} className="p-3 bg-gray-100 font-medium text-center rounded">
                        {day}
                      </div>
                    ))}

                    {/* Time slots */}
                    {shifts.map((shift) => (
                      <>
                        <div key={shift} className="p-3 bg-gray-50 font-medium text-center rounded flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {shift}
                        </div>
                        {days.map((day) => {
                          const classItem = (timetableData as any)[day][shift];
                          return (
                            <div
                              key={`${day}-${shift}`}
                              className="min-h-[80px] border-2 border-dashed border-gray-200 rounded p-2 hover:border-gray-300 transition-colors"
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, day, shift)}
                            >
                              {classItem && (
                                <div
                                  className="bg-blue-100 border border-blue-200 rounded p-2 cursor-move hover:bg-blue-200 transition-colors"
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, classItem)}
                                >
                                  <div className="font-medium text-sm text-blue-900">
                                    {classItem.name}
                                  </div>
                                  <div className="text-xs text-blue-700">
                                    {classItem.room}
                                  </div>
                                  <div className="text-xs text-blue-600">
                                    {classItem.professor}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  💡 Drag and drop class blocks to reschedule them
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* New Class Modal */}
      <Dialog open={newClassModalOpen} onOpenChange={setNewClassModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Nova Turma</DialogTitle>
            <DialogDescription>
              Adicione uma nova turma com atribuições de sala e horário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">Nome da Turma</Label>
              <Input id="className" placeholder="1A" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Academic Year</Label>
              <Input id="year" placeholder="2024" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Sala</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Sala" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name} (Capacity: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shift">Período</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Manhã</SelectItem>
                  <SelectItem value="afternoon">Tarde</SelectItem>
                  <SelectItem value="night">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Student Capacity</Label>
              <Input id="capacity" type="number" placeholder="30" />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewClassModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setNewClassModalOpen(false)}>
                Criar Turma
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Room Modal */}
      <Dialog open={newRoomModalOpen} onOpenChange={setNewRoomModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Sala</DialogTitle>
            <DialogDescription>
              Crie uma Nova Sala
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Nome da Sala</Label>
              <Input id="roomName" placeholder="Room A101" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Input id="building" placeholder="Main Building" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classroom">Classroom</SelectItem>
                  <SelectItem value="lab">Laboratory</SelectItem>
                  <SelectItem value="auditorium">Auditorium</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomCapacity">Capacity</Label>
              <Input id="roomCapacity" type="number" placeholder="30" />
            </div>
            
            <div className="space-y-2">
              <Label>Equipment</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Projector", "WiFi", "Whiteboard", "Computers", "Sound System", "Air Conditioning"].map((equipment) => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={equipment}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={equipment} className="text-sm font-normal">
                      {equipment}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewRoomModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setNewRoomModalOpen(false)}>
                Adicionar Sala
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassTimetableManagement;