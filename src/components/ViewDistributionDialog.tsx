
import React from "react";
import { FileText, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Distribution item type definition
export type DistributionItem = {
  name: string;
  quantity: number;
};

// Distribution type definition
export type Distribution = {
  id: string;
  destination: string;
  destinationType: string;
  date: string;
  status: string;
  items: DistributionItem[];
};

interface ViewDistributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  distribution: Distribution | null;
  onTrackDistribution: (distribution: Distribution) => void;
}

export function ViewDistributionDialog({
  open,
  onOpenChange,
  distribution,
  onTrackDistribution,
}: ViewDistributionDialogProps) {
  if (!distribution) return null;

  // Function to get badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "in-transit":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  const handleGenerateReport = () => {
    toast.success("Distribution report generated");
    onOpenChange(false);
  };

  const handleTrackShipment = () => {
    if (distribution) {
      onTrackDistribution(distribution);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Distribution Details</DialogTitle>
          <DialogDescription>
            Complete information about the selected distribution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="text-base">{distribution.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={getStatusBadge(distribution.status)}
              >
                {distribution.status.charAt(0).toUpperCase() +
                  distribution.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Destination
              </p>
              <p className="text-base">{distribution.destination}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-base">
                {new Date(distribution.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Items</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distribution.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button onClick={handleTrackShipment}>
              <Route className="h-4 w-4 mr-2" />
              Track Shipment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
