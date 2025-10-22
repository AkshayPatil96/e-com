"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  useGetCategoryByIdAdminQuery,
  useSearchCategoriesQuery,
} from "@/redux/adminDashboard/category/categoryApi";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  ICategory,
  ICategorySearchResult,
} from "../_types/category.types";

interface CategoryAutocompleteProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  excludeId?: string; // Exclude a category (useful for edit mode)
  className?: string;
}

const CategoryAutocomplete = ({
  value,
  onValueChange,
  placeholder = "Select parent category (optional)",
  disabled = false,
  excludeId,
  className,
}: CategoryAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ICategorySearchResult | ICategory | null
  >(null);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 300);

  // Fetch selected category details when we have a value
  const { data: selectedCategoryData } = useGetCategoryByIdAdminQuery(
    value as string,
    {
      skip: !value, // Only fetch when we have a selected value
    },
  );

  // Search categories with debounced query
  const {
    data: searchData,
    isLoading,
    isFetching,
  } = useSearchCategoriesQuery(
    {
      q: debouncedSearch || undefined,
      limit: 20, // Show more options in autocomplete
    },
    {
      skip: !open && !debouncedSearch, // Only search when dropdown is open or there's a search term
    },
  );

  const categories = useMemo(
    () => searchData?.data?.results || [],
    [searchData?.data?.results],
  );

  // Update selectedCategory when value or data changes
  useEffect(() => {
    if (value) {
      // First try to find from API data
      if (selectedCategoryData?.data) {
        setSelectedCategory(selectedCategoryData.data);
      } else {
        // Try to find in search results
        const foundCategory = categories.find((cat) => cat._id === value);
        if (foundCategory) {
          setSelectedCategory(foundCategory);
        }
      }
    } else {
      setSelectedCategory(null);
    }
  }, [value, selectedCategoryData?.data, categories]);

  // Filter out excluded category (prevent selecting self as parent)
  const filteredCategories = categories.filter((cat) => cat._id !== excludeId);

  const handleSelect = (categoryId: string) => {
    if (categoryId === "none") {
      onValueChange(null);
    } else {
      onValueChange(categoryId === value ? null : categoryId);
    }
    setOpen(false);
    setSearch(""); // Clear search after selection
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(null);
  };

  // Clear search when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <div className={className}>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedCategory ? (
                <span className="flex items-center gap-1">
                  <span className="text-muted-foreground text-xs">
                    {"—".repeat(selectedCategory?.level || 0)}
                  </span>
                  <span>{selectedCategory.name}</span>
                  {selectedCategory &&
                    "fullPath" in selectedCategory &&
                    selectedCategory.fullPath && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({selectedCategory.fullPath})
                      </span>
                    )}
                </span>
              ) : value ? (
                <span className="text-muted-foreground">
                  Loading selected category...
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
            <div className="flex items-center gap-1">
              {selectedCategory && !disabled && (
                <X
                  className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search categories..."
              value={search}
              onValueChange={setSearch}
              className="h-9"
            />
            <CommandList>
              {isLoading || isFetching ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              ) : filteredCategories.length === 0 && search ? (
                <CommandEmpty>No categories found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {/* No parent option */}
                  <CommandItem
                    value="none"
                    onSelect={() => handleSelect("none")}
                    className="flex items-center gap-2"
                  >
                    {/* <Check
                      className={cn(
                        "h-4 w-4",
                        value === null ? "opacity-100" : "opacity-0",
                      )}
                    /> */}
                    <span className="text-muted-foreground">
                      No parent (Top level)
                    </span>
                  </CommandItem>

                  {/* Category options */}
                  {filteredCategories.map((category) => (
                    <CommandItem
                      key={category._id}
                      value={category._id}
                      onSelect={() => handleSelect(category._id)}
                      className="flex items-center gap-2"
                    >
                      {/* <Check
                        className={cn(
                          "h-4 w-4",
                          value === category._id ? "opacity-100" : "opacity-0",
                        )}
                      /> */}
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="text-muted-foreground text-xs shrink-0">
                          {"—".repeat(category.level || 0)}
                        </span>
                        <span className="truncate">{category.name}</span>
                        {category.fullPath && (
                          <span className="text-xs text-muted-foreground ml-auto shrink-0">
                            {category.fullPath}
                          </span>
                        )}
                      </div>
                      {!category.isActive && (
                        <span className="text-xs text-red-500 ml-2">
                          Inactive
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategoryAutocomplete;
