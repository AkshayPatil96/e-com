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
import { useVirtualizer } from "@tanstack/react-virtual";
import { format } from "date-fns";
import {
  Archive,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronsUpDownIcon,
  Edit,
  Minus,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useMemo, useRef } from "react";
import { type Category, CategorySortBy } from "../../_types/category.types";
import BulkActionsBar from "./BulkActionsBar";
import {
  buildCategoryTree,
  flattenTree,
  getCategorySelectionState,
  getRootExpandedIds,
  toggleCategorySelection
} from "./tree-utils";
import { type CategoryTreeNode, type TreeTableProps } from "./types";

// Virtual table row height
const ROW_HEIGHT = 60;

// Custom hook for managing tree state with virtual scrolling
function useTreeStateWithVirtualization(data: Category[]) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() => {
    // Initialize with root level categories expanded by default
    return getRootExpandedIds(data);
  });
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (categoryId: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSelected = (categoryId: string) => {
    setSelectedIds(prev => toggleCategorySelection(data, categoryId, prev));
  };

  const expandAll = () => {
    const allIds = new Set(data.map(cat => cat._id));
    setExpandedIds(allIds);
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const selectAll = () => {
    const allIds = new Set(data.map(cat => cat._id));
    setSelectedIds(allIds);
  };

  const selectNone = () => {
    setSelectedIds(new Set());
  };

  return {
    expandedIds,
    selectedIds,
    toggleExpanded,
    toggleSelected,
    expandAll,
    collapseAll,
    selectAll,
    selectNone,
  };
}

export function VirtualizedTreeTableView({
  data,
  isLoading,
  sortBy,
  sortOrder,
  isArchiveView,
  permissions,
  config,
  actions
}: TreeTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const {
    expandedIds,
    selectedIds,
    toggleExpanded,
    toggleSelected,
    expandAll,
    collapseAll,
    selectAll,
    selectNone,
  } = useTreeStateWithVirtualization(data);

  // Convert flat data to tree structure
  const treeData = useMemo(() => {
    if (!data.length) return [];
    const tree = buildCategoryTree(data, expandedIds);
    return flattenTree(tree);
  }, [data, expandedIds]);

  // Get selected categories for bulk actions
  const selectedCategories = useMemo(() => {
    return data.filter(cat => selectedIds.has(cat._id));
  }, [data, selectedIds]);

  const rowVirtualizer = useVirtualizer({
    count: treeData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

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

  // Render connecting lines for tree hierarchy
  const renderConnectingLines = (node: CategoryTreeNode) => {
    if (!config.showConnectingLines || node.depth === 0) return null;

    const lines = [];
    
    // Render vertical lines for each level
    for (let i = 0; i < node.depth; i++) {
      const isLast = i === node.depth - 1;
      const hasNext = node.siblingHasNext[i];
      
      lines.push(
        <div
          key={i}
          className="relative flex-shrink-0"
          style={{ width: '20px', height: '100%' }}
        >
          {/* Vertical line */}
          {(hasNext || !isLast) && (
            <div
              className="absolute border-l-2 border-gray-200"
              style={{
                left: '10px',
                top: 0,
                height: isLast ? '50%' : '100%',
              }}
            />
          )}
          
          {/* Horizontal line */}
          {isLast && (
            <>
              <div
                className="absolute border-t-2 border-gray-200"
                style={{
                  left: '10px',
                  top: '50%',
                  width: '10px',
                }}
              />
              {/* Corner connector */}
              <div
                className="absolute w-2 h-2 bg-gray-200 rounded-full"
                style={{
                  left: '19px',
                  top: 'calc(50% - 4px)',
                }}
              />
            </>
          )}
        </div>
      );
    }
    
    return <div className="flex items-center">{lines}</div>;
  };

  // Render expand/collapse button
  const renderExpandButton = (node: CategoryTreeNode) => {
    if (!node.hasChildren) {
      return <div className="w-6 h-6 flex-shrink-0" />;
    }

    const Icon = node.isExpanded ? ChevronDown : ChevronRight;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-6 h-6 p-0 hover:bg-gray-100 flex-shrink-0"
        onClick={() => toggleExpanded(node._id)}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  if (treeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-medium mb-2">No categories found</h3>
        <p className="text-muted-foreground">
          {isArchiveView 
            ? "No archived categories to display" 
            : "Start by creating your first category"
          }
        </p>
      </div>
    );
  }

  const handleBulkAction = async (action: string, categoryIds: string[]) => {
    if (actions.onBulkAction) {
      await actions.onBulkAction(action, categoryIds);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCategories={selectedCategories}
        selectedCount={selectedIds.size}
        totalCount={data.length}
        isArchiveView={isArchiveView}
        permissions={permissions}
        onBulkAction={handleBulkAction}
        onClearSelection={selectNone}
      />

      {/* Tree Controls */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="flex items-center gap-1"
          >
            <Minus className="h-4 w-4" />
            Collapse All
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {treeData.length} of {data.length} categories
        </div>
      </div>
      
      {/* Virtual Table Container */}
      <div className="border rounded-md flex-1 overflow-hidden">
        {/* Table Header */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="flex items-center" style={{ height: ROW_HEIGHT }}>
            {/* Selection */}
            <div className="w-12 px-2 flex-shrink-0 flex items-center justify-center">
              <Checkbox
                checked={selectedIds.size === data.length && data.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    selectAll();
                  } else {
                    selectNone();
                  }
                }}
              />
            </div>
            
            {/* Name */}
            <div className="flex-1 px-2 font-semibold">
              <Button
                variant="ghost"
                className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                onClick={() => actions.onSort(CategorySortBy.NAME)}
              >
                Name
                {getSortIcon(CategorySortBy.NAME)}
              </Button>
            </div>
            
            {/* Status */}
            <div className="w-24 px-2 font-semibold">Status</div>
            
            {/* Featured */}
            <div className="w-24 px-2 font-semibold">Featured</div>
            
            {/* Products */}
            <div className="w-24 px-2 font-semibold">
              <Button
                variant="ghost"
                className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                onClick={() => actions.onSort(CategorySortBy.PRODUCT_COUNT)}
              >
                Products
                {getSortIcon(CategorySortBy.PRODUCT_COUNT)}
              </Button>
            </div>
            
            {/* Visibility */}
            <div className="w-24 px-2 font-semibold">Visibility</div>
            
            {/* Created */}
            <div className="w-28 px-2 font-semibold">
              <Button
                variant="ghost"
                className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                onClick={() => actions.onSort(CategorySortBy.CREATED_AT)}
              >
                Created
                {getSortIcon(CategorySortBy.CREATED_AT)}
              </Button>
            </div>
            
            {/* Actions */}
            <div className="w-20 px-2 font-semibold text-center">Actions</div>
          </div>
        </div>

        {/* Virtual Scrollable Content */}
        <div
          ref={parentRef}
          className="overflow-auto"
          style={{
            height: `calc(100vh - 400px)`,
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const node = treeData[virtualRow.index];
              if (!node) return null;
              
              const selectionState = getCategorySelectionState(data, node._id, selectedIds);
              const isSelected = selectedIds.has(node._id);

              return (
                <div
                  key={virtualRow.key}
                  className={`absolute top-0 left-0 w-full border-b hover:bg-gray-50 ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="flex items-center h-full">
                    {/* Selection Checkbox */}
                    <div className="w-12 px-2 flex-shrink-0 flex items-center justify-center">
                      <Checkbox
                        checked={selectionState === 'selected'}
                        onCheckedChange={() => toggleSelected(node._id)}
                      />
                    </div>
                    
                    {/* Name with Tree Structure */}
                    <div className="flex-1 px-2 min-w-0">
                      <div className="flex items-center gap-1 h-full">
                        {/* Connecting lines */}
                        {renderConnectingLines(node)}
                        
                        {/* Expand/Collapse button */}
                        {renderExpandButton(node)}
                        
                        {/* Category info */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium truncate text-sm">{node.name}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            /{node.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="w-24 px-2 flex items-center">
                      {getCategoryStatusBadge(node)}
                    </div>
                    
                    {/* Featured */}
                    <div className="w-24 px-2 flex items-center">
                      {getFeaturedBadge(node.isFeatured)}
                    </div>
                    
                    {/* Product Count */}
                    <div className="w-24 px-2 flex items-center">
                      <span className="text-xs">
                        {node.productCount || 0}
                      </span>
                    </div>
                    
                    {/* Visibility */}
                    <div className="w-24 px-2 flex items-center">
                      <div className="flex flex-col gap-1">
                        {node.showInMenu && (
                          <Badge variant="outline" className="text-xs w-fit">
                            Menu
                          </Badge>
                        )}
                        {node.showInHomepage && (
                          <Badge variant="outline" className="text-xs w-fit">
                            Home
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Created Date */}
                    <div className="w-28 px-2 flex items-center">
                      <span className="text-xs">
                        {format(new Date(node.createdAt), "MMM dd")}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="w-20 px-2 flex items-center justify-center">
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
                                onClick={() => actions.onEdit(node)}
                                disabled={!permissions.canEdit}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => actions.onToggleStatus(node._id)}
                                disabled={!permissions.canEdit}
                              >
                                {node.isActive ? (
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
                                onClick={() => actions.onDelete(node._id)}
                                disabled={!permissions.canArchive}
                                className="text-red-600"
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem
                                onClick={() => actions.onRestore(node._id)}
                                disabled={!permissions.canRestore}
                                className="text-green-600"
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={!permissions.canDelete}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualizedTreeTableView;