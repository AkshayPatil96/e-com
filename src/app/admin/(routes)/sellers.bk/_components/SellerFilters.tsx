"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    CalendarIcon,
    Filter,
    RotateCcw,
    Search,
    Shield,
    Star,
    TrendingUp,
    X,
} from "lucide-react";
import React, { useState } from "react";
import {
    ISellerFilters,
    SellerStatus,
} from "../_types/seller.types";

interface SellerFiltersProps {
  filters: ISellerFilters;
  onFiltersChange: (filters: ISellerFilters) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  availableCategories?: string[];
  className?: string;
}

const statusOptions = [
  { value: SellerStatus.ACTIVE, label: "Active", color: "bg-green-100 text-green-800" },
  { value: SellerStatus.PENDING, label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: SellerStatus.SUSPENDED, label: "Suspended", color: "bg-red-100 text-red-800" },
  { value: SellerStatus.REJECTED, label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: SellerStatus.INACTIVE, label: "Inactive", color: "bg-gray-100 text-gray-800" },
];

export function SellerFilters({
  filters,
  onFiltersChange,
  onReset,
  totalCount,
  filteredCount,
  availableCategories = [],
  className,
}: SellerFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "search" && value && value.trim() !== "") return true;
    if (key === "status" && Array.isArray(value) && value.length > 0) return true;
    if (key === "categories" && Array.isArray(value) && value.length > 0) return true;
    if (typeof value === "boolean" && value) return true;
    if (typeof value === "number" && value > 0) return true;
    if (value instanceof Date) return true;
    return false;
  });

  const activeFilterCount = [
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

  const updateFilters = (updates: Partial<ISellerFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleStatus = (status: SellerStatus) => {
    const currentStatuses = filters.status || [];
    const updatedStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    updateFilters({ status: updatedStatuses });
  };

  const toggleCategory = (category: string) => {
    const currentCategories = filters.categories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    updateFilters({ categories: updatedCategories });
  };

  const renderFilterBadges = () => {
    const badges = [];

    if (filters.search?.trim()) {
      badges.push(
        <Badge key="search" variant="secondary" className="gap-1">
          <Search className="h-3 w-3" />
          {filters.search}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1"
            onClick={() => updateFilters({ search: "" })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.status && filters.status.length > 0) {
      filters.status.forEach(status => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        if (statusOption) {
          badges.push(
            <Badge key={`status-${status}`} variant="secondary" className="gap-1">
              {statusOption.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => toggleStatus(status)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        }
      });
    }

    if (filters.isVerified) {
      badges.push(
        <Badge key="verified" variant="secondary" className="gap-1">
          <Shield className="h-3 w-3" />
          Verified
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1"
            onClick={() => updateFilters({ isVerified: false })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.isFeatured) {
      badges.push(
        <Badge key="featured" variant="secondary" className="gap-1">
          <Star className="h-3 w-3" />
          Featured
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1"
            onClick={() => updateFilters({ isFeatured: false })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.isTopSeller) {
      badges.push(
        <Badge key="topSeller" variant="secondary" className="gap-1">
          <TrendingUp className="h-3 w-3" />
          Top Seller
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1"
            onClick={() => updateFilters({ isTopSeller: false })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(category => {
        badges.push(
          <Badge key={`category-${category}`} variant="secondary" className="gap-1">
            {category}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-1"
              onClick={() => toggleCategory(category)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      });
    }

    return badges;
  };

  const renderDesktopFilters = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search sellers..."
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Status</Label>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${option.value}`}
                checked={filters.status?.includes(option.value) || false}
                onCheckedChange={() => toggleStatus(option.value)}
              />
              <Label
                htmlFor={`status-${option.value}`}
                className="text-sm cursor-pointer flex items-center space-x-2"
              >
                <span className={cn("px-2 py-1 rounded-full text-xs", option.color)}>
                  {option.label}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Quick Filters</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={filters.isVerified || false}
              onCheckedChange={(checked) => updateFilters({ isVerified: checked as boolean })}
            />
            <Label htmlFor="verified" className="text-sm cursor-pointer flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Verified sellers</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.isFeatured || false}
              onCheckedChange={(checked) => updateFilters({ isFeatured: checked as boolean })}
            />
            <Label htmlFor="featured" className="text-sm cursor-pointer flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>Featured sellers</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="topSeller"
              checked={filters.isTopSeller || false}
              onCheckedChange={(checked) => updateFilters({ isTopSeller: checked as boolean })}
            />
            <Label htmlFor="topSeller" className="text-sm cursor-pointer flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>Top sellers</span>
            </Label>
          </div>
        </div>
      </div>

      {/* Commission Rate Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Commission Rate (%)</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.commissionRateMin || ""}
            onChange={(e) => updateFilters({ 
              commissionRateMin: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="w-24"
            min="0"
            max="100"
          />
          <span className="self-center text-muted-foreground">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.commissionRateMax || ""}
            onChange={(e) => updateFilters({ 
              commissionRateMax: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="w-24"
            min="0"
            max="100"
          />
        </div>
      </div>

      {/* Rating Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Rating</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.ratingMin || ""}
            onChange={(e) => updateFilters({ 
              ratingMin: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="w-24"
            min="0"
            max="5"
            step="0.1"
          />
          <span className="self-center text-muted-foreground">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.ratingMax || ""}
            onChange={(e) => updateFilters({ 
              ratingMax: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="w-24"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
      </div>

      {/* Join Date Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Join Date</Label>
        <div className="space-y-2">
          <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.joinedDateStart && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.joinedDateStart ? format(filters.joinedDateStart, "PPP") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.joinedDateStart}
                onSelect={(date) => {
                  updateFilters({ joinedDateStart: date });
                  setDateFromOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.joinedDateEnd && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.joinedDateEnd ? format(filters.joinedDateEnd, "PPP") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.joinedDateEnd}
                onSelect={(date) => {
                  updateFilters({ joinedDateEnd: date });
                  setDateToOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Categories */}
      {availableCategories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Categories</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories?.includes(category) || false}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with search and filter toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sellers by name, email, or ID..."
              value={filters.search || ""}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Mobile Filter Button */}
        <div className="sm:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs rounded-full">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                {renderDesktopFilters()}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filter Toggle */}
        <div className="hidden sm:flex items-center space-x-2">
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 text-xs rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {renderFilterBadges()}
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          {filteredCount === totalCount 
            ? `${totalCount} sellers` 
            : `${filteredCount} of ${totalCount} sellers`}
        </span>
        {filteredCount !== totalCount && (
          <span className="text-primary">
            {totalCount - filteredCount} hidden by filters
          </span>
        )}
      </div>

      {/* Desktop Filters Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <div className="w-80 space-y-6 border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
          <Separator />
          {renderDesktopFilters()}
        </div>
      </div>
    </div>
  );
}