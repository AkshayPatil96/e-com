"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { IBrand, IBrandFormData } from "../_types/brand.types";

const brandFormSchema = z.object({
  // Basic Information - Required
  name: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),
  shortDescription: z
    .string()
    .max(300, "Short description too long")
    .optional(),

  // Visual Assets - Optional
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  banner: z.string().url("Invalid banner URL").optional().or(z.literal("")),

  // Business Information - Optional
  foundingYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  originCountry: z.string().max(100).optional(),
  headquarters: z.string().max(200).optional(),
  parentCompany: z.string().max(100).optional(),
  legalName: z.string().max(200).optional(),
  registrationNumber: z.string().max(50).optional(),
  taxId: z.string().max(50).optional(),

  // Social Media - Optional
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .optional()
    .or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  youtube: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),
  tiktok: z.string().url("Invalid TikTok URL").optional().or(z.literal("")),

  // SEO Fields - Optional
  seoTitle: z
    .string()
    .max(60, "SEO title should be under 60 characters")
    .optional(),
  seoDescription: z
    .string()
    .max(160, "SEO description should be under 160 characters")
    .optional(),
  seoKeywords: z
    .array(z.string())
    .max(20, "Maximum 20 keywords allowed")
    .optional(),

  // Display Settings - Optional
  displayOrder: z.number().min(0).max(9999).optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  showInMenu: z.boolean(),
  showInHomepage: z.boolean(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: IBrand;
  onSubmit: (data: IBrandFormData) => Promise<void>;
  isLoading?: boolean;
}

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "Portugal",
  "Ireland",
  "Japan",
  "South Korea",
  "China",
  "India",
  "Singapore",
  "Thailand",
  "Vietnam",
  "Indonesia",
  "Philippines",
  "Brazil",
  "Argentina",
  "Mexico",
  "Chile",
  "Colombia",
  "Peru",
  "Turkey",
  "South Africa",
  "Egypt",
  "Morocco",
  "Russia",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Croatia",
  "Greece",
  "Other",
];

