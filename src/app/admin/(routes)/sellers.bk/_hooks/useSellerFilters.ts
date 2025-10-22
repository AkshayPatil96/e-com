import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ISellerFilters, SellerStatus } from "../_types/seller.types";

interface UseSellerFiltersOptions {
  defaultFilters?: Partial<ISellerFilters>;
  syncWithUrl?: boolean;
}

interface UseSellerFiltersReturn {
  filters: ISellerFilters;
  setFilters: (filters: ISellerFilters) => void;
  updateFilters: (updates: Partial<ISellerFilters>) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  clearSearch: () => void;
  setSearch: (search: string) => void;
  toggleStatus: (status: SellerStatus) => void;
  toggleCategory: (category: string) => void;
  setDateRange: (start?: Date, end?: Date) => void;
  setCommissionRange: (min?: number, max?: number) => void;
  setRatingRange: (min?: number, max?: number) => void;
}

const defaultFilters: ISellerFilters = {
  search: "",
  status: [],
  isVerified: undefined,
  isFeatured: undefined,
  isTopSeller: undefined,
  commissionRateMin: undefined,
  commissionRateMax: undefined,
  ratingMin: undefined,
  ratingMax: undefined,
  joinedDateStart: undefined,
  joinedDateEnd: undefined,
  categories: [],
};

