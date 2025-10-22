// Brand Types and Interfaces based on API documentation

// ========== VALIDATION CONSTANTS ==========

export const BRAND_VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
  },
  SHORT_DESCRIPTION: {
    MAX_LENGTH: 200,
  },
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    LOGO: {
      MIN_WIDTH: 100,
      MIN_HEIGHT: 100,
      RECOMMENDED_WIDTH: 400,
      RECOMMENDED_HEIGHT: 400,
      MAX_WIDTH: 2000,
      MAX_HEIGHT: 2000,
    },
    BANNER: {
      MIN_WIDTH: 800,
      MIN_HEIGHT: 200,
      RECOMMENDED_WIDTH: 1920,
      RECOMMENDED_HEIGHT: 600,
      MAX_WIDTH: 4000,
      MAX_HEIGHT: 2000,
    },
    GALLERY: {
      MIN_WIDTH: 300,
      MIN_HEIGHT: 300,
      MAX_WIDTH: 3000,
      MAX_HEIGHT: 3000,
    },
  },
  URL: {
    MAX_LENGTH: 500,
    PROTOCOLS: ["http://", "https://"],
  },
  BUSINESS_INFO: {
    FOUNDING_YEAR: {
      MIN: 1800,
      MAX: new Date().getFullYear(),
    },
    EMAIL: {
      MAX_LENGTH: 100,
    },
    LEGAL_NAME: {
      MAX_LENGTH: 200,
    },
    REGISTRATION_NUMBER: {
      MAX_LENGTH: 50,
    },
    TAX_ID: {
      MAX_LENGTH: 50,
    },
  },
  SEO: {
    META_TITLE: {
      MAX_LENGTH: 70,
    },
    META_DESCRIPTION: {
      MAX_LENGTH: 160,
    },
    META_KEYWORDS: {
      MAX_COUNT: 10,
      MAX_LENGTH_EACH: 30,
    },
  },
} as const;

// ========== CORE BRAND INTERFACES ==========

// ========== IMAGE UPLOAD & PROCESSING TYPES ==========

export enum UploadMethod {
  PRESIGNED_UPLOAD = "presigned_upload",
  EXTERNAL_URL = "external_url",
  LEGACY = "legacy"
}

export enum ProcessingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed"
}

export interface IImageMetadata {
  width: number;
  height: number;
  size: number;
  format: string;
  filename: string;
  uploadMethod: UploadMethod;
  originalUrl?: string; // For external URLs
  s3Key?: string; // For S3 uploads
  uploadedAt: string;
  processedAt?: string;
}

export interface IImageVariant {
  size: "thumbnail" | "small" | "medium" | "large" | "original";
  url: string;
  width: number;
  height: number;
  s3Key?: string;
}

export interface IImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: number;
  filename?: string;
  
  // Enhanced image properties
  metadata?: IImageMetadata;
  variants?: IImageVariant[];
  processingStatus?: ProcessingStatus;
  uploadProgress?: number; // 0-100 for frontend tracking
  error?: string; // Upload/processing error message
}

// Upload-related interfaces
export interface IUploadUrl {
  uploadUrl: string;
  s3Key: string;
  finalUrl: string;
  expiresIn: number;
}

export interface IGenerateUploadUrlsRequest {
  fileTypes: ("logo" | "banner")[];
  externalUrls?: {
    logo?: string;
    banner?: string;
  };
}

export interface IGenerateUploadUrlsResponse {
  success: boolean;
  message: string;
  data: {
    uploadUrls: Record<string, {
      uploadUrl: string;
      key: string;
      publicUrl: string;
      fileType: string;
      expiresAt: string;
    }>;
    externalResults?: Record<string, {
      success: boolean;
      url?: string;
      s3Key?: string;
      metadata?: {
        originalUrl: string;
        uploadMethod: string;
        width: number;
        height: number;
        size: number;
        format: string;
        compressionRatio: number;
      };
      error?: string;
    }>;
    expiresIn: number;
    instructions: {
      presignedUpload: {
        method: string;
        note: string;
        example: string;
      };
      externalUrls: {
        note: string;
      };
    };
  };
}

export interface IProcessExternalUrlRequest {
  urls: Array<{
    url: string;
    type: "logo" | "banner" | "gallery";
    alt?: string;
  }>;
}

