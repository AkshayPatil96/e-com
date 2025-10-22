"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Archive,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDownIcon,
  Edit,
  MoreHorizontal,
  RotateCcw,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  BrandSortBy,
  type BrandListTableProps,
  type IBrandAdminItem
} from "../../_types/brand.types";

export function BrandListTableView({
  data,
  isLoading,
  sortBy,
  sortOrder,
  isArchiveView,
  permissions,
  actions,
}: BrandListTableProps) {
  const getBrandStatusBadge = (brand: IBrandAdminItem) => {
    const config = brand.isActive
      ? {
          variant: "default" as const,
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50 border-green-200",
          text: "ACTIVE",
        }
      : {
          variant: "secondary" as const,
          icon: XCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-50 border-gray-200",
          text: "INACTIVE",
        };

    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={`flex items-center gap-1 ${config.bgColor} ${config.color} border`}
      >
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getFeaturedBadge = (isFeatured: boolean) => {
    return isFeatured ? (
      <Badge
        variant="default"
        className="flex items-center gap-1 bg-yellow-50 text-yellow-800 border-yellow-200"
      >
        <Star className="h-3 w-3" />
        FEATURED
      </Badge>
    ) : null;
  };

  const getVerifiedBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge
        variant="outline"
        className="flex items-center gap-1 bg-blue-50 text-blue-800 border-blue-200"
      >
        <CheckCircle className="h-3 w-3" />
        VERIFIED
      </Badge>
    ) : null;
  };

  const getSortIcon = (column: BrandSortBy) => {
    if (sortBy !== column) {
      return <ChevronsUpDownIcon className="h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 border rounded-md">
        <div className="h-full overflow-auto border-b">
          <Table className="w-full relative">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow className="border-b">
                {/* Bulk Selection Column */}
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                
                {/* Logo Column */}
                <TableHead className="w-16">Logo</TableHead>
                
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                    onClick={() => actions.onSort(BrandSortBy.NAME)}
                  >
                    Name
                    {getSortIcon(BrandSortBy.NAME)}
                  </Button>
                </TableHead>
                
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Featured</TableHead>
                <TableHead className="font-semibold">Verified</TableHead>
                
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                    onClick={() => actions.onSort(BrandSortBy.PRODUCT_COUNT)}
                  >
                    Products
                    {getSortIcon(BrandSortBy.PRODUCT_COUNT)}
                  </Button>
                </TableHead>
                
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                    onClick={() => actions.onSort(BrandSortBy.VIEW_COUNT)}
                  >
                    Views
                    {getSortIcon(BrandSortBy.VIEW_COUNT)}
                  </Button>
                </TableHead>
                
                <TableHead className="font-semibold">Visibility</TableHead>
                
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                    onClick={() => actions.onSort(BrandSortBy.CREATED_AT)}
                  >
                    Created
                    {getSortIcon(BrandSortBy.CREATED_AT)}
                  </Button>
                </TableHead>
                
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Loading brands...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No brands found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((brand) => (
                  <TableRow key={brand._id}>
                    {/* Selection Checkbox */}
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    
                    {/* Logo */}
                    <TableCell>
                      {brand.logo ? (
                        <Image
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          width={32}
                          height={32}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {brand.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="min-w-[200px]">
                      <div className="flex flex-col">
                        <span className="font-medium">{brand.name}</span>
                        <span className="text-xs text-muted-foreground">
                          /{brand.slug}
                        </span>
                        {brand.shortDescription && (
                          <span className="text-xs text-muted-foreground line-clamp-2 max-w-[200px]">
                            {brand.shortDescription}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getBrandStatusBadge(brand)}</TableCell>

                    {/* Featured */}
                    <TableCell>{getFeaturedBadge(brand.isFeatured)}</TableCell>

                    {/* Verified */}
                    <TableCell>{getVerifiedBadge(brand.isVerified)}</TableCell>

                    {/* Product Count */}
                    <TableCell>
                      <span className="text-sm">
                        {brand.analytics.productCount || 0} products
                      </span>
                    </TableCell>

                    {/* View Count */}
                    <TableCell>
                      <span className="text-sm">
                        {brand.analytics.viewCount || 0} views
                      </span>
                    </TableCell>

                    {/* Visibility */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {brand.showInMenu && (
                          <Badge variant="outline" className="text-xs w-fit">
                            Menu
                          </Badge>
                        )}
                        {brand.showInHomepage && (
                          <Badge variant="outline" className="text-xs w-fit">
                            Homepage
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="min-w-[120px]">
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {format(new Date(brand.createdAt), "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          by {brand.createdByName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {!isArchiveView ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => actions.onEdit(brand)}
                                disabled={!permissions.canEdit}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Brand
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => actions.onToggleStatus(brand._id)}
                                disabled={!permissions.canEdit}
                              >
                                {brand.isActive ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => actions.onDelete(brand._id)}
                                disabled={!permissions.canArchive}
                                className="text-red-600"
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archive Brand
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem
                                onClick={() => actions.onRestore(brand._id)}
                                disabled={!permissions.canRestore}
                                className="text-green-600"
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore Brand
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={!permissions.canDelete}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default BrandListTableView;