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
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
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
import React, { useMemo, useState } from "react";
import { CategorySortBy, type Category } from "../../_types/category.types";
import {
  buildCategoryTree,
  flattenTree,
  getCategorySelectionState,
  getRootExpandedIds,
  toggleCategorySelection,
} from "./tree-utils";
import { type CategoryTreeNode, type TreeTableProps } from "./types";

// Custom hook for managing tree state
function useTreeState(data: Category[]) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Initialize with root level categories expanded by default
    return getRootExpandedIds(data);
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (categoryId: string) => {
    console.log(`toggleExpanded called for: ${categoryId}`);
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        console.log(`Collapsing ${categoryId}`);
        newSet.delete(categoryId);
      } else {
        console.log(`Expanding ${categoryId}`);
        newSet.add(categoryId);
      }
      console.log("New expanded set:", Array.from(newSet));
      return newSet;
    });
  };

  const toggleSelected = (categoryId: string) => {
    setSelectedIds((prev) => toggleCategorySelection(data, categoryId, prev));
  };

  const expandAll = () => {
    const allIds = new Set(data.map((cat) => cat._id));
    setExpandedIds(allIds);
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const selectAll = () => {
    const allIds = new Set(data.map((cat) => cat._id));
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

export function TreeTableView({
  data,
  isLoading,
  sortBy,
  sortOrder,
  isArchiveView,
  permissions,
  config,
  actions,
}: TreeTableProps) {
  const {
    expandedIds,
    selectedIds,
    toggleExpanded,
    toggleSelected,
    expandAll,
    collapseAll,
    selectAll,
    selectNone,
  } = useTreeState(data);

  // Convert flat data to tree structure
  const treeData = useMemo(() => {
    console.log("Building tree with data:", data.length, "categories");
    console.log(
      "Sample categories:",
      data.slice(0, 3).map((cat) => ({
        id: cat._id,
        name: cat.name,
        parent: cat.parent,
        level: cat.level,
      })),
    );
    console.log("Expanded IDs:", Array.from(expandedIds));
    const tree = buildCategoryTree(data, expandedIds);
    const flattened = flattenTree(tree);
    console.log("Flattened tree:", flattened.length, "nodes");
    return flattened;
  }, [data, expandedIds]);

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

  // Define table columns
  const columns = useMemo<ColumnDef<CategoryTreeNode>[]>(() => {
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
            className="relative"
            style={{ width: "20px", height: "100%" }}
          >
            {/* Vertical line */}
            {(hasNext || !isLast) && (
              <div
                className="absolute border-l border-gray-300"
                style={{
                  left: "10px",
                  top: 0,
                  height: isLast ? "50%" : "100%",
                }}
              />
            )}

            {/* Horizontal line */}
            {isLast && (
              <div
                className="absolute border-t border-gray-300"
                style={{
                  left: "10px",
                  top: "50%",
                  width: "10px",
                }}
              />
            )}
          </div>,
        );
      }

      return <div className="flex">{lines}</div>;
    };

    // Render expand/collapse button
    const renderExpandButton = (node: CategoryTreeNode) => {
      if (!node.hasChildren) {
        return <div className="w-6 h-6" />;
      }

      const Icon = node.isExpanded ? ChevronDown : ChevronRight;

      return (
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(
              `Toggling expand for ${node.name} (${node._id}), currently expanded: ${node.isExpanded}`,
            );
            toggleExpanded(node._id);
          }}
        >
          <Icon className="h-4 w-4" />
        </Button>
      );
    };

    return [
      // Selection column
      {
        id: "select",
        header: () => (
          <div className="flex items-center gap-2 w-fit">
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
        ),
        cell: ({ row }) => {
          const node = row.original;
          const selectionState = getCategorySelectionState(
            data,
            node._id,
            selectedIds,
          );

          return (
            <div className="flex items-center gap-2 w-fit">
              <Checkbox
                checked={selectionState === "selected"}
                onCheckedChange={() => toggleSelected(node._id)}
              />
            </div>
          );
        },
        size: 50,
      },

      // Name column with tree structure
      {
        accessorKey: "name",
        header: () => (
          <Button
            variant="ghost"
            className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
            onClick={() => actions.onSort(CategorySortBy.NAME)}
          >
            Name
            {getSortIcon(CategorySortBy.NAME)}
          </Button>
        ),
        cell: ({ row }) => {
          const node = row.original;

          return (
            <div className="flex items-center gap-1 min-w-[250px]">
              {/* Connecting lines */}
              {renderConnectingLines(node)}

              {/* Expand/Collapse button */}
              {renderExpandButton(node)}

              {/* Category info */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium truncate">{node.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  /{node.slug}
                </span>
              </div>
            </div>
          );
        },
      },

      // Status column
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => getCategoryStatusBadge(row.original),
        size: 120,
      },

      // Featured column
      {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) => getFeaturedBadge(row.original.isFeatured),
        size: 100,
      },

      // Product count column
      {
        accessorKey: "productCount",
        header: () => (
          <Button
            variant="ghost"
            className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
            onClick={() => actions.onSort(CategorySortBy.PRODUCT_COUNT)}
          >
            Products
            {getSortIcon(CategorySortBy.PRODUCT_COUNT)}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.productCount || 0} products
          </span>
        ),
        size: 100,
      },

      // Visibility column
      {
        id: "visibility",
        header: "Visibility",
        cell: ({ row }) => {
          const category = row.original;
          return (
            <div className="flex flex-col gap-1">
              {category.showInMenu && (
                <Badge
                  variant="outline"
                  className="text-xs w-fit"
                >
                  Menu
                </Badge>
              )}
              {category.showInHomepage && (
                <Badge
                  variant="outline"
                  className="text-xs w-fit"
                >
                  Homepage
                </Badge>
              )}
            </div>
          );
        },
        size: 120,
      },

      // Created date column
      {
        accessorKey: "createdAt",
        header: () => (
          <Button
            variant="ghost"
            className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
            onClick={() => actions.onSort(CategorySortBy.CREATED_AT)}
          >
            Created
            {getSortIcon(CategorySortBy.CREATED_AT)}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
          </span>
        ),
        size: 120,
      },

      // Actions column
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const category = row.original;

          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
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
          );
        },
        size: 80,
      },
    ];
  }, [
    data,
    selectedIds,
    sortBy,
    sortOrder,
    isArchiveView,
    permissions,
    actions,
    config.showConnectingLines,
    toggleSelected,
    selectAll,
    selectNone,
    toggleExpanded,
  ]);

  // Initialize table
  const table = useReactTable({
    data: treeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row._id,
  });

  return (
    <div className="h-full flex flex-col space-y-2 mt-2">
      {/* Tree Controls */}
      <div className="flex items-center flex-shrink-0">
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

        {/* Bulk selection info */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="secondary">{selectedIds.size} selected</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={selectNone}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 border rounded-md">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? header.getSize()
                              : undefined,
                        }}
                        className="font-semibold"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8"
                  >
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={
                      selectedIds.has(row.id) ? "selected" : undefined
                    }
                    className="group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default TreeTableView;
