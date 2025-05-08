import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Package, Plus, FileCheck, FileDown } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define drug details type
interface DrugDetails {
  id: string;
  name: string; // Ensure this is not optional
  category: string;
  stock: number;
  reorderLevel: number;
  expiryDate: string;
  status?: string; // Make status optional if it's not always provided
}

// Mock data
const mockDrugs: DrugDetails[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    stock: 345,
    reorderLevel: 100,
    expiryDate: "2024-12-01",
    status: "adequate",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    stock: 212,
    reorderLevel: 80,
    expiryDate: "2024-10-15",
    status: "adequate",
  },
  {
    id: "3",
    name: "Metformin 500mg",
    category: "Antidiabetic",
    stock: 67,
    reorderLevel: 100,
    expiryDate: "2024-11-20",
    status: "low",
  },
  {
    id: "4",
    name: "Ibuprofen 400mg",
    category: "NSAID",
    stock: 189,
    reorderLevel: 75,
    expiryDate: "2024-08-30",
    status: "adequate",
  },
  {
    id: "5",
    name: "Loratadine 10mg",
    category: "Antihistamine",
    stock: 42,
    reorderLevel: 50,
    expiryDate: "2023-06-10",
    status: "expired",
  },
  {
    id: "6",
    name: "Omeprazole 20mg",
    category: "PPI",
    stock: 23,
    reorderLevel: 30,
    expiryDate: "2024-09-22",
    status: "low",
  },
];

