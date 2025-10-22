"use client";

import {
  formatSellerCommission,
  formatSellerDisplayName,
  formatSellerJoinDate,
  formatSellerStatus,
  getBulkActionConfirmMessage,
  getBulkActionLabel,
  getSellerStatusColor,
  getSortLabel,
} from "@/app/admin/(routes)/sellers/_helpers/sellerHelpers";
import { ISellerAdminItem, SellerBulkAction, SellerSortBy, SellerStatus } from "@/app/admin/(routes)/sellers/_types/seller.types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Package,
  Phone,
  RotateCcw,
  Shield,
  ShieldCheck,
  Star,
  StarOff,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SellerTableProps {
  sellers: ISellerAdminItem[];
  isLoading?: boolean;
  selectedIds: string[];
  onSelectionChange: (sellerId: string) => void;
  onSelectAll: (sellers: ISellerAdminItem[], checked: boolean) => void;
  isSelected: (sellerId: string) => boolean;
  isAllSelected: (sellers: ISellerAdminItem[]) => boolean;
  isSomeSelected: (sellers: ISellerAdminItem[]) => boolean;
  onSort: (sortBy: SellerSortBy) => void;
  sortBy?: SellerSortBy;
  sortOrder?: "asc" | "desc";
  onView: (seller: ISellerAdminItem) => void;
  onEdit: (seller: ISellerAdminItem) => void;
  onDelete: (sellerId: string) => void;
  onRestore?: (sellerId: string) => void;
  onToggleStatus?: (sellerId: string) => void;
  onToggleVerification?: (sellerId: string) => void;
  onToggleFeature?: (sellerId: string) => void;
  onBulkAction?: (action: SellerBulkAction) => void;
  showDeleted?: boolean;
  className?: string;
}

const StatusIcon = ({ status }: { status: SellerStatus }) => {
  switch (status) {
    case SellerStatus.ACTIVE:
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case SellerStatus.SUSPENDED:
      return <XCircle className="h-4 w-4 text-red-600" />;
    case SellerStatus.PENDING:
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case SellerStatus.REJECTED:
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case SellerStatus.INACTIVE:
      return <XCircle className="h-4 w-4 text-gray-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const SortIcon = ({ sortBy: currentSort, targetSort, sortOrder }: {
  sortBy?: SellerSortBy;
  targetSort: SellerSortBy;
  sortOrder?: "asc" | "desc";
}) => {
  if (currentSort !== targetSort) {
    return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
  }
  
  return sortOrder === "asc" ? (
    <ArrowUp className="h-4 w-4 text-primary" />
  ) : (
    <ArrowDown className="h-4 w-4 text-primary" />
  );
};

