"use client";

import React, { useMemo } from "react";
import { type BrandTableProps } from "../../_types/brand.types";
import { BrandGridView } from "./BrandGridView";
import { BrandListTableView } from "./BrandListTableView";
import { type BrandTableConfig, type TableViewMode } from "./types";

interface EnhancedBrandTableProps extends BrandTableProps {
  viewMode?: TableViewMode;
  config?: BrandTableConfig;
}

export function EnhancedBrandTable({
  data,
  isLoading,
  sortBy,
  sortOrder,
  isArchiveView,
  permissions,
  actions,
  viewMode = "list",
  config,
}: EnhancedBrandTableProps) {
  // Enhanced table configuration
  const tableConfig = useMemo(
    () => ({
      showActions: true,
      bulkSelection: true,
      itemsPerRow: 3,
      ...config,
    }),
    [config]
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
      },
      itemsPerRow: tableConfig.itemsPerRow,
    }),
    [data, isLoading, isArchiveView, permissions, actions, tableConfig.itemsPerRow]
  );

  const renderTableView = () => {
    switch (viewMode) {
      case "list":
        return (
          <BrandListTableView
            data={data}
            isLoading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            isArchiveView={isArchiveView}
            permissions={permissions}
            actions={actions}
          />
        );

      case "grid":
        return <BrandGridView {...gridViewProps} />;

      default:
        return (
          <BrandListTableView
            data={data}
            isLoading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            isArchiveView={isArchiveView}
            permissions={permissions}
            actions={actions}
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

export default EnhancedBrandTable;