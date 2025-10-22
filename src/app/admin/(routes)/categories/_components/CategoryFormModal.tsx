"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { type Category, type CategoryFormData } from "../_types/category.types";
import CategoryAutocomplete from "./CategoryAutocomplete";

// Form validation schema
const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name too long"),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z
    .string()
    .max(200, "Short description too long")
    .optional(),
  parent: z.string().nullable().optional(),
  order: z.number().min(0, "Order must be positive").optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  showInMenu: z.boolean(),
  showInHomepage: z.boolean(),
  seo: z.object({
    metaTitle: z.string().max(60, "Meta title too long").optional(),
    metaDescription: z.string().max(160, "Meta description too long").optional(),
    metaKeywords: z.array(z.string()).optional(),
  }).optional(),
});

type CategoryFormModalProps = {
  mode: "add" | "edit";
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading?: boolean;
};

const CategoryFormModal = ({
  mode,
  category,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CategoryFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      parent: null,
      order: 0,
      isActive: true,
      isFeatured: false,
      showInMenu: true,
      showInHomepage: false,
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
      },
    },
  });

  // Reset form when modal opens or category changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && category) {
        reset({
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          shortDescription: category.shortDescription || "",
          parent: category.parent,
          order: category.order,
          isActive: category.isActive,
          isFeatured: category.isFeatured,
          showInMenu: category.showInMenu,
          showInHomepage: category.showInHomepage,
          seo: {
            metaTitle: category.seo?.metaTitle || "",
            metaDescription: category.seo?.metaDescription || "",
            metaKeywords: category.seo?.metaKeywords || [],
          },
        });
      } else {
        reset({
          name: "",
          slug: "",
          description: "",
          shortDescription: "",
          parent: null,
          order: 0,
          isActive: true,
          isFeatured: false,
          showInMenu: true,
          showInHomepage: false,
          seo: {
            metaTitle: "",
            metaDescription: "",
            metaKeywords: [],
          },
        });
      }
    }
  }, [isOpen, mode, category, reset]);

  // Auto-generate slug from name
  const categoryName = watch("name");

  useEffect(() => {
    if (mode === "add") {
      const slug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  }, [categoryName, mode, setValue]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        ...(mode === "edit" && category && { id: category._id }),
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Failed to submit category form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new category for your store"
              : `Edit details for ${category?.name}`}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter category name"
                  disabled={isSubmitting || isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="auto-generated-slug"
                  disabled={isSubmitting || isLoading}
                />
                {errors.slug && (
                  <p className="text-sm text-red-600">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                {...register("shortDescription")}
                placeholder="Brief description for category card"
                className="min-h-[80px]"
                disabled={isSubmitting || isLoading}
              />
              {errors.shortDescription && (
                <p className="text-sm text-red-600">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Detailed category description"
                className="min-h-[120px]"
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>

          {/* Hierarchy & Organization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organization</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category</Label>
                <CategoryAutocomplete
                  value={watch("parent") ?? null}
                  onValueChange={(value) => setValue("parent", value)}
                  disabled={isSubmitting || isLoading}
                  excludeId={mode === "edit" ? category?._id : undefined}
                  placeholder="Select parent category (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  placeholder="0"
                  disabled={isSubmitting || isLoading}
                />
                {errors.order && (
                  <p className="text-sm text-red-600">{errors.order.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Visibility Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Label
                htmlFor="isActive"
                className="flex items-center justify-between"
              >
                <div>
                  <p>Active Status</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    Enable this category for public viewing
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  disabled={isSubmitting || isLoading}
                />
              </Label>

              <Label
                htmlFor="isFeatured"
                className="flex items-center justify-between"
              >
                <div>
                  <p>Featured Category</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    Show in featured categories section
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={watch("isFeatured")}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                  disabled={isSubmitting || isLoading}
                />
              </Label>

              <Label
                htmlFor="showInMenu"
                className="flex items-center justify-between"
              >
                <div>
                  <p>Show in Menu</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    Display in main navigation menu
                  </p>
                </div>
                <Switch
                  id="showInMenu"
                  checked={watch("showInMenu")}
                  onCheckedChange={(checked) => setValue("showInMenu", checked)}
                  disabled={isSubmitting || isLoading}
                />
              </Label>

              <Label
                htmlFor="showInHomepage"
                className="flex items-center justify-between"
              >
                <div>
                  <p>Show in Homepage</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    Display on homepage category section
                  </p>
                </div>
                <Switch
                  id="showInHomepage"
                  checked={watch("showInHomepage")}
                  onCheckedChange={(checked) =>
                    setValue("showInHomepage", checked)
                  }
                  disabled={isSubmitting || isLoading}
                />
              </Label>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Settings</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo.metaTitle">Meta Title</Label>
                <Input
                  id="seo.metaTitle"
                  {...register("seo.metaTitle")}
                  placeholder="SEO title for this category"
                  disabled={isSubmitting || isLoading}
                />
                {errors.seo?.metaTitle && (
                  <p className="text-sm text-red-600">
                    {errors.seo.metaTitle.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.metaDescription">Meta Description</Label>
                <Textarea
                  id="seo.metaDescription"
                  {...register("seo.metaDescription")}
                  placeholder="SEO description for this category"
                  className="min-h-[80px]"
                  disabled={isSubmitting || isLoading}
                />
                {errors.seo?.metaDescription && (
                  <p className="text-sm text-red-600">
                    {errors.seo.metaDescription.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.metaKeywords">Meta Keywords</Label>
                <Input
                  id="seo.metaKeywords"
                  placeholder="Enter keywords separated by commas (e.g., fashion, clothing, men)"
                  value={watch("seo.metaKeywords")?.join(", ") || ""}
                  onChange={(e) => {
                    const keywords = e.target.value
                      .split(",")
                      .map((keyword) => keyword.trim())
                      .filter((keyword) => keyword.length > 0);
                    setValue("seo.metaKeywords", keywords);
                  }}
                  disabled={isSubmitting || isLoading}
                />
                {errors.seo?.metaKeywords && (
                  <p className="text-sm text-red-600">
                    {errors.seo.metaKeywords.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Separate keywords with commas. Recommended: 5-10 relevant keywords
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
                  {mode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === "add" ? "Create Category" : "Update Category"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormModal;
