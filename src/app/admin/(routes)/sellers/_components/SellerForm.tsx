"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetSellerByIdAdminQuery } from "@/redux/adminDashboard/seller/sellerApi";
import { useGetUserByIdAdminQuery } from "@/redux/adminDashboard/user/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ISellerAdminItem, IUser, SellerStatus } from "../_types/seller.types";
import { UserAutocomplete } from "./UserAutocomplete";

// Form validation schema with conditional validation
const sellerFormSchema = z
  .object({
    useExistingUser: z.boolean(),
    userId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional(),
    storeName: z
      .string()
      .min(2, "Store name must be at least 2 characters")
      .max(100, "Store name must be less than 100 characters"),
    storeDescription: z.string().optional(),
    contactEmail: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    alternatePhone: z.string().optional(),
    commissionRate: z
      .number()
      .min(0, "Commission rate must be at least 0")
      .max(50, "Commission rate must be at most 50"),
    isVerified: z.boolean(),
    isFeatured: z.boolean(),
    isTopSeller: z.boolean(),
    status: z.nativeEnum(SellerStatus),
  })
  .refine(
    (data) => {
      if (data.useExistingUser) {
        return data.userId && data.userId.length > 0;
      } else {
        return (
          data.firstName &&
          data.firstName.length > 0 &&
          data.lastName &&
          data.lastName.length > 0 &&
          data.password &&
          data.password.length >= 8
        );
      }
    },
    {
      message:
        "Either select an existing user or provide first name, last name, and password for new user",
      path: ["userId"], // This will show the error on the userId field
    },
  );

type SellerFormValues = z.infer<typeof sellerFormSchema>;

interface SellerFormProps {
  seller?: ISellerAdminItem;
  onSubmit: (data: SellerFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "add" | "edit" | "view";
}

export function SellerForm({
  seller,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "add",
}: SellerFormProps) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const { data: fetchedSeller } = useGetSellerByIdAdminQuery(seller?._id || "");

  // Get user ID value from seller
  const getUserId = (user: string | IUser | undefined): string => {
    if (typeof user === "string") return user;
    if (typeof user === "object" && user && "_id" in user) return user._id;
    return "";
  };

  // Default values for the form
  const defaultValues: SellerFormValues = {
    useExistingUser: false,
    userId: "",
    firstName: "",
    lastName: "",
    password: "",
    storeName: "",
    storeDescription: "",
    contactEmail: "",
    phoneNumber: "",
    alternatePhone: "",
    commissionRate: 5,
    isVerified: false,
    isFeatured: false,
    isTopSeller: false,
    status: SellerStatus.PENDING,
  };

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues,
  });
  console.log('form.watch("userId"): ', form.watch("userId"));

  const { data: userData } = useGetUserByIdAdminQuery(form.watch("userId"), {
    skip: !form.watch("useExistingUser") || !form.watch("userId"),
  });
  console.log("userData: ", userData);

  const handleFormSubmit = async (values: SellerFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  useEffect(() => {
    if (fetchedSeller && (isEditMode || isViewMode)) {
      form.reset({
        useExistingUser: true,
        userId: getUserId(fetchedSeller?.data?.userId) || "",
        firstName: "",
        lastName: "",
        password: "",
        storeName: fetchedSeller?.data?.storeName || "",
        storeDescription: fetchedSeller?.data?.storeDescription || "",
        contactEmail: fetchedSeller?.data?.contactEmail || "",
        phoneNumber: fetchedSeller?.data?.phoneNumber || "",
        alternatePhone: fetchedSeller?.data?.alternatePhone || "",
        commissionRate: fetchedSeller?.data?.commissionRate || 5,
        isVerified: fetchedSeller?.data?.isVerified || false,
        isFeatured: fetchedSeller?.data?.isFeatured || false,
        isTopSeller: fetchedSeller?.data?.isTopSeller || false,
        status: fetchedSeller?.data?.status || SellerStatus.PENDING,
      });
    }
  }, [fetchedSeller, form, isEditMode, isViewMode]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* User & Store Information */}
        <Card>
          <CardContent className="py-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">
                User & Store Information
              </h3>
              <Badge variant="secondary">Required</Badge>
            </div>

            <FormField
              control={form.control}
              name="useExistingUser"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Use Existing User
                    </FormLabel>
                    <FormDescription>
                      Toggle to select an existing user or create a new one
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isViewMode}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("useExistingUser") ? (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User *</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {field.value && userData?.data ? (
                          <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                            <p className="text-sm text-placeholder">
                              Selected User:{" "}
                              <span className="font-medium text-foreground">
                                {userData.data.firstName}{" "}
                                {userData.data.lastName}
                              </span>
                            </p>
                            {!isViewMode && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => field.onChange("")}
                              >
                                Change
                              </Button>
                            )}
                          </div>
                        ) : (
                          <UserAutocomplete
                            value={undefined}
                            onChange={(user: IUser | null) =>
                              field.onChange(user?._id || "")
                            }
                            disabled={isViewMode}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Choose an existing user who will become the seller
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            disabled={isViewMode}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          First name for the new user
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            disabled={isViewMode}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Last name for the new user
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <PasswordInput
                      field={field}
                      label="Password *"
                      placeholder="Enter password (min 8 characters)"
                      description="Password for the new user account (minimum 8 characters)"
                      disabled={isViewMode}
                      showGenerateButton={true}
                      minLength={8}
                    />
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter store name"
                      disabled={isViewMode}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The public name of the store (2-100 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the store and what it sells..."
                      className="min-h-[100px]"
                      disabled={isViewMode}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of the store and its products
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="py-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <Badge variant="secondary">Required</Badge>
            </div>

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="store@example.com"
                      disabled={isViewMode}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Primary email for store communications
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInputField
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={isViewMode}
                        placeholder="Enter phone number"
                        name="phoneNumber"
                        error={form.formState.errors.phoneNumber?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternatePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Phone</FormLabel>
                    <FormControl>
                      <PhoneInputField
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={isViewMode}
                        placeholder="Enter alternate phone number"
                        name="alternatePhone"
                        error={form.formState.errors.alternatePhone?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seller Settings */}
        <Card>
          <CardContent className="py-4 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Seller Settings</h3>

            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      step="0.05"
                      placeholder="5.0"
                      disabled={isViewMode}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Commission rate for this seller (0-50%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isViewMode}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SellerStatus.ACTIVE}>
                        Active
                      </SelectItem>
                      <SelectItem value={SellerStatus.PENDING}>
                        Pending
                      </SelectItem>
                      <SelectItem value={SellerStatus.SUSPENDED}>
                        Suspended
                      </SelectItem>
                      <SelectItem value={SellerStatus.REJECTED}>
                        Rejected
                      </SelectItem>
                      <SelectItem value={SellerStatus.INACTIVE}>
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Verified Seller
                      </FormLabel>
                      <FormDescription>
                        Mark this seller as verified and trusted
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isViewMode}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Featured Seller
                      </FormLabel>
                      <FormDescription>
                        Show this seller in featured listings
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isViewMode}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTopSeller"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Top Seller</FormLabel>
                      <FormDescription>
                        Mark this seller as a top performer
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isViewMode}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        {!isViewMode && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Saving..."
                    : mode === "edit"
                    ? "Update Seller"
                    : "Create Seller"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}
