import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Search, Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock drug categories
const drugCategories = [
  "Analgesics",
  "Antibiotics",
  "Antidepressants",
  "Antihypertensives",
  "Antidiabetics",
  "Antihistamines",
  "Corticosteroids",
  "Vaccines",
];

// Mock drug locations
const drugLocations = [
  { id: "loc-1", name: "Main Pharmacy" },
  { id: "loc-2", name: "Emergency Room" },
  { id: "loc-3", name: "Outpatient Clinic" },
];

// Mock drug data (replace with API call later)
const initialDrugs = [
  {
    id: "drug-1",
    name: "Paracetamol",
    category: "Analgesics",
    stock: 150,
    reorderLevel: 50,
    location: "loc-1",
    status: "Active",
  },
  {
    id: "drug-2",
    name: "Amoxicillin",
    category: "Antibiotics",
    stock: 80,
    reorderLevel: 30,
    location: "loc-2",
    status: "Active",
  },
  {
    id: "drug-3",
    name: "Metformin",
    category: "Antidiabetics",
    stock: 200,
    reorderLevel: 75,
    location: "loc-1",
    status: "Active",
  },
  {
    id: "drug-4",
    name: "Lisinopril",
    category: "Antihypertensives",
    stock: 120,
    reorderLevel: 40,
    location: "loc-3",
    status: "Active",
  },
];

// Zod schema for drug details form
const drugSchema = z.object({
  name: z.string().min(2, {
    message: "Drug name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a drug category.",
  }),
  stock: z.number().min(0, {
    message: "Stock must be a non-negative number.",
  }),
  reorderLevel: z.number().min(0, {
    message: "Reorder level must be a non-negative number.",
  }),
});

// Define DrugDetails type based on the schema
export type DrugDetails = z.infer<typeof drugSchema>;

export default function Inventory() {
  const { toast } = useToast();
  const [drugs, setDrugs] = useState(initialDrugs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("loc-1");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [drugToEdit, setDrugToEdit] = useState<DrugDetails | null>(null);

  // Filter drugs based on search term and category
  const filteredDrugs = drugs.filter((drug) => {
    const searchMatch = drug.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch =
      selectedCategory === "All" || drug.category === selectedCategory;
    return searchMatch && categoryMatch;
  });

  // Function to handle drug creation
  const handleCreateDrug = (newDrug: DrugDetails) => {
    const drugWithId = {
      ...newDrug,
      id: `drug-${Date.now()}`,
      location: selectedLocation,
      status: "Active"
    };
    
    // Ensure all required fields from DrugDetails are present
    if (!drugWithId.name) drugWithId.name = "";
    if (!drugWithId.category) drugWithId.category = "";
    if (!drugWithId.stock) drugWithId.stock = 0;
    if (!drugWithId.reorderLevel) drugWithId.reorderLevel = 0;
    
    setDrugs([...drugs, drugWithId]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Drug Added",
      description: `${newDrug.name} has been added to inventory.`,
    });
  };

  // Function to handle drug editing
  const handleEditDrug = (drug: DrugDetails) => {
    setDrugToEdit(drug);
    setIsEditDialogOpen(true);
  };

  // Function to handle saving edited drug
  const handleSaveDrug = (editedDrug: DrugDetails) => {
    if (!drugToEdit) return;

    const updatedDrugs = drugs.map((drug) =>
      drug.id === drugToEdit.id ? { ...drug, ...editedDrug } : drug
    );
    setDrugs(updatedDrugs);
    setIsEditDialogOpen(false);
    setDrugToEdit(null);
    toast({
      title: "Drug Updated",
      description: `${editedDrug.name} has been updated.`,
    });
  };

  // Function to handle drug deletion
  const handleDeleteDrug = (drugId: string) => {
    setDrugs(drugs.filter((drug) => drug.id !== drugId));
    toast({
      title: "Drug Deleted",
      description: "Drug has been removed from inventory.",
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-description">
          Manage drug inventory, track stock levels, and set reorder points
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

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Drug
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-4">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedCategory("All")}>
            All
          </TabsTrigger>
          {drugCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" />
        {drugCategories.map((category) => (
          <TabsContent key={category} value={category} />
        ))}
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Drug Inventory</CardTitle>
            <CardDescription>
              List of all drugs in the inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrugs.map((drug) => (
                    <TableRow key={drug.id}>
                      <TableCell className="font-medium">{drug.name}</TableCell>
                      <TableCell>{drug.category}</TableCell>
                      <TableCell>{drug.stock}</TableCell>
                      <TableCell>{drug.reorderLevel}</TableCell>
                      <TableCell>
                        {
                          drugLocations.find((loc) => loc.id === drug.location)
                            ?.name
                        }
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={drug.stock <= drug.reorderLevel ? "destructive" : "secondary"}
                        >
                          {drug.stock <= drug.reorderLevel ? "Low Stock" : drug.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDrug(drug)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDrug(drug.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>
              Current stock levels across all locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drugLocations.map((location) => {
                const locationDrugs = drugs.filter(
                  (drug) => drug.location === location.id
                );
                const totalStock = locationDrugs.reduce(
                  (acc, drug) => acc + drug.stock,
                  0
                );
                return (
                  <div
                    key={location.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">{location.name}</span>
                    <Badge variant="secondary">{totalStock} Items</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Select onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {drugLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardFooter>
        </Card>
      </div>

      {/* Create Drug Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Drug</DialogTitle>
            <DialogDescription>
              Create a new drug entry in the inventory
            </DialogDescription>
          </DialogHeader>
          <DrugForm
            onSubmit={handleCreateDrug}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Drug Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Drug</DialogTitle>
            <DialogDescription>
              Edit drug information in the inventory
            </DialogDescription>
          </DialogHeader>
          <DrugForm
            onSubmit={handleSaveDrug}
            onCancel={() => setIsEditDialogOpen(false)}
            initialValues={drugToEdit || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

type DrugFormProps = {
  onSubmit: (data: DrugDetails) => void;
  onCancel: () => void;
  initialValues?: DrugDetails;
};

function DrugForm({ onSubmit, onCancel, initialValues }: DrugFormProps) {
  const form = useForm<DrugDetails>({
    resolver: zodResolver(drugSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  function handleSubmit(values: DrugDetails) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drug Name</FormLabel>
              <FormControl>
                <Input placeholder="Drug Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {drugCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reorderLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reorder Level</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Reorder Level" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!form.formState.isValid}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
