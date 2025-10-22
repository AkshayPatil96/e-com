"use client";

import CategoryAutocompleteV2 from "@/app/admin/(routes)/categories/_components/CategoryAutocompleteV2";
import {
  SellerFiltersType,
  SellerStatus,
} from "@/app/admin/(routes)/sellers/_types/seller.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter, RotateCcw, Search, X } from "lucide-react";
import { useState } from "react";

interface SellerFiltersProps {
  filters: SellerFiltersType;
  onFiltersChange: (filters: Partial<SellerFiltersType>) => void;
  onClearFilters: () => void;
  totalFiltersCount: number;
  isLoading?: boolean;
  className?: string;
}

export function SellerFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalFiltersCount,
  isLoading = false,
  className,
}: SellerFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof SellerFiltersType,
    value: string | string[] | null,
  ) => {
    if (
      key === "categories" &&
      Array.isArray(value) &&
      value?.filter((v) => v !== "").length > 0
    ) {
      const newValue = value?.filter((v) => v !== "");
      onFiltersChange({
        [key]: value,
        ...(key === "categories" && { categories: newValue }),
      });
    } else {
      onFiltersChange({ [key]: value });
    }
  };

  const handleClearFilter = (key: keyof SellerFiltersType) => {
    onFiltersChange({ [key]: key === "search" ? "" : "all" });
  };

  return (
    <Card className={cn("gap-0 pt-2 pb-4 bg-white", className)}>
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-sm font-medium">Filters</CardTitle>
            {totalFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="text-xs"
              >
                {totalFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {totalFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                disabled={isLoading}
                className="h-8 gap-1 text-xs"
              >
                <RotateCcw className="h-3 w-3" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={isLoading}
              className="h-8 text-xs"
            >
              {isExpanded ? (
                <span className="flex items-center gap-1">
                  Collapse
                  <ChevronDown className="mr-1 h-3 w-3 rotate-180" />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Expand
                  <ChevronDown className="mr-1 h-3 w-3" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sellers by name, email, or phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClearFilter("search")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={SellerStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={SellerStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={SellerStatus.SUSPENDED}>
                  Suspended
                </SelectItem>
                <SelectItem value={SellerStatus.REJECTED}>Rejected</SelectItem>
                <SelectItem value={SellerStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.verified}
              onValueChange={(value) => handleFilterChange("verified", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sellers</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.featured}
              onValueChange={(value) => handleFilterChange("featured", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sellers</SelectItem>
                <SelectItem value="true">Featured</SelectItem>
                <SelectItem value="false">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters (Expandable) */}
        {isExpanded && (
          <>
            <Separator />
            <div className="space-y-4">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <CategoryAutocompleteV2
                  value={filters.categories || []}
                  onValueChange={(value) =>
                    handleFilterChange("categories", value)
                  }
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
                {/* <Input
                  id="category-filter"
                  placeholder="Enter category name..."
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  disabled={isLoading}
                /> */}
              </div>

              {/* Sales Range */}
              <div className="space-y-2">
                <Label>Sales Range ($)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min sales"
                    type="number"
                    value={filters.minSales}
                    onChange={(e) =>
                      handleFilterChange("minSales", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <Input
                    placeholder="Max sales"
                    type="number"
                    value={filters.maxSales}
                    onChange={(e) =>
                      handleFilterChange("maxSales", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Commission Range */}
              <div className="space-y-2">
                <Label>Commission Range (%)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min commission"
                    type="number"
                    min="0"
                    max="100"
                    value={filters.minCommission}
                    onChange={(e) =>
                      handleFilterChange("minCommission", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <Input
                    placeholder="Max commission"
                    type="number"
                    min="0"
                    max="100"
                    value={filters.maxCommission}
                    onChange={(e) =>
                      handleFilterChange("maxCommission", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Rating Range */}
              <div className="space-y-2">
                <Label>Rating Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={filters.minRating}
                    onValueChange={(value) =>
                      handleFilterChange("minRating", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Min rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1★ & above</SelectItem>
                      <SelectItem value="2">2★ & above</SelectItem>
                      <SelectItem value="3">3★ & above</SelectItem>
                      <SelectItem value="4">4★ & above</SelectItem>
                      <SelectItem value="5">5★ only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.maxRating}
                    onValueChange={(value) =>
                      handleFilterChange("maxRating", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Max rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1★ & below</SelectItem>
                      <SelectItem value="2">2★ & below</SelectItem>
                      <SelectItem value="3">3★ & below</SelectItem>
                      <SelectItem value="4">4★ & below</SelectItem>
                      <SelectItem value="5">5★ only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