// Define schema for new drug form
const newDrugSchema = z.object({
  name: z.string().min(1, { message: "Drug name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  stock: z.coerce.number().min(0, { message: "Stock must be 0 or higher" }),
  reorderLevel: z.coerce.number().min(1, { message: "Reorder level is required" }),
  expiryDate: z.string().min(1, { message: "Expiry date is required" })
});

// Define schema for order more form
const orderMoreSchema = z.object({
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
});

export default function Inventory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [drugs, setDrugs] = useState<DrugDetails[]>(mockDrugs);
  const [selectedDrug, setSelectedDrug] = useState<DrugDetails | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isOrderMoreDialogOpen, setIsOrderMoreDialogOpen] = useState(false);

  // Form for adding new drugs
  const newDrugForm = useForm<z.infer<typeof newDrugSchema>>({
    resolver: zodResolver(newDrugSchema),
    defaultValues: {
      name: "",
      category: "",
      stock: 0,
      reorderLevel: 10,
      expiryDate: ""
    },
  });

  // Form for editing drugs
  const editDrugForm = useForm<z.infer<typeof newDrugSchema>>({
    resolver: zodResolver(newDrugSchema),
    defaultValues: {
      name: selectedDrug?.name || "",
      category: selectedDrug?.category || "",
      stock: selectedDrug?.stock || 0,
      reorderLevel: selectedDrug?.reorderLevel || 10,
      expiryDate: selectedDrug?.expiryDate || ""
    },
  });

  // Form for ordering more drugs
  const orderMoreForm = useForm<z.infer<typeof orderMoreSchema>>({
    resolver: zodResolver(orderMoreSchema),
    defaultValues: {
      quantity: 10,
    },
  });

  // Reset the edit form when selected drug changes
  React.useEffect(() => {
    if (selectedDrug && isEditDialogOpen) {
      editDrugForm.reset({
        name: selectedDrug.name,
        category: selectedDrug.category,
        stock: selectedDrug.stock,
        reorderLevel: selectedDrug.reorderLevel,
        expiryDate: selectedDrug.expiryDate
      });
    }
  }, [selectedDrug, isEditDialogOpen, editDrugForm]);

  // Filter drugs by search term
  const filteredDrugs = drugs.filter((drug) =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to determine badge style based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "low":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "adequate":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  // Function to add new drug
  const handleAddDrug = (values: z.infer<typeof newDrugSchema>) => {
    const newDrug: DrugDetails = {
      id: (drugs.length + 1).toString(),
      ...values,
      status: values.stock < values.reorderLevel ? "low" : "adequate"
    };
    
    setDrugs([...drugs, newDrug]);
    
    toast({
      title: "Drug added successfully",
      description: `${values.name} has been added to the inventory.`
    });
    
    // Reset form
    newDrugForm.reset();
  };

  // Function to edit drug
  const handleEditDrug = (values: z.infer<typeof newDrugSchema>) => {
    if (!selectedDrug) return;
    
    const updatedDrugs = drugs.map(drug => 
      drug.id === selectedDrug.id ? {
        ...drug,
        ...values,
        status: values.stock < values.reorderLevel ? "low" : 
                new Date(values.expiryDate) < new Date() ? "expired" : "adequate"
      } : drug
    );
    
    setDrugs(updatedDrugs);
    setSelectedDrug(null);
    setIsEditDialogOpen(false);
    setIsDetailsDialogOpen(false);
    
    toast({
      title: "Drug updated successfully",
      description: `${values.name} has been updated in the inventory.`
    });
  };

  // Function to order more of a drug
  const handleOrderMore = (values: z.infer<typeof orderMoreSchema>) => {
    if (!selectedDrug) return;
    
    const updatedDrugs = drugs.map(drug => 
      drug.id === selectedDrug.id ? {
        ...drug,
        stock: drug.stock + values.quantity,
        status: (drug.stock + values.quantity) < drug.reorderLevel ? "low" : 
                new Date(drug.expiryDate) < new Date() ? "expired" : "adequate"
      } : drug
    );
    
    setDrugs(updatedDrugs);
    setSelectedDrug(null);
    setIsOrderMoreDialogOpen(false);
    setIsDetailsDialogOpen(false);
    
    toast({
      title: "Order placed successfully",
      description: `${values.quantity} units of ${selectedDrug.name} have been ordered.`
    });
    
    orderMoreForm.reset();
  };

  // Function to handle file import
  const handleFileImport = () => {
    // In a real application, this would handle CSV/Excel file parsing
    // For demo purposes, we'll just add some sample data
    const importedDrugs: DrugDetails[] = [
      {
        id: (drugs.length + 1).toString(),
        name: "Aspirin 100mg",
        category: "NSAID",
        stock: 150,
        reorderLevel: 30,
        expiryDate: "2024-11-30",
        status: "adequate"
      },
      {
        id: (drugs.length + 2).toString(),
        name: "Cetirizine 10mg",
        category: "Antihistamine",
        stock: 75,
        reorderLevel: 25,
        expiryDate: "2025-01-15",
        status: "adequate"
      }
    ];
    
    setDrugs([...drugs, ...importedDrugs]);
    setIsImportDialogOpen(false);
    
    toast({
      title: "Import successful",
      description: `${importedDrugs.length} drugs have been imported.`
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-description">
          Manage and track pharmaceutical inventory
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drugs..."
            className="pl-9 w-full sm:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {/* Import Button with Dialog */}
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Drug Inventory</DialogTitle>
                <DialogDescription>
                  Upload a CSV or Excel file with your drug inventory data.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <FileCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports CSV and Excel files
                  </p>
                  <Button variant="outline" className="mt-4" size="sm">
                    Select File
                  </Button>
                </div>
                <div className="text-sm">
                  <p className="font-medium">File requirements:</p>
                  <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                    <li>Headers: Name, Category, Stock, Reorder Level, Expiry Date</li>
                    <li>Maximum file size: 5MB</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFileImport}>
                  Import Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add New Drug Button with Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Drug
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Drug</DialogTitle>
                <DialogDescription>
                  Enter the details of the new drug to add to the inventory.
                </DialogDescription>
              </DialogHeader>
              <Form {...newDrugForm}>
                <form onSubmit={newDrugForm.handleSubmit(handleAddDrug)} className="space-y-4">
                  <FormField
                    control={newDrugForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drug Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Paracetamol 500mg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newDrugForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Analgesic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={newDrugForm.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newDrugForm.control}
                      name="reorderLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reorder Level</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={newDrugForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="submit">Add Drug</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead className="text-right">Reorder Level</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrugs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No drugs found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredDrugs.map((drug) => {
                const isExpiringSoon = new Date(drug.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const isExpired = new Date(drug.expiryDate) < new Date();
                
                return (
                  <TableRow key={drug.id}>
                    <TableCell className="font-medium">{drug.name}</TableCell>
                    <TableCell>{drug.category}</TableCell>
                    <TableCell className="text-right">{drug.stock}</TableCell>
                    <TableCell className="text-right">{drug.reorderLevel}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {new Date(drug.expiryDate).toLocaleDateString()}
                        {isExpiringSoon && !isExpired && (
                          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                            Soon
                          </Badge>
                        )}
                        {isExpired && (
                          <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                            Expired
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getBadgeVariant(drug.status)}
                      >
                        {drug.status === "low"
                          ? "Low Stock"
                          : drug.status === "expired"
                          ? "Expired"
                          : "In Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={isDetailsDialogOpen && selectedDrug?.id === drug.id} onOpenChange={(open) => {
                        setIsDetailsDialogOpen(open);
                        if (open) setSelectedDrug(drug);
                        else setSelectedDrug(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedDrug(drug);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Drug Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about this medication.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-semibold">Drug Name:</h3>
                                <p>{drug.name}</p>
                              </div>
                              <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-semibold">Category:</h3>
                                <p>{drug.category}</p>
                              </div>
                              <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-semibold">Current Stock:</h3>
                                <p>{drug.stock} units</p>
                              </div>
                              <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-semibold">Reorder Level:</h3>
                                <p>{drug.reorderLevel} units</p>
                              </div>
                              <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-semibold">Expiry Date:</h3>
                                <p>{new Date(drug.expiryDate).toLocaleDateString()}</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Status:</h3>
                                <Badge
                                  variant="outline"
                                  className={getBadgeVariant(drug.status)}
                                >
                                  {drug.status === "low"
                                    ? "Low Stock"
                                    : drug.status === "expired"
                                    ? "Expired"
                                    : "In Stock"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline">Edit</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Drug</DialogTitle>
                                  <DialogDescription>
                                    Update the details of this drug.
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...editDrugForm}>
                                  <form onSubmit={editDrugForm.handleSubmit(handleEditDrug)} className="space-y-4">
                                    <FormField
                                      control={editDrugForm.control}
                                      name="name"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Drug Name</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editDrugForm.control}
                                      name="category"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Category</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                      <FormField
                                        control={editDrugForm.control}
                                        name="stock"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Stock Quantity</FormLabel>
                                            <FormControl>
                                              <Input type="number" min="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={editDrugForm.control}
                                        name="reorderLevel"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Reorder Level</FormLabel>
                                            <FormControl>
                                              <Input type="number" min="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <FormField
                                      control={editDrugForm.control}
                                      name="expiryDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Expiry Date</FormLabel>
                                          <FormControl>
                                            <Input type="date" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter className="pt-4">
                                      <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button type="submit">Save Changes</Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog open={isOrderMoreDialogOpen} onOpenChange={setIsOrderMoreDialogOpen}>
                              <DialogTrigger asChild>
                                <Button>Order More</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Order More Stock</DialogTitle>
                                  <DialogDescription>
                                    Request additional units of {selectedDrug?.name}.
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...orderMoreForm}>
                                  <form onSubmit={orderMoreForm.handleSubmit(handleOrderMore)} className="space-y-4">
                                    <div className="py-2">
                                      <div className="flex justify-between pb-2 text-sm">
                                        <span className="text-muted-foreground">Current Stock:</span>
                                        <span className="font-medium">{selectedDrug?.stock} units</span>
                                      </div>
                                      <div className="flex justify-between pb-4 text-sm">
                                        <span className="text-muted-foreground">Reorder Level:</span>
                                        <span className="font-medium">{selectedDrug?.reorderLevel} units</span>
                                      </div>
                                    </div>
                                    <FormField
                                      control={orderMoreForm.control}
                                      name="quantity"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Quantity to Order</FormLabel>
                                          <FormControl>
                                            <Input type="number" min="1" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter className="pt-4">
                                      <Button type="button" variant="outline" onClick={() => setIsOrderMoreDialogOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button type="submit">Place Order</Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