export const BrandFormModal = ({
  isOpen,
  onClose,
  brand,
  onSubmit,
  isLoading = false,
}: BrandFormModalProps) => {
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [keywordInput, setKeywordInput] = useState("");
  const [businessInfoOpen, setBusinessInfoOpen] = useState(false);
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);
  const [seoSettingsOpen, setSeoSettingsOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const isEditing = !!brand;

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      // Basic Information
      name: "",
      description: "",
      shortDescription: "",

      // Visual Assets
      logo: "",
      banner: "",

      // Business Information
      foundingYear: undefined,
      originCountry: "",
      headquarters: "",
      parentCompany: "",
      legalName: "",
      registrationNumber: "",
      taxId: "",

      // Social Media
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      tiktok: "",

      // SEO Fields
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],

      // Display Settings
      displayOrder: 0,
      isActive: true,
      isFeatured: false,
      showInMenu: true,
      showInHomepage: false,
    },
  });

  // Reset form when modal opens/closes or brand changes
  useEffect(() => {
    if (isOpen && brand) {
      form.reset({
        // Basic Information
        name: brand.name,
        description: brand.description || "",
        shortDescription: brand.shortDescription || "",

        // Visual Assets
        logo:
          typeof brand.logo === "string" ? brand.logo : brand.logo?.url || "",
        banner:
          typeof brand.banner === "string"
            ? brand.banner
            : brand.banner?.url || "",

        // Business Information
        foundingYear: brand.businessInfo?.foundingYear,
        originCountry: brand.businessInfo?.originCountry || "",
        headquarters: brand.businessInfo?.headquarters || "",
        parentCompany: brand.businessInfo?.parentCompany || "",
        legalName: brand.businessInfo?.legalName || "",
        registrationNumber: brand.businessInfo?.registrationNumber || "",
        taxId: brand.businessInfo?.taxId || "",

        // Social Media
        website: brand.socialMedia?.website || "",
        facebook: brand.socialMedia?.facebook || "",
        instagram: brand.socialMedia?.instagram || "",
        twitter: brand.socialMedia?.twitter || "",
        linkedin: brand.socialMedia?.linkedin || "",
        youtube: brand.socialMedia?.youtube || "",
        tiktok: brand.socialMedia?.tiktok || "",

        // SEO Fields
        seoTitle: brand.seo?.metaTitle || "",
        seoDescription: brand.seo?.metaDescription || "",
        seoKeywords: brand.seo?.metaKeywords || [],

        // Display Settings
        displayOrder: brand.displayOrder || 0,
        isActive: brand.isActive,
        isFeatured: brand.isFeatured || false,
        showInMenu: true, // Default since brand interface doesn't have this field
        showInHomepage: brand.showInHomepage || false,
      });
      setLogoPreview(
        typeof brand.logo === "string" ? brand.logo : brand.logo?.url || "",
      );
      setBannerPreview(
        typeof brand.banner === "string"
          ? brand.banner
          : brand.banner?.url || "",
      );
    } else if (isOpen && !brand) {
      form.reset({
        // Basic Information
        name: "",
        description: "",
        shortDescription: "",

        // Visual Assets
        logo: "",
        banner: "",

        // Business Information
        foundingYear: undefined,
        originCountry: "",
        headquarters: "",
        parentCompany: "",
        legalName: "",
        registrationNumber: "",
        taxId: "",

        // Social Media
        website: "",
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",

        // SEO Fields
        seoTitle: "",
        seoDescription: "",
        seoKeywords: [],

        // Display Settings
        displayOrder: 0,
        isActive: true,
        isFeatured: false,
        showInMenu: true,
        showInHomepage: false,
      });
      setLogoPreview("");
      setBannerPreview("");
    }
  }, [isOpen, brand, form]);

  const handleSubmit = async (values: BrandFormValues) => {
    try {
      const formData: IBrandFormData = {
        // Basic Information
        name: values.name,
        description: values.description || "",
        shortDescription: values.shortDescription || undefined,

        // Visual Assets
        // logo: values.logo || undefined,
        // banner: values.banner || undefined,

        // Business Information
        businessInfo: {
          foundingYear: values.foundingYear,
          originCountry: values.originCountry || undefined,
          headquarters: values.headquarters || undefined,
          parentCompany: values.parentCompany || undefined,
          legalName: values.legalName || undefined,
          registrationNumber: values.registrationNumber || undefined,
          taxId: values.taxId || undefined,
        },

        // Social Media
        socialMedia: {
          website: values.website || undefined,
          facebook: values.facebook || undefined,
          instagram: values.instagram || undefined,
          twitter: values.twitter || undefined,
          linkedin: values.linkedin || undefined,
          youtube: values.youtube || undefined,
          tiktok: values.tiktok || undefined,
        },

        // SEO Fields
        seo: {
          metaTitle: values.seoTitle || undefined,
          metaDescription: values.seoDescription || undefined,
          metaKeywords: values.seoKeywords,
        },

        // Display Settings
        displayOrder: values.displayOrder || 0,
        isActive: values.isActive,
        isFeatured: values.isFeatured,
        showInMenu: values.showInMenu,
        showInHomepage: values.showInHomepage,
      };

      await onSubmit(formData);
      toast.success(
        isEditing ? "Brand updated successfully" : "Brand created successfully",
      );
      onClose();
    } catch {
      toast.error(
        isEditing ? "Failed to update brand" : "Failed to create brand",
      );
    }
  };

  const handleLogoChange = (url: string) => {
    form.setValue("logo", url);
    setLogoPreview(url);
  };

  const handleBannerChange = (url: string) => {
    form.setValue("banner", url);
    setBannerPreview(url);
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = form.getValues("seoKeywords") || [];
      if (!currentKeywords.includes(keywordInput.trim())) {
        form.setValue("seoKeywords", [...currentKeywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = form.getValues("seoKeywords") || [];
    form.setValue(
      "seoKeywords",
      currentKeywords.filter((keyword) => keyword !== keywordToRemove),
    );
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={onClose}
      >
        <SheetContent
          className="sm:max-w-[800px] overflow-y-auto"
          side="right"
        >
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Edit Brand" : "Create New Brand"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update the brand information below. Fields marked with * are required."
                : "Add a new brand to your store. Fields marked with * are required."}
            </SheetDescription>
          </SheetHeader>

          {/* Rest of your form content stays the same */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Basic Information - Required Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <Badge
                    variant="destructive"
                    className="text-xs"
                  >
                    Required
                  </Badge>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Nike, Adidas, Zara"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed brand description..."
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
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description for cards and previews..."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/300 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Visual Assets - Optional Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visual Assets</h3>

                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Input
                            placeholder="https://example.com/logo.png"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleLogoChange(e.target.value);
                            }}
                          />
                          {logoPreview && (
                            <div className="flex items-center gap-3">
                              <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-50">
                                <Image
                                  src={logoPreview}
                                  alt="Logo preview"
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                Logo Preview
                              </span>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner URL</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Input
                            placeholder="https://example.com/banner.jpg"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleBannerChange(e.target.value);
                            }}
                          />
                          {bannerPreview && (
                            <div className="space-y-2">
                              <div className="relative w-full h-24 border rounded-lg overflow-hidden bg-gray-50">
                                <Image
                                  src={bannerPreview}
                                  alt="Banner preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                Banner Preview
                              </span>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Business Information - Collapsible Section */}
              <Collapsible
                open={businessInfoOpen}
                onOpenChange={setBusinessInfoOpen}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex w-full justify-between p-0 h-auto"
                  >
                    <h3 className="text-lg font-medium">
                      Business Information
                    </h3>
                    {businessInfoOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="foundingYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founding Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 1971"
                              min={1800}
                              max={new Date().getFullYear()}
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="originCountry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Country of Origin</FormLabel>
                          <Popover
                            open={countryOpen}
                            onOpenChange={setCountryOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={countryOpen}
                                  className="w-full justify-between"
                                >
                                  {field.value
                                    ? countries.find(
                                        (country) => country === field.value,
                                      )
                                    : "Select country..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput placeholder="Search countries..." />
                                <CommandList>
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup>
                                    {countries.map((country) => (
                                      <CommandItem
                                        key={country}
                                        value={country}
                                        onSelect={(currentValue) => {
                                          field.onChange(
                                            currentValue === field.value
                                              ? ""
                                              : currentValue,
                                          );
                                          setCountryOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            field.value === country
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                        {country}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="headquarters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headquarters</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Beaverton, Oregon, USA"
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
                      name="parentCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Company</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Nike Inc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="legalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Legal Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Legal business name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Business registration number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tax identification number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Social Media - Collapsible Section */}
              <Collapsible
                open={socialMediaOpen}
                onOpenChange={setSocialMediaOpen}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex w-full justify-between p-0 h-auto"
                  >
                    <h3 className="text-lg font-medium">Social Media & Web</h3>
                    {socialMediaOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Official Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.brandwebsite.com"
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
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://facebook.com/brand"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://instagram.com/brand"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter/X</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://twitter.com/brand"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://linkedin.com/company/brand"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://youtube.com/brand"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tiktok"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TikTok</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://tiktok.com/@brand"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Display Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Settings</h3>

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min={0}
                          max={9999}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first in listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <FormDescription>
                            Active brands are visible to customers
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
                            Featured Brand
                          </FormLabel>
                          <FormDescription>
                            Featured brands appear prominently
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="showInMenu"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Show in Menu
                          </FormLabel>
                          <FormDescription>
                            Display brand in navigation menu
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="showInHomepage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Show on Homepage
                          </FormLabel>
                          <FormDescription>
                            Display brand on homepage
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* SEO Settings - Collapsible Section */}
              <Collapsible
                open={seoSettingsOpen}
                onOpenChange={setSeoSettingsOpen}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex w-full justify-between p-0 h-auto"
                  >
                    <h3 className="text-lg font-medium">SEO Settings</h3>
                    {seoSettingsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SEO optimized title"
                            maxLength={60}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/60 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="SEO meta description"
                            rows={3}
                            maxLength={160}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/160 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seoKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Keywords</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add keyword and press Enter"
                                value={keywordInput}
                                onChange={(e) =>
                                  setKeywordInput(e.target.value)
                                }
                                onKeyPress={handleKeywordKeyPress}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addKeyword}
                              >
                                Add
                              </Button>
                            </div>
                            {field.value && field.value.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((keyword) => (
                                  <Badge
                                    key={keyword}
                                    variant="secondary"
                                    className="gap-1"
                                  >
                                    {keyword}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeKeyword(keyword)}
                                      className="h-4 w-4 p-0 hover:bg-transparent"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <FormDescription>
                              Maximum 20 keywords. Press Enter or click Add to
                              add keywords.
                            </FormDescription>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>

              <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Update Brand" : "Create Brand"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );

  // return (
  //   <Dialog
  //     open={isOpen}
  //     onOpenChange={onClose}
  //   >
  //     <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto">
  //       <DialogHeader>
  //         <DialogTitle>
  //           {isEditing ? "Edit Brand" : "Create New Brand"}
  //         </DialogTitle>
  //         <DialogDescription>
  //           {isEditing
  //             ? "Update the brand information below. Fields marked with * are required."
  //             : "Add a new brand to your store. Fields marked with * are required."}
  //         </DialogDescription>
  //       </DialogHeader>

  //       <Form {...form}>
  //         <form
  //           onSubmit={form.handleSubmit(handleSubmit)}
  //           className="space-y-6"
  //         >
  //           {/* Basic Information - Required Section */}
  //           <div className="space-y-4">
  //             <div className="flex items-center gap-2">
  //               <h3 className="text-lg font-medium">Basic Information</h3>
  //               <Badge
  //                 variant="destructive"
  //                 className="text-xs"
  //               >
  //                 Required
  //               </Badge>
  //             </div>

  //             <FormField
  //               control={form.control}
  //               name="name"
  //               render={({ field }) => (
  //                 <FormItem>
  //                   <FormLabel>Brand Name *</FormLabel>
  //                   <FormControl>
  //                     <Input
  //                       placeholder="e.g., Nike, Adidas, Zara"
  //                       {...field}
  //                     />
  //                   </FormControl>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />

  //             <FormField
  //               control={form.control}
  //               name="description"
  //               render={({ field }) => (
  //                 <FormItem>
  //                   <FormLabel>Description *</FormLabel>
  //                   <FormControl>
  //                     <Textarea
  //                       placeholder="Detailed brand description..."
  //                       rows={4}
  //                       {...field}
  //                     />
  //                   </FormControl>
  //                   <FormDescription>
  //                     {field.value?.length || 0}/2000 characters
  //                   </FormDescription>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />

  //             <FormField
  //               control={form.control}
  //               name="shortDescription"
  //               render={({ field }) => (
  //                 <FormItem>
  //                   <FormLabel>Short Description</FormLabel>
  //                   <FormControl>
  //                     <Textarea
  //                       placeholder="Brief description for cards and previews..."
  //                       rows={2}
  //                       {...field}
  //                     />
  //                   </FormControl>
  //                   <FormDescription>
  //                     {field.value?.length || 0}/300 characters
  //                   </FormDescription>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />
  //           </div>

  //           <Separator />

  //           {/* Visual Assets - Optional Section */}
  //           <div className="space-y-4">
  //             <h3 className="text-lg font-medium">Visual Assets</h3>

  //             <FormField
  //               control={form.control}
  //               name="logo"
  //               render={({ field }) => (
  //                 <FormItem>
  //                   <FormLabel>Logo URL</FormLabel>
  //                   <FormControl>
  //                     <div className="space-y-3">
  //                       <Input
  //                         placeholder="https://example.com/logo.png"
  //                         {...field}
  //                         onChange={(e) => {
  //                           field.onChange(e);
  //                           handleLogoChange(e.target.value);
  //                         }}
  //                       />
  //                       {logoPreview && (
  //                         <div className="flex items-center gap-3">
  //                           <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-50">
  //                             <Image
  //                               src={logoPreview}
  //                               alt="Logo preview"
  //                               fill
  //                               className="object-contain p-1"
  //                             />
  //                           </div>
  //                           <span className="text-sm text-muted-foreground">
  //                             Logo Preview
  //                           </span>
  //                         </div>
  //                       )}
  //                     </div>
  //                   </FormControl>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />

  //             <FormField
  //               control={form.control}
  //               name="banner"
  //               render={({ field }) => (
  //                 <FormItem>
  //                   <FormLabel>Banner URL</FormLabel>
  //                   <FormControl>
  //                     <div className="space-y-3">
  //                       <Input
  //                         placeholder="https://example.com/banner.jpg"
  //                         {...field}
  //                         onChange={(e) => {
  //                           field.onChange(e);
  //                           handleBannerChange(e.target.value);
  //                         }}
  //                       />
  //                       {bannerPreview && (
  //                         <div className="space-y-2">
  //                           <div className="relative w-full h-24 border rounded-lg overflow-hidden bg-gray-50">
  //                             <Image
  //                               src={bannerPreview}
  //                               alt="Banner preview"
  //                               fill
  //                               className="object-cover"
  //                             />
  //                           </div>
  //                           <span className="text-sm text-muted-foreground">
  //                             Banner Preview
  //                           </span>
  //                         </div>
  //                       )}
  //                     </div>
  //                   </FormControl>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />
  //           </div>

  //           <Separator />

  //           {/* Business Information - Collapsible Section */}
  //           <Collapsible
  //             open={businessInfoOpen}
  //             onOpenChange={setBusinessInfoOpen}
  //           >
  //             <CollapsibleTrigger asChild>
  //               <Button
  //                 variant="ghost"
  //                 className="flex w-full justify-between p-0 h-auto"
  //               >
  //                 <h3 className="text-lg font-medium">Business Information</h3>
  //                 {businessInfoOpen ? (
  //                   <ChevronDown className="h-4 w-4" />
  //                 ) : (
  //                   <ChevronRight className="h-4 w-4" />
  //                 )}
  //               </Button>
  //             </CollapsibleTrigger>
  //             <CollapsibleContent className="space-y-4 mt-4">
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <FormField
  //                   control={form.control}
  //                   name="foundingYear"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Founding Year</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           type="number"
  //                           placeholder="e.g., 1971"
  //                           min={1800}
  //                           max={new Date().getFullYear()}
  //                           {...field}
  //                           onChange={(e) =>
  //                             field.onChange(
  //                               e.target.value
  //                                 ? parseInt(e.target.value)
  //                                 : undefined,
  //                             )
  //                           }
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />

  //                 <FormField
  //                   control={form.control}
  //                   name="originCountry"
  //                   render={({ field }) => (
  //                     <FormItem className="flex flex-col">
  //                       <FormLabel>Country of Origin</FormLabel>
  //                       <Popover open={countryOpen} onOpenChange={setCountryOpen}>
  //                         <PopoverTrigger asChild>
  //                           <FormControl>
  //                             <Button
  //                               variant="outline"
  //                               role="combobox"
  //                               aria-expanded={countryOpen}
  //                               className="w-full justify-between"
  //                             >
  //                               {field.value
  //                                 ? countries.find((country) => country === field.value)
  //                                 : "Select country..."}
  //                               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
  //                             </Button>
  //                           </FormControl>
  //                         </PopoverTrigger>
  //                         <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
  //                           <Command>
  //                             <CommandInput placeholder="Search countries..." />
  //                             <CommandList>
  //                               <CommandEmpty>No country found.</CommandEmpty>
  //                               <CommandGroup>
  //                                 {countries.map((country) => (
  //                                   <CommandItem
  //                                     key={country}
  //                                     value={country}
  //                                     onSelect={(currentValue) => {
  //                                       field.onChange(currentValue === field.value ? "" : currentValue);
  //                                       setCountryOpen(false);
  //                                     }}
  //                                   >
  //                                     <Check
  //                                       className={`mr-2 h-4 w-4 ${
  //                                         field.value === country ? "opacity-100" : "opacity-0"
  //                                       }`}
  //                                     />
  //                                     {country}
  //                                   </CommandItem>
  //                                 ))}
  //                               </CommandGroup>
  //                             </CommandList>
  //                           </Command>
  //                         </PopoverContent>
  //                       </Popover>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //               </div>

  //               <FormField
  //                 control={form.control}
  //                 name="headquarters"
  //                 render={({ field }) => (
  //                   <FormItem>
  //                     <FormLabel>Headquarters</FormLabel>
  //                     <FormControl>
  //                       <Input
  //                         placeholder="e.g., Beaverton, Oregon, USA"
  //                         {...field}
  //                       />
  //                     </FormControl>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />

  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <FormField
  //                   control={form.control}
  //                   name="parentCompany"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Parent Company</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="e.g., Nike Inc."
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />

  //                 <FormField
  //                   control={form.control}
  //                   name="legalName"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Legal Name</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="Legal business name"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //               </div>

  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <FormField
  //                   control={form.control}
  //                   name="registrationNumber"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Registration Number</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="Business registration number"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />

  //                 <FormField
  //                   control={form.control}
  //                   name="taxId"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Tax ID</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="Tax identification number"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //               </div>
  //             </CollapsibleContent>
  //           </Collapsible>

  //           <Separator />

  //           {/* Social Media - Collapsible Section */}
  //           <Collapsible
  //             open={socialMediaOpen}
  //             onOpenChange={setSocialMediaOpen}
  //           >
  //             <CollapsibleTrigger asChild>
  //               <Button
  //                 variant="ghost"
  //                 className="flex w-full justify-between p-0 h-auto"
  //               >
  //                 <h3 className="text-lg font-medium">Social Media & Web</h3>
  //                 {socialMediaOpen ? (
  //                   <ChevronDown className="h-4 w-4" />
  //                 ) : (
  //                   <ChevronRight className="h-4 w-4" />
  //                 )}
  //               </Button>
  //             </CollapsibleTrigger>
  //             <CollapsibleContent className="space-y-4 mt-4">
  //               <FormField
  //                 control={form.control}
  //                 name="website"
  //                 render={({ field }) => (
  //                   <FormItem>
  //                     <FormLabel>Official Website</FormLabel>
  //                     <FormControl>
  //                       <Input
  //                         placeholder="https://www.brandwebsite.com"
  //                         {...field}
  //                       />
  //                     </FormControl>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />

  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <FormField
  //                   control={form.control}
  //                   name="facebook"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Facebook</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="https://facebook.com/brand"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />

  //                 <FormField
  //                   control={form.control}
  //                   name="instagram"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Instagram</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="https://instagram.com/brand"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />

  //                 <FormField
  //                   control={form.control}
  //                   name="twitter"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Twitter/X</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="https://twitter.com/brand"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />

  //                 <FormField
  //                   control={form.control}
  //                   name="linkedin"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>LinkedIn</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="https://linkedin.com/company/brand"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />

  //                 <FormField
  //                   control={form.control}
  //                   name="youtube"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>YouTube</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="https://youtube.com/brand"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />

  //                 <FormField
  //                   control={form.control}
  //                   name="tiktok"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>TikTok</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="https://tiktok.com/@brand"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //               </div>
  //             </CollapsibleContent>
  //           </Collapsible>

  //           <Separator />

  //           {/* Display Settings */}
  //           <div className="space-y-4">
  //             <h3 className="text-lg font-medium">Display Settings</h3>

  //             <FormField
  //               control={form.control}
  //               name="displayOrder"
  //               render={({ field }) => (
  //                 <FormItem>
  //                   <FormLabel>Display Order</FormLabel>
  //                   <FormControl>
  //                     <Input
  //                       type="number"
  //                       placeholder="0"
  //                       min={0}
  //                       max={9999}
  //                       {...field}
  //                       onChange={(e) =>
  //                         field.onChange(
  //                           e.target.value ? parseInt(e.target.value) : 0,
  //                         )
  //                       }
  //                     />
  //                   </FormControl>
  //                   <FormDescription>
  //                     Lower numbers appear first in listings
  //                   </FormDescription>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />

  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //               <FormField
  //                 control={form.control}
  //                 name="isActive"
  //                 render={({ field }) => (
  //                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
  //                     <div className="space-y-0.5">
  //                       <FormLabel className="text-base">
  //                         Active Status
  //                       </FormLabel>
  //                       <FormDescription>
  //                         Active brands are visible to customers
  //                       </FormDescription>
  //                     </div>
  //                     <FormControl>
  //                       <Switch
  //                         checked={field.value}
  //                         onCheckedChange={field.onChange}
  //                       />
  //                     </FormControl>
  //                   </FormItem>
  //                 )}
  //               />

  //               <FormField
  //                 control={form.control}
  //                 name="isFeatured"
  //                 render={({ field }) => (
  //                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
  //                     <div className="space-y-0.5">
  //                       <FormLabel className="text-base">
  //                         Featured Brand
  //                       </FormLabel>
  //                       <FormDescription>
  //                         Featured brands appear prominently
  //                       </FormDescription>
  //                     </div>
  //                     <FormControl>
  //                       <Switch
  //                         checked={field.value}
  //                         onCheckedChange={field.onChange}
  //                       />
  //                     </FormControl>
  //                   </FormItem>
  //                 )}
  //               />

  //               <FormField
  //                 control={form.control}
  //                 name="showInMenu"
  //                 render={({ field }) => (
  //                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
  //                     <div className="space-y-0.5">
  //                       <FormLabel className="text-base">
  //                         Show in Menu
  //                       </FormLabel>
  //                       <FormDescription>
  //                         Display brand in navigation menu
  //                       </FormDescription>
  //                     </div>
  //                     <FormControl>
  //                       <Switch
  //                         checked={field.value}
  //                         onCheckedChange={field.onChange}
  //                       />
  //                     </FormControl>
  //                   </FormItem>
  //                 )}
  //               />

  //               <FormField
  //                 control={form.control}
  //                 name="showInHomepage"
  //                 render={({ field }) => (
  //                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
  //                     <div className="space-y-0.5">
  //                       <FormLabel className="text-base">
  //                         Show on Homepage
  //                       </FormLabel>
  //                       <FormDescription>
  //                         Display brand on homepage
  //                       </FormDescription>
  //                     </div>
  //                     <FormControl>
  //                       <Switch
  //                         checked={field.value}
  //                         onCheckedChange={field.onChange}
  //                       />
  //                     </FormControl>
  //                   </FormItem>
  //                 )}
  //               />
  //             </div>
  //           </div>

  //           <Separator />

  //           {/* SEO Settings - Collapsible Section */}
  //           <Collapsible
  //             open={seoSettingsOpen}
  //             onOpenChange={setSeoSettingsOpen}
  //           >
  //             <CollapsibleTrigger asChild>
  //               <Button
  //                 variant="ghost"
  //                 className="flex w-full justify-between p-0 h-auto"
  //               >
  //                 <h3 className="text-lg font-medium">SEO Settings</h3>
  //                 {seoSettingsOpen ? (
  //                   <ChevronDown className="h-4 w-4" />
  //                 ) : (
  //                   <ChevronRight className="h-4 w-4" />
  //                 )}
  //               </Button>
  //             </CollapsibleTrigger>
  //             <CollapsibleContent className="space-y-4 mt-4">
  //               <FormField
  //                 control={form.control}
  //                 name="seoTitle"
  //                 render={({ field }) => (
  //                   <FormItem>
  //                     <FormLabel>SEO Title</FormLabel>
  //                     <FormControl>
  //                       <Input
  //                         placeholder="SEO optimized title"
  //                         maxLength={60}
  //                         {...field}
  //                       />
  //                     </FormControl>
  //                     <FormDescription>
  //                       {field.value?.length || 0}/60 characters
  //                     </FormDescription>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />

  //               <FormField
  //                 control={form.control}
  //                 name="seoDescription"
  //                 render={({ field }) => (
  //                   <FormItem>
  //                     <FormLabel>SEO Description</FormLabel>
  //                     <FormControl>
  //                       <Textarea
  //                         placeholder="SEO meta description"
  //                         rows={3}
  //                         maxLength={160}
  //                         {...field}
  //                       />
  //                     </FormControl>
  //                     <FormDescription>
  //                       {field.value?.length || 0}/160 characters
  //                     </FormDescription>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />

  //               <FormField
  //                 control={form.control}
  //                 name="seoKeywords"
  //                 render={({ field }) => (
  //                   <FormItem>
  //                     <FormLabel>SEO Keywords</FormLabel>
  //                     <FormControl>
  //                       <div className="space-y-3">
  //                         <div className="flex gap-2">
  //                           <Input
  //                             placeholder="Add keyword and press Enter"
  //                             value={keywordInput}
  //                             onChange={(e) => setKeywordInput(e.target.value)}
  //                             onKeyPress={handleKeywordKeyPress}
  //                           />
  //                           <Button
  //                             type="button"
  //                             variant="outline"
  //                             size="sm"
  //                             onClick={addKeyword}
  //                           >
  //                             Add
  //                           </Button>
  //                         </div>
  //                         {field.value && field.value.length > 0 && (
  //                           <div className="flex flex-wrap gap-2">
  //                             {field.value.map((keyword) => (
  //                               <Badge
  //                                 key={keyword}
  //                                 variant="secondary"
  //                                 className="gap-1"
  //                               >
  //                                 {keyword}
  //                                 <Button
  //                                   type="button"
  //                                   variant="ghost"
  //                                   size="sm"
  //                                   onClick={() => removeKeyword(keyword)}
  //                                   className="h-4 w-4 p-0 hover:bg-transparent"
  //                                 >
  //                                   <X className="h-3 w-3" />
  //                                 </Button>
  //                               </Badge>
  //                             ))}
  //                           </div>
  //                         )}
  //                         <FormDescription>
  //                           Maximum 20 keywords. Press Enter or click Add to add
  //                           keywords.
  //                         </FormDescription>
  //                       </div>
  //                     </FormControl>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />
  //             </CollapsibleContent>
  //           </Collapsible>

  //           <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
  //             <Button
  //               type="button"
  //               variant="outline"
  //               onClick={onClose}
  //               disabled={isLoading}
  //             >
  //               Cancel
  //             </Button>
  //             <Button
  //               type="submit"
  //               disabled={isLoading}
  //             >
  //               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  //               {isEditing ? "Update Brand" : "Create Brand"}
  //             </Button>
  //           </DialogFooter>
  //         </form>
  //       </Form>
  //     </DialogContent>
  //   </Dialog>
  // );
};
