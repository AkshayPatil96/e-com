// Admin-related type definitions
export type Admin = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string; // Backend computed field
  phone?: string | null;
  status: "active" | "inactive" | "hold" | "blocked" | "suspended" | "pending";
  adminStatus: "active" | "inactive" | "never-logged"; // Backend computed field
  lastLogin: string | null;
  canCreateAdmin: boolean;
  isTempPassword: boolean; // New field from backend
  profileImage: {
    url: string;
    alt: string;
    isPrimary: boolean;
    width: number;
    height: number;
    format: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // For archived admins
  permissionLevel: "high" | "medium" | "low"; // Backend computed field
  permissionPercentage: number; // Backend computed field
  permissions: {
    brands: {
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
      canArchive: boolean;
      canRestore: boolean;
    };
    categories: {
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
      canArchive: boolean;
      canRestore: boolean;
    };
    products: {
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
      canApprove: boolean;
      canArchive: boolean;
      canRestore: boolean;
    };
    users: {
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
      canBan: boolean;
      canArchive: boolean;
      canRestore: boolean;
    };
    sellers: {
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
      canApprove: boolean;
      canSuspend: boolean;
      canArchive: boolean;
      canRestore: boolean;
    };
    orders: {
      canView: boolean;
      canEdit: boolean;
      canCancel: boolean;
      canRefund: boolean;
      canArchive: boolean;
      canRestore: boolean;
    };
    admins: {
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
      canManagePermissions: boolean;
      canArchive: boolean;
      canRestore: boolean;
    };
    reports: { canView: boolean; canExport: boolean };
  };
  // Deprecated fields (keeping for backward compatibility)
  name?: string; // Use fullName instead
  id?: string; // Use _id instead
};

export type PermissionModule = keyof Admin["permissions"];
export type Permission = keyof Admin["permissions"][PermissionModule];

// Form types
export type AdminFormData = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for edit mode, required for add mode
  canCreateAdmin: boolean;
  permissions?: Admin["permissions"]; // Optional since it can be set later
};

// Table action types
export type AdminAction = "view" | "edit" | "permissions" | "delete";

// API response types
export type AdminsListResponse = {
  data: Admin[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
};

export type AdminFilters = {
  page?: number;
  limit?: number;
  search?: string;
  statusFilter?: "all" | "active" | "inactive" | "never-logged";
  permissionFilter?: "all" | "high" | "medium" | "low";
  canCreateAdminFilter?: "all" | "yes" | "no";
  sortBy?: "name" | "email" | "createdAt" | "lastLogin";
  sortOrder?: "asc" | "desc";
  createdDateFrom?: string;
  createdDateTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  isArchived?: boolean; // New filter for archived admins
};
