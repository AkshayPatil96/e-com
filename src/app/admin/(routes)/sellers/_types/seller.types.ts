"use client";

import { z } from "zod";

// Core Enums
export enum SellerStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  PENDING = "pending",
  REJECTED = "rejected",
  INACTIVE = "inactive",
}

export enum SellerSortBy {
  STORE_NAME = "storeName",
  CREATED_AT = "createdAt",
  JOINED_DATE = "joinedDate",
  TOTAL_SALES = "totalSales",
  TOTAL_ORDERS = "totalOrders",
  AVERAGE_RATING = "averageRating",
  COMMISSION_RATE = "commissionRate",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum SellerBulkAction {
  ACTIVATE = "activate",
  SUSPEND = "suspend",
  DELETE = "delete",
  RESTORE = "restore",
  VERIFY = "verify",
  UNVERIFY = "unverify",
  FEATURE = "feature",
  UNFEATURE = "unfeature",
  APPROVE = "approve",
  REJECT = "reject",
}

export enum AddressType {
  BUSINESS = "business",
  BILLING = "billing",
  SHIPPING = "shipping",
}

// Core Interfaces
export interface ISellerImage {
  url: string;
  alt: string;
  s3Key?: string;
  bucket?: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  uploadMethod?: string;
  originalUrl?: string;
  isPrimary?: boolean;
  isProcessed?: boolean;
  processingStatus?: string;
  uploadedAt?: Date;
  processedAt?: Date;
}

export type ISellerBanner = ISellerImage;

export interface ISellerAddress {
  id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
  type?: AddressType;
}

export interface ISellerSocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

export interface ISellerRatings {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ISellerPolicies {
  returnPolicy?: string;
  shippingPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;
}

// User interface for autocomplete
export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    alt: string;
  };
  isActive: boolean;
  createdAt: Date;
}

// Admin List Item for table display
export interface ISellerAdminItem {
  _id: string;
  userId: IUser;
  storeName: string;
  slug: string;
  storeDescription?: string;
  contactEmail: string;
  phoneNumber?: string;
  alternatePhone?: string;
  status: SellerStatus;
  isVerified: boolean;
  isDeleted: boolean;
  isFeatured: boolean;
  isTopSeller: boolean;
  image?: ISellerImage;
  banner?: ISellerBanner;
  addresses?: ISellerAddress[];
  categories?: string[]; // Category IDs
  socialLinks?: ISellerSocialLinks;
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
  totalRatings: number;
  commissionRate: number;
  joinedDate: Date;
  lastActiveDate?: Date;
  policies?: ISellerPolicies;
  createdAt: Date;
  updatedAt: Date;
}

// Form data interfaces
export interface ISellerFormData {
  useExistingUser?: boolean;
  userId?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  storeName: string;
  storeDescription?: string;
  categories?: string[];
  contactEmail: string;
  phoneNumber?: string;
  alternatePhone?: string;
  addresses?: ISellerAddress[];
  image?: ISellerImage;
  banner?: ISellerBanner;
  socialLinks?: ISellerSocialLinks;
  commissionRate?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  isTopSeller?: boolean;
  status?: SellerStatus;
  policies?: ISellerPolicies;
}