// Add the missing interface for processing uploaded images
export interface IProcessImagesRequest {
  uploads: Record<string, {
    tempKey: string;
    filename: string;
    originalName?: string;
  }>;
}

export interface IProcessImagesResponse {
  success: boolean;
  data: {
    processedImages: Record<string, {
      success: boolean;
      url: string;
      s3Key: string;
      bucket: string;
      width: number;
      height: number;
      format: string;
      uploadMethod: string;
      isProcessed: boolean;
      processingStatus: string;
      uploadedAt: string;
      processedAt: string;
    }>;
    errors?: string[];
  };
}

export interface IProcessExternalUrlResponse {
  success: boolean;
  data: {
    processedImages: IImage[];
    failed?: Array<{
      url: string;
      error: string;
    }>;
  };
  message?: string;
}

export interface IUploadProgressInfo {
  file: File;
  uploadUrl: string;
  s3Key: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
  resultImage?: IImage;
}

export interface IBrandBusinessInfo {
  foundingYear?: number;
  originCountry?: string;
  headquarters?: string;
  parentCompany?: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  email?: string;
  companySize?: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
}

export interface IBrandSocialMedia {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface IBrandSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: IImage;
}

export interface IBrandAnalytics {
  productCount: number;
  totalSales: number;
  averageRating: number;
  totalRatings: number;
  viewCount: number;
  searchCount: number;
  conversionRate: number;
}

// Core Brand Interface
export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  
  // Visual Assets
  logo?: IImage;
  banner?: IImage;
  images?: IImage[];
  
  // Business Information
  businessInfo: IBrandBusinessInfo;
  
  // Social Media & Web
  socialMedia: IBrandSocialMedia;
  
  // SEO Fields
  seo: IBrandSEO;
  
  // Analytics (Auto-calculated)
  analytics: IBrandAnalytics;
  
  // Relationships
  categories: string[];
  parent?: string;
  
  // Status & Display
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isPremium: boolean;
  showInHomepage: boolean;
  displayOrder?: number;
  
  // Audit Fields
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ========== ADMIN API TYPES ==========

// Admin Brand List Item (simplified for table display)
export interface IBrandAdminItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  banner?: string;
  analytics: {
    productCount: number;
    viewCount: number;
    totalSales: number;
    averageRating: number;
  };
  businessInfo: IBrandBusinessInfo;
  socialMedia: IBrandSocialMedia;
  seo: IBrandSEO;
  categories: string[];
  isDeleted: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  showInMenu: boolean;
  showInHomepage: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
  updatedByName: string;
}

// Create Brand Request Body
export interface IBrandFormData {
  id?: string; // For edit mode
  name: string;
  description: string;
  shortDescription?: string;
  
  // Enhanced image fields
  logo?: IImage;
  banner?: IImage;
  images?: IImage[];
  
  // Legacy support (will be converted to IImage format)
  logoUrl?: string;
  bannerUrl?: string;
  
  businessInfo?: IBrandBusinessInfo;
  socialMedia?: IBrandSocialMedia;
  seo?: IBrandSEO;
  categories?: string[];
  displayOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  showInMenu?: boolean;
  showInHomepage?: boolean;
}

// Update Brand Request Body
export type IBrandUpdateData = Partial<IBrandFormData>;

// Bulk Action Request
export interface IBrandBulkActionRequest {
  brandIds: string[];
  action: "activate" | "deactivate" | "delete" | "restore" | "feature" | "unfeature";
}

// ========== QUERY PARAMETERS & FILTERS ==========

export enum BrandStatus {
  ALL = "all",
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export enum BrandFeatured {
  ALL = "all",
  FEATURED = "featured",
  NOT_FEATURED = "not-featured"
}

export enum BrandSortBy {
  NAME = "name",
  CREATED_AT = "createdAt",
  ORDER = "order",
  PRODUCT_COUNT = "productCount",
  VIEW_COUNT = "viewCount"
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}

// Brand Admin Query Parameters
export interface BrandAdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: BrandStatus;
  featured?: BrandFeatured;
  isDeleted?: boolean;
  showInMenu?: boolean;
  showInHomepage?: boolean;
  sortBy?: BrandSortBy;
  sortOrder?: SortOrder;
}

