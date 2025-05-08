
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Package, Truck } from "lucide-react";

// Validation schema for the form
const formSchema = z.object({
  destination: z.string().min(1, { message: "Destination is required" })
});

type FormData = z.infer<typeof formSchema>;

// Mock drug items based on user location
const getMockDrugItems = (userRole: string, userLocationId?: string) => {
  // Items in central inventory (available to admin)
  const centralDrugs = [
    { id: "drug1", name: "Paracetamol 500mg" },
    { id: "drug2", name: "Amoxicillin 250mg" },
    { id: "drug3", name: "Metformin 500mg" },
    { id: "drug4", name: "Ibuprofen 400mg" },
    { id: "drug5", name: "Omeprazole 20mg" },
    { id: "drug6", name: "Loratadine 10mg" }
  ];
  
  // Items in Abia state inventory
  const abiaDrugs = [
    { id: "drug3", name: "Metformin 500mg" },
    { id: "drug4", name: "Ibuprofen 400mg" },
    { id: "drug7", name: "Amlodipine 5mg" },
    { id: "drug8", name: "Atorvastatin 20mg" }
  ];
  
  // Items in other states
  const otherStateDrugs = [
    { id: "drug9", name: "Ciprofloxacin 500mg" },
    { id: "drug10", name: "Diazepam 5mg" }
  ];
  
  if (userRole === "admin") {
    return centralDrugs;
  } else if (userRole === "state_manager") {
    if (userLocationId === "abia") {
      return abiaDrugs;
    }
    return otherStateDrugs;
  }
  
  return [];
};

// Mock destinations based on user role
const getDestinations = (user?: { 
  role?: string; 
  location?: { type?: string; id?: string; name?: string } 
}) => {
  if (user?.role === "admin") {
    return [
      { id: "abia", name: "Abia State", type: "state" },
      { id: "enugu", name: "Enugu State", type: "state" },
      { id: "imo", name: "Imo State", type: "state" }
    ];
  } else if (user?.role === "state_manager") {
    return [
      { id: "facility1", name: "General Hospital Umuahia", type: "facility" },
      { id: "facility2", name: "Primary Health Center Aba", type: "facility" },
      { id: "facility3", name: "St. Mary's Hospital", type: "facility" }
    ];
  }
  return [];
};

interface NewDistributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDistributionCreated?: (distribution: any) => void;
}

export default function NewDistributionDialog({ 
  open, 
  onOpenChange,
  onDistributionCreated
}: NewDistributionDialogProps) {
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string, name: string, quantity: number }>>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Get destinations based on user's role
  const destinations = getDestinations(user);
  
  // Get available drug items based on user's role and location
  const availableDrugItems = getMockDrugItems(user?.role || "", user?.location?.id);
  
  // Setup form with validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: ""
    }
  });

  // Reset form error when items change
  useEffect(() => {
    if (selectedItems.length > 0) {
      setFormError(null);
    }
  }, [selectedItems]);

  // Add item to the selected items list
  const addItem = () => {
    if (!selectedItemId) return;

    const item = availableDrugItems.find(item => item.id === selectedItemId);
    if (!item) return;

    // Check if item is already in the list
    if (selectedItems.some(i => i.id === selectedItemId)) {
      // Update quantity if already exists
      setSelectedItems(prev => 
        prev.map(i => 
          i.id === selectedItemId 
            ? { ...i, quantity: i.quantity + selectedQuantity } 
            : i
        )
      );
    } else {
      // Add new item
      setSelectedItems(prev => [
        ...prev,
        { id: selectedItemId, name: item.name, quantity: selectedQuantity }
      ]);
    }

    // Reset selection
    setSelectedItemId("");
    setSelectedQuantity(1);
  };

  // Remove item from the list
  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  // Handle form submission
  const onSubmit = (data: FormData) => {
    // Validate that items exist
    if (selectedItems.length === 0) {
      setFormError("At least one item is required");
      return;
    }

    setIsSubmitting(true);
    
    // Create the new distribution object
    const destinationDetails = destinations.find(d => d.id === data.destination);
    const newDistribution = {
      id: `DIST-${Math.floor(Math.random() * 10000)}`,
      destination: destinationDetails?.name || data.destination,
      destinationType: destinationDetails?.type || "unknown",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      items: selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity
      }))
    };

    // Simulate API call with a delay
    setTimeout(() => {
      console.log("Distribution created:", newDistribution);
      
      // Call the callback function if provided
      if (onDistributionCreated) {
        onDistributionCreated(newDistribution);
      }

      // Show success toast
      toast({
        title: "Distribution created successfully",
        description: `Distribution to ${newDistribution.destination} has been created and is pending approval`,
      });

      // Reset form and close dialog
      form.reset();
      setSelectedItems([]);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  // Check if user has permission to create distributions
  if (user?.role !== "admin" && user?.role !== "state_manager") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
            <DialogDescription>
              You don't have permission to create distributions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            New Distribution
          </DialogTitle>
          <DialogDescription>
            {user?.role === "admin" 
              ? "Create a new distribution to send pharmaceutical supplies to states."
              : "Create a new distribution to send pharmaceutical supplies to facilities."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map(dest => (
                          <SelectItem key={dest.id} value={dest.id}>
                            {dest.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Items</h3>
              
              {/* Item selection */}
              <div className="flex gap-2">
                <Select onValueChange={setSelectedItemId} value={selectedItemId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrugItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  min="1"
                  className="w-24"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                />
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addItem}
                  disabled={!selectedItemId}
                >
                  Add
                </Button>
              </div>
              
              {/* Selected items list */}
              <div className="border rounded-md">
                {selectedItems.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No items added yet
                  </div>
                ) : (
                  <ul className="divide-y">
                    {selectedItems.map(item => (
                      <li key={item.id} className="flex items-center justify-between py-3 px-4">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">{item.quantity} units</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Display form error for items */}
              {formError && (
                <p className="text-sm text-destructive">
                  {formError}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                <Truck className="mr-2 h-4 w-4" />
                {isSubmitting ? "Creating..." : "Create Distribution"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
