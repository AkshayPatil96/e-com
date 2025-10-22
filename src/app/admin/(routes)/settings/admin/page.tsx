"use client";

import AdminPageLayout from "@/app/admin/_components/AdminPageLayout";
import AdminPagination from "@/app/admin/_components/Pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import config from "@/config";
import { adminHeadersHeight } from "@/lib/utils";
import {
  useCreateAdminMutation,
  useGetAdminsListQuery,
  usePermanentlyDeleteAdminMutation,
  useRestoreAdminMutation,
  useSoftDeleteAdminMutation,
  useUpdateAdminMutation,
  useUpdateAdminPermissionsMutation,
} from "@/redux/adminDashboard/admin/adminApi";
import { useLoadUserQuery } from "@/redux/user/userApi";
import { format } from "date-fns";
import {
  AlertCircle,
  Archive,
  CheckCircle,
  ChevronDown,
  ChevronsUpDownIcon,
  ChevronUp,
  Edit,
  Key,
  MoreHorizontal,
  RotateCcw,
  Shield,
  Trash2,
  User,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  AdminFilters,
  AdminFormModal,
  DeleteAdminDialog,
  ManagePermissionsModal,
} from "./_components";
import {
  Admin,
  AdminFilters as AdminFiltersType,
  AdminFormData,
} from "./_types/admin.types";

