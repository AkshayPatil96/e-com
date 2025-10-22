"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  CheckCircle,
  LoaderCircle,
  Shield,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Admin, Permission, PermissionModule } from "../_types/admin.types";

type ManagePermissionsModalProps = {
  admin: Admin | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adminId: string, permissions: Admin['permissions']) => Promise<void>;
  isLoading?: boolean;
};

export default function ManagePermissionsModal({
  admin,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: ManagePermissionsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<Admin['permissions']>({
    brands: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canArchive: false,
      canRestore: false,
    },
    categories: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canArchive: false,
      canRestore: false,
    },
    products: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canApprove: false,
      canArchive: false,
      canRestore: false,
    },
    users: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canBan: false,
      canArchive: false,
      canRestore: false,
    },
    sellers: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canApprove: false,
      canSuspend: false,
      canArchive: false,
      canRestore: false,
    },
    orders: {
      canView: false,
      canEdit: false,
      canCancel: false,
      canRefund: false,
      canArchive: false,
      canRestore: false,
    },
    admins: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canManagePermissions: false,
      canArchive: false,
      canRestore: false,
    },
    reports: {
      canView: false,
      canExport: false,
    },
  });

  // Reset permissions when admin changes
  useEffect(() => {
    if (admin) {
      setPermissions(admin.permissions);
    }
  }, [admin]);

  const handlePermissionChange = (
    module: PermissionModule, 
    permission: string, 
    value: boolean
  ) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: value,
      },
    }));
  };

  const handleModuleToggle = (module: PermissionModule, value: boolean) => {
    const modulePermissions = permissions[module];
    const updatedPermissions = Object.keys(modulePermissions).reduce((acc, key) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, boolean>);
    
    setPermissions(prev => ({
      ...prev,
      [module]: updatedPermissions,
    }));
  };

  const handleFormSubmit = async () => {
    if (!admin) return;

    setIsSubmitting(true);
    try {
      await onSubmit(admin._id, permissions);
      onClose();
    } catch (error) {
      console.error("Failed to update permissions:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate module statistics
  const getModuleStats = (modulePermissions: Record<Permission, boolean>) => {
    const total = Object.keys(modulePermissions).length;
    const granted = Object.values(modulePermissions).filter(Boolean).length;
    return { total, granted, percentage: Math.round((granted / total) * 100) };
  };

  // Check if module has all permissions
  const isModuleFullyEnabled = (modulePermissions: Record<Permission, boolean>) => {
    return Object.values(modulePermissions).every(Boolean);
  };

  // Check if module has any permissions
  const isModulePartiallyEnabled = (modulePermissions: Record<Permission, boolean>) => {
    return Object.values(modulePermissions).some(Boolean);
  };

  if (!admin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Permissions
          </DialogTitle>
          <DialogDescription>
            Configure access permissions for {admin.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Permission Modules */}
          {Object.entries(permissions).map(([module, modulePermissions]) => {
            const stats = getModuleStats(modulePermissions);
            const isFullyEnabled = isModuleFullyEnabled(modulePermissions);
            const isPartiallyEnabled = isModulePartiallyEnabled(modulePermissions);
            
            return (
              <div key={module} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-3">
                      <Switch
                        id={`module-${module}`}
                        checked={isFullyEnabled}
                        onCheckedChange={(checked) => 
                          handleModuleToggle(module as PermissionModule, checked)
                        }
                        disabled={isSubmitting || isLoading}
                      />
                      <Label 
                        htmlFor={`module-${module}`}
                        className="text-lg font-semibold capitalize cursor-pointer"
                      >
                        {module}
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isFullyEnabled ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : isPartiallyEnabled ? (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <Badge 
                        variant={
                          isFullyEnabled 
                            ? "default" 
                            : isPartiallyEnabled 
                              ? "secondary" 
                              : "destructive"
                        }
                      >
                        {stats.granted}/{stats.total} ({stats.percentage}%)
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Individual Permissions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  {Object.entries(modulePermissions).map(([permission, value]) => (
                    <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                      <Label 
                        htmlFor={`${module}-${permission}`}
                        className="text-sm capitalize cursor-pointer font-medium"
                      >
                        {permission.replace(/^can/, "")}
                      </Label>
                      <Switch
                        id={`${module}-${permission}`}
                        checked={value}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(
                            module as PermissionModule, 
                            permission, 
                            checked
                          )
                        }
                        disabled={isSubmitting || isLoading}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <Separator />

          {/* Overall Summary */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold">Permission Summary</h3>
              <p className="text-sm text-muted-foreground">
                Total permissions granted across all modules
              </p>
            </div>
            <div className="text-right">
              {(() => {
                const totalPermissions = Object.values(permissions).reduce(
                  (acc, module) => acc + Object.keys(module).length, 
                  0
                );
                const grantedPermissions = Object.values(permissions).reduce(
                  (acc, module) => acc + Object.values(module).filter(Boolean).length, 
                  0
                );
                const percentage = Math.round((grantedPermissions / totalPermissions) * 100);
                
                return (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {grantedPermissions}/{totalPermissions} permissions
                    </Badge>
                    <span className="text-sm font-medium">
                      {percentage}% access
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFormSubmit}
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Permissions"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}