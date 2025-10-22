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
import Image from "next/image";
import React from "react";
import { type BrandGridViewProps, type IBrandAdminItem } from "../../_types/brand.types";

export function BrandGridView({
  data,
  isLoading,
  isArchiveView,
  permissions,
  actions,
  itemsPerRow = 3
}: BrandGridViewProps) {
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

  const getVerifiedBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge
        variant="outline"
        className="flex items-center gap-1 bg-blue-50 text-blue-800 border-blue-200 text-xs"
      >
        <CheckCircle className="h-3 w-3" />
        VERIFIED
      </Badge>
    ) : null;
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0 overflow-auto p-1">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)` }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
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
            <h3 className="text-lg font-medium mb-2">No brands found</h3>
            <p className="text-muted-foreground">
              {isArchiveView 
                ? "No archived brands to display" 
                : "Start by creating your first brand"
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
          {data.map((brand) => (
            <Card key={brand._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Header with logo, name and actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Brand Logo */}
                    <div className="flex-shrink-0">
                      {brand.logo ? (
                        <Image
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-sm text-gray-500 font-medium">
                            {brand.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Brand Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate" title={brand.name}>
                        {brand.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate" title={`/${brand.slug}`}>
                        /{brand.slug}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
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
                </div>

                {/* Status and Featured Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {getBrandStatusBadge(brand)}
                  {getFeaturedBadge(brand.isFeatured)}
                  {getVerifiedBadge(brand.isVerified)}
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {brand.analytics.productCount || 0}
                    </span>{" "}
                    products
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {brand.analytics.viewCount || 0}
                    </span>{" "}
                    views
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {brand.analytics.averageRating || 0}
                    </span>{" "}
                    rating
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      ${brand.analytics.totalSales || 0}
                    </span>{" "}
                    sales
                  </div>
                </div>

                {/* Visibility Settings */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {brand.showInMenu && (
                    <Badge variant="outline" className="text-xs">
                      Menu
                    </Badge>
                  )}
                  {brand.showInHomepage && (
                    <Badge variant="outline" className="text-xs">
                      Homepage
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {brand.shortDescription && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2" title={brand.shortDescription}>
                    {brand.shortDescription}
                  </p>
                )}

                {/* Created Date and Author */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  <div className="flex justify-between">
                    <span>Created {format(new Date(brand.createdAt), "MMM dd, yyyy")}</span>
                    <span>by {brand.createdByName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandGridView;