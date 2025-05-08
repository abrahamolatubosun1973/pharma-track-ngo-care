import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { useAuth } from "@/contexts/AuthContext";
import { Search, ArrowRight, FileText, Package, Map, Route } from "lucide-react";
import NewDistributionDialog from "@/components/NewDistributionDialog";
import { ViewDistributionDialog } from "@/components/ViewDistributionDialog";
import { TrackDistributionDialog } from "@/components/TrackDistributionDialog";
import { toast } from "sonner";

// Distribution item type definition
type DistributionItem = {
  name: string;
  quantity: number;
};

// Distribution type definition
export type DistributionType = {
  id: string;
  destination: string;
  destinationType: string;
  date: string;
  status: string;
  items: DistributionItem[];
};

// Mock distribution data
const initialDistributions = [
  {
    id: "1",
    destination: "Abia State",
    destinationType: "state",
    date: "2023-05-01",
    status: "delivered",
    items: [
      { name: "Paracetamol 500mg", quantity: 1000 },
      { name: "Metformin 500mg", quantity: 500 },
    ]
  },
  {
    id: "2",
    destination: "Enugu State",
    destinationType: "state",
    date: "2023-04-28",
    status: "in-transit",
    items: [
      { name: "Amoxicillin 250mg", quantity: 800 },
      { name: "Ibuprofen 400mg", quantity: 600 },
    ]
  },
  {
    id: "3",
    destination: "Imo State",
    destinationType: "state",
    date: "2023-04-25",
    status: "delivered",
    items: [
      { name: "Omeprazole 20mg", quantity: 400 },
      { name: "Loratadine 10mg", quantity: 300 },
    ]
  },
];

// Mock state distribution data
const initialStateDistributions = [
  {
    id: "1",
    destination: "General Hospital Umuahia",
    destinationType: "facility",
    date: "2023-05-02",
    status: "delivered",
    items: [
      { name: "Paracetamol 500mg", quantity: 300 },
      { name: "Metformin 500mg", quantity: 150 },
    ]
  },
  {
    id: "2",
    destination: "Primary Health Center Aba",
    destinationType: "facility",
    date: "2023-04-30",
    status: "in-transit",
    items: [
      { name: "Amoxicillin 250mg", quantity: 200 },
      { name: "Ibuprofen 400mg", quantity: 180 },
    ]
  },
  {
    id: "3",
    destination: "St. Mary's Hospital",
    destinationType: "facility",
    date: "2023-04-27",
    status: "delivered",
    items: [
      { name: "Omeprazole 20mg", quantity: 120 },
      { name: "Loratadine 10mg", quantity: 90 },
    ]
  },
];

// Mock destinations based on user role/location
const destinations = {
  central: [
    { id: "abia", name: "Abia State", type: "state" },
    { id: "enugu", name: "Enugu State", type: "state" },
    { id: "imo", name: "Imo State", type: "state" }
  ],
  state: [
    { id: "facility1", name: "General Hospital Umuahia", type: "facility" },
    { id: "facility2", name: "Primary Health Center Aba", type: "facility" },
    { id: "facility3", name: "St. Mary's Hospital", type: "facility" }
  ]
};

function DistributionPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for distributions data
  const [recentDistributions, setRecentDistributions] = useState<DistributionType[]>(initialDistributions);
  const [stateDistributions, setStateDistributions] = useState<DistributionType[]>(initialStateDistributions);

  // View dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState<DistributionType | null>(null);

  // Track dialog state
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [trackingDistribution, setTrackingDistribution] = useState<DistributionType | null>(null);

  // Determine user access level
  const isAdmin = user?.role === "admin";
  const isStateManager = user?.role === "state_manager";
  const isFacilityUser = user?.role === "facility_manager" || user?.role === "pharmacist";

  // If user doesn't have permission to access this page, show a message
  if (isFacilityUser) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Distribution Management</h1>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Facility users cannot access the distribution management section.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4 text-center">
              You can view received inventory in the Inventory section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine which data to show based on user's role
  const distributionsData = isStateManager ? stateDistributions : recentDistributions;

  // Filter distributions by search term
  const filteredDistributions = distributionsData.filter((dist) =>
    dist.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle newly created distribution
  const handleDistributionCreated = (newDistribution: DistributionType) => {
    if (isStateManager) {
      setStateDistributions(prev => [newDistribution, ...prev]);
    } else {
      setRecentDistributions(prev => [newDistribution, ...prev]);
    }
  };

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

  // Handle view button click
  const handleViewDetails = (distribution: DistributionType) => {
    setSelectedDistribution(distribution);
    setViewDialogOpen(true);
  };

  // Handle track button click
  const handleTrackDistribution = (distribution: DistributionType) => {
    setTrackingDistribution(distribution);
    setTrackDialogOpen(true);
    
    // Simulate tracking notification
    if (distribution.status === "in-transit") {
      setTimeout(() => {
        toast.success(`Location update for ${distribution.id}`, {
          description: `Currently at transit point ${Math.floor(Math.random() * 5) + 1}`,
        });
      }, 1500);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Distribution Management</h1>
        <p className="page-description">
          {isStateManager 
            ? "Distribute pharmaceutical supplies to facilities" 
            : "Distribute pharmaceutical supplies to states"
          }
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search distributions..."
            className="pl-9 w-full sm:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button onClick={() => setIsDialogOpen(true)}>
          <ArrowRight className="mr-2 h-4 w-4" />
          New Distribution
        </Button>
      </div>

      {/* Add the New Distribution dialog */}
      <NewDistributionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onDistributionCreated={handleDistributionCreated}
      />

      {/* View Distribution Details Dialog */}
      <ViewDistributionDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        distribution={selectedDistribution}
        onTrackDistribution={handleTrackDistribution}
      />

      {/* Track Distribution Dialog */}
      <TrackDistributionDialog
        open={trackDialogOpen}
        onOpenChange={setTrackDialogOpen}
        distribution={trackingDistribution}
      />

      <Tabs defaultValue="recent" className="mb-6">
        <TabsList>
          <TabsTrigger 
            value="recent" 
            onClick={() => setActiveTab("recent")}
          >
            Recent Distributions
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming" 
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Distributions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Distributed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {distributionsData.reduce((total, dist) => {
                    return total + dist.items.reduce((sum, item) => sum + item.quantity, 0);
                  }, 0)}
                </div>
                <p className="text-xs text-muted-foreground">items this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {distributionsData
                    .filter(dist => dist.status === "in-transit")
                    .reduce((total, dist) => {
                      return total + dist.items.reduce((sum, item) => sum + item.quantity, 0);
                    }, 0)}
                </div>
                <p className="text-xs text-muted-foreground">items currently</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isStateManager ? "8" : "3"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isStateManager ? "facilities" : "states"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDistributions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No distributions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDistributions.map((dist) => (
                    <TableRow key={dist.id}>
                      <TableCell className="font-medium">{dist.id}</TableCell>
                      <TableCell>{dist.destination}</TableCell>
                      <TableCell>{new Date(dist.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(dist.status)}
                        >
                          {dist.status === "in-transit"
                            ? "In Transit"
                            : dist.status === "delivered"
                            ? "Delivered"
                            : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {dist.items.length} items
                        <span className="text-muted-foreground text-xs ml-2">
                          ({dist.items.reduce((sum, item) => sum + item.quantity, 0)} units)
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(dist)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleTrackDistribution(dist)}
                        >
                          <Route className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Distributions</CardTitle>
              <CardDescription>
                Plan and schedule new distributions to {isStateManager ? "facilities" : "states"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4 text-center">
                No upcoming distributions scheduled. Create a new distribution to get started.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <ArrowRight className="mr-2 h-4 w-4" />
                New Distribution
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Export the component as default
export default DistributionPage;
