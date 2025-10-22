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
import React from "react";
import { type Category, CategorySortBy } from "../../_types/category.types";
import { type ListTableProps } from "./types";

export function ListTableView({
  data,
  isLoading,
  sortBy,
  sortOrder,
  isArchiveView,
  permissions,
  actions,
  showHierarchy = false
}: ListTableProps) {
  const getCategoryStatusBadge = (category: Category) => {
    const config = category.isActive
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

  const getCategoryLevel = (level: number) => {
    return showHierarchy ? "—".repeat(level) : "";
  };

  const getSortIcon = (column: CategorySortBy) => {
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
                
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                    onClick={() => actions.onSort(CategorySortBy.NAME)}
                  >
                    Name
                    {getSortIcon(CategorySortBy.NAME)}
                  </Button>
                </TableHead>
                
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Featured</TableHead>
                
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                    onClick={() => actions.onSort(CategorySortBy.PRODUCT_COUNT)}
                  >
                    Products
                    {getSortIcon(CategorySortBy.PRODUCT_COUNT)}
                  </Button>
                </TableHead>
                
                <TableHead className="font-semibold">Visibility</TableHead>
                
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                    onClick={() => actions.onSort(CategorySortBy.CREATED_AT)}
                  >
                    Created
                    {getSortIcon(CategorySortBy.CREATED_AT)}
                  </Button>
                </TableHead>
                
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((category) => (
                  <TableRow key={category._id}>
                    {/* Selection Checkbox */}
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    
                    {/* Name */}
                    <TableCell className="min-w-[250px]">
                      <div className="flex items-center gap-2">
                        {showHierarchy && (
                          <span className="text-muted-foreground text-xs">
                            {getCategoryLevel(category.level)}
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-xs text-muted-foreground">
                            /{category.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getCategoryStatusBadge(category)}</TableCell>

                    {/* Featured */}
                    <TableCell>{getFeaturedBadge(category.isFeatured)}</TableCell>

                    {/* Product Count */}
                    <TableCell>
                      <span className="text-sm">
                        {category.productCount || 0} products
                      </span>
                    </TableCell>

                    {/* Visibility */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {category.showInMenu && (
                          <Badge variant="outline" className="text-xs w-fit">
                            Menu
                          </Badge>
                        )}
                        {category.showInHomepage && (
                          <Badge variant="outline" className="text-xs w-fit">
                            Homepage
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="min-w-[120px]">
                      <span className="text-sm">
                        {format(new Date(category.createdAt), "MMM dd, yyyy")}
                      </span>
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
                                onClick={() => actions.onEdit(category)}
                                disabled={!permissions.canEdit}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => actions.onToggleStatus(category._id)}
                                disabled={!permissions.canEdit}
                              >
                                {category.isActive ? (
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
                                onClick={() => actions.onDelete(category._id)}
                                disabled={!permissions.canArchive}
                                className="text-red-600"
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archive Category
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem
                                onClick={() => actions.onRestore(category._id)}
                                disabled={!permissions.canRestore}
                                className="text-green-600"
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore Category
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

export default ListTableView;