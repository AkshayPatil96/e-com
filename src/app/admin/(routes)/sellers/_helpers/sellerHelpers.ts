import {
  ISellerAdminItem,
  SellerAdminQueryParams,
  SellerBulkAction,
  SellerFiltersType,
  SellerSortBy,
  SellerStatus,
} from "@/app/admin/(routes)/sellers/_types/seller.types";

// 1. Formatting Utilities
export const formatSellerStatus = (status: SellerStatus): string => {
  const statusMap: Record<SellerStatus, string> = {
    [SellerStatus.ACTIVE]: "Active",
    [SellerStatus.INACTIVE]: "Inactive",
    [SellerStatus.SUSPENDED]: "Suspended",
    [SellerStatus.PENDING]: "Pending Review",
    [SellerStatus.REJECTED]: "Rejected",
  };
  return statusMap[status] || status;
};

export const formatSellerCommission = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};

export const formatSellerJoinDate = (date: Date | string): string => {
  const joinDate = new Date(date);
  return joinDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSellerAddress = (seller: ISellerAdminItem): string => {
  const primaryAddress =
    seller.addresses?.find((addr) => addr.isDefault) || seller.addresses?.[0];
  if (!primaryAddress) return "No address provided";

  const parts = [
    primaryAddress.street,
    primaryAddress.city,
    primaryAddress.state,
    primaryAddress.country,
  ].filter(Boolean);

  return parts.join(", ");
};

export const formatSellerDisplayName = (seller: ISellerAdminItem): string => {
  if (seller.storeName) return seller.storeName;
  if (seller.userId?.name) {
    return seller.userId.name;
  }
  return seller.userId?.email || "Unknown Seller";
};

// 2. Status Badge Utilities
export const getSellerStatusColor = (
  status: SellerStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case SellerStatus.ACTIVE:
      return "default";
    case SellerStatus.INACTIVE:
      return "secondary";
    case SellerStatus.SUSPENDED:
      return "destructive";
    case SellerStatus.PENDING:
      return "outline";
    case SellerStatus.REJECTED:
      return "destructive";
    default:
      return "outline";
  }
};

export const getVerificationBadgeColor = (
  isVerified: boolean,
): "default" | "destructive" => {
  return isVerified ? "default" : "destructive";
};

export const getFeaturedBadgeColor = (
  isFeatured: boolean,
): "default" | "secondary" => {
  return isFeatured ? "default" : "secondary";
};

// 3. Validation Utilities
export const validateSellerEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateSellerPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
};

export const validateCommissionRate = (rate: number): boolean => {
  return rate >= 0 && rate <= 1; // 0% to 100%
};

export const validateSellerSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
};

// 4. Data Transformation
export const transformSellerForTable = (
  sellers: ISellerAdminItem[],
): ISellerAdminItem[] => {
  return sellers.map((seller) => ({
    ...seller,
    displayName: formatSellerDisplayName(seller),
    formattedCommission: formatSellerCommission(seller.commissionRate),
    formattedJoinDate: formatSellerJoinDate(seller.createdAt),
    statusColor: getSellerStatusColor(seller.status),
  }));
};

export const transformFiltersToQueryParams = (
  filters: SellerFiltersType,
): SellerAdminQueryParams => {
  return {
    page: parseInt(filters.search) || 1,
    limit: 20,
    search: filters.search || "",
    status: filters.status || "all",
    verified: filters.verified || "all",
    featured: filters.featured || "all",
    isDeleted: false,
    sortBy: SellerSortBy.CREATED_AT,
    categories: filters.categories || [],
    minSales: parseInt(filters.minSales) || undefined,
    maxSales: parseInt(filters.maxSales) || undefined,
    minRating: parseInt(filters.minRating) || undefined,
    maxRating: parseInt(filters.maxRating) || undefined,
    minCommission: parseInt(filters.minCommission) || undefined,
    maxCommission: parseInt(filters.maxCommission) || undefined,
  };
};

// 5. URL Management
export const generateSellerPageUrl = (
  type: "list" | "add" | "edit" | "view",
  id?: string,
): string => {
  const baseUrl = "/admin/sellers";

  switch (type) {
    case "list":
      return baseUrl;
    case "add":
      return `${baseUrl}?type=add`;
    case "edit":
      return id ? `${baseUrl}?type=edit&id=${id}` : baseUrl;
    case "view":
      return id ? `${baseUrl}?type=view&id=${id}` : baseUrl;
    default:
      return baseUrl;
  }
};

export const parseSellerPageUrl = (
  searchParams: URLSearchParams,
): { type: string; id?: string } => {
  const type = searchParams.get("type") || "list";
  const id = searchParams.get("id") || undefined;
  return { type, id };
};

// 6. Bulk Action Utilities
export const getBulkActionLabel = (action: SellerBulkAction): string => {
  const actionMap: Record<SellerBulkAction, string> = {
    [SellerBulkAction.ACTIVATE]: "Activate Selected",
    [SellerBulkAction.SUSPEND]: "Suspend Selected",
    [SellerBulkAction.VERIFY]: "Verify Selected",
    [SellerBulkAction.UNVERIFY]: "Unverify Selected",
    [SellerBulkAction.FEATURE]: "Feature Selected",
    [SellerBulkAction.UNFEATURE]: "Unfeature Selected",
    [SellerBulkAction.DELETE]: "Delete Selected",
    [SellerBulkAction.RESTORE]: "Restore Selected",
    [SellerBulkAction.APPROVE]: "Approve Selected",
    [SellerBulkAction.REJECT]: "Reject Selected",
  };
  return actionMap[action];
};

export const getBulkActionConfirmMessage = (
  action: SellerBulkAction,
  count: number,
): string => {
  const actionName = getBulkActionLabel(action).toLowerCase();
  return `Are you sure you want to ${actionName
    .replace("selected", "")
    .trim()} ${count} seller${count !== 1 ? "s" : ""}?`;
};

export const validateBulkActionSelection = (
  selectedIds: string[],
): { valid: boolean; message?: string } => {
  if (selectedIds.length === 0) {
    return {
      valid: false,
      message: "Please select at least one seller to perform this action.",
    };
  }

  if (selectedIds.length > 100) {
    return {
      valid: false,
      message:
        "You can only perform bulk actions on up to 100 sellers at once.",
    };
  }

  return { valid: true };
};

// 7. Sort Utilities
export const getSortLabel = (sortBy: SellerSortBy): string => {
  const sortMap: Record<SellerSortBy, string> = {
    [SellerSortBy.CREATED_AT]: "Date Joined",
    [SellerSortBy.STORE_NAME]: "Store Name",
    [SellerSortBy.JOINED_DATE]: "Joined Date",
    [SellerSortBy.TOTAL_SALES]: "Total Sales",
    [SellerSortBy.TOTAL_ORDERS]: "Total Orders",
    [SellerSortBy.AVERAGE_RATING]: "Average Rating",
    [SellerSortBy.COMMISSION_RATE]: "Commission Rate",
  };
  return sortMap[sortBy];
};

export const getNextSortOrder = (
  currentSortBy: SellerSortBy,
  newSortBy: SellerSortBy,
  currentSortOrder: "asc" | "desc",
): "asc" | "desc" => {
  if (currentSortBy === newSortBy) {
    return currentSortOrder === "asc" ? "desc" : "asc";
  }
  return "desc"; // Default for new sort field
};

// 8. Search and Filter Utilities
export const buildSearchQuery = (filters: SellerFiltersType): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
};

export const clearSearchFilters = (): SellerFiltersType => {
  return {
    search: "",
    status: "all",
    verified: "all",
    featured: "all",
    categories: [],
    minSales: "",
    maxSales: "",
    minRating: "",
    maxRating: "",
    minCommission: "",
    maxCommission: "",
  };
};

// 9. Statistics Utilities
export const calculateSellerGrowthRate = (
  current: number,
  previous: number,
): { rate: number; isPositive: boolean } => {
  if (previous === 0) {
    return { rate: current > 0 ? 100 : 0, isPositive: true };
  }

  const rate = ((current - previous) / previous) * 100;
  return {
    rate: Math.abs(rate),
    isPositive: rate >= 0,
  };
};

export const formatGrowthRate = (rate: number, isPositive: boolean): string => {
  const sign = isPositive ? "+" : "-";
  return `${sign}${rate.toFixed(1)}%`;
};

// Error interface for better type handling
interface ApiError {
  status?: number;
  message?: string;
  data?: {
    message?: string;
    code?: string;
  };
}

// 10. Error Handling Utilities
export const getSellerErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    const err = error as ApiError;
    if (err?.data?.message) {
      return err.data.message;
    }
    if (err?.message) {
      return err.message;
    }
  }

  return "An unexpected error occurred. Please try again.";
};

export const isSellerNotFoundError = (error: unknown): boolean => {
  if (error && typeof error === "object") {
    const err = error as ApiError;
    return err?.status === 404 || err?.data?.code === "SELLER_NOT_FOUND";
  }
  return false;
};

export const isSellerValidationError = (error: unknown): boolean => {
  if (error && typeof error === "object") {
    const err = error as ApiError;
    return err?.status === 400 || err?.data?.code === "VALIDATION_ERROR";
  }
  return false;
};
