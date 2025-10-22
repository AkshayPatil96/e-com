"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  ChevronDown,
  Download,
  Mail,
  ShieldCheck,
  Star,
  StarOff,
  Trash2,
  TrendingUp,
  UserCheck,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { SellerStatus } from "../_types/seller.types";

export interface BulkAction {
  type: 'activate' | 'suspend' | 'verify' | 'unverify' | 'feature' | 'unfeature' | 
        'makeTopSeller' | 'removeTopSeller' | 'delete' | 'restore' | 'export' | 
        'sendEmail' | 'changeStatus';
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive' | 'secondary';
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
  value?: string | number;
}

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: BulkAction) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const bulkActions: BulkAction[] = [
  {
    type: 'activate',
    label: 'Activate',
    icon: <UserCheck className="h-4 w-4" />,
    variant: 'default',
    requiresConfirmation: true,
    confirmationTitle: 'Activate Sellers',
    confirmationDescription: 'This will activate the selected sellers and they will be able to sell products.',
  },
  {
    type: 'suspend',
    label: 'Suspend',
    icon: <Ban className="h-4 w-4" />,
    variant: 'destructive',
    requiresConfirmation: true,
    confirmationTitle: 'Suspend Sellers',
    confirmationDescription: 'This will suspend the selected sellers and they will not be able to sell products.',
  },
  {
    type: 'verify',
    label: 'Verify',
    icon: <ShieldCheck className="h-4 w-4" />,
    variant: 'default',
    requiresConfirmation: true,
    confirmationTitle: 'Verify Sellers',
    confirmationDescription: 'This will mark the selected sellers as verified.',
  },
  {
    type: 'unverify',
    label: 'Unverify',
    icon: <ShieldCheck className="h-4 w-4" />,
    variant: 'secondary',
    requiresConfirmation: true,
    confirmationTitle: 'Unverify Sellers',
    confirmationDescription: 'This will remove verification status from the selected sellers.',
  },
  {
    type: 'feature',
    label: 'Make Featured',
    icon: <Star className="h-4 w-4" />,
    variant: 'default',
  },
  {
    type: 'unfeature',
    label: 'Remove Featured',
    icon: <StarOff className="h-4 w-4" />,
    variant: 'secondary',
  },
  {
    type: 'makeTopSeller',
    label: 'Make Top Seller',
    icon: <TrendingUp className="h-4 w-4" />,
    variant: 'default',
  },
  {
    type: 'removeTopSeller',
    label: 'Remove Top Seller',
    icon: <TrendingUp className="h-4 w-4" />,
    variant: 'secondary',
  },
  {
    type: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    requiresConfirmation: true,
    confirmationTitle: 'Delete Sellers',
    confirmationDescription: 'This action cannot be undone. This will permanently delete the selected sellers and all their data.',
  },
  {
    type: 'export',
    label: 'Export Data',
    icon: <Download className="h-4 w-4" />,
    variant: 'secondary',
  },
  {
    type: 'sendEmail',
    label: 'Send Email',
    icon: <Mail className="h-4 w-4" />,
    variant: 'secondary',
  },
];

const statusChangeActions: BulkAction[] = [
  {
    type: 'changeStatus',
    label: 'Active',
    icon: <UserCheck className="h-4 w-4" />,
    value: SellerStatus.ACTIVE,
    requiresConfirmation: true,
    confirmationTitle: 'Change Status to Active',
    confirmationDescription: 'This will change the status of selected sellers to Active.',
  },
  {
    type: 'changeStatus',
    label: 'Pending',
    icon: <AlertTriangle className="h-4 w-4" />,
    value: SellerStatus.PENDING,
    requiresConfirmation: true,
    confirmationTitle: 'Change Status to Pending',
    confirmationDescription: 'This will change the status of selected sellers to Pending.',
  },
  {
    type: 'changeStatus',
    label: 'Suspended',
    icon: <Ban className="h-4 w-4" />,
    value: SellerStatus.SUSPENDED,
    requiresConfirmation: true,
    confirmationTitle: 'Change Status to Suspended',
    confirmationDescription: 'This will change the status of selected sellers to Suspended.',
  },
  {
    type: 'changeStatus',
    label: 'Inactive',
    icon: <X className="h-4 w-4" />,
    value: SellerStatus.INACTIVE,
    requiresConfirmation: true,
    confirmationTitle: 'Change Status to Inactive',
    confirmationDescription: 'This will change the status of selected sellers to Inactive.',
  },
];

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onBulkAction,
  isLoading = false,
  className,
}: BulkActionsToolbarProps) {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleActionClick = async (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
      setIsConfirmOpen(true);
    } else {
      await onBulkAction(action);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmAction) {
      await onBulkAction(confirmAction);
      setIsConfirmOpen(false);
      setConfirmAction(null);
    }
  };

  const handleCancelAction = () => {
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className={`flex items-center justify-between bg-muted/50 border rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>{selectedCount} selected</span>
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleActionClick(bulkActions[0])} // Activate
              disabled={isLoading}
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Activate
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleActionClick(bulkActions[2])} // Verify
              disabled={isLoading}
            >
              <ShieldCheck className="h-4 w-4 mr-1" />
              Verify
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleActionClick(bulkActions[1])} // Suspend
              disabled={isLoading}
            >
              <Ban className="h-4 w-4 mr-1" />
              Suspend
            </Button>
          </div>

          {/* Status Change Dropdown */}
          <Select onValueChange={(value) => {
            const action = statusChangeActions.find(a => a.value === value);
            if (action) handleActionClick(action);
          }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              {statusChangeActions.map((action) => (
                <SelectItem key={`${action.type}-${action.value}`} value={action.value as string}>
                  <div className="flex items-center space-x-2">
                    {action.icon}
                    <span>{action.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                More Actions
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* Feature Actions */}
              <DropdownMenuItem onClick={() => handleActionClick(bulkActions[4])}>
                <Star className="h-4 w-4 mr-2" />
                Make Featured
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick(bulkActions[5])}>
                <StarOff className="h-4 w-4 mr-2" />
                Remove Featured
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Top Seller Actions */}
              <DropdownMenuItem onClick={() => handleActionClick(bulkActions[6])}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Make Top Seller
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick(bulkActions[7])}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Remove Top Seller
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Verification Actions */}
              <DropdownMenuItem onClick={() => handleActionClick(bulkActions[3])}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Remove Verification
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Export and Communication */}
              <DropdownMenuItem onClick={() => handleActionClick(bulkActions[9])}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick(bulkActions[10])}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Destructive Actions */}
              <DropdownMenuItem 
                onClick={() => handleActionClick(bulkActions[8])}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Sellers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {confirmAction?.icon}
              <span>{confirmAction?.confirmationTitle}</span>
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.confirmationDescription}
              <br />
              <strong>Selected sellers: {selectedCount}</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAction} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAction}
              disabled={isLoading}
              variant={confirmAction?.variant === 'destructive' ? 'destructive' : 'default'}
            >
              {isLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}