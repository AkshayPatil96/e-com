"use client";

import React, { useMemo } from "react";
import { GridView } from "./GridView";
import { ListTableView } from "./ListTableView";
import { TreeTableView } from "./TreeTableView";
import { type TableViewMode, type TreeTableProps } from "./types";
import { VirtualizedTreeTableView } from "./VirtualizedTreeTableView";

interface EnhancedCategoryTableProps extends TreeTableProps {
  enableVirtualization?: boolean;
  viewMode?: TableViewMode;
}

export function EnhancedCategoryTable({
  data,
  isLoading,
  sortBy,
  sortOrder,
  isArchiveView,
  permissions,
  config,
  actions,
  enableVirtualization = true,
  viewMode = "tree",
}: EnhancedCategoryTableProps) {
  // Enhanced table configuration with performance optimizations
  const tableConfig = useMemo(
    () => ({
      ...config,
      virtualScrolling: enableVirtualization && data.length > 100,
      showConnectingLines: viewMode === "tree",
      autoExpandDepth: viewMode === "tree" ? 2 : 0,
      bulkSelection: true,
    }),
    [config, enableVirtualization, data.length, viewMode],
  );

  // Grid view specific props
  const gridViewProps = useMemo(
    () => ({
      data,
      isLoading,
      isArchiveView,
      permissions,
      actions: {
        onEdit: actions.onEdit,
        onDelete: actions.onDelete,
        onRestore: actions.onRestore,
        onToggleStatus: actions.onToggleStatus,
        onBulkAction: actions.onBulkAction,
      },
      itemsPerRow: 3,
    }),
    [data, isLoading, isArchiveView, permissions, actions],
  );

  // List view specific props
  const listViewProps = useMemo(
    () => ({
      data,
      isLoading,
      sortBy,
      sortOrder,
      isArchiveView,
      permissions,
      actions,
      showHierarchy: true,
    }),
    [data, isLoading, sortBy, sortOrder, isArchiveView, permissions, actions],
  );

  const renderTableView = () => {
    switch (viewMode) {
      case "tree":
        // Use virtualized tree table for large datasets, regular tree table for smaller ones
        if (tableConfig.virtualScrolling) {
          return (
            <VirtualizedTreeTableView
              {...{
                data,
                isLoading,
                sortBy,
                sortOrder,
                isArchiveView,
                permissions,
                config: tableConfig,
                actions,
              }}
            />
          );
        }
        return (
          <TreeTableView
            {...{
              data,
              isLoading,
              sortBy,
              sortOrder,
              isArchiveView,
              permissions,
              config: tableConfig,
              actions,
            }}
          />
        );

      case "list":
        return <ListTableView {...listViewProps} />;

      case "grid":
        return <GridView {...gridViewProps} />;

      default:
        return (
          <TreeTableView
            {...{
              data,
              isLoading,
              sortBy,
              sortOrder,
              isArchiveView,
              permissions,
              config: tableConfig,
              actions,
            }}
          />
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main Table Content */}
      <div className="flex-1 min-h-0">{renderTableView()}</div>
    </div>
  );
}

export default EnhancedCategoryTable;
