"use client";

import { AdminPagination } from "@/app/admin/_components/Pagination";
import { Button } from "@/components/ui/button";
import {
  useCreateSellerMutation,
  useDeleteSellerMutation,
  useRestoreSellerMutation,
  useToggleSellerStatusMutation,
  useUpdateSellerMutation,
} from "@/redux/adminDashboard/seller/sellerApi";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { SellerFilters, SellerForm, SellerTable } from "./_components";
import {
  useSellerBulkActions,
  useSellerData,
} from "./_hooks/useSellerManagement";
import { ISellerAdminItem, ISellerFormData } from "./_types/seller.types";

function SellersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters
  const type = searchParams.get("type"); // 'add' | 'edit' | 'view'
  const editId = searchParams.get("id");

  // Modal state based on URL
  const isFormMode = type === "add" || type === "edit" || type === "view";
  const isEditMode = type === "edit" && !!editId;
  const isViewMode = type === "view" && !!editId;

  // Data and filters
  const {
    sellers,
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    updateFilters,
    updatePage,
    updateLimit,
    updateSort,
    clearFilters,
  } = useSellerData();

  // Bulk actions
  const {
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isSomeSelected,
    executeBulkAction,
    selectionCount,
  } = useSellerBulkActions();

  // API Mutations
  const [createSeller] = useCreateSellerMutation();
  const [updateSeller] = useUpdateSellerMutation();
  const [deleteSeller] = useDeleteSellerMutation();
  const [restoreSeller] = useRestoreSellerMutation();
  const [toggleSellerStatus] = useToggleSellerStatusMutation();

  // Loading state for form submissions
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Computed Values
  const totalFiltersCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) =>
        value &&
        value !== "all" &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0),
    ).length;
  }, [filters]);

  // Get seller for editing/viewing
  const selectedSeller =
    (isEditMode || isViewMode) && editId
      ? sellers.find((seller) => seller._id === editId)
      : undefined;

  // Handlers
  const handleCreateSeller = () => {
    router.push("/admin/sellers?type=add");
  };

  const handleEditSeller = (seller: ISellerAdminItem) => {
    router.push(`/admin/sellers?type=edit&id=${seller._id}`);
  };

  const handleViewSeller = (seller: ISellerAdminItem) => {
    router.push(`/admin/sellers?type=view&id=${seller._id}`);
  };

  const handleCloseForm = () => {
    router.push("/admin/sellers"); // Back to list
  };

  const handleFormSubmit = async (formData: ISellerFormData) => {
    setIsFormLoading(true);
    try {
      if (isEditMode && editId) {
        // Update existing seller
        await updateSeller({
          id: editId,
          ...formData,
        }).unwrap();
        toast.success("Seller updated successfully");
      } else {
        // Create new seller
        await createSeller(formData).unwrap();
        toast.success("Seller created successfully");
      }

      // Close form and refresh data
      handleCloseForm();
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        `Failed to ${isEditMode ? "update" : "create"} seller`;
      toast.error(errorMessage);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteSeller = async (sellerId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this seller? This action can be undone later.",
      )
    ) {
      return;
    }

    try {
      await deleteSeller(sellerId).unwrap();
      toast.success("Seller deleted successfully");
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete seller";
      toast.error(errorMessage);
    }
  };

  const handleRestoreSeller = async (sellerId: string) => {
    try {
      await restoreSeller(sellerId).unwrap();
      toast.success("Seller restored successfully");
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to restore seller";
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (sellerId: string) => {
    try {
      await toggleSellerStatus(sellerId).unwrap();
      toast.success("Seller status updated successfully");
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update seller status";
      toast.error(errorMessage);
    }
  };

  // Error handling
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Sellers
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
              {isEditMode
                ? "Edit Seller"
                : isViewMode
                ? "View Seller"
                : "Add New Seller"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? `Update "${selectedSeller?.storeName}" seller information`
                : isViewMode
                ? `View "${selectedSeller?.storeName}" seller details`
                : "Create a new seller with all the necessary information"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleCloseForm}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sellers
          </Button>
        </div>

        {/* Form Content */}
        <div className="">
          <SellerForm
            seller={selectedSeller}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={isFormLoading}
            mode={isEditMode ? "edit" : isViewMode ? "view" : "add"}
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
            Seller Management
          </h1>
          <p className="text-muted-foreground">
            Manage your store sellers, verification, and settings
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectionCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectionCount} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                Clear
              </Button>
            </div>
          )}
          <Button
            onClick={handleCreateSeller}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Seller
          </Button>
        </div>
      </div>

      {/* Filters */}
      <SellerFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        totalFiltersCount={totalFiltersCount}
        isLoading={isLoading}
      />

      {/* Seller Table */}
      <SellerTable
        sellers={sellers}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectionChange={toggleSelection}
        onSelectAll={toggleSelectAll}
        isSelected={isSelected}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        onSort={updateSort}
        onView={handleViewSeller}
        onEdit={handleEditSeller}
        onDelete={handleDeleteSeller}
        onRestore={handleRestoreSeller}
        onToggleStatus={handleToggleStatus}
        onBulkAction={executeBulkAction}
        className="mt-6"
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <AdminPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          itemsPerPage={pagination.limit}
          onPageChange={updatePage}
          onItemsPerPageChange={(limit) => {
            updateLimit(limit);
          }}
          isLoading={isLoading}
          itemName="sellers"
          showFirstLast={true}
          showPageNumbers={true}
        />
      )}
    </div>
  );
}

export default function SellersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SellersPageContent />
    </Suspense>
  );
}
