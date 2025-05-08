
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Settings as SettingsIcon, 
  User, 
  Users, 
  Building, 
  Database,
  Plus,
  Edit,
  Trash
} from "lucide-react";
import { UserFormDialog, UserFormData } from "@/components/UserFormDialog";
import { LocationFormDialog, LocationFormData } from "@/components/LocationFormDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

// Initial mock users data
const initialMockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@caritas.org",
    role: "admin",
    location: "CARITAS HQ"
  },
  {
    id: "2",
    name: "Abia Manager",
    email: "abia@caritas.org",
    role: "state_manager",
    location: "Abia State"
  },
  {
    id: "3",
    name: "Enugu Manager",
    email: "enugu@caritas.org",
    role: "state_manager",
    location: "Enugu State"
  },
  {
    id: "4",
    name: "Imo Manager",
    email: "imo@caritas.org",
    role: "state_manager",
    location: "Imo State"
  },
  {
    id: "5",
    name: "Facility User",
    email: "facility@caritas.org",
    role: "facility_manager",
    location: "General Hospital Umuahia"
  },
  {
    id: "6",
    name: "Pharmacist",
    email: "pharm@caritas.org",
    role: "pharmacist",
    location: "General Hospital Umuahia"
  }
];

// Initial mock locations data
const initialMockLocations = [
  { 
    id: "central", 
    name: "CARITAS HQ", 
    type: "central",
    address: "Abuja, Nigeria",
    contact: "+234-80-1234-5678"
  },
  { 
    id: "abia", 
    name: "Abia State Office", 
    type: "state",
    address: "Umuahia, Abia, Nigeria",
    contact: "+234-80-2345-6789"
  },
  { 
    id: "enugu", 
    name: "Enugu State Office", 
    type: "state",
    address: "Enugu, Enugu, Nigeria",
    contact: "+234-80-3456-7890"
  },
  { 
    id: "imo", 
    name: "Imo State Office", 
    type: "state",
    address: "Owerri, Imo, Nigeria",
    contact: "+234-80-4567-8901"
  },
  { 
    id: "facility1", 
    name: "General Hospital Umuahia", 
    type: "facility",
    parent: "abia",
    address: "Main St, Umuahia, Abia, Nigeria",
    contact: "+234-80-5678-9012"
  },
  { 
    id: "facility2", 
    name: "Primary Health Center Aba", 
    type: "facility",
    parent: "abia",
    address: "Health Rd, Aba, Abia, Nigeria",
    contact: "+234-80-6789-0123"
  }
];

