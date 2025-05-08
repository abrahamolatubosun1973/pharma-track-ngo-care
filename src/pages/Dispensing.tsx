
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
import { Search, Clipboard, ClipboardCheck, User, AlertCircle, Pills } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PatientDetailsDialog } from "@/components/PatientDetailsDialog";
import { MedicationFormDialog } from "@/components/MedicationFormDialog";
import { DispensingHistoryDialog } from "@/components/DispensingHistoryDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

// Mock available medications
const availableMedications = [
  "Paracetamol 500mg",
  "Amoxicillin 250mg", 
  "Metformin 500mg",
  "Ibuprofen 400mg",
  "Omeprazole 20mg",
  "Hydrochlorothiazide 25mg",
  "Atorvastatin 10mg",
  "Lisinopril 10mg",
  "Metoprolol 50mg",
  "Loratadine 10mg",
  "Salbutamol Inhaler 100mcg"
];

// Mock patients
const mockPatients = [
  { 
    id: "P001", 
    name: "John Doe", 
    age: 45, 
    gender: "Male", 
    allergies: ["Penicillin"],
    chronicConditions: ["Hypertension", "Diabetes"],
    dispensingHistory: [
      {
        id: "1",
        date: "2023-05-05",
        drugs: [
          { name: "Paracetamol 500mg", quantity: 20, days: 10 },
          { name: "Metformin 500mg", quantity: 30, days: 30 }
        ]
      }
    ]
  },
  { 
    id: "P002", 
    name: "Jane Smith", 
    age: 38, 
    gender: "Female", 
    allergies: ["Sulfa drugs"],
    chronicConditions: ["Asthma"],
    dispensingHistory: [
      {
        id: "2",
        date: "2023-05-04",
        drugs: [
          { name: "Amoxicillin 250mg", quantity: 21, days: 7 },
          { name: "Ibuprofen 400mg", quantity: 10, days: 5 }
        ]
      }
    ]
  },
  { 
    id: "P003", 
    name: "Robert Johnson", 
    age: 62, 
    gender: "Male", 
    allergies: [],
    chronicConditions: ["GERD", "Allergic Rhinitis"],
    dispensingHistory: [
      {
        id: "3",
        date: "2023-05-04",
        drugs: [
          { name: "Omeprazole 20mg", quantity: 30, days: 30 },
          { name: "Loratadine 10mg", quantity: 10, days: 10 }
        ]
      }
    ]
  },
  { 
    id: "P004", 
    name: "Sarah Williams", 
    age: 55, 
    gender: "Female", 
    allergies: ["NSAIDs"],
    chronicConditions: ["Hypertension", "Hyperlipidemia"],
    dispensingHistory: [
      {
        id: "4",
        date: "2023-05-03",
        drugs: [
          { name: "Hydrochlorothiazide 25mg", quantity: 30, days: 30 },
          { name: "Atorvastatin 10mg", quantity: 30, days: 30 }
        ]
      }
    ]
  },
  { 
    id: "P005", 
    name: "Michael Brown", 
    age: 70, 
    gender: "Male", 
    allergies: ["Aspirin"],
    chronicConditions: ["Hypertension", "Coronary Artery Disease"],
    dispensingHistory: [
      {
        id: "5",
        date: "2023-05-03",
        drugs: [
          { name: "Lisinopril 10mg", quantity: 30, days: 30 },
          { name: "Metoprolol 50mg", quantity: 60, days: 30 }
        ]
      }
    ]
  }
];

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

type MedicationType = {
  name: string;
  quantity: number;
  days: number;
  instructions?: string;
};

