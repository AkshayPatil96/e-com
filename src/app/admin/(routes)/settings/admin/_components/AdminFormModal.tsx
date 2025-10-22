/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PhoneInputField } from "@/components/ui/phoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit,
  LoaderCircle,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Admin, AdminFormData } from "../_types/admin.types";

const adminFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .optional(),
  password: z
    .string()
    .optional()
    .refine((val) => {
      // If password is provided, it must be at least 8 characters
      if (val && val.length > 0) {
        return val.length >= 8;
      }
      return true; // Allow empty/undefined password
    }, "Password must be at least 8 characters"),
  status: z
    .enum(["active", "inactive", "hold", "blocked", "suspended", "pending"])
    .optional(),
});

type AdminFormDataLocal = z.infer<typeof adminFormSchema>;

type AdminFormModalProps = {
  mode: "add" | "edit";
  admin?: Admin | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<AdminFormData>) => Promise<void>;
  isLoading?: boolean;
};

export default function AdminFormModal({
  mode,
  admin,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AdminFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";

  const form = useForm<AdminFormDataLocal>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      status: "active",
    },
  });

  // Update your useEffect to include more debugging
  useEffect(() => {
    if (isEditMode && admin) {
      const resetData = {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin?.phone || "",
        status: admin.status || "active",
        password: "", // Password field is only for add mode
      };

      form.reset(resetData);
    } else if (!isEditMode) {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        status: "active",
      });
    }
  }, [admin, isEditMode, form]);

  const handleFormSubmit = async (data: AdminFormDataLocal) => {
    setIsSubmitting(true);

    let payload = { ...data } as any;

    try {
      if (isEditMode && admin) {
        payload = {
          ...data,
          id: admin._id,
        };
        delete payload.password;
        await onSubmit(payload);
      } else {
        await onSubmit({
          ...data,
        });
      }
      form.reset();
      onClose();
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} admin:`,
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Don't render if in edit mode without admin data
  if (isEditMode && !admin) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Edit className="size-6" />
                <span>Edit Admin</span>
              </>
            ) : (
              <>
                <UserPlus className="size-6" />
                <span>Add New Admin</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update information for ${admin?.name}`
              : "Create a new administrator account. Permissions can be configured after the admin is created."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter first name"
                          {...field}
                          disabled={isSubmitting || isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter last name"
                          {...field}
                          disabled={isSubmitting || isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                          disabled={isSubmitting || isLoading || isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInputField
                          value={field.value || ""}
                          onChange={field.onChange}
                          name={field.name}
                          error={fieldState.error?.message}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status Field - Only for Edit Mode */}
              {isEditMode && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-title">
                            <SelectValue
                              placeholder="Select status"
                              className="text-title"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="hold">Hold</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Password Field - Only for Add Mode */}
              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <PasswordInput
                      field={field}
                      label="Password"
                      placeholder="Enter password (min 8 characters)"
                      disabled={isSubmitting || isLoading}
                      showGenerateButton={true}
                      minLength={8}
                    />
                  )}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating Admin..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      "Update Admin"
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Admin
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