export default function Settings() {
  const { toast } = useToast();
  const [mockUsers, setMockUsers] = useState(initialMockUsers);
  const [mockLocations, setMockLocations] = useState(initialMockLocations);
  
  // User dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<UserFormData | undefined>(undefined);
  
  // Location dialog states
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [locationDialogMode, setLocationDialogMode] = useState<"add" | "edit">("add");
  const [selectedLocation, setSelectedLocation] = useState<LocationFormData | undefined>(undefined);
  
  // Deletion confirmation dialog states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<"user" | "location">("user");
  const [deleteItemId, setDeleteItemId] = useState<string>("");

  // General settings handlers
  const handleSaveChanges = () => {
    toast({
      title: "Settings updated",
      description: "Your changes have been saved successfully."
    });
  };

  const handleSaveSystemSettings = () => {
    toast({
      title: "System settings updated",
      description: "Reorder levels and notification settings have been updated."
    });
  };

  // User management handlers
  const handleAddUser = () => {
    setUserDialogMode("add");
    setSelectedUser(undefined);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setUserDialogMode("edit");
    // Convert location name to ID
    const locationObj = mockLocations.find(loc => loc.name === user.location);
    const locationId = locationObj ? locationObj.id : "";
    
    setSelectedUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: locationId
    });
    setIsUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteItemType("user");
    setDeleteItemId(userId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteUser = () => {
    setMockUsers(mockUsers.filter(user => user.id !== deleteItemId));
    toast({
      title: "User Deleted",
      description: "User has been successfully removed from the system."
    });
    setIsDeleteConfirmOpen(false);
  };

  const handleUserFormSubmit = (data: UserFormData) => {
    if (userDialogMode === "add") {
      // Generate a new ID and find the location name
      const newId = (mockUsers.length + 1).toString();
      const locationObj = mockLocations.find(loc => loc.id === data.location);
      
      setMockUsers([
        ...mockUsers,
        {
          id: newId,
          name: data.name,
          email: data.email,
          role: data.role,
          location: locationObj ? locationObj.name : "Unknown"
        }
      ]);
    } else {
      // Update existing user
      const locationObj = mockLocations.find(loc => loc.id === data.location);
      
      setMockUsers(
        mockUsers.map(user => 
          user.id === data.id
            ? {
                ...user,
                name: data.name,
                email: data.email,
                role: data.role,
                location: locationObj ? locationObj.name : "Unknown"
              }
            : user
        )
      );
    }
  };

  // Location management handlers
  const handleAddLocation = () => {
    setLocationDialogMode("add");
    setSelectedLocation(undefined);
    setIsLocationDialogOpen(true);
  };

  const handleEditLocation = (location: any) => {
    setLocationDialogMode("edit");
    
    setSelectedLocation({
      id: location.id,
      name: location.name,
      type: location.type,
      parent: location.parent,
      address: location.address,
      contact: location.contact
    });
    setIsLocationDialogOpen(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    setDeleteItemType("location");
    setDeleteItemId(locationId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteLocation = () => {
    setMockLocations(mockLocations.filter(location => location.id !== deleteItemId));
    toast({
      title: "Location Deleted",
      description: "Location has been successfully removed from the system."
    });
    setIsDeleteConfirmOpen(false);
  };

  const handleLocationFormSubmit = (data: LocationFormData) => {
    if (locationDialogMode === "add") {
      // Generate a new ID
      const newId = `location-${mockLocations.length + 1}`;
      
      setMockLocations([
        ...mockLocations,
        {
          id: newId,
          name: data.name,
          type: data.type,
          ...(data.parent && { parent: data.parent }),
          address: data.address,
          contact: data.contact
        }
      ]);
    } else {
      // Update existing location
      setMockLocations(
        mockLocations.map(location => 
          location.id === data.id
            ? {
                ...location,
                name: data.name,
                type: data.type,
                ...(data.parent && { parent: data.parent }),
                address: data.address,
                contact: data.contact
              }
            : location
        )
      );
    }
  };

  // Get parent locations (states) for dropdown
  const stateLocations = mockLocations.filter(loc => loc.type === "state").map(loc => ({
    id: loc.id,
    name: loc.name
  }));

  // Get all locations for user dropdown
  const allLocations = mockLocations.map(loc => ({
    id: loc.id,
    name: loc.name
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Manage system settings, users, and locations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Update your organization information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="orgName" className="text-sm font-medium">
                  Organization Name
                </label>
                <Input id="orgName" defaultValue="CARITAS NGO" />
              </div>

              <div className="space-y-2">
                <label htmlFor="orgContact" className="text-sm font-medium">
                  Contact Email
                </label>
                <Input id="orgContact" type="email" defaultValue="contact@caritas.org" />
              </div>

              <div className="space-y-2">
                <label htmlFor="orgPhone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input id="orgPhone" defaultValue="+234-80-1234-5678" />
              </div>

              <div className="space-y-2">
                <label htmlFor="orgAddress" className="text-sm font-medium">
                  Address
                </label>
                <Input id="orgAddress" defaultValue="Central HQ, Abuja, Nigeria" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and access permissions
                </CardDescription>
              </div>
              <Button onClick={handleAddUser}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">
                          {user.role.replace("_", " ")}
                        </TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
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
        </TabsContent>

        {/* Locations Management Tab */}
        <TabsContent value="locations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Locations Management</CardTitle>
                <CardDescription>
                  Manage states and healthcare facilities
                </CardDescription>
              </div>
              <Button onClick={handleAddLocation}>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLocations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">{location.name}</TableCell>
                        <TableCell className="capitalize">{location.type}</TableCell>
                        <TableCell>
                          {location.parent 
                            ? mockLocations.find(l => l.id === location.parent)?.name || "-"
                            : "-"}
                        </TableCell>
                        <TableCell>{location.address}</TableCell>
                        <TableCell>{location.contact}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditLocation(location)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteLocation(location.id)}
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
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reorder Settings</CardTitle>
                <CardDescription>
                  Configure inventory reorder levels and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="defaultReorderLevel" className="text-sm font-medium">
                    Default Reorder Level (%)
                  </label>
                  <Input id="defaultReorderLevel" type="number" defaultValue="25" />
                  <p className="text-xs text-muted-foreground">
                    Alert will be triggered when stock falls below this percentage of maximum level
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="expiryAlert" className="text-sm font-medium">
                    Expiry Alert Threshold (days)
                  </label>
                  <Input id="expiryAlert" type="number" defaultValue="90" />
                  <p className="text-xs text-muted-foreground">
                    Alert will be triggered for items expiring within this many days
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="enableAutoOrder"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="enableAutoOrder" className="text-sm font-medium">
                    Enable automated reorder notifications
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSystemSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Low Stock Alerts</label>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts for low stock items
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Expiry Alerts</label>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts for items nearing expiry
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Distribution Updates</label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications for distribution events
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">System Reports</label>
                    <p className="text-xs text-muted-foreground">
                      Receive weekly system reports via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <label htmlFor="notificationEmail" className="text-sm font-medium">
                    Notification Email
                  </label>
                  <Input id="notificationEmail" type="email" defaultValue="admin@caritas.org" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSystemSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Add/Edit Dialog */}
      <UserFormDialog 
        isOpen={isUserDialogOpen}
        onClose={() => setIsUserDialogOpen(false)}
        onSubmit={handleUserFormSubmit}
        locations={allLocations}
        initialData={selectedUser}
        mode={userDialogMode}
      />

      {/* Location Add/Edit Dialog */}
      <LocationFormDialog
        isOpen={isLocationDialogOpen}
        onClose={() => setIsLocationDialogOpen(false)}
        onSubmit={handleLocationFormSubmit}
        parentLocations={stateLocations}
        initialData={selectedLocation}
        mode={locationDialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={deleteItemType === "user" ? confirmDeleteUser : confirmDeleteLocation}
        title={`Delete ${deleteItemType === "user" ? "User" : "Location"}`}
        description={`Are you sure you want to delete this ${deleteItemType}? This action cannot be undone.`}
      />
    </div>
  );
}
