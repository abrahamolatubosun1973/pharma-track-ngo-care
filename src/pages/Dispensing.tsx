
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clipboard, ClipboardCheck, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock dispensing history
const recentDispensing = [
  {
    id: "1",
    patient: "John Doe",
    patientId: "P001",
    date: "2023-05-05",
    drugs: [
      { name: "Paracetamol 500mg", quantity: 20, days: 10 },
      { name: "Metformin 500mg", quantity: 30, days: 30 }
    ]
  },
  {
    id: "2",
    patient: "Jane Smith",
    patientId: "P002",
    date: "2023-05-04",
    drugs: [
      { name: "Amoxicillin 250mg", quantity: 21, days: 7 },
      { name: "Ibuprofen 400mg", quantity: 10, days: 5 }
    ]
  },
  {
    id: "3",
    patient: "Robert Johnson",
    patientId: "P003",
    date: "2023-05-04",
    drugs: [
      { name: "Omeprazole 20mg", quantity: 30, days: 30 },
      { name: "Loratadine 10mg", quantity: 10, days: 10 }
    ]
  },
  {
    id: "4",
    patient: "Sarah Williams",
    patientId: "P004",
    date: "2023-05-03",
    drugs: [
      { name: "Hydrochlorothiazide 25mg", quantity: 30, days: 30 },
      { name: "Atorvastatin 10mg", quantity: 30, days: 30 }
    ]
  },
  {
    id: "5",
    patient: "Michael Brown",
    patientId: "P005",
    date: "2023-05-03",
    drugs: [
      { name: "Lisinopril 10mg", quantity: 30, days: 30 },
      { name: "Metoprolol 50mg", quantity: 60, days: 30 }
    ]
  }
];

// Mock most dispensed medications
const mostDispensed = [
  { name: "Paracetamol 500mg", count: 423 },
  { name: "Amoxicillin 250mg", count: 287 },
  { name: "Metformin 500mg", count: 243 },
  { name: "Ibuprofen 400mg", count: 198 },
  { name: "Omeprazole 20mg", count: 176 }
];

export default function Dispensing() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter dispensing records by search term
  const filteredDispensing = recentDispensing.filter((record) =>
    record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Medication Dispensing</h1>
        <p className="page-description">
          Dispense medications to patients and track dispensing history
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
          <Clipboard className="mr-2 h-4 w-4" />
          New Prescription
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">prescriptions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patients Served</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">unique patients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">items dispensed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Dispensing</CardTitle>
            <CardDescription>Medications dispensed to patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDispensing.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No dispensing records found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDispensing.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.patient}</TableCell>
                        <TableCell>{record.patientId}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {record.drugs.map((drug, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="mr-1 mb-1 bg-blue-50 text-blue-800"
                            >
                              {drug.name} ({drug.quantity})
                            </Badge>
                          ))}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm">
                            <User className="h-4 w-4 mr-1" />
                            Patient
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ClipboardCheck className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline">View All History</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Dispensed</CardTitle>
            <CardDescription>Top medications this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostDispensed.map((med, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm truncate mr-2">{med.name}</span>
                  <Badge variant="secondary">{med.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Prescription</CardTitle>
          <CardDescription>Dispense medication to a patient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="patient" className="text-sm font-medium">
                Patient
              </label>
              <div className="flex gap-2">
                <Input id="patient" placeholder="Search patient..." />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input 
                id="date" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]} 
              />
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Prescription Items</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No items added to this prescription yet.
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button disabled>Save Prescription</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Plus icon definition
function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
