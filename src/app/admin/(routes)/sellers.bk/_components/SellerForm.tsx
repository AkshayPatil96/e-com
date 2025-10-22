"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Save,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CategoryAutocompleteV2 from "../../categories/_components/CategoryAutocompleteV2";
import {
  ISellerAdminItem,
  ISellerFormData,
  ISellerImage,
  sellerFormSchema,
  SellerFormValues,
  SellerStatus,
} from "../_types/seller.types";
import AddressManager from "./AddressManager";
import { SellerImageUploader } from "./SellerImageUploader";
import UserAutocomplete from "./UserAutocomplete";

interface SellerFormProps {
  seller?: ISellerAdminItem;
  onSubmit: (data: ISellerFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  submitIcon?: React.ReactNode;
}

export const SellerForm = ({
  seller,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Seller",
  submitIcon = <Save className="h-4 w-4 mr-2" />,
}: SellerFormProps) => {
  // Accordion state
  const [addressesOpen, setAddressesOpen] = useState(false);

  const isEditing = !!seller;

  const defaultSeller: Partial<SellerFormValues> = useMemo(() => ({
    userId: "",
    storeName: "",
    storeDescription: "",
    categories: [],
    contactEmail: "",
    phoneNumber: "",
    alternatePhone: "",
    addresses: [],
    image: "",
    banner: "",
    socialLinks: {
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },
    commissionRate: 10,
    isVerified: false,
    isFeatured: false,
    isTopSeller: false,
    status: SellerStatus.PENDING,
    policies: {
      returnPolicy: "",
      shippingPolicy: "",
      privacyPolicy: "",
      termsOfService: "",
    },
  }), []);

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: defaultSeller,
  });

  // Reset form when seller changes
  useEffect(() => {
    if (seller) {
      const formData: Partial<SellerFormValues> = {
        userId: seller.userId || "",
        storeName: seller.storeName || "",
        storeDescription: seller.storeDescription || "",
        categories: seller.categories || [],
        contactEmail: seller.contactEmail || "",
        phoneNumber: seller.phoneNumber || "",
        alternatePhone: seller.alternatePhone || "",
        addresses: seller.addresses || [],
        image: seller.image?.url || "",
        banner: seller.banner?.url || "",
        socialLinks: {
          website: seller.socialLinks?.website || "",
          facebook: seller.socialLinks?.facebook || "",
          instagram: seller.socialLinks?.instagram || "",
          twitter: seller.socialLinks?.twitter || "",
          youtube: seller.socialLinks?.youtube || "",
          linkedin: seller.socialLinks?.linkedin || "",
        },
        commissionRate: seller.commissionRate || 10,
        isVerified: seller.isVerified ?? false,
        isFeatured: seller.isFeatured ?? false,
        isTopSeller: seller.isTopSeller ?? false,
        status: seller.status || SellerStatus.PENDING,
        policies: {
          returnPolicy: seller.policies?.returnPolicy || "",
          shippingPolicy: seller.policies?.shippingPolicy || "",
          privacyPolicy: seller.policies?.privacyPolicy || "",
          termsOfService: seller.policies?.termsOfService || "",
        },
      };

      form.reset(formData);
    } else {
      form.reset(defaultSeller);
    }
  }, [seller, form, defaultSeller]);

  const handleSubmit = async (values: SellerFormValues) => {
    try {
      const formData: ISellerFormData = {
        ...values,
        // Convert string image URLs to ISellerImage objects
        image: values.image ? {
          url: values.image,
          alt: "Store logo",
          s3Key: "",
          bucket: "seller-assets",
        } : undefined,
        banner: values.banner ? {
          url: values.banner,
          alt: "Store banner",
          s3Key: "",
          bucket: "seller-assets", 
        } : undefined,
        // Clean up empty strings to undefined for optional text fields
        storeDescription: values.storeDescription || undefined,
        phoneNumber: values.phoneNumber || undefined,
        alternatePhone: values.alternatePhone || undefined,
        // Structure social media as nested object
        socialLinks: {
          website: values.socialLinks?.website || undefined,
          facebook: values.socialLinks?.facebook || undefined,
          instagram: values.socialLinks?.instagram || undefined,
          twitter: values.socialLinks?.twitter || undefined,
          youtube: values.socialLinks?.youtube || undefined,
          linkedin: values.socialLinks?.linkedin || undefined,
        },
        // Structure policies as nested object
        policies: {
          returnPolicy: values.policies?.returnPolicy || undefined,
          shippingPolicy: values.policies?.shippingPolicy || undefined,
          privacyPolicy: values.policies?.privacyPolicy || undefined,
          termsOfService: values.policies?.termsOfService || undefined,
        },
        // Handle addresses
        addresses: values.addresses?.filter(addr => 
          addr.street && addr.city && addr.state && addr.country && addr.zipCode
        ),
      };

      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          {/* Basic Information - Required Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>

            {!isEditing && (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User *</FormLabel>
                    <FormControl>
                      <UserAutocomplete
                        value={field.value || null}
                        onValueChange={field.onChange}
                        texts={{
                          placeholder: "Search and select a user...",
                          noResultsText: "No users found.",
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Select the user who will become a seller
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., John's Electronics Store"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Describe what this store offers..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/2000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@store.com"
                      {...field}
                    />
                  </FormControl>
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
                      <Input
                        placeholder="+1 (555) 123-4567"
                        {...field}
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
                      <Input
                        placeholder="+1 (555) 987-6543"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <CategoryAutocompleteV2
                      value={field.value || []}
                      onValueChange={field.onChange}
                      config={{
                        multiple: true,
                        showBadges: true,
                        allowClear: true,
                        maxSelections: 10,
                        showHierarchy: true,
                        showDescriptions: true,
                        closeOnSelect: false,
                      }}
                      texts={{
                        placeholder: "Select categories for this seller...",
                        searchPlaceholder: "Search categories...",
                        itemsSelectedText: "categories selected",
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the categories this seller can sell in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Visual Assets */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Visual Assets</h3>

            <div className="flex flex-col gap-8">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2">Store Image</FormLabel>
                    <FormControl>
                      <SellerImageUploader
                        type="logo"
                        value={field.value ? { url: field.value, alt: "Store logo" } as ISellerImage : undefined}
                        onChange={(value) => {
                          if (value && !Array.isArray(value) && value.url) {
                            field.onChange(value.url);
                          } else {
                            field.onChange("");
                          }
                        }}
                        label="Store Logo"
                        description="Upload a store logo or profile image (JPEG, PNG, WebP - Max 5MB)"
                        disabled={isLoading}
                      />
                    </FormControl>
                    {!field.value && (
                      <FormDescription>
                        Upload a store logo or profile image (JPEG, PNG, WebP - Max 5MB)
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2">Store Banner</FormLabel>
                    <FormControl>
                      <SellerImageUploader
                        type="banner"
                        value={field.value ? { url: field.value, alt: "Store banner" } as ISellerImage : undefined}
                        onChange={(value) => {
                          if (value && !Array.isArray(value) && value.url) {
                            field.onChange(value.url);
                          } else {
                            field.onChange("");
                          }
                        }}
                        label="Store Banner"
                        description="Upload a store banner image (JPEG, PNG, WebP - Max 10MB)"
                        disabled={isLoading}
                      />
                    </FormControl>
                    {!field.value && (
                      <FormDescription>
                        Upload a store banner image (JPEG, PNG, WebP - Max 10MB)
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Addresses - Collapsible Section */}
          <Collapsible
            open={addressesOpen}
            onOpenChange={setAddressesOpen}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto"
                type="button"
              >
                <h3 className="text-lg font-medium">Addresses</h3>
                {addressesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <AddressManager form={form} disabled={isLoading} />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Commission & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Commission & Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        step="0.1"
                        placeholder="10.0"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : 0,
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Percentage commission charged on sales (0-50%)
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SellerStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={SellerStatus.PENDING}>Pending</SelectItem>
                        <SelectItem value={SellerStatus.SUSPENDED}>Suspended</SelectItem>
                        <SelectItem value={SellerStatus.REJECTED}>Rejected</SelectItem>
                        <SelectItem value={SellerStatus.INACTIVE}>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Verified Seller</FormLabel>
                      <FormDescription className="text-xs">
                        Mark as verified seller
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Featured Seller</FormLabel>
                      <FormDescription className="text-xs">
                        Show in featured sections
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTopSeller"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Top Seller</FormLabel>
                      <FormDescription className="text-xs">
                        Mark as top performer
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
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
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                submitIcon
              )}
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};