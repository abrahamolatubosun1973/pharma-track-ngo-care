
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
import { Search, Package, Plus } from "lucide-react";

// Mock data
const mockDrugs = [
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

export default function Inventory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [drugs, setDrugs] = useState(mockDrugs);

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
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Drug
          </Button>
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
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
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
