"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Ban,
  DollarSign,
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Package,
  Phone,
  Shield,
  ShieldCheck,
  Star,
  StarOff,
  Trash2,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import React, { useState } from "react";
import {
  ISellerAdminItem,
  ISellerSortConfig,
  SellerStatus,
} from "../_types/seller.types";
import { formatCurrency, formatDate } from "../_utils/sellerHelpers";

// Simple phone number formatting function
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  // For international or other formats, just return the original
  return phone;
};

interface SellerTableProps {
  sellers: ISellerAdminItem[];
  loading?: boolean;
  selectedSellers: string[];
  onSellerSelect: (sellerId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (seller: ISellerAdminItem) => void;
  onDelete: (seller: ISellerAdminItem) => void;
  onView: (seller: ISellerAdminItem) => void;
  onVerify: (seller: ISellerAdminItem) => void;
  onSuspend: (seller: ISellerAdminItem) => void;
  onActivate: (seller: ISellerAdminItem) => void;
  onToggleFeatured: (seller: ISellerAdminItem) => void;
  onToggleTopSeller: (seller: ISellerAdminItem) => void;
  sortConfig: ISellerSortConfig | null;
  onSort: (field: keyof ISellerAdminItem) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const getStatusBadgeVariant = (status: SellerStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case SellerStatus.ACTIVE:
      return "default";
    case SellerStatus.PENDING:
      return "secondary";
    case SellerStatus.SUSPENDED:
    case SellerStatus.REJECTED:
      return "destructive";
    case SellerStatus.INACTIVE:
      return "outline";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: SellerStatus) => {
  switch (status) {
    case SellerStatus.ACTIVE:
      return <UserCheck className="h-3 w-3" />;
    case SellerStatus.PENDING:
      return <Shield className="h-3 w-3" />;
    case SellerStatus.SUSPENDED:
      return <Ban className="h-3 w-3" />;
    case SellerStatus.REJECTED:
      return <Trash2 className="h-3 w-3" />;
    case SellerStatus.INACTIVE:
      return <Eye className="h-3 w-3" />;
    default:
      return null;
  }
};

export function SellerTable({
  sellers,
  loading = false,
  selectedSellers,
  onSellerSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
  onVerify,
  onSuspend,
  onActivate,
  onToggleFeatured,
  onToggleTopSeller,
  sortConfig,
  onSort,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: SellerTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const isAllSelected = sellers.length > 0 && selectedSellers.length === sellers.length;
  const isIndeterminate = selectedSellers.length > 0 && selectedSellers.length < sellers.length;

  const handleSort = (field: keyof ISellerAdminItem) => {
    onSort(field);
  };

  const getSortIcon = (field: keyof ISellerAdminItem) => {
    if (!sortConfig || sortConfig.field !== field) {
      return null;
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const renderActionMenu = (seller: ISellerAdminItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => onView(seller)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(seller)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Seller
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {seller.status === SellerStatus.PENDING && (
          <DropdownMenuItem onClick={() => onVerify(seller)}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verify Seller
          </DropdownMenuItem>
        )}
        
        {seller.status === SellerStatus.ACTIVE && (
          <DropdownMenuItem onClick={() => onSuspend(seller)}>
            <Ban className="mr-2 h-4 w-4" />
            Suspend Seller
          </DropdownMenuItem>
        )}
        
        {(seller.status === SellerStatus.SUSPENDED || seller.status === SellerStatus.INACTIVE) && (
          <DropdownMenuItem onClick={() => onActivate(seller)}>
            <UserCheck className="mr-2 h-4 w-4" />
            Activate Seller
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => onToggleFeatured(seller)}>
          {seller.isFeatured ? (
            <>
              <StarOff className="mr-2 h-4 w-4" />
              Remove Featured
            </>
          ) : (
            <>
              <Star className="mr-2 h-4 w-4" />
              Make Featured
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onToggleTopSeller(seller)}>
          {seller.isTopSeller ? (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Remove Top Seller
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Make Top Seller
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(seller)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Seller
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderSellerInfo = (seller: ISellerAdminItem) => (
    <div className="flex items-center space-x-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={seller.image?.url} alt={seller.storeName} />
        <AvatarFallback>
          {seller.storeName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">{seller.storeName}</span>
          {seller.isVerified && (
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          )}
          {seller.isFeatured && (
            <Star className="h-4 w-4 text-yellow-500" />
          )}
          {seller.isTopSeller && (
            <TrendingUp className="h-4 w-4 text-green-500" />
          )}
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <span>#{seller._id.slice(-6)}</span>
          <span>•</span>
          <span>{seller.userId ? `User: ${seller.userId.slice(-6)}` : "No user assigned"}</span>
        </div>
      </div>
    </div>
  );

  const renderContactInfo = (seller: ISellerAdminItem) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-1 text-sm">
        <Mail className="h-3 w-3 text-muted-foreground" />
        <span className="truncate">{seller.contactEmail}</span>
      </div>
      {seller.phoneNumber && (
        <div className="flex items-center space-x-1 text-sm">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span>{formatPhoneNumber(seller.phoneNumber)}</span>
        </div>
      )}
      {seller.addresses && seller.addresses.length > 0 && (
        <div className="flex items-center space-x-1 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="truncate">
            {seller.addresses[0].city}, {seller.addresses[0].country}
          </span>
        </div>
      )}
    </div>
  );

  const renderStats = (seller: ISellerAdminItem) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-1 text-sm">
        <Package className="h-3 w-3 text-muted-foreground" />
        <span>{seller.totalProducts || 0} products</span>
      </div>
      <div className="flex items-center space-x-1 text-sm">
        <DollarSign className="h-3 w-3 text-muted-foreground" />
        <span>{formatCurrency(seller.totalSales || 0)}</span>
      </div>
      <div className="flex items-center space-x-1 text-sm">
        <TrendingUp className="h-3 w-3 text-muted-foreground" />
        <span>{seller.totalOrders || 0} orders</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No sellers found</h3>
        <p className="text-muted-foreground">
          No sellers match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onSelectAll}
                    aria-label="Select all sellers"
                    className={isIndeterminate ? "data-[state=checked]:bg-primary/50" : ""}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("storeName")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Seller</span>
                    <span className="text-xs">{getSortIcon("storeName")}</span>
                  </div>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <span className="text-xs">{getSortIcon("status")}</span>
                  </div>
                </TableHead>
                <TableHead>Statistics</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("commissionRate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Commission</span>
                    <span className="text-xs">{getSortIcon("commissionRate")}</span>
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Joined</span>
                    <span className="text-xs">{getSortIcon("createdAt")}</span>
                  </div>
                </TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow
                  key={seller._id}
                  className={cn(
                    "hover:bg-muted/50",
                    selectedSellers.includes(seller._id) && "bg-muted/30",
                    hoveredRow === seller._id && "bg-muted/20"
                  )}
                  onMouseEnter={() => setHoveredRow(seller._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedSellers.includes(seller._id)}
                      onCheckedChange={() => onSellerSelect(seller._id)}
                      aria-label={`Select ${seller.storeName}`}
                    />
                  </TableCell>
                  <TableCell>{renderSellerInfo(seller)}</TableCell>
                  <TableCell>{renderContactInfo(seller)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(seller.status)}
                      className="inline-flex items-center space-x-1"
                    >
                      {getStatusIcon(seller.status)}
                      <span className="capitalize">{seller.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{renderStats(seller)}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {seller.commissionRate}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(seller.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>{renderActionMenu(seller)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to{" "}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount} sellers
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 w-16 rounded border border-input bg-background px-2 text-sm"
              aria-label="Select page size"
              title="Page size"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}