"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Plus, Upload } from "lucide-react";
import React, { useMemo, useState } from "react";

// Components
import { BulkActionsToolbar } from "./_components/BulkActionsToolbar";
import { SellerFilters } from "./_components/SellerFilters";
import { SellerForm } from "./_components/SellerForm";
import { SellerTable } from "./_components/SellerTable";

// Hooks
import { useSellerBulkActions } from "./_hooks/useSellerBulkActions";
import { useSellerFilters } from "./_hooks/useSellerFilters";

// API
import { useGetSellersQuery } from "@/redux/adminDashboard/seller/sellerApi";

// Types
import { ISellerAdminItem, SellerStatus } from "./_types/seller.types";

const SellersPage = () => {
  // State
  const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<ISellerAdminItem | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Hooks
  const {
    filters,
    updateFilters,
    resetFilters,
  } = useSellerFilters();

  const { isLoading: isBulkActionsLoading, handleBulkAction } = useSellerBulkActions({
    onSuccess: () => {
      setSelectedSellerIds([]);
    },
    onClearSelection: () => {
      setSelectedSellerIds([]);
    },
  });

  // API Query
  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean | string[]> = {
      page: 1,
      limit: 10,
      search: filters.search || '',
    };
    
    if (filters.status && filters.status.length > 0) {
      params.status = filters.status;
    }
    
    if (filters.isVerified !== undefined) {
      params.isVerified = filters.isVerified;
    }
    
    if (filters.isFeatured !== undefined) {
      params.isFeatured = filters.isFeatured;
    }
    
    return params;
  }, [filters]);

  const {
    data: sellersData,
    isLoading: isSellersLoading,
    isFetching: isSellersFetching,
    refetch: refetchSellers,
  } = useGetSellersQuery(queryParams);

  // Computed values
  const sellers = sellersData?.data || [];
  const pagination = {
    total: sellersData?.totalCount || 0,
    page: sellersData?.page || 1,
    limit: sellersData?.limit || 10,
    totalPages: sellersData?.totalPages || 1,
    hasMore: sellersData?.hasMore || false,
  };
  const isLoading = isSellersLoading || isSellersFetching;

  // Event handlers
  const handleEditSeller = (seller: ISellerAdminItem) => {
    setEditingSeller(seller);
  };

  const handleCreateSeller = () => {
    setIsCreateDialogOpen(true);
  };

  const handleFormClose = () => {
    setIsCreateDialogOpen(false);
    setEditingSeller(null);
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await refetchSellers();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update filters based on tab
    switch (tab) {
      case "active":
        updateFilters({ status: [SellerStatus.ACTIVE] });
        break;
      case "pending":
        updateFilters({ status: [SellerStatus.PENDING] });
        break;
      case "suspended":
        updateFilters({ status: [SellerStatus.SUSPENDED] });
        break;
      case "verified":
        updateFilters({ isVerified: true });
        break;
      case "featured":
        updateFilters({ isFeatured: true });
        break;
      default:
        updateFilters({ status: [], isVerified: undefined, isFeatured: undefined });
    }
  };

  const handleExportAll = () => {
    // Implementation for exporting all sellers
    console.log("Export all sellers");
  };

  const handleImportSellers = () => {
    // Implementation for importing sellers
    console.log("Import sellers");
  };

  // Stats for tabs (you would get these from API)
  const stats = {
    all: pagination?.total || 0,
    active: 0, // Would come from API
    pending: 0, // Would come from API
    suspended: 0, // Would come from API
    verified: 0, // Would come from API
    featured: 0, // Would come from API
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sellers</h1>
          <p className="text-muted-foreground">
            Manage seller accounts, verification status, and permissions
          </p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleImportSellers}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button onClick={handleCreateSeller}>
            <Plus className="mr-2 h-4 w-4" />
            Add Seller
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.all}</div>
            <p className="text-xs text-muted-foreground">All registered sellers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">Verified accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Featured on platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>
            Filter and search sellers based on various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SellerFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
            totalCount={pagination.total}
            filteredCount={sellers.length}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({stats.suspended})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({stats.verified})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({stats.featured})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Bulk Actions Toolbar */}
          {selectedSellerIds.length > 0 && (
            <BulkActionsToolbar
              selectedCount={selectedSellerIds.length}
              onBulkAction={(action) => handleBulkAction(action, selectedSellerIds)}
              isLoading={isBulkActionsLoading}
              onClearSelection={() => setSelectedSellerIds([])}
            />
          )}

          {/* Sellers Table */}
          <Card>
            <CardContent className="p-0">
              <SellerTable
                sellers={sellers}
                loading={isLoading}
                selectedSellers={selectedSellerIds}
                onSellerSelect={(sellerId) => {
                  setSelectedSellerIds(prev => 
                    prev.includes(sellerId) 
                      ? prev.filter(id => id !== sellerId)
                      : [...prev, sellerId]
                  );
                }}
                onSelectAll={(checked) => {
                  setSelectedSellerIds(checked ? sellers.map(s => s._id) : []);
                }}
                onEdit={handleEditSeller}
                onDelete={(seller) => console.log('Delete seller:', seller)}
                onView={(seller) => console.log('View seller:', seller)}
                onVerify={(seller) => console.log('Verify seller:', seller)}
                onSuspend={(seller) => console.log('Suspend seller:', seller)}
                onActivate={(seller) => console.log('Activate seller:', seller)}
                onToggleFeatured={(seller) => console.log('Toggle featured:', seller)}
                onToggleTopSeller={(seller) => console.log('Toggle top seller:', seller)}
                sortConfig={null}
                onSort={(field) => console.log('Sort by:', field)}
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalCount={pagination.total}
                pageSize={pagination.limit}
                onPageChange={(page) => {
                  console.log('Page changed to:', page);
                }}
                onPageSizeChange={(pageSize) => {
                  console.log('Page size changed to:', pageSize);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Seller Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Seller</DialogTitle>
          </DialogHeader>
          <Separator />
          <SellerForm
            onSubmit={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Seller Dialog */}
      <Dialog open={!!editingSeller} onOpenChange={(open) => !open && setEditingSeller(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Seller</DialogTitle>
          </DialogHeader>
          <Separator />
          <SellerForm
            seller={editingSeller || undefined}
            onSubmit={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellersPage;