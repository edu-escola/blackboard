import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const SchoolManagement = () => {
  const navigate = useNavigate();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string>("");

  // Mock data for schools
  const schools = [
    { 
      id: 1, 
      name: "Lincoln Elementary", 
      city: "Springfield", 
      created: "2023-01-15", 
      activeAdmins: 3 
    },
    { 
      id: 2, 
      name: "Washington High School", 
      city: "Springfield", 
      created: "2022-08-20", 
      activeAdmins: 5 
    },
    { 
      id: 3, 
      name: "Roosevelt Middle School", 
      city: "Springfield", 
      created: "2023-03-10", 
      activeAdmins: 2 
    },
    { 
      id: 4, 
      name: "Jefferson Academy", 
      city: "Riverside", 
      created: "2022-11-05", 
      activeAdmins: 4 
    }
  ];

  const handleInviteAdmin = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setInviteModalOpen(true);
  };

  const handleSendInvite = () => {
    // TODO: Implement invite logic
    console.log("Sending invite for school:", selectedSchool);
    setInviteModalOpen(false);
    setSelectedSchool("");
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
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">School Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Active Admins</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.city}</TableCell>
                    <TableCell>{new Date(school.created).toLocaleDateString()}</TableCell>
                    <TableCell>{school.activeAdmins}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInviteAdmin(school.name)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Invite Admin
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Invite Admin Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Admin to {selectedSchool}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Input
                id="message"
                placeholder="Welcome to our team!"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvite}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send Invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolManagement;