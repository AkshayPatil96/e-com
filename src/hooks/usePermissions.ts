import { hasPermission, UserPermissions } from "@/app/admin/_components/sidebarData";
import { useSelector } from "react-redux";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  isSuperAdmin?: boolean;
  permissions?: UserPermissions;
  [key: string]: unknown;
}

interface RootState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
}

export const usePermissions = () => {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const permissions = user?.permissions as UserPermissions | undefined;
  const isSuperAdmin = user?.role === "superadmin" || user?.isSuperAdmin || false;

  const checkPermission = (module: keyof UserPermissions, action: string) => {
    return hasPermission(permissions, module, action);
  };

  return {
    permissions,
    checkPermission,
    user,
    isLoading,
    isSuperAdmin,
    isAuthenticated,
    // Helper methods for common checks
    canViewUsers: checkPermission("users", "canView"),
    canCreateUsers: checkPermission("users", "canCreate"),
    canEditUsers: checkPermission("users", "canEdit"),
    canDeleteUsers: checkPermission("users", "canDelete"),
    canBanUsers: checkPermission("users", "canBan"),
    
    canViewProducts: checkPermission("products", "canView"),
    canCreateProducts: checkPermission("products", "canCreate"),
    canEditProducts: checkPermission("products", "canEdit"),
    canDeleteProducts: checkPermission("products", "canDelete"),
    canApproveProducts: checkPermission("products", "canApprove"),
    
    canViewOrders: checkPermission("orders", "canView"),
    canEditOrders: checkPermission("orders", "canEdit"),
    canCancelOrders: checkPermission("orders", "canCancel"),
    canRefundOrders: checkPermission("orders", "canRefund"),
    
    canViewBrands: checkPermission("brands", "canView"),
    canCreateBrands: checkPermission("brands", "canCreate"),
    canEditBrands: checkPermission("brands", "canEdit"),
    canDeleteBrands: checkPermission("brands", "canDelete"),
    
    canViewCategories: checkPermission("categories", "canView"),
    canCreateCategories: checkPermission("categories", "canCreate"),
    canEditCategories: checkPermission("categories", "canEdit"),
    canDeleteCategories: checkPermission("categories", "canDelete"),
    
    canViewAdmins: checkPermission("admins", "canView"),
    canCreateAdmins: checkPermission("admins", "canCreate"),
    canEditAdmins: checkPermission("admins", "canEdit"),
    canDeleteAdmins: checkPermission("admins", "canDelete"),
    canManageAdminPermissions: checkPermission("admins", "canManagePermissions"),
    
    canViewReports: checkPermission("reports", "canView"),
    canExportReports: checkPermission("reports", "canExport"),
  };
};