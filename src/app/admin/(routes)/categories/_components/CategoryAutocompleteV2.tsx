"use client";

import DynamicAutocomplete, {
  type AutocompleteOption,
  type DynamicAutocompleteProps,
} from "@/components/ui/dynamic-autocomplete";
import { useSearchCategoriesQuery } from "@/redux/adminDashboard/category/categoryApi";
import { useCallback } from "react";
import type { ICategorySearchResult } from "../_types/category.types";

interface CategoryAutocompleteProps
  extends Omit<
    DynamicAutocompleteProps,
    "options" | "isLoading" | "onSearch" | "fetchOption"
  > {
  excludeId?: string; // Exclude a category (useful for edit mode)
  includeInactive?: boolean; // Whether to show inactive categories
}

const CategoryAutocomplete = ({
  excludeId,
  includeInactive = false,
  config = {},
  texts = {},
  ...props
}: CategoryAutocompleteProps) => {
  // Search categories with debounced query
  const {
    data: searchData,
    isLoading,
    isFetching,
  } = useSearchCategoriesQuery(
    {
      limit: 50, // Reasonable limit for autocomplete
    },
    {
      // Always keep categories loaded for better UX
    },
  );

  // Fetch specific category by ID when needed
  const fetchCategory = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_id: string): Promise<AutocompleteOption | null> => {
      try {
        // This would ideally use RTK Query's imperative fetch
        // For now, we'll handle this through the search results
        return null;
      } catch (error) {
        console.error("Failed to fetch category:", error);
        return null;
      }
    },
    [],
  );

  // Convert categories to autocomplete options
  const options: AutocompleteOption[] = (searchData?.data?.results || [])
    .filter((cat) => {
      // Exclude specific category if provided
      if (excludeId && cat._id === excludeId) return false;
      // Filter inactive categories if not included
      if (!includeInactive && !cat.isActive) return false;
      return true;
    })
    .map((cat: ICategorySearchResult) => ({
      id: cat._id,
      label: cat.name,
      value: cat._id,
      description: cat.fullPath,
      level: cat.level || 0,
      isActive: cat.isActive,
      metadata: {
        slug: cat.slug,
        productCount: cat.productCount,
      },
    }));

  // Handle search (triggered by typing in the autocomplete)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearch = useCallback((_query: string) => {
    // The search is handled by the RTK Query hook above
    // We could refetch with the query if needed
  }, []);

  // Default configuration for categories
  const categoryConfig = {
    showHierarchy: true,
    showDescriptions: true,
    showActiveStatus: true,
    searchLimit: 50,
    debounceMs: 300,
    ...config,
  };

  // Default texts for categories
  const categoryTexts = {
    placeholder: "Select category...",
    searchPlaceholder: "Search categories...",
    noResultsText: "No categories found.",
    ...texts,
  };

  return (
    <DynamicAutocomplete
      {...props}
      options={options}
      isLoading={isLoading || isFetching}
      onSearch={handleSearch}
      fetchOption={fetchCategory}
      config={categoryConfig}
      texts={categoryTexts}
      excludeIds={excludeId ? [excludeId] : undefined}
    />
  );
};

export default CategoryAutocomplete;
