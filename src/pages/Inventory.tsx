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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the schema for the inventory item form
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Inventory item name must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  stock: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, {
    message: "Stock must be a non-negative number.",
  }),
  reorderLevel: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, {
    message: "Reorder level must be a non-negative number.",
  }),
  location: z.string().optional(),
  status: z.string().optional(),
});

// Define the type for the form values based on the schema
type FormValues = z.infer<typeof formSchema>;

// Define the type for an inventory item
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  location?: string;
  status?: string;
};

export default function Inventory() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    // Load data from local storage on component mount
    const storedData = localStorage.getItem("inventoryData");
    if (storedData) {
      setInventoryData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    // Save data to local storage whenever inventoryData changes
    localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
  }, [inventoryData]);

  const filteredInventory = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      stock: "0",
      reorderLevel: "0",
      location: "",
      status: "In Stock",
    },
  });

  // Function to ensure all inventory items have the required fields
  const ensureCompleteInventoryItem = (item: Partial<InventoryItem>): InventoryItem => {
    return {
      id: item.id || `inv-${Date.now()}`,
      name: item.name || "Unnamed Item",
      category: item.category || "Uncategorized",
      stock: item.stock || 0,
      reorderLevel: item.reorderLevel || 0,
      location: item.location || "",
      status: item.status || "In Stock"
    };
  };

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
    form.reset();
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleOpenEditDialog = (id: string) => {
    const itemToEdit = inventoryData.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItemId(id);
      form.setValue("name", itemToEdit.name);
      form.setValue("category", itemToEdit.category);
      form.setValue("stock", String(itemToEdit.stock));
      form.setValue("reorderLevel", String(itemToEdit.reorderLevel));
      form.setValue("location", itemToEdit.location || "");
      form.setValue("status", itemToEdit.status || "In Stock");
      setIsEditDialogOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingItemId(null);
    form.reset();
  };

  // Update this function to ensure it returns a complete inventory item
  const handleAddItem = (values: FormValues) => {
    const newItem = ensureCompleteInventoryItem({
      id: `inv-${Date.now()}`,
      name: values.name,
      category: values.category,
      stock: Number(values.stock),
      reorderLevel: Number(values.reorderLevel),
      location: values.location,
      status: values.stock > 0 ? "In Stock" : "Out of Stock"
    });

    setInventoryData([newItem, ...inventoryData]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Inventory Item Added",
      description: `${values.name} has been added to inventory.`,
    });
  };

  // This is the function with the type error
  const handleUpdateItem = (values: FormValues) => {
    const updatedItem = ensureCompleteInventoryItem({
      id: editingItemId,
      name: values.name,
      category: values.category,
      stock: Number(values.stock),
      reorderLevel: Number(values.reorderLevel),
      location: values.location,
      status: Number(values.stock) > 0 ? "In Stock" : "Out of Stock"
    });

    setInventoryData(
      inventoryData.map(item => 
        item.id === editingItemId ? updatedItem : item
      )
    );
    
    setIsEditDialogOpen(false);
    setEditingItemId(null);
    
    toast({
      title: "Inventory Item Updated",
      description: `${values.name} has been updated.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    setInventoryData(inventoryData.filter((item) => item.id !== id));
    toast({
      title: "Inventory Item Deleted",
      description: "Item has been removed from inventory.",
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-description">
          Manage your stock, track items, and monitor reorder levels
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-9 w-full sm:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            A comprehensive list of all items in your inventory
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
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.stock <= item.reorderLevel ? "destructive" : "secondary"}
                      >
                        {item.stock <= item.reorderLevel ? "Low Stock" : "In Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(item.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Inventory Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleCloseAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item Name" {...field} />
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
                    <FormControl>
                      <Input placeholder="Category" {...field} />
                    </FormControl>
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
                        <Input type="number" placeholder="0" {...field} />
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
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Warehouse Aisle 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseAddDialog}>
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Inventory Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Edit details of the selected inventory item
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateItem)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item Name" {...field} />
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
                    <FormControl>
                      <Input placeholder="Category" {...field} />
                    </FormControl>
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
                        <Input type="number" placeholder="0" {...field} />
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
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Warehouse Aisle 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseEditDialog}>
                  Cancel
                </Button>
                <Button type="submit">Update Item</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