const SettingsAdminPage = () => {
  const router = useRouter();
  const {
    data: { data: user },
  } = useLoadUserQuery();
  const adminPermissions = user?.permissions?.admins;
  // const { state } = useSidebar();

  // Filter state
  const [filters, setFilters] = useState<AdminFiltersType>({
    page: 1,
    limit: 20,
    search: "",
    statusFilter: "all",
    permissionFilter: "all",
    sortBy: "name",
    sortOrder: "asc",
    isArchived: false, // Default to showing active admins
  });

  // Track archive view state
  const [isArchiveView, setIsArchiveView] = useState(false);

  const { data: adminsList, isLoading } = useGetAdminsListQuery(filters);

  // Mutation hooks
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [updateAdminPermissions, { isLoading: isUpdatingPermissions }] =
    useUpdateAdminPermissionsMutation();
  const [softDeleteAdmin, { isLoading: isDeleting }] =
    useSoftDeleteAdminMutation();
  const [restoreAdmin] = useRestoreAdminMutation();
  const [permanentlyDeleteAdmin] = usePermanentlyDeleteAdminMutation();

  // Modal state management
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formModalMode, setFormModalMode] = useState<"add" | "edit">("add");
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDialogMode, setDeleteDialogMode] = useState<
    "archive" | "restore" | "permanent-delete"
  >("archive");

  const admins: Admin[] = adminsList?.data || [];
  const totalPages = adminsList?.totalPages || 0;
  const totalCount = adminsList?.totalCount || 0;

  const handleAddAdmin = () => {
    if (!adminPermissions?.canCreate) {
      toast.error("You do not have permission to create admins");
      return;
    }
    setSelectedAdmin(null);
    setFormModalMode("add");
    setShowFormModal(true);
  };

  const handleEditAdmin = (adminId: string) => {
    if (!adminPermissions?.canEdit) {
      toast.error("You do not have permission to edit admins");
      return;
    }
    const admin = admins.find((a) => a._id === adminId);
    if (admin) {
      setSelectedAdmin(admin);
      setFormModalMode("edit");
      setShowFormModal(true);
    }
  };

  const handleManagePermissions = (adminId: string) => {
    if (!adminPermissions?.canManagePermissions) {
      toast.error("You do not have permission to manage admin permissions");
      return;
    }
    const admin = admins.find((a) => a._id === adminId);
    if (admin) {
      setSelectedAdmin(admin);
      setShowPermissionsModal(true);
    }
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (!adminPermissions?.canArchive) {
      toast.error("You do not have permission to archive admins");
      return;
    }
    const admin = admins.find((a) => a._id === adminId);
    if (admin) {
      setSelectedAdmin(admin);
      setDeleteDialogMode(isArchiveView ? "permanent-delete" : "archive");
      setShowDeleteDialog(true);
    }
  };

  const handleRestoreAdmin = async (adminId: string) => {
    if (!adminPermissions?.canRestore) {
      toast.error("You do not have permission to restore admins");
      return;
    }
    const admin = admins.find((a) => a._id === adminId);
    if (admin) {
      setSelectedAdmin(admin);
      setDeleteDialogMode("restore");
      setShowDeleteDialog(true);
    }
  };

  const handlePermanentDeleteAdmin = async (adminId: string) => {
    if (!adminPermissions?.canDelete) {
      toast.error("You do not have permission to permanently delete admins");
      return;
    }
    const admin = admins.find((a) => a._id === adminId);
    if (admin) {
      setSelectedAdmin(admin);
      setDeleteDialogMode("permanent-delete");
      setShowDeleteDialog(true);
    }
  };

  // Modal action handlers
  const handleFormSubmit = async (data: Partial<AdminFormData>) => {
    try {
      if (formModalMode === "edit" && data?.id) {
        // Edit mode
        if (adminPermissions?.canEdit) {
          await updateAdmin({ id: data?.id, ...data }).unwrap();
          toast.success("Admin updated successfully");
        } else {
          toast.error("You do not have permission to edit admins");
        }
      } else {
        // Add mode
        if (!adminPermissions?.canCreate) {
          await createAdmin(data as AdminFormData).unwrap();
          toast.success("Admin created successfully");
        } else {
          toast.error("You do not have permission to create admins");
        }
      }
      setShowFormModal(false);
      setSelectedAdmin(null);
    } catch (error: unknown) {
      console.error(`Failed to ${formModalMode} admin:`, error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        `Failed to ${formModalMode} admin`;
      toast.error(errorMessage);
    }
  };

  const handleManagePermissionsSubmit = async (
    adminId: string,
    permissions: Admin["permissions"],
  ) => {
    try {
      if (adminPermissions?.canManagePermissions) {
        await updateAdminPermissions({ id: adminId, permissions }).unwrap();
        toast.success("Permissions updated successfully");
        setShowPermissionsModal(false);
        setSelectedAdmin(null);
      } else {
        toast.error("You do not have permission to manage admin permissions");
      }
    } catch (error: unknown) {
      console.error("Failed to update permissions:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update permissions";
      toast.error(errorMessage);
    }
  };

  const handleDeleteAdminConfirm = async (
    adminId: string,
    confirmDelete: string,
  ) => {
    try {
      if (deleteDialogMode === "restore") {
        if (!adminPermissions?.canRestore) {
          toast.error("You do not have permission to restore admins");
          return;
        }
        await restoreAdmin(adminId).unwrap();
        toast.success("Admin restored successfully");
      } else if (deleteDialogMode === "permanent-delete") {
        if (!adminPermissions?.canDelete) {
          toast.error(
            "You do not have permission to permanently delete admins",
          );
          return;
        }
        await permanentlyDeleteAdmin({ id: adminId, confirmDelete }).unwrap();
        toast.success("Admin permanently deleted");
      } else {
        // Archive mode
        if (!adminPermissions?.canArchive) {
          toast.error("You do not have permission to archive admins");
          return;
        }
        await softDeleteAdmin(adminId).unwrap();
        toast.success("Admin archived successfully");
      }
      setShowDeleteDialog(false);
      setSelectedAdmin(null);
    } catch (error: unknown) {
      console.error(`Failed to ${deleteDialogMode} admin:`, error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        `Failed to ${deleteDialogMode} admin`;
      toast.error(errorMessage);
    }
  };

  // Handle status change
  const handleStatusChange = async (admin: Admin, newStatus: string) => {
    try {
      if (!adminPermissions?.canEdit) {
        toast.error("You do not have permission to edit admins");
        return;
      }
      // For now, using the update admin API - you may need a separate status update endpoint
      const updateData = { ...admin, id: admin._id, status: newStatus };
      await updateAdmin(updateData).unwrap();
      toast.success(`Admin status updated to ${newStatus}`);
    } catch (error: unknown) {
      console.error("Failed to update admin status:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update admin status";
      toast.error(errorMessage);
    }
  };

  const handleToggleArchiveView = () => {
    if (!adminPermissions?.canView && !adminPermissions?.canRestore) {
      toast.error("You do not have permission to view archived admins");
      return;
    }
    const newIsArchiveView = !isArchiveView;
    setIsArchiveView(newIsArchiveView);
    setFilters((prev) => ({
      ...prev,
      isArchived: newIsArchiveView,
      page: 1, // Reset to first page
    }));
  };

  // Filter and pagination handlers
  const handleFiltersChange = (newFilters: AdminFiltersType) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleSort = (column: "name" | "email" | "createdAt" | "lastLogin") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder:
        prev.sortBy === column && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1, // Reset to first page when sorting
    }));
  };

  // Helper functions for status and permissions
  const getAdminStatusBadge = (admin: Admin) => {
    const statusConfig = {
      active: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
      },
      inactive: {
        variant: "secondary" as const,
        icon: AlertCircle,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200",
      },
      hold: {
        variant: "outline" as const,
        icon: AlertCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200",
      },
      blocked: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
      },
      suspended: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
      },
      pending: {
        variant: "outline" as const,
        icon: User,
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200",
      },
    };

    // Use admin.status for display
    const displayStatus = admin.status || "pending";
    const config =
      statusConfig[displayStatus as keyof typeof statusConfig] ||
      statusConfig["pending"];
    const Icon = config.icon;

    // For archived admins, show readonly badge
    if (isArchiveView) {
      return (
        <Badge
          variant={config.variant}
          className={`flex items-center gap-1 text-red-600 bg-red-50 border-red-200`}
        >
          <XCircle className={`h-3 w-3 text-red-600`} />
          ARCHIVED
        </Badge>
      );
    }

    // For active admins, show clickable dropdown
    return adminPermissions?.canEdit ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            effect={"ringHover"}
            size="sm"
            className={`h-auto p-1 hover:bg-transparent ${config.bgColor} border rounded-full`}
          >
            <Badge
              variant={config.variant}
              className={`flex items-center gap-1 cursor-pointer hover:opacity-80 ${config.bgColor} text-title border-none`}
            >
              <Icon className={`h-3 w-3 ${config.color}`} />
              {displayStatus.toUpperCase()}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            "active",
            "inactive",
            "hold",
            "blocked",
            "suspended",
            "pending",
          ].map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() =>
                adminPermissions?.canEdit
                  ? handleStatusChange(admin, status)
                  : null
              }
              disabled={admin.status === status}
              className={admin.status === status ? "opacity-50" : ""}
            >
              <Icon
                className={`mr-2 h-4 w-4 ${
                  statusConfig[status as keyof typeof statusConfig]?.color ||
                  "text-gray-600"
                }`}
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Button
        variant="ghost"
        size="sm"
        className={`h-auto p-1 hover:bg-transparent ${config.bgColor} border rounded-full`}
        // disabled={true}
      >
        <Badge
          variant={config.variant}
          className={`flex items-center gap-1 cursor-pointer hover:opacity-80 ${config.bgColor} text-title border-none`}
        >
          <Icon className={`h-3 w-3 ${config.color}`} />
          {displayStatus.toUpperCase()}
        </Badge>
      </Button>
    );
  };

  const getPermissionBadge = (
    permissionLevel: string,
    permissionPercentage: number,
    adminId: string,
  ) => {
    const levelConfig = {
      high: {
        variant: "default" as const,
        color: "bg-green-100 text-green-800 border-green-200",
      },
      medium: {
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      low: {
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config =
      levelConfig[permissionLevel as keyof typeof levelConfig] ||
      levelConfig.low;

    return adminPermissions?.canManagePermissions ? (
      <Badge
        variant={config.variant}
        className={`${config.color} flex items-center gap-1 ${
          isArchiveView ? "" : "cursor-pointer"
        }`}
        onClick={() =>
          isArchiveView ? false : handleManagePermissions(adminId)
        }
      >
        <Shield className="h-3 w-3" />
        {permissionLevel.toUpperCase()} ({permissionPercentage}%)
      </Badge>
    ) : (
      <Badge
        variant={config.variant}
        className={`${config.color} flex items-center gap-1`}
      >
        <Shield className="h-3 w-3" />
        {permissionLevel.toUpperCase()} ({permissionPercentage}%)
      </Badge>
    );
  };

  const getTempPasswordIndicator = (isTempPassword: boolean) => {
    if (!isTempPassword) return null;

    return (
      <Badge
        variant="outline"
        className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1"
      >
        <Key className="h-3 w-3" />
        TEMP
      </Badge>
    );
  };

  return adminPermissions?.canView ? (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{ height: `calc(100vh - ${adminHeadersHeight}px)` }}
    >
      {/* Header */}
      <AdminPageLayout
        title={isArchiveView ? "Archived Admin Management" : "Admin Management"}
        subtitle={`Manage ${totalCount} ${
          isArchiveView ? "archived " : ""
        }administrator${totalCount !== 1 ? "s" : ""}${
          isArchiveView
            ? " - you can restore or permanently delete archived admins"
            : " and their permissions"
        }`}
        actionButtons={[
          {
            label: isArchiveView ? "View Active" : "View Archived",
            onClick: handleToggleArchiveView,
            icon: <Archive className="h-4 w-4 mr-2" />,
            variant: isArchiveView ? "default" : "outline",
            size: "sm",
            disabled:
              !adminPermissions?.canRestore || !adminPermissions?.canDelete,
          },
          {
            label: "Add Admin",
            onClick: handleAddAdmin,
            icon: <UserPlus className="h-4 w-4 mr-2" />,
            variant: "default",
            size: "sm",
            disabled: !adminPermissions?.canCreate,
          },
        ]}
      />

      <div className="flex flex-col h-[calc(100vh-130px)] w-full px-2">
        {/* Filters */}
        <AdminFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />

        {/* Table Container - with horizontal scroll */}
        <div className="flex-1 border rounded-md w-full overflow-hidden">
          <div className="overflow-auto h-full border-b">
            <Table className="w-full relative">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="border-b">
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      {filters.sortBy === "name" ? (
                        filters.sortOrder === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronsUpDownIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {filters.sortBy === "email" ? (
                        filters.sortOrder === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronsUpDownIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Permissions</TableHead>
                  <TableHead className="font-semibold">
                    {isArchiveView ? (
                      "Archived Date"
                    ) : (
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                        onClick={() => handleSort("lastLogin")}
                      >
                        Last Login
                        {filters.sortBy === "lastLogin" ? (
                          filters.sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDownIcon className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {isArchiveView ? (
                      "Originally Created"
                    ) : (
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1"
                        onClick={() => handleSort("createdAt")}
                      >
                        Created
                        {filters.sortBy === "createdAt" ? (
                          filters.sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDownIcon className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </TableHead>
                  <TableHead className="text-right font-semibold"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8"
                    >
                      Loading admins...
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8"
                    >
                      No admins found
                    </TableCell>
                  </TableRow>
                ) : admins.length > 0 ? (
                  admins.map((admin) => {
                    return (
                      <TableRow key={admin._id}>
                        {/* Admin Info with Avatar */}
                        <TableCell className="">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {admin.profileImage?.url ? (
                                <AvatarImage
                                  src={
                                    admin.profileImage.url.startsWith("http")
                                      ? admin.profileImage.url
                                      : `${config.env.IMGURL}${admin.profileImage.url}`
                                  }
                                  alt={admin.profileImage.alt || admin.fullName}
                                />
                              ) : null}
                              <AvatarFallback>
                                {admin.firstName[0]}
                                {admin.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {admin.fullName}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                {getTempPasswordIndicator(admin.isTempPassword)}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell className="">
                          <span className="text-sm">{admin.email}</span>
                          {admin.phone && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {admin.phone}
                            </div>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="">
                          {getAdminStatusBadge(admin)}
                        </TableCell>

                        {/* Permissions */}
                        <TableCell className="">
                          {getPermissionBadge(
                            admin.permissionLevel,
                            admin.permissionPercentage,
                            admin._id,
                          )}
                        </TableCell>

                        {/* Last Login / Archive Date */}
                        <TableCell className="min-w-[150px]">
                          <span className="text-sm">
                            {isArchiveView && admin.updatedAt
                              ? format(
                                  new Date(admin.updatedAt),
                                  "MMM dd, yyyy 'at' HH:mm",
                                )
                              : admin.lastLogin
                              ? format(
                                  new Date(admin.lastLogin),
                                  "MMM dd, yyyy 'at' HH:mm",
                                )
                              : "Never"}
                          </span>
                        </TableCell>

                        {/* Created Date */}
                        <TableCell className="min-w-[120px]">
                          <span className="text-sm">
                            {format(new Date(admin.createdAt), "MMM dd, yyyy")}
                          </span>
                        </TableCell>

                        {/* Actions Dropdown */}
                        <TableCell className="">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {!isArchiveView ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleEditAdmin(admin._id)}
                                    disabled={!adminPermissions?.canEdit}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleManagePermissions(admin._id)
                                    }
                                    disabled={
                                      !adminPermissions?.canManagePermissions
                                    }
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Manage Permissions
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteAdmin(admin._id)}
                                    disabled={!adminPermissions?.canArchive}
                                    className="text-red-600"
                                  >
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive Admin
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRestoreAdmin(admin._id)
                                    }
                                    className="text-green-600"
                                    disabled={!adminPermissions?.canRestore}
                                  >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Restore Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handlePermanentDeleteAdmin(admin._id)
                                    }
                                    disabled={!adminPermissions?.canDelete}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Permanently
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8"
                    >
                      Something went wrong, please try again later.
                      {/* Refesh btn and dashboard btn */}
                      <div className="flex justify-center gap-4 mt-2">
                        <Button
                          variant="outline"
                          onClick={() => router.refresh()}
                        >
                          {" "}
                          Refresh
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => router.push(`/admin/dashboard`)}
                        >
                          Go to Dashboard
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Sticky Pagination */}
        <div className="bg-background sticky bottom-0 z-[10]">
          <AdminPagination
            currentPage={filters.page || 1}
            totalPages={totalPages}
            totalCount={totalCount}
            itemsPerPage={filters.limit || 10}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            isLoading={isLoading}
            itemName="admins"
          />
        </div>
      </div>

      {/* Modal Components */}
      <AdminFormModal
        mode={formModalMode}
        admin={selectedAdmin}
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isLoading={formModalMode === "edit" ? isUpdating : isCreating}
      />

      <ManagePermissionsModal
        admin={selectedAdmin}
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        onSubmit={handleManagePermissionsSubmit}
        isLoading={isUpdatingPermissions}
      />

      <DeleteAdminDialog
        admin={selectedAdmin}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAdminConfirm}
        mode={deleteDialogMode}
        isLoading={isDeleting}
      />
    </div>
  ) : (
    <div
      className="flex items-center justify-center"
      style={{ height: `calc(100vh - ${adminHeadersHeight}px)` }}
    >
      <div className="text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default SettingsAdminPage;
