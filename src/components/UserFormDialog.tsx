
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type UserFormData = {
  id?: string;
  name: string;
  email: string;
  role: string;
  location: string;
};

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  location: z.string().min(1, "Please select a location"),
});

type UserFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  locations: Array<{ id: string; name: string }>;
  initialData?: UserFormData;
  mode: "add" | "edit";
};

export function UserFormDialog({
  isOpen,
  onClose,
  onSubmit,
  locations,
  initialData,
  mode,
}: UserFormDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUser?.role === "admin") {
      return [
        { value: "admin", label: "Admin" },
        { value: "state_manager", label: "State Manager" },
        { value: "facility_manager", label: "Facility Manager" },
        { value: "pharmacist", label: "Pharmacist" }
      ];
    } else if (currentUser?.role === "state_manager") {
      return [
        { value: "facility_manager", label: "Facility Manager" },
        { value: "pharmacist", label: "Pharmacist" }
      ];
    }
    return [];
  };
  
  const availableRoles = getAvailableRoles();
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      role: availableRoles[0]?.value || "facility_manager",
      location: "",
    },
  });
  
  // Update form default role when roles change
  useEffect(() => {
    if (mode === "add" && availableRoles.length > 0) {
      form.setValue("role", availableRoles[0].value);
    }
  }, [availableRoles, form, mode]);

  function handleSubmit(data: UserFormData) {
    // Admin validation
    if (currentUser?.role !== "admin" && data.role === "admin") {
      toast({
        title: "Permission denied",
        description: "Only admins can create or edit admin users",
        variant: "destructive",
      });
      return;
    }
    
    // State manager validation
    if (currentUser?.role === "state_manager" && data.role === "state_manager") {
      toast({
        title: "Permission denied",
        description: "State managers cannot create other state managers",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      ...data,
      id: initialData?.id,
    });
    form.reset();
    onClose();
    toast({
      title: mode === "add" ? "User Added" : "User Updated",
      description: mode === "add" 
        ? "New user has been successfully created"
        : "User information has been updated",
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Create a new user account with access permissions"
              : "Update user information and access permissions"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@caritas.org" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Add User" : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
