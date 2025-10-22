"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Archive,
  LoaderCircle,
  RotateCcw,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Admin } from "../_types/admin.types";

type DeleteAdminDialogProps = {
  admin: Admin | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminId: string, confirmationText: string) => Promise<void>;
  mode: "archive" | "restore" | "permanent-delete";
  isLoading?: boolean;
};

export default function DeleteAdminDialog({
  admin,
  isOpen,
  onClose,
  onConfirm,
  mode,
  isLoading = false,
}: DeleteAdminDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  // Dynamic content based on mode
  const getDialogContent = () => {
    switch (mode) {
      case "archive":
        return {
          title: "Archive Admin",
          description:
            "This will archive the admin account. They will no longer be able to access the system, but their data will be preserved and they can be restored later.",
          icon: <Archive className="h-5 w-5 text-orange-500" />,
          expectedConfirmation: "ARCHIVE",
          buttonText: "Archive Admin",
          buttonVariant: "destructive" as const,
        };
      case "restore":
        return {
          title: "Restore Admin",
          description:
            "This will restore the admin account and they will regain access to the system with their previous permissions.",
          icon: <RotateCcw className="h-5 w-5 text-green-500" />,
          expectedConfirmation: "RESTORE",
          buttonText: "Restore Admin",
          buttonVariant: "default" as const,
        };
      case "permanent-delete":
        return {
          title: "Permanently Delete Admin",
          description:
            "This will permanently delete the admin account and all associated data. This action cannot be undone.",
          icon: <Trash2 className="h-5 w-5 text-red-500" />,
          expectedConfirmation: "DELETE PERMANENTLY",
          buttonText: "Delete Permanently",
          buttonVariant: "destructive" as const,
        };
      default:
        return {
          title: "Confirm Action",
          description: "Please confirm this action.",
          icon: <ShieldAlert className="h-5 w-5" />,
          expectedConfirmation: "CONFIRM",
          buttonText: "Confirm",
          buttonVariant: "destructive" as const,
        };
    }
  };

  const dialogContent = getDialogContent();
  const isConfirmationValid =
    confirmationText === dialogContent.expectedConfirmation;

  const handleConfirmDelete = async () => {
    if (!admin || !isConfirmationValid) return;

    setIsDeleting(true);
    try {
      await onConfirm(admin._id, confirmationText);
      onClose();
      setConfirmationText("");
    } catch (error) {
      console.error(`Failed to ${mode} admin:`, error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  // Calculate permission count for warning
  const getPermissionCount = () => {
    if (!admin) return 0;
    return Object.values(admin.permissions).reduce(
      (acc, module) => acc + Object.values(module).filter(Boolean).length,
      0,
    );
  };

  if (!admin) return null;

  const permissionCount = getPermissionCount();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dialogContent.icon}
            {dialogContent.title}
          </DialogTitle>
          <DialogDescription>{dialogContent.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Admin Information */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Admin Name:</span>
                <span className="text-sm">{admin.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{admin.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Permissions:</span>
                <Badge variant="outline">
                  {permissionCount} permissions granted
                </Badge>
              </div>
            </div>
          </div>

          {/* Warning Messages */}
          <div className="space-y-3">
            <Alert>
              {dialogContent.icon}
              <AlertDescription>
                <strong>Action Details:</strong>
                {mode === "archive" && (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Move the account to archived admins</li>
                    <li>Temporarily disable access to the system</li>
                    <li>Preserve all account data and permissions</li>
                    <li>Allow restoration from archived admins section</li>
                    {admin.canCreateAdmin && (
                      <li className="text-amber-600 font-medium">
                        Temporarily suspend admin creation privileges
                      </li>
                    )}
                  </ul>
                )}
                {mode === "restore" && (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Restore full access to the system</li>
                    <li>Reactivate all previous permissions</li>
                    <li>Remove from archived admins list</li>
                    {admin.canCreateAdmin && (
                      <li className="text-green-600 font-medium">
                        Restore admin creation privileges
                      </li>
                    )}
                  </ul>
                )}
                {mode === "permanent-delete" && (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li className="text-red-600">
                      Permanently delete all account data
                    </li>
                    <li className="text-red-600">
                      Remove all permissions and access
                    </li>
                    <li className="text-red-600">
                      This action cannot be undone
                    </li>
                    <li className="text-red-600">
                      All associated data will be lost
                    </li>
                  </ul>
                )}
              </AlertDescription>
            </Alert>

            {admin.canCreateAdmin &&
              (mode === "archive" || mode === "permanent-delete") && (
                <Alert>
                  <ShieldAlert className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High Privilege Account:</strong> This admin has the
                    ability to create new administrators.
                    {mode === "archive"
                      ? "The account can be restored later with all privileges intact."
                      : "This privilege will be permanently lost."}
                  </AlertDescription>
                </Alert>
              )}
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <strong>{dialogContent.expectedConfirmation}</strong> to
              confirm{" "}
              {mode === "archive"
                ? "archiving"
                : mode === "restore"
                ? "restoring"
                : "permanent deletion"}
              :
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type ${dialogContent.expectedConfirmation} here`}
              disabled={isDeleting || isLoading}
              autoComplete="off"
              className={
                confirmationText && !isConfirmationValid
                  ? "border-destructive"
                  : ""
              }
            />
            {confirmationText && !isConfirmationValid && (
              <p className="text-sm text-destructive">
                Please type &quot;{dialogContent.expectedConfirmation}&quot;
                exactly as shown.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant={dialogContent.buttonVariant}
            onClick={handleConfirmDelete}
            disabled={!isConfirmationValid || isDeleting || isLoading}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              dialogContent.buttonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
