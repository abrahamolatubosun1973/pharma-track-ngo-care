
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, User, Plus, Clipboard } from "lucide-react";

// Mock patients data
const mockPatients = [
  {
    id: "P001",
    name: "John Doe",
    gender: "Male",
    age: 45,
    contact: "080-1234-5678",
    lastVisit: "2023-05-05",
    visitCount: 8
  },
  {
    id: "P002",
    name: "Jane Smith",
    gender: "Female",
    age: 32,
    contact: "080-2345-6789",
    lastVisit: "2023-05-04",
    visitCount: 5
  },
  {
    id: "P003",
    name: "Robert Johnson",
    gender: "Male",
    age: 58,
    contact: "080-3456-7890",
    lastVisit: "2023-05-04",
    visitCount: 12
  },
  {
    id: "P004",
    name: "Sarah Williams",
    gender: "Female",
    age: 29,
    contact: "080-4567-8901",
    lastVisit: "2023-05-03",
    visitCount: 3
  },
  {
    id: "P005",
    name: "Michael Brown",
    gender: "Male",
    age: 61,
    contact: "080-5678-9012",
    lastVisit: "2023-05-03",
    visitCount: 15
  },
  {
    id: "P006",
    name: "Emily Davis",
    gender: "Female",
    age: 27,
    contact: "080-6789-0123",
    lastVisit: "2023-05-02",
    visitCount: 2
  },
  {
    id: "P007",
    name: "David Wilson",
    gender: "Male",
    age: 42,
    contact: "080-7890-1234",
    lastVisit: "2023-05-01",
    visitCount: 6
  }
];

// Patient visits statistics
const visitStats = [
  { day: "Monday", count: 18 },
  { day: "Tuesday", count: 23 },
  { day: "Wednesday", count: 19 },
  { day: "Thursday", count: 24 },
  { day: "Friday", count: 21 },
  { day: "Saturday", count: 12 },
  { day: "Sunday", count: 5 }
];

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter patients by search term
  const filteredPatients = mockPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Patient Management</h1>
        <p className="page-description">
          Register and manage patients for medication dispensing
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-9 w-full sm:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button>
          <User className="mr-2 h-4 w-4" />
          New Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">218</div>
            <p className="text-xs text-muted-foreground">registered patients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">patient visits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Patient Registry</CardTitle>
            <CardDescription>View and manage registered patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No patients found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.contact}</TableCell>
                        <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm">
                            <User className="h-4 w-4 mr-1" />
                            Profile
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Clipboard className="h-4 w-4 mr-1" />
                            Prescribe
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Visits</CardTitle>
            <CardDescription>Patient visits this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitStats.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{day.day}</span>
                    <span className="text-sm font-medium">{day.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${(day.count / 24) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Registration</CardTitle>
          <CardDescription>Add a new patient to the registry</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="patientName" className="text-sm font-medium">
                Full Name
              </label>
              <Input id="patientName" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="patientGender" className="text-sm font-medium">
                Gender
              </label>
              <select 
                id="patientGender" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="patientAge" className="text-sm font-medium">
                Age
              </label>
              <Input id="patientAge" type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <label htmlFor="patientContact" className="text-sm font-medium">
                Contact Number
              </label>
              <Input id="patientContact" placeholder="080-1234-5678" />
            </div>
            <div className="space-y-2">
              <label htmlFor="patientLocation" className="text-sm font-medium">
                Location
              </label>
              <Input id="patientLocation" placeholder="Umuahia, Abia" />
            </div>
            <div className="space-y-2">
              <label htmlFor="patientVisitType" className="text-sm font-medium">
                Visit Type
              </label>
              <select 
                id="patientVisitType" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select...</option>
                <option value="new">New Visit</option>
                <option value="follow-up">Follow-up</option>
                <option value="prescription-refill">Prescription Refill</option>
              </select>
            </div>
          </div>
        </CardContent>
        <div className="p-6 flex justify-end">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Register Patient
          </Button>
        </div>
      </Card>
    </div>
  );
}