export function SellerTable({
  sellers,
  isLoading = false,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  isSelected,
  isAllSelected,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onDelete,
  onRestore,
  onToggleStatus,
  onToggleVerification,
  onToggleFeature,
  onBulkAction,
  showDeleted = false,
  className,
}: SellerTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (action: () => Promise<void> | void, sellerId?: string) => {
    if (sellerId) setActionLoading(sellerId);
    try {
      await action();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = (action: SellerBulkAction) => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one seller");
      return;
    }
    
    const confirmMessage = getBulkActionConfirmMessage(action, selectedIds.length);
    if (window.confirm(confirmMessage)) {
      onBulkAction?.(action);
    }
  };

  if (isLoading && sellers.length === 0) {
    return (
      <div className={cn("bg-white rounded-lg border", className)}>
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sellers...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && sellers.length === 0) {
    return (
      <div className={cn("bg-white rounded-lg border", className)}>
        <div className="p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No sellers found</h3>
          <p className="text-muted-foreground">
            {showDeleted ? "No deleted sellers found" : "No sellers match your current filters"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg border", className)}>
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && onBulkAction && (
        <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedIds.length} seller{selectedIds.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction(SellerBulkAction.ACTIVATE)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction(SellerBulkAction.SUSPEND)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Suspend
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction(SellerBulkAction.VERIFY)}>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction(SellerBulkAction.UNVERIFY)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Unverify
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction(SellerBulkAction.FEATURE)}>
                  <Star className="h-4 w-4 mr-2" />
                  Feature
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction(SellerBulkAction.UNFEATURE)}>
                  <StarOff className="h-4 w-4 mr-2" />
                  Unfeature
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {showDeleted ? (
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction(SellerBulkAction.RESTORE)}
                    className="text-green-600"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction(SellerBulkAction.DELETE)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected(sellers)}
                  onCheckedChange={(checked) => onSelectAll(sellers, !!checked)}
                />
              </TableHead>
              
              {/* Seller Info */}
              <TableHead className="min-w-[250px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort(SellerSortBy.STORE_NAME)}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Seller
                  <SortIcon sortBy={sortBy} targetSort={SellerSortBy.STORE_NAME} sortOrder={sortOrder} />
                </Button>
              </TableHead>

              {/* Status */}
              <TableHead>
                Status
              </TableHead>

              {/* Verification & Features */}
              <TableHead>
                Verification
              </TableHead>

              {/* Stats */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort(SellerSortBy.TOTAL_SALES)}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Sales
                  <SortIcon sortBy={sortBy} targetSort={SellerSortBy.TOTAL_SALES} sortOrder={sortOrder} />
                </Button>
              </TableHead>

              {/* Commission */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort(SellerSortBy.COMMISSION_RATE)}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Commission
                  <SortIcon sortBy={sortBy} targetSort={SellerSortBy.COMMISSION_RATE} sortOrder={sortOrder} />
                </Button>
              </TableHead>

              {/* Join Date */}
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort(SellerSortBy.CREATED_AT)}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Joined
                  <SortIcon sortBy={sortBy} targetSort={SellerSortBy.CREATED_AT} sortOrder={sortOrder} />
                </Button>
              </TableHead>

              {/* Actions */}
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller._id} className="group">
                {/* Selection */}
                <TableCell>
                  <Checkbox
                    checked={isSelected(seller._id)}
                    onCheckedChange={() => onSelectionChange(seller._id)}
                  />
                </TableCell>

                {/* Seller Info */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={seller.image?.url} alt={seller.storeName} />
                      <AvatarFallback>
                        {seller.storeName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{seller.storeName}</div>
                      <div className="text-sm text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {seller.contactEmail}
                      </div>
                      {seller.phoneNumber && (
                        <div className="text-sm text-muted-foreground truncate flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {seller.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* <StatusIcon status={seller.status} /> */}
                    <Badge variant={getSellerStatusColor(seller.status)}>
                      {formatSellerStatus(seller.status)}
                    </Badge>
                  </div>
                  {seller.isDeleted && (
                    <Badge variant="destructive" className="mt-1">
                      Deleted
                    </Badge>
                  )}
                </TableCell>

                {/* Verification & Features */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {seller.isVerified ? (
                        <Badge variant="default" className="text-xs">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                    </div>
                    {seller.isFeatured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {seller.isTopSeller && (
                      <Badge variant="default" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Top Seller
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Stats */}
                <TableCell className="text-right">
                  <div className="text-sm font-medium">
                    ${seller.totalSales.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    <Package className="h-3 w-3" />
                    {seller.totalProducts} products
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {seller.totalOrders} orders
                  </div>
                </TableCell>

                {/* Commission */}
                <TableCell className="text-right">
                  <div className="font-medium">
                    {formatSellerCommission(seller.commissionRate)}
                  </div>
                </TableCell>

                {/* Join Date */}
                <TableCell>
                  <div className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {formatSellerJoinDate(seller.joinedDate)}
                  </div>
                  {seller.lastActiveDate && (
                    <div className="text-xs text-muted-foreground">
                      Last active: {formatSellerJoinDate(seller.lastActiveDate)}
                    </div>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={actionLoading === seller._id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(seller)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(seller)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      {onToggleStatus && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onToggleStatus(seller._id), seller._id)}
                        >
                          {seller.status === SellerStatus.ACTIVE ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      )}

                      {onToggleVerification && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onToggleVerification(seller._id), seller._id)}
                        >
                          {seller.isVerified ? (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Verify
                            </>
                          )}
                        </DropdownMenuItem>
                      )}

                      {onToggleFeature && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onToggleFeature(seller._id), seller._id)}
                        >
                          {seller.isFeatured ? (
                            <>
                              <StarOff className="h-4 w-4 mr-2" />
                              Unfeature
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-2" />
                              Feature
                            </>
                          )}
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      
                      {seller.isDeleted && onRestore ? (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onRestore!(seller._id), seller._id)}
                          className="text-green-600"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore
                        </DropdownMenuItem>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Seller</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {formatSellerDisplayName(seller)}? 
                                This action can be undone later.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleAction(() => onDelete(seller._id), seller._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}