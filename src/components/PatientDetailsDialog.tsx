
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Medication = {
  name: string;
  quantity: number;
  days: number;
};

type DispensingRecord = {
  id: string;
  date: string;
  drugs: Medication[];
};

type PatientDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    name: string;
    id: string;
    age?: number;
    gender?: string;
    allergies?: string[];
    chronicConditions?: string[];
    dispensingHistory: DispensingRecord[];
  };
};

export function PatientDetailsDialog({
  isOpen,
  onClose,
  patient,
}: PatientDetailsDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {patient.name}
            <Badge variant="outline" className="ml-2">
              ID: {patient.id}
            </Badge>
          </DialogTitle>
          <DialogDescription>Patient details and medication history</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="space-y-2">
            <h3 className="font-medium">Personal Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Age:</span>
              <span>{patient.age || "Not recorded"}</span>
              <span className="text-muted-foreground">Gender:</span>
              <span>{patient.gender || "Not recorded"}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Medical Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground block">Allergies:</span>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-800">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span>None recorded</span>
                )}
              </div>
              
              <div>
                <span className="text-muted-foreground block">Chronic Conditions:</span>
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span>None recorded</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <h3 className="font-medium">Dispensing History</h3>
          
          {patient.dispensingHistory.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.dispensingHistory.map((record) => (
                    <React.Fragment key={record.id}>
                      {record.drugs.map((medication, medIndex) => (
                        <TableRow key={`${record.id}-${medIndex}`}>
                          {medIndex === 0 && (
                            <TableCell rowSpan={record.drugs.length} className="align-top">
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                          )}
                          <TableCell>{medication.name}</TableCell>
                          <TableCell>{medication.quantity}</TableCell>
                          <TableCell>{medication.days}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No dispensing history available.</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