export default function Dispensing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewPrescription, setIsNewPrescription] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [dispensingDate, setDispensingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [prescriptionItems, setPrescriptionItems] = useState<MedicationType[]>([]);
  
  // Dialog states
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false);
  const [isPatientDetailsDialogOpen, setIsPatientDetailsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [viewingPatientId, setViewingPatientId] = useState<string | null>(null);
  
  // Filter dispensing records by search term
  const filteredDispensing = recentDispensing.filter((record) =>
    record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get patient details by ID
  const getPatientById = (patientId: string) => {
    return mockPatients.find(patient => patient.id === patientId);
  };
  
  // View patient details
  const handleViewPatient = (patientId: string) => {
    setViewingPatientId(patientId);
    setIsPatientDetailsDialogOpen(true);
  };
  
  // Handle new prescription
  const handleNewPrescription = () => {
    setIsNewPrescription(true);
    setPrescriptionItems([]);
    setSelectedPatient("");
    setDispensingDate(new Date().toISOString().split('T')[0]);
  };
  
  // Add medication to prescription
  const handleAddMedication = (medication: MedicationType) => {
    setPrescriptionItems([...prescriptionItems, medication]);
    setIsAddMedicationDialogOpen(false);
    toast({
      title: "Medication Added",
      description: `${medication.name} added to prescription.`,
    });
  };
  
  // Remove medication from prescription
  const handleRemoveMedication = (index: number) => {
    const updatedItems = [...prescriptionItems];
    updatedItems.splice(index, 1);
    setPrescriptionItems(updatedItems);
    toast({
      title: "Medication Removed",
      description: "Medication removed from prescription.",
    });
  };
  
  // Save prescription
  const handleSavePrescription = () => {
    if (!selectedPatient) {
      toast({
        title: "No Patient Selected",
        description: "Please select a patient before saving the prescription.",
        variant: "destructive",
      });
      return;
    }
    
    if (prescriptionItems.length === 0) {
      toast({
        title: "No Medications",
        description: "Please add at least one medication to the prescription.",
        variant: "destructive",
      });
      return;
    }
    
    setIsConfirmDialogOpen(true);
  };
  
  // Confirm save prescription
  const confirmSavePrescription = () => {
    const patient = getPatientById(selectedPatient);
    if (!patient) return;
    
    const newRecord = {
      id: `rx-${Date.now()}`,
      patient: patient.name,
      patientId: patient.id,
      date: dispensingDate,
      drugs: prescriptionItems
    };
    
    // Add to recent dispensing
    recentDispensing.unshift(newRecord);
    
    // Reset form
    setIsNewPrescription(false);
    setPrescriptionItems([]);
    setSelectedPatient("");
    setIsConfirmDialogOpen(false);
    
    toast({
      title: "Prescription Saved",
      description: `Prescription for ${patient.name} has been successfully dispensed.`,
    });
  };
  
  // Cancel new prescription
  const handleCancelPrescription = () => {
    if (prescriptionItems.length > 0) {
      setIsConfirmDialogOpen(true);
    } else {
      setIsNewPrescription(false);
    }
  };

  // Search patients
  const handlePatientSearch = () => {
    // In a real app, this would search the database
    const searchInput = document.getElementById("patient") as HTMLInputElement;
    if (!searchInput?.value) return;
    
    const foundPatient = mockPatients.find(
      p => p.id === searchInput.value || p.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    
    if (foundPatient) {
      setSelectedPatient(foundPatient.id);
      toast({
        title: "Patient Found",
        description: `${foundPatient.name} (${foundPatient.id}) selected.`,
      });
    } else {
      toast({
        title: "Patient Not Found",
        description: "No matching patient record found.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Medication Dispensing</h1>
        <p className="page-description">
          Dispense medications to patients and track dispensing history
        </p>
      </div>

      {!isNewPrescription ? (
        <>
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

            <Button onClick={handleNewPrescription}>
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewPatient(record.patientId)}
                              >
                                <User className="h-4 w-4 mr-1" />
                                Patient
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  // View details functionality would go here
                                  // For now, we'll just show the patient details
                                  handleViewPatient(record.patientId);
                                }}
                              >
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
                <Button 
                  variant="outline" 
                  onClick={() => setIsHistoryDialogOpen(true)}
                >
                  View All History
                </Button>
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
        </>
      ) : (
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
                  <Input 
                    id="patient" 
                    placeholder="Search patient by name or ID..." 
                    value={selectedPatient ? getPatientById(selectedPatient)?.name || "" : ""}
                    onChange={(e) => {
                      // Clear selected patient if input is cleared
                      if (!e.target.value) {
                        setSelectedPatient("");
                      }
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={handlePatientSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {selectedPatient && (
                  <div className="flex items-center mt-2 gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      {getPatientById(selectedPatient)?.id}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => handleViewPatient(selectedPatient)}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Input 
                  id="date" 
                  type="date" 
                  value={dispensingDate}
                  onChange={(e) => setDispensingDate(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Prescription Items</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddMedicationDialogOpen(true)}
                  disabled={!selectedPatient}
                >
                  <Pills className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
              
              {prescriptionItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  {selectedPatient ? (
                    <>
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No medications added to this prescription yet.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setIsAddMedicationDialogOpen(true)}
                      >
                        <Pills className="h-4 w-4 mr-2" />
                        Add Medication
                      </Button>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Select a patient first to add medications.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Instructions</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescriptionItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.days}</TableCell>
                          <TableCell>{item.instructions || "None"}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveMedication(index)}
                              className="h-8 w-8 p-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-500"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancelPrescription}>Cancel</Button>
            <Button 
              onClick={handleSavePrescription}
              disabled={!selectedPatient || prescriptionItems.length === 0}
            >
              Save Prescription
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Patient Details Dialog */}
      <PatientDetailsDialog
        isOpen={isPatientDetailsDialogOpen}
        onClose={() => setIsPatientDetailsDialogOpen(false)}
        patient={viewingPatientId ? getPatientById(viewingPatientId) : undefined}
      />
      
      {/* Add Medication Dialog */}
      <MedicationFormDialog
        isOpen={isAddMedicationDialogOpen}
        onClose={() => setIsAddMedicationDialogOpen(false)}
        onSubmit={handleAddMedication}
        medications={availableMedications}
      />
      
      {/* Dispensing History Dialog */}
      <DispensingHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        dispensingHistory={recentDispensing}
        onViewPatient={handleViewPatient}
        onViewDetails={(recordId) => {
          // Find the record and get the patient ID
          const record = recentDispensing.find(r => r.id === recordId);
          if (record) {
            handleViewPatient(record.patientId);
          }
        }}
      />
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={isNewPrescription ? confirmSavePrescription : () => setIsNewPrescription(false)}
        title={isNewPrescription && prescriptionItems.length > 0 ? "Save Prescription?" : "Cancel Prescription?"}
        description={
          isNewPrescription && prescriptionItems.length > 0
            ? "Are you sure you want to save this prescription and dispense these medications?"
            : "Are you sure you want to cancel this prescription? Any unsaved changes will be lost."
        }
        confirmText={isNewPrescription && prescriptionItems.length > 0 ? "Save" : "Yes, Cancel"}
        cancelText="No, Go Back"
        variant={isNewPrescription && prescriptionItems.length > 0 ? "default" : "warning"}
      />
    </div>
  );
}