export function useSellerFilters(options: UseSellerFiltersOptions = {}): UseSellerFiltersReturn {
  const { defaultFilters: customDefaults, syncWithUrl = true } = options;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Merge custom defaults with base defaults
  const initialFilters = useMemo(() => ({
    ...defaultFilters,
    ...customDefaults,
  }), [customDefaults]);

  const [filters, setFiltersState] = useState<ISellerFilters>(initialFilters);

  // Parse filters from URL parameters
  const parseFiltersFromUrl = useCallback((): ISellerFilters => {
    const urlFilters: ISellerFilters = { ...initialFilters };

    // Search
    const search = searchParams.get("search");
    if (search) urlFilters.search = search;

    // Status (multiple values)
    const status = searchParams.get("status");
    if (status) {
      urlFilters.status = status.split(",").filter(s => 
        Object.values(SellerStatus).includes(s as SellerStatus)
      ) as SellerStatus[];
    }

    // Boolean filters
    const isVerified = searchParams.get("verified");
    if (isVerified !== null) urlFilters.isVerified = isVerified === "true";

    const isFeatured = searchParams.get("featured");
    if (isFeatured !== null) urlFilters.isFeatured = isFeatured === "true";

    const isTopSeller = searchParams.get("topSeller");
    if (isTopSeller !== null) urlFilters.isTopSeller = isTopSeller === "true";

    // Commission rate range
    const commissionMin = searchParams.get("commissionMin");
    if (commissionMin) urlFilters.commissionRateMin = Number(commissionMin);

    const commissionMax = searchParams.get("commissionMax");
    if (commissionMax) urlFilters.commissionRateMax = Number(commissionMax);

    // Rating range
    const ratingMin = searchParams.get("ratingMin");
    if (ratingMin) urlFilters.ratingMin = Number(ratingMin);

    const ratingMax = searchParams.get("ratingMax");
    if (ratingMax) urlFilters.ratingMax = Number(ratingMax);

    // Date range
    const joinedStart = searchParams.get("joinedStart");
    if (joinedStart) urlFilters.joinedDateStart = new Date(joinedStart);

    const joinedEnd = searchParams.get("joinedEnd");
    if (joinedEnd) urlFilters.joinedDateEnd = new Date(joinedEnd);

    // Categories (multiple values)
    const categories = searchParams.get("categories");
    if (categories) {
      urlFilters.categories = categories.split(",").filter(Boolean);
    }

    return urlFilters;
  }, [searchParams, initialFilters]);

  // Sync filters with URL on mount
  useEffect(() => {
    if (syncWithUrl) {
      const urlFilters = parseFiltersFromUrl();
      setFiltersState(urlFilters);
    }
  }, [syncWithUrl, parseFiltersFromUrl]);

  // Update URL when filters change
  const updateUrl = useCallback((newFilters: ISellerFilters) => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams();

    // Add non-empty filter values to URL
    if (newFilters.search?.trim()) {
      params.set("search", newFilters.search);
    }

    if (newFilters.status && newFilters.status.length > 0) {
      params.set("status", newFilters.status.join(","));
    }

    if (newFilters.isVerified !== undefined) {
      params.set("verified", String(newFilters.isVerified));
    }

    if (newFilters.isFeatured !== undefined) {
      params.set("featured", String(newFilters.isFeatured));
    }

    if (newFilters.isTopSeller !== undefined) {
      params.set("topSeller", String(newFilters.isTopSeller));
    }

    if (newFilters.commissionRateMin !== undefined) {
      params.set("commissionMin", String(newFilters.commissionRateMin));
    }

    if (newFilters.commissionRateMax !== undefined) {
      params.set("commissionMax", String(newFilters.commissionRateMax));
    }

    if (newFilters.ratingMin !== undefined) {
      params.set("ratingMin", String(newFilters.ratingMin));
    }

    if (newFilters.ratingMax !== undefined) {
      params.set("ratingMax", String(newFilters.ratingMax));
    }

    if (newFilters.joinedDateStart) {
      params.set("joinedStart", newFilters.joinedDateStart.toISOString().split('T')[0]);
    }

    if (newFilters.joinedDateEnd) {
      params.set("joinedEnd", newFilters.joinedDateEnd.toISOString().split('T')[0]);
    }

    if (newFilters.categories && newFilters.categories.length > 0) {
      params.set("categories", newFilters.categories.join(","));
    }

    // Update URL without triggering a navigation
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  }, [router, syncWithUrl]);

  // Set filters and update URL
  const setFilters = useCallback((newFilters: ISellerFilters) => {
    setFiltersState(newFilters);
    updateUrl(newFilters);
  }, [updateUrl]);

  // Update specific filter properties
  const updateFilters = useCallback((updates: Partial<ISellerFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
  }, [filters, setFilters]);

  // Reset to default filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [setFilters, initialFilters]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "search" && value && value.trim() !== "") return true;
      if (key === "status" && Array.isArray(value) && value.length > 0) return true;
      if (key === "categories" && Array.isArray(value) && value.length > 0) return true;
      if (typeof value === "boolean" && value) return true;
      if (typeof value === "number" && value > 0) return true;
      if (value instanceof Date) return true;
      return false;
    });
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return [
      filters.search?.trim() ? 1 : 0,
      filters.status?.length || 0,
      filters.categories?.length || 0,
      filters.isVerified ? 1 : 0,
      filters.isFeatured ? 1 : 0,
      filters.isTopSeller ? 1 : 0,
      filters.commissionRateMin || filters.commissionRateMax ? 1 : 0,
      filters.ratingMin || filters.ratingMax ? 1 : 0,
      filters.joinedDateStart || filters.joinedDateEnd ? 1 : 0,
    ].reduce((sum, count) => sum + count, 0);
  }, [filters]);

  // Convenience methods
  const clearSearch = useCallback(() => {
    updateFilters({ search: "" });
  }, [updateFilters]);

  const setSearch = useCallback((search: string) => {
    updateFilters({ search });
  }, [updateFilters]);

  const toggleStatus = useCallback((status: SellerStatus) => {
    const currentStatuses = filters.status || [];
    const updatedStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    updateFilters({ status: updatedStatuses });
  }, [filters.status, updateFilters]);

  const toggleCategory = useCallback((category: string) => {
    const currentCategories = filters.categories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    updateFilters({ categories: updatedCategories });
  }, [filters.categories, updateFilters]);

  const setDateRange = useCallback((start?: Date, end?: Date) => {
    updateFilters({
      joinedDateStart: start,
      joinedDateEnd: end,
    });
  }, [updateFilters]);

  const setCommissionRange = useCallback((min?: number, max?: number) => {
    updateFilters({
      commissionRateMin: min,
      commissionRateMax: max,
    });
  }, [updateFilters]);

  const setRatingRange = useCallback((min?: number, max?: number) => {
    updateFilters({
      ratingMin: min,
      ratingMax: max,
    });
  }, [updateFilters]);

  return {
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    clearSearch,
    setSearch,
    toggleStatus,
    toggleCategory,
    setDateRange,
    setCommissionRange,
    setRatingRange,
  };
}