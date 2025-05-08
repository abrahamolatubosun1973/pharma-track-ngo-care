
import React from "react";
import { Map, Package, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Distribution } from "./ViewDistributionDialog";

interface TrackDistributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  distribution: Distribution | null;
}

export function TrackDistributionDialog({
  open,
  onOpenChange,
  distribution,
}: TrackDistributionDialogProps) {
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

  const handleSubscribeUpdates = () => {
    toast.success("Tracking updates will be sent to your email");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Tracking Information</DialogTitle>
          <DialogDescription>
            Real-time tracking for distribution {distribution.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">From</p>
              <p className="text-base">Central Warehouse</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">To</p>
              <p className="text-base">{distribution.destination}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current Status
              </p>
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
                Estimated Arrival
              </p>
              <p className="text-base">
                {distribution.status === "delivered"
                  ? "Delivered"
                  : new Date(
                      new Date(distribution.date).getTime() +
                        3 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="aspect-video bg-muted rounded-md relative flex items-center justify-center overflow-hidden">
            {distribution.status === "delivered" ? (
              <div className="text-center p-6">
                <Package className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <h3 className="text-lg font-medium">Delivery Completed</h3>
                <p className="text-muted-foreground">
                  This shipment was delivered on{" "}
                  {new Date(distribution.date).toLocaleDateString()}
                </p>
              </div>
            ) : distribution.status === "in-transit" ? (
              <div className="relative w-full h-full">
                <Map className="absolute h-full w-full opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-sm text-center">
                    <Route className="h-8 w-8 mx-auto mb-2 text-blue-500 animate-pulse" />
                    <h3 className="text-lg font-medium">In Transit</h3>
                    <p className="text-muted-foreground mb-2">
                      Shipment is currently in transit to{" "}
                      {distribution.destination}
                    </p>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-3/5"></div>
                    </div>
                    <p className="text-xs text-right mt-1">60% complete</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <Package className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
                <h3 className="text-lg font-medium">Pending Shipment</h3>
                <p className="text-muted-foreground">
                  This distribution is being prepared for shipping
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Tracking History</h3>
            <div className="space-y-3">
              {distribution.status === "delivered" && (
                <>
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Package className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Delivered to recipient</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(distribution.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <Route className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Out for delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          new Date(distribution.date).getTime() -
                            2 * 24 * 60 * 60 * 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {distribution.status === "in-transit" && (
                <>
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <Route className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">In transit</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                  <Package className="h-3 w-3 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Shipment prepared</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      new Date(distribution.date).getTime() -
                        3 * 24 * 60 * 60 * 1000
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={handleSubscribeUpdates}>
              Subscribe to Updates
            </Button>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
