import {
  clearSearchFilters,
  getNextSortOrder,
  transformFiltersToQueryParams,
  validateBulkActionSelection,
} from "@/app/admin/(routes)/sellers/_helpers/sellerHelpers";
import {
  ISellerAdminItem,
  SellerAdminQueryParams,
  SellerBulkAction,
  SellerFiltersType,
  SellerSortBy,
  SortOrder,
} from "@/app/admin/(routes)/sellers/_types/seller.types";
import {
  useBulkActionSellersMutation,
  useGetSellersListAdminQuery,
} from "@/redux/adminDashboard/seller/sellerApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

// 1. Seller Filters Hook
export const useSellerFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL params
  const initialFilters: SellerFiltersType = useMemo(() => {
    return {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
      verified: searchParams.get("verified") || "all",
      featured: searchParams.get("featured") || "all",
      categories: searchParams.get("categories")
        ? searchParams.get("categories")!.split(",").filter(Boolean)
        : [],
      minSales: searchParams.get("minSales") || "",
      maxSales: searchParams.get("maxSales") || "",
      minRating: searchParams.get("minRating") || "",
      maxRating: searchParams.get("maxRating") || "",
      minCommission: searchParams.get("minCommission") || "",
      maxCommission: searchParams.get("maxCommission") || "",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<SellerFiltersType>(initialFilters);
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1"),
  );
  const [limit, setLimit] = useState<number>(
    parseInt(searchParams.get("limit") || "20"),
  );
  const [sortBy, setSortBy] = useState<SellerSortBy>(
    (searchParams.get("sortBy") as SellerSortBy) || SellerSortBy.CREATED_AT,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get("sortOrder") as SortOrder) || SortOrder.DESC,
  );

  // Update URL with current filters
  const updateURL = useCallback(
    (
      newFilters: SellerFiltersType,
      newPage?: number,
      newLimit?: number,
      newSortBy?: SellerSortBy,
      newSortOrder?: SortOrder,
    ) => {
      const params = new URLSearchParams();

      // Add filter params
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          params.set(key, value);
        }
      });

      // Add pagination and sorting
      if (newPage && newPage > 1) params.set("page", newPage.toString());
      if (newSortBy) params.set("sortBy", newSortBy);
      if (newSortOrder) params.set("sortOrder", newSortOrder);
      if (newLimit) params.set("limit", newLimit.toString());
      const queryString = params.toString();
      const newPath = queryString ? `?${queryString}` : "";

      router.push(`/admin/sellers${newPath}`, { scroll: false });
    },
    [router],
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<SellerFiltersType>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      setPage(1); // Reset to first page when filters change
      updateURL(updatedFilters, 1, limit, sortBy, sortOrder);
    },
    [filters, limit, sortBy, sortOrder, updateURL],
  );

  // Update pagination
  const updatePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateURL(filters, newPage, limit, sortBy, sortOrder);
    },
    [filters, limit, sortBy, sortOrder, updateURL],
  );

  // Update Limit
  const updateLimit = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      updateURL(filters, page, newLimit, sortBy, sortOrder);
    },
    [filters, page, sortBy, sortOrder, updateURL],
  );

  // Update sorting
  const updateSort = useCallback(
    (newSortBy: SellerSortBy) => {
      const nextOrder = getNextSortOrder(sortBy, newSortBy, sortOrder);
      const newSortOrder = nextOrder === "asc" ? SortOrder.ASC : SortOrder.DESC;
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setPage(1); // Reset to first page when sorting changes
      updateURL(filters, 1, limit, newSortBy, newSortOrder);
    },
    [filters, sortBy, sortOrder, updateURL, limit],
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters = clearSearchFilters();
    setFilters(clearedFilters);
    setPage(1);
    setSortBy(SellerSortBy.CREATED_AT);
    setSortOrder(SortOrder.DESC);
    router.push("/admin/sellers");
  }, [router]);

  // Get query params for API
  const queryParams: SellerAdminQueryParams = useMemo(() => {
    return {
      ...transformFiltersToQueryParams(filters),
      page,
      sortBy,
      sortOrder,
      limit,
    };
  }, [filters, page, sortBy, sortOrder, limit]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    const defaultFilters = clearSearchFilters();
    return Object.keys(filters).some(
      (key) =>
        filters[key as keyof SellerFiltersType] !==
        defaultFilters[key as keyof SellerFiltersType],
    );
  }, [filters]);

  return {
    filters,
    page,
    limit,
    sortBy,
    sortOrder,
    queryParams,
    hasActiveFilters,
    updateFilters,
    updateLimit,
    updatePage,
    updateSort,
    clearFilters,
  };
};

