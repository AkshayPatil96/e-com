"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Archive,
    CheckCircle,
    ChevronDown,
    RotateCcw,
    Star,
    Trash2,
    X,
    XCircle,
} from "lucide-react";
import React from "react";
import { type Category } from "../../_types/category.types";

interface BulkActionsBarProps {
  selectedCategories: Category[];
  selectedCount: number;
  totalCount: number;
  isArchiveView: boolean;
  permissions: {
    canEdit: boolean;
    canArchive: boolean;
    canRestore: boolean;
    canDelete: boolean;
  };
  onBulkAction: (action: string, categoryIds: string[]) => void;
  onClearSelection: () => void;
}

export function BulkActionsBar({
  selectedCategories,
  selectedCount,
  totalCount,
  isArchiveView,
  permissions,
  onBulkAction,
  onClearSelection,
}: BulkActionsBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  const selectedIds = selectedCategories.map(cat => cat._id);
  
  // Calculate statistics for selected items
  const activeCount = selectedCategories.filter(cat => cat.isActive).length;
  const inactiveCount = selectedCategories.filter(cat => !cat.isActive).length;
  const featuredCount = selectedCategories.filter(cat => cat.isFeatured).length;

  const handleBulkAction = (action: string) => {
    onBulkAction(action, selectedIds);
  };

  return (
    <div className="sticky top-0 z-20 bg-blue-50 border-b border-blue-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-blue-600">
            {selectedCount} selected
          </Badge>
          {selectedCount === totalCount && (
            <Badge variant="outline">All items</Badge>
          )}
        </div>
        
        {/* Selection Statistics */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {activeCount > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              {activeCount} active
            </span>
          )}
          {inactiveCount > 0 && (
            <span className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-gray-600" />
              {inactiveCount} inactive
            </span>
          )}
          {featuredCount > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-600" />
              {featuredCount} featured
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Bulk Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm">
              Bulk Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
            
            {!isArchiveView && (
              <>
                {inactiveCount > 0 && (
                  <DropdownMenuItem
                    onClick={() => handleBulkAction('activate')}
                    disabled={!permissions.canEdit}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Activate ({inactiveCount})
                  </DropdownMenuItem>
                )}
                
                {activeCount > 0 && (
                  <DropdownMenuItem
                    onClick={() => handleBulkAction('deactivate')}
                    disabled={!permissions.canEdit}
                  >
                    <XCircle className="mr-2 h-4 w-4 text-gray-600" />
                    Deactivate ({activeCount})
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Featured Actions</DropdownMenuLabel>
                
                {selectedCount - featuredCount > 0 && (
                  <DropdownMenuItem
                    onClick={() => handleBulkAction('feature')}
                    disabled={!permissions.canEdit}
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-600" />
                    Mark as Featured ({selectedCount - featuredCount})
                  </DropdownMenuItem>
                )}
                
                {featuredCount > 0 && (
                  <DropdownMenuItem
                    onClick={() => handleBulkAction('unfeature')}
                    disabled={!permissions.canEdit}
                  >
                    <Star className="mr-2 h-4 w-4 text-gray-400" />
                    Remove Featured ({featuredCount})
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Archive Actions</DropdownMenuLabel>
                
                <DropdownMenuItem
                  onClick={() => handleBulkAction('archive')}
                  disabled={!permissions.canArchive}
                  className="text-orange-600"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive All ({selectedCount})
                </DropdownMenuItem>
              </>
            )}
            
            {isArchiveView && (
              <>
                <DropdownMenuItem
                  onClick={() => handleBulkAction('restore')}
                  disabled={!permissions.canRestore}
                  className="text-green-600"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore All ({selectedCount})
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={() => handleBulkAction('permanent-delete')}
                  disabled={!permissions.canDelete}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently ({selectedCount})
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Selection */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear Selection
        </Button>
      </div>
    </div>
  );
}

export default BulkActionsBar;