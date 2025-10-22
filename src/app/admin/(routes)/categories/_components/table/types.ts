// Enhanced table types and interfaces
import { type Category, CategorySortBy, SortOrder } from "../../_types/category.types";

// View modes for the category table
export type TableViewMode = 'tree' | 'list' | 'grid';

// Tree node structure for hierarchical display
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  hasChildren: boolean;
  isExpanded: boolean;
  depth: number;
  parentPath: string[];
  isLastChild: boolean;
  siblingHasNext: boolean[];
}

// Table configuration interface
export interface TableConfig {
  virtualScrolling: boolean;
  showConnectingLines: boolean;
  autoExpandDepth: number;
  maxDepth: number;
  bulkSelection: boolean;
}

// Selection state for bulk operations
export interface SelectionState {
  selectedIds: Set<string>;
  indeterminateIds: Set<string>;
  selectAll: boolean;
}

// Expand/collapse state management
export interface ExpandState {
  expandedIds: Set<string>;
  autoExpand: boolean;
  maxAutoExpandDepth: number;
}

// Table action handlers
export interface TableActions {
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onRestore: (categoryId: string) => void;
  onToggleStatus: (categoryId: string) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  onSort: (column: CategorySortBy) => void;
}

// Tree table props
export interface TreeTableProps {
  data: Category[];
  isLoading: boolean;
  sortBy: CategorySortBy;
  sortOrder: SortOrder;
  isArchiveView: boolean;
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canArchive: boolean;
    canRestore: boolean;
    canDelete: boolean;
  };
  config: TableConfig;
  actions: TableActions;
}

// List table props (simplified flat view)
export interface ListTableProps extends Omit<TreeTableProps, 'config'> {
  showHierarchy: boolean;
}

// Grid view props
export interface GridViewProps {
  data: Category[];
  isLoading: boolean;
  isArchiveView: boolean;
  permissions: TreeTableProps['permissions'];
  actions: Omit<TableActions, 'onSort'>;
  itemsPerRow: number;
}

// Virtual scrolling configuration
export interface VirtualScrollConfig {
  enabled: boolean;
  itemHeight: number;
  overscan: number;
  containerHeight: number;
}

// Lazy loading configuration
export interface LazyLoadConfig {
  enabled: boolean;
  loadThreshold: number;
  pageSize: number;
  preloadDepth: number;
}