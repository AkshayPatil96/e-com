"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Unified Admin Pagination Component
 *
 * A comprehensive pagination component for all admin pages with flexible configuration options.
 *
 * @example
 * // Basic usage (compact mode for tables)
 * <AdminPagination
 *   currentPage={filters.page || 1}
 *   totalPages={totalPages}
 *   totalCount={totalCount}
 *   itemsPerPage={filters.limit || 20}
 *   onPageChange={handlePageChange}
 *   onItemsPerPageChange={handleItemsPerPageChange}
 *   isLoading={isLoading}
 *   itemName="categories"
 *   compact={true}
 * />
 *
 * // Full featured mode
 * <AdminPagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   totalCount={totalCount}
 *   itemsPerPage={itemsPerPage}
 *   onPageChange={onPageChange}
 *   onItemsPerPageChange={onItemsPerPageChange}
 *   isLoading={isLoading}
 *   itemName="users"
 *   showFirstLast={true}
 *   showPageNumbers={true}
 *   pageSizes={[5, 10, 20, 50, 100]}
 * />
 */

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  isLoading?: boolean;
  itemName?: string;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  pageSizes?: number[];
  compact?: boolean;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
  itemName = "items",
  showFirstLast = true,
  showPageNumbers = true,
  pageSizes = [10, 20, 50, 100],
  compact = false,
}: AdminPaginationProps) {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const getVisiblePages = () => {
    if (!showPageNumbers) return [];

    const delta = compact ? 1 : 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    if (totalPages <= 1) return [1];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    if (!isLoading) {
      onItemsPerPageChange(parseInt(value));
    }
  };

  if (totalCount === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t bg-background">
        {/* Results info */}
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {totalCount} {itemName}
          </p>
        </div>

        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-background">
      {/* Results info and items per page */}
      <div className="flex items-center">
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          Showing {startItem} to {endItem} of {totalCount} {itemName}
        </p>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {/* First page */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8 p-0"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="h-8 w-8 p-0"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {showPageNumbers && (
            <div className="flex items-center gap-1">
              {visiblePages.map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-1 text-sm text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }

                const pageNumber = page as number;
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <Button
                    key={pageNumber}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="h-8 w-8 p-0"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
              className="h-8 w-8 p-0"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-8 min-w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizes.map((size) => (
              <SelectItem
                key={size}
                value={size.toString()}
              >
                {size} / Page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default AdminPagination;