// Brand Filters Type (for UI state) - Make it partial for easier use
export type BrandFiltersType = Partial<BrandAdminQueryParams>;

// Search Parameters
export interface IBrandSearchParams {
  q?: string;
  limit?: number;
  page?: number;
  includeDeleted?: boolean;
}

// ========== RESPONSE TYPES ==========

// Brand List Response
export interface IBrandListResponse {
  success: boolean;
  data: {
    data: IBrandAdminItem[];
    totalPages: number;
    totalCount: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    statistics?: IBrandStatistics;
  };
  message?: string;
}

// Single Brand Response
export interface IBrandResponse {
  success: boolean;
  data: IBrand;
  message?: string;
}

// Brand Statistics
export interface IBrandStatistics {
  totalBrands: number;
  activeBrands: number;
  inactiveBrands: number;
  featuredBrands: number;
  deletedBrands: number;
  averageProductsPerBrand: number;
  brandsWithoutProducts: number;
  brandsWithMostProducts: Array<{
    _id: string;
    name: string;
    productCount: number;
  }>;
  topPerformingBrands: Array<{
    _id: string;
    name: string;
    viewCount: number;
    productCount: number;
  }>;
}

// Brand Statistics Response
export interface IBrandStatisticsResponse {
  success: boolean;
  data: IBrandStatistics;
  message?: string;
}

// Search Response
export interface IBrandSearchResponse {
  success: boolean;
  data: {
    results: IBrandSearchItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasMore: boolean;
      limit: number;
      count: number;
    };
    query: string;
  };
  message?: string;
}

export interface IBrandSearchItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
}

// Bulk Action Response
export interface IBulkActionResponse {
  success: boolean;
  data: {
    processed: number;
    succeeded: number;
    failed: number;
    errors?: string[];
  };
  message: string;
}

// Delete/Restore Response
export interface IDeleteRestoreResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    isDeleted: boolean;
  };
  message: string;
}

// Toggle Status Response
export interface IToggleStatusResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    isActive: boolean;
  };
  message: string;
}

// ========== TABLE AND UI TYPES ==========

export type TableViewMode = "list" | "grid";

export interface BrandTableProps {
  data: IBrandAdminItem[];
  isLoading: boolean;
  sortBy?: BrandSortBy;
  sortOrder?: SortOrder;
  isArchiveView?: boolean;
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canArchive: boolean;
    canRestore: boolean;
    canDelete: boolean;
  };
  actions: {
    onEdit: (brand: IBrandAdminItem) => void;
    onDelete: (brandId: string) => void;
    onRestore: (brandId: string) => void;
    onToggleStatus: (brandId: string) => void;
    onBulkAction: (action: string, brandIds: string[]) => Promise<void>;
    onSort: (column: BrandSortBy) => void;
  };
}

export type BrandListTableProps = BrandTableProps;

export interface BrandGridViewProps {
  data: IBrandAdminItem[];
  isLoading: boolean;
  isArchiveView?: boolean;
  permissions: BrandTableProps['permissions'];
  actions: Pick<BrandTableProps['actions'], 'onEdit' | 'onDelete' | 'onRestore' | 'onToggleStatus'>;
  itemsPerRow?: number;
}

// ========== ERROR TYPES ==========

export interface ApiBrandError {
  success: false;
  message: string;
  errors?: {
    field?: string;
    code?: string;
    value?: unknown;
    constraints?: string[];
  }[];
}

// Form validation errors
export interface BrandFormErrors {
  name?: string[];
  description?: string[];
  shortDescription?: string[];
  logo?: string[];
  banner?: string[];
  displayOrder?: string[];
  businessInfo?: {
    foundingYear?: string[];
    originCountry?: string[];
    headquarters?: string[];
    parentCompany?: string[];
    legalName?: string[];
    registrationNumber?: string[];
    taxId?: string[];
    email?: string[];
    companySize?: string[];
  };
  socialMedia?: {
    website?: string[];
    facebook?: string[];
    twitter?: string[];
    instagram?: string[];
    linkedin?: string[];
    youtube?: string[];
    tiktok?: string[];
  };
  seo?: {
    metaTitle?: string[];
    metaDescription?: string[];
    metaKeywords?: string[];
    canonicalUrl?: string[];
    ogTitle?: string[];
    ogDescription?: string[];
  };
}