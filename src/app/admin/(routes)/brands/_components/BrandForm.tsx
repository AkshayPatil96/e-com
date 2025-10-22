"use client";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { getData } from "country-list";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CategoryAutocompleteV2 from "../../categories/_components/CategoryAutocompleteV2";
import { ImageUploader } from "../_components/ImageUploader";
import {
  IBrandAdminItem,
  IBrandFormData,
  IImage,
  ProcessingStatus,
} from "../_types/brand.types";


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

  // Visual Assets - Support IImage objects
  logo: z
    .object({
      url: z.string().url(),
      alt: z.string().optional(),
      filename: z.string().optional(),
      processingStatus: z.nativeEnum(ProcessingStatus).optional(),
    })
    .optional(),
  banner: z
    .object({
      url: z.string().url(),
      alt: z.string().optional(),
      filename: z.string().optional(),
      processingStatus: z.nativeEnum(ProcessingStatus).optional(),
    })
    .optional(),

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

  // Categories - Optional
  categories: z.array(z.string()).optional(),

  // Display Settings - Optional
  displayOrder: z.number().min(0).max(9999).optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  showInMenu: z.boolean(),
  showInHomepage: z.boolean(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

interface BrandFormProps {
  brand?: IBrandAdminItem;
  onSubmit: (data: IBrandFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  submitIcon?: React.ReactNode;
  formType?: "add" | "edit";
  editId?: string | undefined;
}

export const BrandForm = ({
  brand,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Brand",
  submitIcon = <Save className="h-4 w-4 mr-2" />,
  formType,
  editId,
}: BrandFormProps) => {
  const [keywordInput, setKeywordInput] = useState("");
  const [businessInfoOpen, setBusinessInfoOpen] = useState(false);
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);
  const [seoSettingsOpen, setSeoSettingsOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const isEditing = !!brand;

  const defaultBrand: Partial<BrandFormValues> = {
    name: "",
    description: "",
    shortDescription: "",
    logo: undefined,
    banner: undefined,
    foundingYear: undefined,
    originCountry: "",
    headquarters: "",
    parentCompany: "",
    legalName: "",
    registrationNumber: "",
    taxId: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    categories: [],
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
    showInMenu: true,
    showInHomepage: false,
  };

  const countries = useMemo(() => getData().map((country) => country.name), []);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: defaultBrand,
  });

  // Reset form when brand changes
  useEffect(() => {
    if (brand) {
      const formData: Partial<BrandFormValues> = {
        name: brand.name || "",
        description: brand.description || "",
        shortDescription: brand.shortDescription || "",
        logo:
          typeof brand.logo === "string"
            ? {
                url: brand.logo,
                alt: `${brand.name} logo`,
                processingStatus: ProcessingStatus.COMPLETED,
              }
            : (brand.logo as IImage | undefined),
        banner:
          typeof brand.banner === "string"
            ? {
                url: brand.banner,
                alt: `${brand.name} banner`,
                processingStatus: ProcessingStatus.COMPLETED,
              }
            : (brand.banner as IImage | undefined),
        foundingYear: brand?.businessInfo?.foundingYear,
        originCountry: brand?.businessInfo?.originCountry || "",
        headquarters: brand?.businessInfo?.headquarters || "",
        parentCompany: brand?.businessInfo?.parentCompany || "",
        legalName: brand?.businessInfo?.legalName || "",
        registrationNumber: brand?.businessInfo?.registrationNumber || "",
        taxId: brand?.businessInfo?.taxId || "",
        website: brand?.socialMedia?.website || "",
        facebook: brand?.socialMedia?.facebook || "",
        instagram: brand?.socialMedia?.instagram || "",
        twitter: brand?.socialMedia?.twitter || "",
        linkedin: brand?.socialMedia?.linkedin || "",
        youtube: brand?.socialMedia?.youtube || "",
        tiktok: brand?.socialMedia?.tiktok || "",
        seoTitle: brand?.seo?.metaTitle || "",
        seoDescription: brand?.seo?.metaDescription || "",
        seoKeywords: brand?.seo?.metaKeywords || [],
        categories: brand?.categories || [],
        displayOrder: brand.displayOrder || 0,
        isActive: brand.isActive ?? true,
        isFeatured: brand.isFeatured ?? false,
        showInMenu: brand.showInMenu ?? true,
        showInHomepage: brand.showInHomepage ?? false,
      };

      form.reset(formData);
      // Preview handling is done by ImageUploader component

      // For admin table items, we don't have extended data, so keep sections closed
      setBusinessInfoOpen(false);
      setSocialMediaOpen(false);
      setSeoSettingsOpen(false);
    } else {
      form.reset();
      setBusinessInfoOpen(false);
      setSocialMediaOpen(false);
      setSeoSettingsOpen(false);
    }
  }, [brand, form]);

  const handleSubmit = async (values: BrandFormValues) => {
    try {
      const formData: IBrandFormData = {
        ...values,
        // Logo and banner are already IImage objects or undefined
        logo: values.logo,
        banner: values.banner,
        // Convert empty strings to undefined for optional text fields
        shortDescription: values.shortDescription || undefined,
        // Structure business info as nested object
        businessInfo: {
          foundingYear: values.foundingYear,
          originCountry: values.originCountry || undefined,
          headquarters: values.headquarters || undefined,
          parentCompany: values.parentCompany || undefined,
          legalName: values.legalName || undefined,
          registrationNumber: values.registrationNumber || undefined,
          taxId: values.taxId || undefined,
        },
        // Structure social media as nested object
        socialMedia: {
          website: values.website || undefined,
          facebook: values.facebook || undefined,
          instagram: values.instagram || undefined,
          twitter: values.twitter || undefined,
          linkedin: values.linkedin || undefined,
          youtube: values.youtube || undefined,
          tiktok: values.tiktok || undefined,
        },
        // Structure SEO as nested object
        seo: {
          metaTitle: values.seoTitle || undefined,
          metaDescription: values.seoDescription || undefined,
          metaKeywords:
            values.seoKeywords && values.seoKeywords.length > 0
              ? values.seoKeywords
              : undefined,
        },
        // Categories
        categories:
          values.categories && values.categories.length > 0
            ? values.categories
            : undefined,
      };

      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Form submission error:", error);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = form.getValues("seoKeywords") || [];
      // make first letter Uppercase
      const formattedKeyword =
        keywordInput.charAt(0).toUpperCase() + keywordInput.slice(1);
      if (!currentKeywords.includes(formattedKeyword)) {
        form.setValue("seoKeywords", [...currentKeywords, formattedKeyword]);
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
              {/* <Badge
                variant="destructive"
                className="text-xs"
              >
                Required
              </Badge> */}
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
                        placeholder: "Select categories for this brand...",
                        searchPlaceholder: "Search categories...",
                        itemsSelectedText: "categories selected",
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the categories this brand belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Visual Assets - Advanced Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Visual Assets</h3>

            <div className="flex flex-col gap-8">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2">Brand Logo</FormLabel>
                    <FormControl>
                      <ImageUploader
                        type="logo"
                        value={field.value}
                        onChange={(image: IImage | IImage[]) => {
                          const singleImage = Array.isArray(image)
                            ? image[0]
                            : image;
                          field.onChange(singleImage);
                        }}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        disabled={isLoading}
                        className="w-full"
                        formType={formType}
                        editId={editId}
                      />
                    </FormControl>
                    {!field.value && (
                      <FormDescription>
                        Upload a logo file (PNG, JPG, WebP, SVG) or enter an
                        external URL.
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
                    <FormLabel className="mb-2">Brand Banner</FormLabel>
                    <FormControl>
                      <ImageUploader
                        type="banner"
                        value={field.value}
                        onChange={(image: IImage | IImage[]) => {
                          const singleImage = Array.isArray(image)
                            ? image[0]
                            : image;
                          field.onChange(singleImage);
                        }}
                        accept="image/png,image/jpeg,image/webp"
                        disabled={isLoading}
                        className="w-full"
                        editId={editId}
                        formType={formType}
                      />
                    </FormControl>
                    {!field.value && (
                      <FormDescription>
                        Upload a banner file (PNG, JPG, WebP) or enter an
                        external URL.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Separator />

            {/* Business Information - Collapsible Section */}
            <Collapsible
              open={businessInfoOpen}
              onOpenChange={setBusinessInfoOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-between p-0 py-2 h-auto"
                >
                  <h3 className="text-lg font-medium">Business Information</h3>
                  {businessInfoOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
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
                              <CommandList className="max-h-[200px] overflow-y-auto">
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
                  className="flex w-full justify-between p-0 py-2 h-auto"
                >
                  <h3 className="text-lg font-medium">Social Media & Web</h3>
                  {socialMediaOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
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

            {/* SEO Settings - Collapsible Section */}
            <Collapsible
              open={seoSettingsOpen}
              onOpenChange={setSeoSettingsOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-between p-0 py-2 h-auto"
                >
                  <h3 className="text-lg font-medium">SEO Settings</h3>
                  {seoSettingsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brand name | Your Store"
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
                          placeholder="SEO-friendly description for search engines..."
                          rows={3}
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
                              placeholder="Add keyword..."
                              value={keywordInput}
                              onChange={(e) => setKeywordInput(e.target.value)}
                              onKeyPress={handleKeywordKeyPress}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addKeyword}
                              disabled={!keywordInput.trim()}
                            >
                              Add
                            </Button>
                          </div>
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((keyword, index) => (
                                <div
                                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                                  key={index}
                                >
                                  <span>{keyword}</span>
                                  <X
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={() => removeKeyword(keyword)}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/20 keywords
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Separator />
          </div>

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
                  <FormItem className="">
                    <FormLabel className="text-base flex flex-row items-center justify-between rounded-lg border p-4 cursor-pointer">
                      <div className="">
                        Active Status
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
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-base flex flex-row items-center justify-between rounded-lg border p-4 cursor-pointer">
                      <div className="">
                        Featured Brand
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
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showInMenu"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-base flex flex-row items-center justify-between rounded-lg border p-4 cursor-pointer">
                      <div className="">
                        Show in Menu
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
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showInHomepage"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-base flex flex-row items-center justify-between rounded-lg border p-4 cursor-pointer">
                      <div className="">
                        Show on Homepage
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
                    </FormLabel>
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
