/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AdminPagination } from "@/app/admin/_components/Pagination";
import { Button } from "@/components/ui/button";
import {
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsListAdminQuery,
  useUpdateBrandMutation,
} from "@/redux/adminDashboard/brand/brandApi";
import { ArrowLeft, Download, Plus, RefreshCw, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { BrandFilters, SimpleBrandTable } from "./_components";
import { BrandForm } from "./_components/BrandForm";
import {
  BrandFiltersType,
  IBrandAdminItem,
  IBrandFormData,
} from "./_types/brand.types";

const DEFAULT_FILTERS: BrandFiltersType & any = {
  search: "",
  status: "all",
  isFeatured: "all",
};

function BrandsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters
  const type = searchParams.get("type"); // 'add' | 'edit'
  const editId = searchParams.get("id");

  // Modal state based on URL
  const isFormMode = type === "add" || type === "edit";
  const isEditMode = type === "edit" && !!editId;

  // State Management
  const [filters, setFilters] = useState<BrandFiltersType>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // API Queries and Mutations
  const {
    data: brandsResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetBrandsListAdminQuery({
    ...filters,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  // Computed Values
  const totalFiltersCount = useMemo(() => {
    // return Object.keys(filters).length;
    return Object.values(filters).filter((value) => value && value !== "all")
      .length;
  }, [filters]);

  const brands = brandsResponse?.data?.data || [];
  const totalPages = brandsResponse?.data?.totalPages || 1;
  const totalItems = brandsResponse?.data?.totalCount || 0;

  // Get brand for editing
  const selectedBrand = isEditMode
    ? brands.find((brand) => brand._id === editId)
    : undefined;

  // Handlers
  const handleFiltersChange = (newFilters: BrandFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };

  const handleCreateBrand = () => {
    router.push("/admin/brands?type=add");
  };

  const handleEditBrand = (brand: IBrandAdminItem) => {
    router.push(`/admin/brands?type=edit&id=${brand._id}`);
  };

  const handleCloseForm = () => {
    router.push("/admin/brands"); // Back to list
  };

  const handleFormSubmit = async (formData: IBrandFormData) => {
    try {
      if (isEditMode && selectedBrand) {
        await updateBrand({
          id: selectedBrand._id,
          ...formData,
        }).unwrap();
        toast.success("Brand updated successfully");
      } else {
        await createBrand(formData).unwrap();
        toast.success("Brand created successfully");
      }
      router.push("/admin/brands"); // Back to list
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Operation failed";
      toast.error(errorMessage);
      throw error; // Re-throw to handle in form
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this brand? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteBrand(brandId).unwrap();
      toast.success("Brand deleted successfully");
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete brand";
      toast.error(errorMessage);
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Brands
          </h1>
          <p className="text-gray-600 mb-4">
            {(error as { data?: { message?: string } })?.data?.message ||
              "Something went wrong"}
          </p>
          <Button
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isFormMode) {
    return (
      <div className="container mx-auto p-4 min-h-screen">
        {/* Form Header */}
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Brand" : "Add New Brand"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? `Update "${selectedBrand?.name}" brand information`
                : "Create a new brand with all the necessary information"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleCloseForm}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Brands
          </Button>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <BrandForm
            brand={selectedBrand}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={isCreating || isUpdating}
            submitLabel={isEditMode ? "Update Brand" : "Create Brand"}
            formType={type as "add" | "edit"}
            editId={editId as string | undefined}
          />
        </div>
      </div>
    );
  }

  // List mode - normal page
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Brand Management
          </h1>
          <p className="text-muted-foreground">
            Manage your store brands, settings, and visibility
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleCreateBrand}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Filters */}
      <BrandFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        totalFiltersCount={totalFiltersCount}
      />

      {/* Simple Brand Table */}
      <SimpleBrandTable
        brands={brands}
        isLoading={isLoading}
        onEdit={handleEditBrand}
        onDelete={handleDeleteBrand}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          isLoading={isLoading}
          itemName="brands"
          showFirstLast={true}
          showPageNumbers={true}
        />
      )}
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandsPageContent />
    </Suspense>
  );
}
