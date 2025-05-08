
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, ClipboardCheck } from "lucide-react";
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
  patient: string;
  patientId: string;
  date: string;
  drugs: Medication[];
};

type DispensingHistoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  dispensingHistory: DispensingRecord[];
  onViewPatient: (patientId: string) => void;
  onViewDetails: (recordId: string) => void;
};

export function DispensingHistoryDialog({
  isOpen,
  onClose,
  dispensingHistory,
  onViewPatient,
  onViewDetails,
}: DispensingHistoryDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredHistory = dispensingHistory.filter(
    (record) =>
      record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Dispensing History</DialogTitle>
          <DialogDescription>
            View and search all medication dispensing records
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or ID..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No dispensing records found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{record.patient}</TableCell>
                    <TableCell>{record.patientId}</TableCell>
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
                        onClick={() => onViewPatient(record.patientId)}
                      >
                        <User className="h-4 w-4 mr-1" />
                        Patient
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onViewDetails(record.id)}
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
      </DialogContent>
    </Dialog>
  );
}
