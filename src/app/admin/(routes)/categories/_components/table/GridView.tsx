"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
    Archive,
    CheckCircle,
    Edit,
    FolderOpen,
    MoreHorizontal,
    RotateCcw,
    Star,
    Trash2,
    XCircle,
} from "lucide-react";
import React from "react";
import { type Category } from "../../_types/category.types";
import { type GridViewProps } from "./types";

export function GridView({
  data,
  isLoading,
  isArchiveView,
  permissions,
  actions,
  itemsPerRow = 3
}: GridViewProps) {
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
        className={`flex items-center gap-1 ${config.bgColor} ${config.color} border text-xs`}
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
        className="flex items-center gap-1 bg-yellow-50 text-yellow-800 border-yellow-200 text-xs"
      >
        <Star className="h-3 w-3" />
        FEATURED
      </Badge>
    ) : null;
  };

  const getCategoryLevel = (level: number) => {
    return "—".repeat(level);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0 overflow-auto p-1">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)` }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              {isArchiveView 
                ? "No archived categories to display" 
                : "Start by creating your first category"
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-auto p-1">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)` }}>
          {data.map((category) => (
            <Card key={category._id} className="hover:shadow-md transition-shadow py-3">
              <CardContent className="px-3">
                {/* Header with level indicator and actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-muted-foreground text-xs flex-shrink-0">
                      {getCategoryLevel(category.level)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate" title={category.name}>
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate" title={`/${category.slug}`}>
                        /{category.slug}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                </div>

                {/* Status and Featured Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {getCategoryStatusBadge(category)}
                  {getFeaturedBadge(category.isFeatured)}
                </div>

                {/* Product Count */}
                <div className="text-sm text-muted-foreground mb-2">
                  {category.productCount || 0} products
                </div>

                {/* Visibility Settings */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {category.showInMenu && (
                    <Badge variant="outline" className="text-xs">
                      Menu
                    </Badge>
                  )}
                  {category.showInHomepage && (
                    <Badge variant="outline" className="text-xs">
                      Homepage
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {category.shortDescription && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2" title={category.shortDescription}>
                    {category.shortDescription}
                  </p>
                )}

                {/* Created Date */}
                <div className="text-xs text-muted-foreground">
                  Created {format(new Date(category.createdAt), "MMM dd, yyyy")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GridView;