// API Interfaces
export interface ISellerAdminListResponse {
  success: boolean;
  data: {
    data: ISellerAdminItem[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
  message: string;
}

export interface ISellerResponse {
  success: boolean;
  data: ISellerAdminItem;
  message: string;
}

export interface ISellerSearchItem {
  _id: string;
  storeName: string;
  slug: string;
  contactEmail: string;
  status: SellerStatus;
  isVerified: boolean;
  image?: ISellerImage;
}

export interface ISellerSearchResponse {
  success: boolean;
  data: {
    results: ISellerSearchItem[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      hasMore: boolean;
      count: number;
    };
    query: string;
  };
  message: string;
}

export interface IUserSearchResponse {
  success: boolean;
  data: {
    results: IUser[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      hasMore: boolean;
      count: number;
    };
    query: string;
  };
  message: string;
}

// Statistics Interface
export interface ISellerStatistics {
  totalSellers: number;
  activeSellers: number;
  pendingSellers: number;
  suspendedSellers: number;
  verifiedSellers: number;
  featuredSellers: number;
  topSellers: number;
  deletedSellers: number;
  totalSales: number;
  averageCommissionRate: number;
  newSellersThisMonth: number;
  newSellersLastMonth: number;
  statusBreakdown: {
    active: number;
    suspended: number;
    pending: number;
    rejected: number;
    inactive: number;
  };
  verificationBreakdown: {
    verified: number;
    unverified: number;
  };
}

// Query Parameters
export interface SellerAdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  verified?: string;
  featured?: string;
  isDeleted?: boolean;
  sortBy?: SellerSortBy;
  sortOrder?: SortOrder;
  categories?: string[];
  minSales?: number;
  maxSales?: number;
  minRating?: number;
  maxRating?: number;
  minCommission?: number;
  maxCommission?: number;
}

// Filter Types
export interface SellerFiltersType {
  search: string;
  status: string;
  verified: string;
  featured: string;
  categories: string[];
  minSales: string;
  maxSales: string;
  minRating: string;
  maxRating: string;
  minCommission: string;
  maxCommission: string;
}

// Bulk Action Interfaces
export interface ISellerBulkActionRequest {
  sellerIds: string[];
  action: SellerBulkAction;
  reason?: string;
}

export interface IBulkActionResponse {
  success: boolean;
  data: {
    action: SellerBulkAction;
    total: number;
    success: number;
    failed: number;
    errors?: string[];
  };
  message: string;
}

// File Upload Interfaces
export interface IGenerateUploadUrlsRequest {
  fileTypes: ("image" | "banner")[];
  sellerId?: string;
}

export interface IGenerateUploadUrlsResponse {
  success: boolean;
  data: {
    uploadUrls: {
      [key: string]: {
        uploadUrl: string;
        key: string;
        publicUrl: string;
        fileType: string;
        expiresAt: string;
      };
    };
  };
  message: string;
}

export interface IProcessImagesRequest {
  uploads: {
    [key: string]: {
      tempKey: string;
      filename: string;
      originalName?: string;
    };
  };
  sellerId?: string;
}

export interface IProcessImagesResponse {
  success: boolean;
  data: {
    processedImages: {
      [key: string]: ISellerImage;
    };
  };
  message: string;
}

// Validation Schemas
export const SELLER_VALIDATION = {
  STORE_NAME: {
    MIN: 2,
    MAX: 100,
  },
  STORE_DESCRIPTION: {
    MAX: 2000,
  },
  COMMISSION_RATE: {
    MIN: 0,
    MAX: 50,
    DEFAULT: 5,
  },
  PHONE: {
    PATTERN: /^\+?[\d\s\-\(\)]+$/,
  },
  ADDRESS: {
    STREET_MAX: 200,
    CITY_MAX: 100,
    STATE_MAX: 100,
    COUNTRY_MAX: 100,
    ZIP_MAX: 20,
  },
  POLICIES: {
    MAX: 5000,
  },
} as const;

// Zod Schemas
export const sellerAddressSchema = z.object({
  id: z.string().optional(),
  street: z
    .string()
    .min(1, "Street is required")
    .max(SELLER_VALIDATION.ADDRESS.STREET_MAX),
  city: z
    .string()
    .min(1, "City is required")
    .max(SELLER_VALIDATION.ADDRESS.CITY_MAX),
  state: z
    .string()
    .min(1, "State is required")
    .max(SELLER_VALIDATION.ADDRESS.STATE_MAX),
  country: z
    .string()
    .min(1, "Country is required")
    .max(SELLER_VALIDATION.ADDRESS.COUNTRY_MAX),
  zipCode: z
    .string()
    .min(1, "ZIP code is required")
    .max(SELLER_VALIDATION.ADDRESS.ZIP_MAX),
  isDefault: z.boolean().optional(),
  type: z.nativeEnum(AddressType).optional(),
});

export const sellerSocialLinksSchema = z.object({
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .optional()
    .or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  youtube: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
});

export const sellerPoliciesSchema = z.object({
  returnPolicy: z.string().max(SELLER_VALIDATION.POLICIES.MAX).optional(),
  shippingPolicy: z.string().max(SELLER_VALIDATION.POLICIES.MAX).optional(),
  privacyPolicy: z.string().max(SELLER_VALIDATION.POLICIES.MAX).optional(),
  termsOfService: z.string().max(SELLER_VALIDATION.POLICIES.MAX).optional(),
});

export const sellerFormSchema = z.object({
  userId: z.string().min(1, "User selection is required"),
  storeName: z
    .string()
    .min(
      SELLER_VALIDATION.STORE_NAME.MIN,
      "Store name must be at least 2 characters",
    )
    .max(
      SELLER_VALIDATION.STORE_NAME.MAX,
      "Store name must be less than 100 characters",
    ),
  storeDescription: z
    .string()
    .max(
      SELLER_VALIDATION.STORE_DESCRIPTION.MAX,
      "Description must be less than 2000 characters",
    )
    .optional(),
  categories: z.array(z.string()).optional(),
  contactEmail: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(SELLER_VALIDATION.PHONE.PATTERN, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  alternatePhone: z
    .string()
    .regex(SELLER_VALIDATION.PHONE.PATTERN, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  addresses: z.array(sellerAddressSchema).optional(),
  socialLinks: sellerSocialLinksSchema.optional(),
  commissionRate: z
    .number()
    .min(
      SELLER_VALIDATION.COMMISSION_RATE.MIN,
      "Commission rate cannot be negative",
    )
    .max(
      SELLER_VALIDATION.COMMISSION_RATE.MAX,
      "Commission rate cannot exceed 50%",
    )
    .default(SELLER_VALIDATION.COMMISSION_RATE.DEFAULT),
  isVerified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isTopSeller: z.boolean().optional(),
  status: z.nativeEnum(SellerStatus).optional(),
  policies: sellerPoliciesSchema.optional(),
});

export type SellerFormValues = z.infer<typeof sellerFormSchema>;

// Response Types
export interface IDeleteRestoreResponse {
  success: boolean;
  data: {
    _id: string;
    storeName: string;
    isDeleted: boolean;
  };
  message: string;
}

export interface IToggleStatusResponse {
  success: boolean;
  data: {
    _id: string;
    storeName: string;
    status: SellerStatus;
  };
  message: string;
}

// Image upload specific types (reusing pattern from brands)
export interface IImage {
  url: string;
  alt: string;
  s3Key?: string;
  originalUrl?: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
}

// Upload validation
export const UPLOAD_CONFIG = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    DIMENSIONS: {
      MIN_WIDTH: 100,
      MIN_HEIGHT: 100,
      MAX_WIDTH: 2000,
      MAX_HEIGHT: 2000,
    },
  },
  BANNER: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    DIMENSIONS: {
      MIN_WIDTH: 300,
      MIN_HEIGHT: 100,
      MAX_WIDTH: 2000,
      MAX_HEIGHT: 800,
    },
  },
} as const;