// 2. Seller Bulk Actions Hook
export const useSellerBulkActions = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [bulkActionSellers] = useBulkActionSellersMutation();

  // Toggle selection for a single seller
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((sellerId) => sellerId !== id)
        : [...prev, id],
    );
  }, []);

  // Toggle all sellers on current page
  const toggleSelectAll = useCallback(
    (sellers: ISellerAdminItem[], checked: boolean) => {
      if (checked) {
        const newIds = sellers.map((seller) => seller._id);
        setSelectedIds((prev) => {
          const combined = [...prev, ...newIds];
          return Array.from(new Set(combined)); // Remove duplicates
        });
      } else {
        const idsToRemove = sellers.map((seller) => seller._id);
        setSelectedIds((prev) =>
          prev.filter((id) => !idsToRemove.includes(id)),
        );
      }
    },
    [],
  );

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // Check if a seller is selected
  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds],
  );

  // Check if all sellers on current page are selected
  const isAllSelected = useCallback(
    (sellers: ISellerAdminItem[]) => {
      if (sellers.length === 0) return false;
      return sellers.every((seller) => selectedIds.includes(seller._id));
    },
    [selectedIds],
  );

  // Check if some sellers on current page are selected
  const isSomeSelected = useCallback(
    (sellers: ISellerAdminItem[]) => {
      if (sellers.length === 0) return false;
      return sellers.some((seller) => selectedIds.includes(seller._id));
    },
    [selectedIds],
  );

  // Execute bulk action
  const executeBulkAction = useCallback(
    async (action: SellerBulkAction) => {
      // Validate selection
      const validation = validateBulkActionSelection(selectedIds);
      if (!validation.valid) {
        toast.error(validation.message);
        return false;
      }

      setIsLoading(true);
      try {
        const result = await bulkActionSellers({
          action,
          sellerIds: selectedIds,
        }).unwrap();

        if (result.success) {
          toast.success(
            `Successfully performed ${action} on ${selectedIds.length} seller${
              selectedIds.length !== 1 ? "s" : ""
            }`,
          );
          clearSelection();
          return true;
        } else {
          toast.error(result.message || "Failed to perform bulk action");
          return false;
        }
      } catch (error) {
        console.error("Bulk action error:", error);
        toast.error("Failed to perform bulk action. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedIds, bulkActionSellers, clearSelection],
  );

  return {
    selectedIds,
    isLoading,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isSomeSelected,
    executeBulkAction,
    selectionCount: selectedIds.length,
  };
};

// 3. Seller Asset Upload Hook
export const useSellerAssetUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isUploading, setIsUploading] = useState(false);

  // Upload single file
  const uploadFile = useCallback(
    async (
      file: File,
      type: "image" | "banner",
    ): Promise<{ success: boolean; url?: string; error?: string }> => {
      const fileKey = `${type}_${Date.now()}`;

      try {
        setIsUploading(true);
        setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));

        // Here you would implement the actual upload logic
        // This is a placeholder for the upload process

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setUploadProgress((prev) => ({ ...prev, [fileKey]: progress }));
        }

        // Mock successful upload
        const mockUrl = `https://example.com/uploads/${fileKey}`;

        setUploadProgress((prev) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [fileKey]: _removed, ...rest } = prev;
          return rest;
        });

        return { success: true, url: mockUrl };
      } catch (error) {
        console.error("Upload error:", error);
        setUploadProgress((prev) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [fileKey]: _removed, ...rest } = prev;
          return rest;
        });
        return { success: false, error: "Failed to upload file" };
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  // Upload multiple files
  const uploadMultipleFiles = useCallback(
    async (
      files: File[],
      type: "image" | "banner",
    ): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> => {
      const results = await Promise.all(
        files.map((file) => uploadFile(file, type)),
      );

      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      return {
        success: failed.length === 0,
        urls: successful.map((r) => r.url!),
        errors: failed.map((r) => r.error!),
      };
    },
    [uploadFile],
  );

  // Remove uploaded file
  const removeFile = useCallback(async (url: string): Promise<boolean> => {
    try {
      // Here you would implement the actual file deletion logic
      console.log("Removing file:", url);
      return true;
    } catch (error) {
      console.error("Remove file error:", error);
      return false;
    }
  }, []);

  return {
    uploadProgress,
    isUploading,
    uploadFile,
    uploadMultipleFiles,
    removeFile,
  };
};

// 4. Seller Data Hook (combines query with filters)
export const useSellerData = () => {
  const {
    queryParams,
    hasActiveFilters,
    updateFilters,
    updatePage,
    updateLimit,
    updateSort,
    clearFilters,
    filters,
    page,
    limit,
    sortBy,
    sortOrder,
  } = useSellerFilters();

  const {
    data: sellersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSellersListAdminQuery(queryParams);

  return {
    // Data
    sellersData,
    sellers: sellersData?.data?.data || [],
    pagination: sellersData?.data
      ? {
          totalCount: sellersData.data.totalCount,
          page: sellersData.data.page,
          limit: sellersData.data.limit,
          totalPages: sellersData.data.totalPages,
          hasMore: sellersData.data.hasMore,
        }
      : null,

    // Status
    isLoading,
    isError,
    error,

    // Actions
    refetch,

    // Filters
    filters,
    page,
    limit,
    sortBy,
    sortOrder,
    hasActiveFilters,
    updateFilters,
    updatePage,
    updateLimit,
    updateSort,
    clearFilters,
  };
};
