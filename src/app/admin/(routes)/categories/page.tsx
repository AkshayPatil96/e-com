"use client";

import AdminPageLayout from "@/app/admin/_components/AdminPageLayout";
import AdminPagination from "@/app/admin/_components/Pagination";
import { adminHeadersHeight } from "@/lib/utils";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesListAdminQuery,
  useRestoreCategoryMutation,
  useToggleCategoryStatusMutation,
  useUpdateCategoryMutation,
} from "@/redux/adminDashboard/category/categoryApi";
import { useLoadUserQuery } from "@/redux/user/userApi";
import { AlertCircle, Archive, FolderPlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  CategoryFilters,
  CategoryFormModal,
  EnhancedCategoryTable,
} from "./_components";
import { type TableViewMode } from "./_components/table/types";
import {
  type Category,
  CategoryFeatured,
  type CategoryFiltersType,
  type CategoryFormData,
  CategorySortBy,
  CategoryStatus,
  SortOrder,
} from "./_types/category.types";

const CategoriesPage = () => {
  const { data: { data: user } = {} } = useLoadUserQuery();
  const categoryPermissions = user?.permissions?.categories;

  // Filter state
  const [filters, setFilters] = useState<CategoryFiltersType>({
    page: 1,
    limit: 20,
    search: "",
    status: CategoryStatus.ALL,
    featured: CategoryFeatured.ALL,
    parent: "all",
    level: null,
    isDeleted: false,
    sortBy: CategorySortBy.ORDER,
    sortOrder: SortOrder.ASC,
  });

  // Track archive view state
  const [isArchiveView, setIsArchiveView] = useState(false);

  // View mode state
  const [viewMode, setViewMode] = useState<TableViewMode>("tree");

  // Handle view mode change to reset pagination appropriately
  const handleViewModeChange = (newViewMode: TableViewMode) => {
    setViewMode(newViewMode);
    if (newViewMode === "tree") {
      // For tree view, we want to fetch all categories
      setFilters((prev) => ({ ...prev, page: 1, limit: 1000 }));
    } else {
      // For list/grid view, reset to reasonable pagination
      setFilters((prev) => ({ ...prev, page: 1, limit: 20 }));
    }
  };

  // For tree view, we need all categories to build proper hierarchy
  const treeFilters = {
    ...filters,
    // Remove pagination limit for tree view to get all categories
    limit: viewMode === "tree" ? 1000 : filters.limit,
    page: viewMode === "tree" ? 1 : filters.page,
  };

  const { data: categoriesData, isLoading } =
    useGetCategoriesListAdminQuery(treeFilters);

  // Mutation hooks
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [restoreCategory] = useRestoreCategoryMutation();
  const [toggleCategoryStatus] = useToggleCategoryStatusMutation();

  // Modal state management
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [showFormModal, setShowFormModal] = useState(false);
  const [formModalMode, setFormModalMode] = useState<"add" | "edit">("add");

  const categories: Category[] = categoriesData?.data?.data || [];
  const totalPages = categoriesData?.data?.totalPages || 0;
  const totalCount = categoriesData?.data?.totalCount || 0;

  const handleAddCategory = () => {
    if (!categoryPermissions?.canCreate) {
      toast.error("You do not have permission to create categories");
      return;
    }
    setSelectedCategory(null);
    setFormModalMode("add");
    setShowFormModal(true);
  };

  const handleEditCategory = (category: Category) => {
    if (!categoryPermissions?.canEdit) {
      toast.error("You do not have permission to edit categories");
      return;
    }
    setSelectedCategory(category);
    setFormModalMode("edit");
    setShowFormModal(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!categoryPermissions?.canArchive) {
      toast.error("You do not have permission to archive categories");
      return;
    }
    try {
      await deleteCategory(categoryId).unwrap();
      toast.success("Category archived successfully");
    } catch (error: unknown) {
      console.error("Failed to archive category:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to archive category";
      toast.error(errorMessage);
    }
  };

  const handleRestoreCategory = async (categoryId: string) => {
    if (!categoryPermissions?.canRestore) {
      toast.error("You do not have permission to restore categories");
      return;
    }
    try {
      await restoreCategory(categoryId).unwrap();
      toast.success("Category restored successfully");
    } catch (error: unknown) {
      console.error("Failed to restore category:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to restore category";
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    if (!categoryPermissions?.canEdit) {
      toast.error("You do not have permission to edit categories");
      return;
    }
    try {
      await toggleCategoryStatus(categoryId).unwrap();
      toast.success("Category status updated successfully");
    } catch (error: unknown) {
      console.error("Failed to update category status:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update category status";
      toast.error(errorMessage);
    }
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      if (formModalMode === "edit" && data?.id) {
        // Edit mode
        if (categoryPermissions?.canEdit) {
          await updateCategory({ id: data.id, ...data }).unwrap();
          toast.success("Category updated successfully");
        } else {
          toast.error("You do not have permission to edit categories");
        }
      } else {
        // Add mode
        if (categoryPermissions?.canCreate) {
          await createCategory(data).unwrap();
          toast.success("Category created successfully");
        } else {
          toast.error("You do not have permission to create categories");
        }
      }
      setShowFormModal(false);
      setSelectedCategory(null);
    } catch (error: unknown) {
      console.error(`Failed to ${formModalMode} category:`, error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        `Failed to ${formModalMode} category`;
      toast.error(errorMessage);
    }
  };

  const handleToggleArchiveView = () => {
    if (!categoryPermissions?.canView && !categoryPermissions?.canRestore) {
      toast.error("You do not have permission to view archived categories");
      return;
    }
    const newIsArchiveView = !isArchiveView;
    setIsArchiveView(newIsArchiveView);
    setFilters((prev) => ({
      ...prev,
      isDeleted: newIsArchiveView,
      page: 1,
    }));
  };

  // Filter and pagination handlers
  const handleFiltersChange = (newFilters: CategoryFiltersType) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleSort = (column: CategorySortBy) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder:
        prev.sortBy === column && prev.sortOrder === SortOrder.ASC
          ? SortOrder.DESC
          : SortOrder.ASC,
      page: 1,
    }));
  };

  return categoryPermissions?.canView ? (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{ height: `calc(100vh - ${adminHeadersHeight}px)` }}
    >
      {/* Header */}
      <AdminPageLayout
        title={isArchiveView ? "Archived Categories" : "Category Management"}
        subtitle={`Manage ${totalCount} ${
          isArchiveView ? "archived " : ""
        }categor${totalCount !== 1 ? "ies" : "y"}${
          isArchiveView
            ? " - you can restore or permanently delete archived categories"
            : " and organize your product catalog"
        }`}
        actionButtons={[
          {
            label: isArchiveView ? "View Active" : "View Archived",
            onClick: handleToggleArchiveView,
            icon: <Archive className="h-4 w-4 mr-2" />,
            variant: isArchiveView ? "default" : "outline",
            size: "sm",
            disabled: !categoryPermissions?.canRestore,
          },
          {
            label: "Add Category",
            onClick: handleAddCategory,
            icon: <FolderPlus className="h-4 w-4 mr-2" />,
            variant: "default",
            size: "sm",
            disabled: !categoryPermissions?.canCreate,
          },
        ]}
      />

      <div className="flex flex-col h-[calc(100vh-130px)] w-full px-2">
        {/* Filters */}
        <CategoryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          showViewModeToggle={true}
          dataLength={categories.length}
          virtualScrolling={categories.length > 100}
        />

        {/* Enhanced Table */}
        <div className="flex-1 overflow-hidden">
          <EnhancedCategoryTable
            data={categories}
            isLoading={isLoading}
            sortBy={filters.sortBy || CategorySortBy.ORDER}
            sortOrder={filters.sortOrder || SortOrder.ASC}
            isArchiveView={isArchiveView}
            permissions={
              categoryPermissions || {
                canView: false,
                canCreate: false,
                canEdit: false,
                canArchive: false,
                canRestore: false,
                canDelete: false,
              }
            }
            config={{
              virtualScrolling: categories.length > 100,
              showConnectingLines: true,
              autoExpandDepth: 2,
              maxDepth: 6,
              bulkSelection: true,
            }}
            actions={{
              onEdit: handleEditCategory,
              onDelete: handleDeleteCategory,
              onRestore: handleRestoreCategory,
              onToggleStatus: handleToggleStatus,
              onBulkAction: async (action: string, categoryIds: string[]) => {
                // Handle bulk actions
                try {
                  switch (action) {
                    case "activate":
                      for (const id of categoryIds) {
                        const category = categories.find((c) => c._id === id);
                        if (category && !category.isActive) {
                          await handleToggleStatus(id);
                        }
                      }
                      break;
                    case "deactivate":
                      for (const id of categoryIds) {
                        const category = categories.find((c) => c._id === id);
                        if (category && category.isActive) {
                          await handleToggleStatus(id);
                        }
                      }
                      break;
                    case "archive":
                      for (const id of categoryIds) {
                        await handleDeleteCategory(id);
                      }
                      break;
                    case "restore":
                      for (const id of categoryIds) {
                        await handleRestoreCategory(id);
                      }
                      break;
                    default:
                      break;
                  }
                } catch (error) {
                  console.error(`Bulk action ${action} failed:`, error);
                }
              },
              onSort: handleSort,
            }}
            enableVirtualization={true}
            viewMode={viewMode}
          />
        </div>

        {/* Pagination */}
        {viewMode === "tree" ? null : (
          <div className="bg-background sticky bottom-0 z-10">
            <AdminPagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              totalCount={totalCount}
              itemsPerPage={filters.limit || 20}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              isLoading={isLoading}
              itemName="categories"
              // compact={true}
            />
          </div>
        )}
      </div>

      {/* Modal Components */}
      <CategoryFormModal
        mode={formModalMode}
        category={selectedCategory}
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isLoading={formModalMode === "edit" ? isUpdating : isCreating}
      />
    </div>
  ) : (
    <div
      className="flex items-center justify-center"
      style={{ height: `calc(100vh - ${adminHeadersHeight}px)` }}
    >
      <div className="text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default CategoriesPage;
