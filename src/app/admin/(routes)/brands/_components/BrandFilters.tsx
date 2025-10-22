/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { BrandFiltersType } from "../_types/brand.types";

interface BrandFiltersProps {
  filters: BrandFiltersType;
  onFiltersChange: (filters: BrandFiltersType) => void;
  onClearFilters: () => void;
  totalFiltersCount: number;
}

const statusOptions = [
  {
    value: "active",
    label: "Active",
    color: "bg-green-200 text-green-800",
  },
  {
    value: "inactive",
    label: "Inactive",
    color: "bg-rose-200 text-gray-800",
  },
];

export const BrandFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  totalFiltersCount,
}: BrandFiltersProps) => {
  const updateFilters = (key: keyof BrandFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex items-center flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search brands..."
          type="search"
          value={filters.search || ""}
          onChange={(e) => {
            updateFilters("search", e.target.value);
          }}
          className="pl-9 pr-4"
        />
      </div>

      {/* Quick Filters Row */}
      <div className="flex items-center justify-end gap-2 flex-wrap flex-1">
        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilters("status", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      option.color.split(" ")[0]
                    }`}
                  />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Featured Filter */}
        <Select
          value={filters.featured?.toString()}
          onValueChange={(value) => updateFilters("featured", value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="true">Featured Only</SelectItem>
            <SelectItem value="false">Non-Featured</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear All Button */}
        {totalFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Clear All ({totalFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
};
