"use client";

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
import { Filter, FilterX, Search, SortAsc, SortDesc } from "lucide-react";
import { AdminFilters as AdminFiltersType } from "../_types/admin.types";

type AdminFiltersProps = {
  filters: AdminFiltersType;
  onFiltersChange: (filters: AdminFiltersType) => void;
  isLoading?: boolean;
};

export default function AdminFilters({
  filters,
  onFiltersChange,
  isLoading = false,
}: AdminFiltersProps) {
  const handleFilterChange = (
    key: keyof AdminFiltersType,
    value: string | number | undefined,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 10,
      search: "",
      statusFilter: "all",
      permissionFilter: "all",
      sortBy: "name",
      sortOrder: "asc",
      isArchived: filters.isArchived, // Keep archive state
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.statusFilter && filters.statusFilter !== "all") count++;
    if (filters.permissionFilter && filters.permissionFilter !== "all") count++;
    if (filters.canCreateAdminFilter && filters.canCreateAdminFilter !== "all")
      count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex items-center gap-3 py-2 bg-background">
      {/* Search Input */}
      <div className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          disabled={isLoading}
          className="pl-10"
        />
      </div>

      {/* Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={activeFiltersCount > 0 ? "default" : "outline"}
            size="sm"
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-background text-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          align="end"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter & Sort</h4>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={isLoading}
                >
                  <FilterX className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <Separator />

            {/* Sort Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sort</Label>
              <div className="flex gap-2">
                <Select
                  value={filters.sortBy || "name"}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="flex-1 w-full">
                    <SelectValue placeholder="Sort field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="lastLogin">Last Login</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleFilterChange(
                      "sortOrder",
                      filters.sortOrder === "asc" ? "desc" : "asc",
                    )
                  }
                  disabled={isLoading}
                >
                  {filters.sortOrder === "desc" ? (
                    <SortDesc className="h-4 w-4" />
                  ) : (
                    <SortAsc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Filter Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Filters</Label>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select
                  value={filters.statusFilter || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("statusFilter", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="hold">Hold</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permission Level Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Permission Level
                </Label>
                <Select
                  value={filters.permissionFilter || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("permissionFilter", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High (70%+)</SelectItem>
                    <SelectItem value="medium">Medium (30-70%)</SelectItem>
                    <SelectItem value="low">Low (&lt;30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
