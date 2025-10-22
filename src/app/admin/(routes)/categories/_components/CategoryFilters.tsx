"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CategoryFeatured,
  type CategoryFiltersType,
  CategorySortBy,
  CategoryStatus,
  SortOrder,
} from "../_types/category.types";
import { ViewModeToggle } from "./table/ViewModeToggle";
import { type TableViewMode } from "./table/types";

type CategoryFiltersProps = {
  filters: CategoryFiltersType;
  onFiltersChange: (filters: CategoryFiltersType) => void;
  isLoading?: boolean;
  viewMode?: TableViewMode;
  onViewModeChange?: (mode: TableViewMode) => void;
  showViewModeToggle?: boolean;
  dataLength?: number;
  virtualScrolling?: boolean;
};

function CategoryFilters({
  filters,
  onFiltersChange,
  isLoading = false,
  viewMode = "tree",
  onViewModeChange,
  showViewModeToggle = true,
  dataLength = 0,
  virtualScrolling = false,
}: CategoryFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] =
    useState<CategoryFiltersType>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: CategoryFiltersType = {
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
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setIsOpen(false);
  };

  const handleLocalFilterChange = (
    key: keyof CategoryFiltersType,
    value: string | boolean | number | null | undefined,
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Count active filters
  const activeFiltersCount = [
    localFilters.search && localFilters.search.length > 0,
    localFilters.status !== CategoryStatus.ALL,
    localFilters.featured !== CategoryFeatured.ALL,
    localFilters.parent !== "all",
    localFilters.level !== null,
    localFilters.showInMenu !== undefined,
    localFilters.showInHomepage !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-3 py-2 border-b">
      {viewMode === "tree" ? null : (
        <>
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={localFilters.search || ""}
              onChange={(e) => {
                const newFilters = {
                  ...localFilters,
                  search: e.target.value,
                  page: 1,
                };
                setLocalFilters(newFilters);
                onFiltersChange(newFilters);
              }}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          {/* Advanced Filters Popover */}
          <Popover
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80"
              align="end"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filter Categories</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select
                    value={localFilters.status}
                    onValueChange={(value) =>
                      handleLocalFilterChange("status", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CategoryStatus.ALL}>
                        All Statuses
                      </SelectItem>
                      <SelectItem value={CategoryStatus.ACTIVE}>
                        Active
                      </SelectItem>
                      <SelectItem value={CategoryStatus.INACTIVE}>
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Featured</Label>
                  <Select
                    value={localFilters.featured}
                    onValueChange={(value) =>
                      handleLocalFilterChange("featured", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CategoryFeatured.ALL}>
                        All Categories
                      </SelectItem>
                      <SelectItem value={CategoryFeatured.FEATURED}>
                        Featured Only
                      </SelectItem>
                      <SelectItem value={CategoryFeatured.NOT_FEATURED}>
                        Not Featured
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show in Menu Toggle */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Show in Menu</Label>
                  <Switch
                    checked={localFilters.showInMenu || false}
                    onCheckedChange={(checked) =>
                      handleLocalFilterChange(
                        "showInMenu",
                        checked ? true : undefined,
                      )
                    }
                  />
                </div>

                {/* Show in Homepage Toggle */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Show in Homepage
                  </Label>
                  <Switch
                    checked={localFilters.showInHomepage || false}
                    onCheckedChange={(checked) =>
                      handleLocalFilterChange(
                        "showInHomepage",
                        checked ? true : undefined,
                      )
                    }
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select
                    value={localFilters.sortBy}
                    onValueChange={(value) =>
                      handleLocalFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CategorySortBy.ORDER}>
                        Order
                      </SelectItem>
                      <SelectItem value={CategorySortBy.NAME}>Name</SelectItem>
                      <SelectItem value={CategorySortBy.CREATED_AT}>
                        Created Date
                      </SelectItem>
                      <SelectItem value={CategorySortBy.PRODUCT_COUNT}>
                        Product Count
                      </SelectItem>
                      <SelectItem value={CategorySortBy.VIEW_COUNT}>
                        View Count
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort Order</Label>
                  <Select
                    value={localFilters.sortOrder}
                    onValueChange={(value) =>
                      handleLocalFilterChange("sortOrder", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SortOrder.ASC}>Ascending</SelectItem>
                      <SelectItem value={SortOrder.DESC}>Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}

      {/* View Mode Toggle */}
      {showViewModeToggle && onViewModeChange && (
        <div className="flex-1 flex items-center justify-end gap-4">
          <ViewModeToggle
            currentMode={viewMode}
            onModeChange={onViewModeChange}
            disabled={isLoading}
            handleResetFilters={handleResetFilters}
          />

          {/* Performance indicator */}
          {virtualScrolling && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Virtual scrolling ({dataLength} items)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryFilters;
