
import React from "react";
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

export type LocationFormData = {
  id?: string;
  name: string;
  type: "central" | "state" | "facility";
  parent?: string;
  address: string;
  contact: string;
};

const locationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["central", "state", "facility"]),
  parent: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contact: z.string().min(5, "Contact must be at least 5 characters"),
});

type LocationFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => void;
  parentLocations: Array<{ id: string; name: string }>;
  initialData?: LocationFormData;
  mode: "add" | "edit";
};

export function LocationFormDialog({
  isOpen,
  onClose,
  onSubmit,
  parentLocations,
  initialData,
  mode,
}: LocationFormDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: initialData || {
      name: "",
      type: "facility",
      parent: "",
      address: "",
      contact: "",
    },
  });

  const watchType = form.watch("type");

  function handleSubmit(data: LocationFormData) {
    // Only include parent if type is facility
    const submissionData = {
      ...data,
      id: initialData?.id,
      parent: data.type === "facility" ? data.parent : undefined,
    };
    
    onSubmit(submissionData);
    form.reset();
    onClose();
    toast({
      title: mode === "add" ? "Location Added" : "Location Updated",
      description: mode === "add" 
        ? "New location has been successfully created"
        : "Location information has been updated",
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Location" : "Edit Location"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new location in the system"
              : "Update location information"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="General Hospital Umuahia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="central">Central</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchType === "facility" && (
              <FormField
                control={form.control}
                name="parent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parentLocations.map((location) => (
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
            )}
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="+234-80-1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Add Location" : "Update Location"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
