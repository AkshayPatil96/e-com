import { UserPermissions } from "@/app/admin/_components/sidebarData";
import { usePermissions } from "@/hooks/usePermissions";
import React from "react";

interface PermissionGuardProps {
  children: React.ReactNode;
  module?: keyof UserPermissions;
  action?: string;
  requireSuperAdmin?: boolean;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  module,
  action,
  requireSuperAdmin = false,
  fallback = (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don&apos;t have permission to view this content.</p>
      </div>
    </div>
  ),
}) => {
  const { checkPermission, isSuperAdmin, isAuthenticated } = usePermissions();

  // If not authenticated, don't render anything (let auth guards handle this)
  if (!isAuthenticated) {
    return null;
  }

  // Check super admin requirement
  if (requireSuperAdmin && !isSuperAdmin) {
    return <>{fallback}</>;
  }

  // Check specific module permission
  if (module && action) {
    const hasPermission = checkPermission(module, action);
    if (!hasPermission && !isSuperAdmin) {
      return <>{fallback}</>;
    }
  }

  // If all checks pass, render children
  return <>{children}</>;
};

export default PermissionGuard;