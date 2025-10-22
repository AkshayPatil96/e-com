// Category-related type definitions

// Enum definitions for query parameters
export enum CategoryStatus {
  ALL = "all",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum CategoryFeatured {
  ALL = "all",
  FEATURED = "featured",
  NOT_FEATURED = "not-featured",
}

export enum CategorySortBy {
  NAME = "name",
  CREATED_AT = "createdAt",
  ORDER = "order",
  PRODUCT_COUNT = "productCount",
  VIEW_COUNT = "viewCount",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

// Basic Category object that frontend receives
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  parent?: string | null;
  ancestors?: string[];
  level: number;
  path?: string;
  materializedPath?: string;
  order: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  searchKeywords?: string[];
  productCount?: number;
  totalProductCount?: number;
  viewCount?: number;
  isActive: boolean;
  isFeatured: boolean;
  isPopular?: boolean;
  showInMenu: boolean;
  showInHomepage: boolean;
  isDeleted: boolean;
  hasChildren?: boolean;
  childrenCount?: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy: string; // User ID
  updatedBy?: string; // User ID
  createdByName?: string;
  updatedByName?: string;
}

// Extended category with populated fields (for admin panel)
export interface ICategoryAdmin extends ICategory {
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  children?: ICategoryAdmin[];
  createdByUser?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  updatedByUser?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Category hierarchy structure
export interface ICategoryHierarchy extends Omit<ICategory, 'parent'> {
  children: ICategoryHierarchy[];
  parent?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
}

// Category statistics response
export interface ICategoryStatistics {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  deletedCategories: number;
  featuredCategories: number;
  categoriesWithProducts: number;
  categoriesWithoutProducts: number;
  topLevelCategories: number;
  averageProductsPerCategory: number;
  categoryLevels: {
    level: number;
    count: number;
  }[];
  recentlyCreated: {
    _id: string;
    name: string;
    createdAt: string;
  }[];
  mostViewedCategories: {
    _id: string;
    name: string;
    viewCount: number;
  }[];
}

// Query parameters interface
export interface CategoryAdminQueryParams {
  page?: number; // Min: 1, Max: ∞, Default: 1
  limit?: number; // Min: 1, Max: 100, Default: 20
  search?: string; // Max length: 100 chars, Default: ""
  status?: CategoryStatus; // Default: "all"
  featured?: CategoryFeatured; // Default: "all"
  parent?: string; // ObjectId or "all", Default: "all"
  level?: number | null; // Min: 0, Default: null
  isDeleted?: boolean; // Default: false
  sortBy?: CategorySortBy; // Default: "order"
  sortOrder?: SortOrder; // Default: "asc"
  showInMenu?: boolean; // Optional filter
  showInHomepage?: boolean; // Optional filter
}

// Form data for creating/updating categories
export interface CategoryFormData {
  id?: string; // For edit mode
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  parent?: string | null;
  order?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  searchKeywords?: string[];
  isActive: boolean;
  isFeatured: boolean;
  isPopular?: boolean;
  showInMenu: boolean;
  showInHomepage: boolean;
}

// API Response wrappers
export interface ICategoryResponse {
  success: boolean;
  message: string;
  data: ICategory;
}

export interface ICategoryListResponse {
  success: boolean;
  message: string;
  data: {
    data: ICategoryAdmin[];
    totalPages: number;
    totalCount: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
}

export interface ICategoryHierarchyResponse {
  success: boolean;
  message: string;
  data: ICategoryHierarchy[];
}

export interface ICategoryStatisticsResponse {
  success: boolean;
  message: string;
  data: ICategoryStatistics;
}

// Bulk action response
export interface IBulkActionResponse {
  success: boolean;
  message: string;
  data: {
    action: string;
    total: number;
    success: number;
    failed: number;
    errors: string[];
    completedAt: string;
  };
}

// Move category response
export interface IMoveResponse {
  success: boolean;
  message: string;
  data: {
    categoryId: string;
    newParentId?: string;
    newOrder?: number;
    movedAt: string;
    category: ICategoryAdmin;
  };
}

// Delete/Restore response
export interface IDeleteRestoreResponse {
  success: boolean;
  message: string;
  data: {
    categoryId: string;
    deletedAt?: string;
    restoredAt?: string;
    category?: ICategoryAdmin;
  };
}

// Toggle status response
export interface IToggleStatusResponse {
  success: boolean;
  message: string;
  data: {
    categoryId: string;
    isActive: boolean;
    toggledAt: string;
  };
}

// Bulk action types
export type BulkActionType =
  | "activate"
  | "deactivate"
  | "feature"
  | "unfeature"
  | "delete"
  | "restore";

export interface BulkActionRequest {
  action: BulkActionType;
  categoryIds: string[];
}

// Table action types
export type CategoryAction = "view" | "edit" | "delete" | "restore" | "move";

// Alias for backward compatibility and consistency
export type Category = ICategoryAdmin;
export type CategoryFiltersType = CategoryAdminQueryParams;

// Search API Types
export interface ICategorySearchParams {
  q?: string;
  limit?: number;
  page?: number;
}

export interface ICategorySearchResult {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parent: string | null;
  isActive: boolean;
  productCount?: number;
  fullPath?: string; // e.g., "Electronics > Smartphones"
}

export interface ICategorySearchResponse {
  success: boolean;
  message: string;
  data: {
    results: ICategorySearchResult[];
    pagination: {
      totalCount: number;
      hasMore: boolean;
      currentPage: number;
      limit: number;
      count: number;
    };
    query: string;
  };
}
