import {
  useBulkActionSellersMutation,
} from "@/redux/adminDashboard/seller/sellerApi";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { BulkAction } from "../_components/BulkActionsToolbar";
import { ISellerBulkActionBody, SellerBulkAction, SellerStatus } from "../_types/seller.types";

interface UseSellerBulkActionsOptions {
  onSuccess?: (action: BulkAction, affectedIds: string[]) => void;
  onError?: (error: string, action: BulkAction) => void;
  onClearSelection?: () => void;
}

interface UseSellerBulkActionsReturn {
  isLoading: boolean;
  handleBulkAction: (action: BulkAction, selectedIds: string[]) => Promise<void>;
  errors: Record<string, string>;
  clearErrors: () => void;
}

// Map BulkAction types to SellerBulkAction enum
function mapBulkActionToSellerBulkAction(action: BulkAction): SellerBulkAction | null {
  const actionMap: Record<string, SellerBulkAction> = {
    'activate': SellerBulkAction.ACTIVATE,
    'suspend': SellerBulkAction.SUSPEND,
    'verify': SellerBulkAction.VERIFY,
    'unverify': SellerBulkAction.UNVERIFY,
    'feature': SellerBulkAction.FEATURE,
    'unfeature': SellerBulkAction.UNFEATURE,
    'delete': SellerBulkAction.DELETE,
    'restore': SellerBulkAction.RESTORE,
  };

  return actionMap[action.type] || null;
}

export function useSellerBulkActions(options: UseSellerBulkActionsOptions = {}): UseSellerBulkActionsReturn {
  const { onSuccess, onError, onClearSelection } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // RTK Query mutations
  const [bulkActionSellers] = useBulkActionSellersMutation();

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const addError = useCallback((actionType: string, message: string) => {
    setErrors(prev => ({ ...prev, [actionType]: message }));
  }, []);

  const handleBulkAction = useCallback(async (action: BulkAction, selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error("No sellers selected");
      return;
    }

    setIsLoading(true);
    clearErrors();

    try {
      // Handle actions that use the API
      const apiAction = mapBulkActionToSellerBulkAction(action);
      
      if (apiAction) {
        const body: ISellerBulkActionBody = {
          sellerIds: selectedIds,
          action: apiAction,
        };
        
        await bulkActionSellers(body).unwrap();
        toast.success(`${selectedIds.length} seller(s) ${action.label.toLowerCase()} successfully`);
      } else {
        // Handle special actions that don't use the API directly
        switch (action.type) {
          case 'makeTopSeller':
            // This would need a separate API endpoint for top seller functionality
            toast.info(`Top seller functionality for ${selectedIds.length} seller(s) (API needed)`);
            break;

          case 'removeTopSeller':
            // This would need a separate API endpoint for top seller functionality
            toast.info(`Remove top seller functionality for ${selectedIds.length} seller(s) (API needed)`);
            break;

          case 'changeStatus':
            if (!action.value) {
              throw new Error("Status value is required");
            }
            // This would need a separate status change API
            toast.info(`Status change to ${action.value} for ${selectedIds.length} seller(s) (API needed)`);
            break;

          case 'export':
            // Handle export functionality
            toast.info(`Export functionality for ${selectedIds.length} seller(s) (API needed)`);
            // In a real implementation, you would call an export API
            break;

          case 'sendEmail':
            // Handle email functionality
            toast.info(`Email composition opened for ${selectedIds.length} seller(s)`);
            // In a real implementation, you might open a modal or navigate to email page
            break;

          default:
            throw new Error(`Unknown action type: ${action.type}`);
        }
      }

      // Call success callback
      onSuccess?.(action, selectedIds);
      
      // Clear selection after successful action
      onClearSelection?.();

    } catch (error: unknown) {
      let errorMessage = "An error occurred";
      
      if (error && typeof error === 'object') {
        if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
          errorMessage = error.data.message as string;
        } else if ('message' in error) {
          errorMessage = error.message as string;
        }
      }
      
      console.error(`Bulk action ${action.type} failed:`, error);
      addError(action.type, errorMessage);
      toast.error(`Failed to ${action.label.toLowerCase()}: ${errorMessage}`);
      
      // Call error callback
      onError?.(errorMessage, action);
    } finally {
      setIsLoading(false);
    }
  }, [
    bulkActionSellers,
    onSuccess,
    onError,
    onClearSelection,
    clearErrors,
    addError,
  ]);

  return {
    isLoading,
    handleBulkAction,
    errors,
    clearErrors,
  };
}

// Utility function to validate bulk action
export function validateBulkAction(action: BulkAction, selectedIds: string[]): string | null {
  if (selectedIds.length === 0) {
    return "No sellers selected";
  }

  // Add specific validations for different actions
  switch (action.type) {
    case 'changeStatus':
      if (!action.value) {
        return "Status value is required";
      }
      if (!Object.values(SellerStatus).includes(action.value as SellerStatus)) {
        return "Invalid status value";
      }
      break;

    case 'export':
      if (selectedIds.length > 1000) {
        return "Cannot export more than 1000 sellers at once";
      }
      break;

    case 'delete':
      if (selectedIds.length > 100) {
        return "Cannot delete more than 100 sellers at once";
      }
      break;

    default:
      break;
  }

  return null;
}

// Utility function to get action confirmation message
export function getActionConfirmationMessage(action: BulkAction, count: number): string {
  const baseMessages: Record<string, string> = {
    activate: `activate ${count} seller(s)`,
    suspend: `suspend ${count} seller(s)`,
    verify: `verify ${count} seller(s)`,
    unverify: `remove verification from ${count} seller(s)`,
    feature: `feature ${count} seller(s)`,
    unfeature: `remove featured status from ${count} seller(s)`,
    makeTopSeller: `mark ${count} seller(s) as top sellers`,
    removeTopSeller: `remove top seller status from ${count} seller(s)`,
    delete: `permanently delete ${count} seller(s)`,
    restore: `restore ${count} seller(s)`,
    export: `export data for ${count} seller(s)`,
    sendEmail: `send email to ${count} seller(s)`,
    changeStatus: `change status for ${count} seller(s)`,
  };

  return baseMessages[action.type] || `perform ${action.label.toLowerCase()} on ${count} seller(s)`;
}