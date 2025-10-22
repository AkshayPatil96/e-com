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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetArchivedAdminsQuery,
  usePermanentlyDeleteAdminMutation,
  useRestoreAdminMutation
} from "@/redux/adminDashboard/admin/adminApi";
import { format } from "date-fns";
import {
  Archive,
  MoreHorizontal,
  RotateCcw,
  Search,
  Trash2,
  X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Admin } from "../_types/admin.types";

type ArchivedAdminsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ArchivedAdminsModal({
  isOpen,
  onClose,
}: ArchivedAdminsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: archivedAdminsList, isLoading } = useGetArchivedAdminsQuery({
    search: searchQuery,
    limit: 50, // Show more items in archive
  });

  const [restoreAdmin, { isLoading: isRestoring }] = useRestoreAdminMutation();
  const [permanentlyDeleteAdmin, { isLoading: isPermanentlyDeleting }] = usePermanentlyDeleteAdminMutation();

  const archivedAdmins: Admin[] = archivedAdminsList?.data || [];

  const handleRestore = async (adminId: string) => {
    try {
      await restoreAdmin(adminId).unwrap();
      toast.success("Admin restored successfully");
    } catch (error: unknown) {
      console.error("Failed to restore admin:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to restore admin";
      toast.error(errorMessage);
    }
  };

  const handlePermanentDelete = async (adminId: string) => {
    if (!confirm("Are you sure you want to permanently delete this admin? This action cannot be undone.")) {
      return;
    }

    try {
      await permanentlyDeleteAdmin(adminId).unwrap();
      toast.success("Admin permanently deleted");
    } catch (error: unknown) {
      console.error("Failed to permanently delete admin:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to permanently delete admin";
      toast.error(errorMessage);
    }
  };

  // Calculate total permissions for each admin
  const getTotalPermissions = (permissions: Admin["permissions"]) => {
    let total = 0;
    let granted = 0;

    Object.values(permissions).forEach((module) => {
      Object.values(module).forEach((permission) => {
        total++;
        if (permission) granted++;
      });
    });

    return { granted, total };
  };

  const getPermissionsBadgeVariant = (granted: number, total: number) => {
    const percentage = (granted / total) * 100;
    if (percentage === 0) return "destructive";
    if (percentage < 30) return "secondary";
    if (percentage < 70) return "default";
    return "default";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Admins
          </DialogTitle>
          <DialogDescription>
            View and manage archived administrator accounts. You can restore or permanently delete archived admins.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search archived admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Can Create Admin</TableHead>
                  <TableHead>Archived Date</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading archived admins...
                    </TableCell>
                  </TableRow>
                ) : archivedAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchQuery 
                        ? "No archived admins found matching your search" 
                        : "No archived admins found"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  archivedAdmins.map((admin) => {
                    const { granted, total } = getTotalPermissions(admin.permissions);
                    return (
                      <TableRow key={admin._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{admin.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ID: {admin._id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{admin.email}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPermissionsBadgeVariant(granted, total)}>
                            {granted}/{total} permissions
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.canCreateAdmin ? "default" : "secondary"}>
                            {admin.canCreateAdmin ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {admin.deletedAt 
                              ? format(new Date(admin.deletedAt), "MMM dd, yyyy 'at' HH:mm")
                              : "Unknown"
                            }
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleRestore(admin._id)}
                                disabled={isRestoring}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore Admin
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handlePermanentDelete(admin._id)}
                                className="text-red-600"
                                disabled={isPermanentlyDeleting}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-muted-foreground">
              {archivedAdmins.length} archived admin{archivedAdmins.length !== 1 ? 's' : ''} found
            </p>
            <Button onClick={onClose} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}