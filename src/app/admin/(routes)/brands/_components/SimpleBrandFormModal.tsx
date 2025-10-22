"use client";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IBrandAdminItem, IBrandFormData } from "../_types/brand.types";

interface SimpleBrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: IBrandAdminItem;
  onSubmit: (data: IBrandFormData) => Promise<void>;
  isLoading?: boolean;
}

export const SimpleBrandFormModal = ({
  isOpen,
  onClose,
  brand,
  onSubmit,
  isLoading = false,
}: SimpleBrandFormModalProps) => {
  const [formData, setFormData] = useState<IBrandFormData>({
    name: "",
    description: "",
    isActive: true,
    isFeatured: false,
  });

  const isEditing = !!brand;

  // Reset form when modal opens/closes or brand changes
  useEffect(() => {
    if (isOpen && brand) {
      setFormData({
        name: brand.name,
        description: brand.description || "",
        isActive: brand.isActive,
        isFeatured: brand.isFeatured || false,
      });
    } else if (isOpen && !brand) {
      setFormData({
        name: "",
        description: "",
        isActive: true,
        isFeatured: false,
      });
    }
  }, [isOpen, brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      await onSubmit(formData);
      toast.success(isEditing ? "Brand updated successfully" : "Brand created successfully");
      onClose();
    } catch {
      toast.error(isEditing ? "Failed to update brand" : "Failed to create brand");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Brand" : "Create New Brand"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the brand information below."
              : "Add a new brand to your store."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name *</Label>
            <Input
              id="name"
              placeholder="Enter brand name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter brand description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Active brands are visible to customers
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* Featured Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Featured Brand</Label>
              <p className="text-sm text-muted-foreground">
                Featured brands appear prominently in listings
              </p>
            </div>
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Brand" : "Create Brand"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};