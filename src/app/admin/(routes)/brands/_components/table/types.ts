import { LucideIcon } from "lucide-react";
import { IBrand } from "../../_types/brand.types";

export type TableViewMode = "list" | "grid";

export interface BrandTableConfig {
  mode: TableViewMode;
  enableSort: boolean;
  enableActions: boolean;
  enableBulkActions: boolean;
  showAnalytics?: boolean;
  cardVariant?: "default" | "compact" | "detailed";
  showActions?: boolean; // Legacy prop
  bulkSelection?: boolean; // Legacy prop
  itemsPerRow?: number; // For grid view
}

export interface BrandTableProps {
  brands: IBrand[];
  isLoading?: boolean;
  config?: Partial<BrandTableConfig>;
  onEdit?: (brand: IBrand) => void;
  onDelete?: (brandId: string) => void;
  onToggleArchive?: (brandId: string) => void;
  onToggleFeatured?: (brandId: string) => void;
  onBulkAction?: (action: string, brandIds: string[]) => void;
}

export interface BrandActionItem {
  label: string;
  icon: LucideIcon;
  onClick: (brand: IBrand) => void;
  variant?: "default" | "destructive";
  disabled?: (brand: IBrand) => boolean;
}

export interface BrandSortConfig {
  field: keyof IBrand;
  direction: "asc" | "desc";
}

export interface BrandTableColumn {
  key: keyof IBrand;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (brand: IBrand) => React.ReactNode;
}