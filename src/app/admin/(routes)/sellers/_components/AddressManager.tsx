"use client";

import { useState } from "react";
import { ISellerAddress, AddressType } from "@/app/admin/(routes)/sellers/_types/seller.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressManagerProps {
  addresses: ISellerAddress[];
  onChange: (addresses: ISellerAddress[]) => void;
  error?: string;
  disabled?: boolean;
  maxAddresses?: number;
  className?: string;
}

interface AddressFormData {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  type: AddressType;
  isDefault: boolean;
}

const defaultAddressForm: AddressFormData = {
  street: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  type: AddressType.BUSINESS,
  isDefault: false,
};

const addressTypeLabels: Record<AddressType, string> = {
  [AddressType.BUSINESS]: "Business",
  [AddressType.BILLING]: "Billing",
  [AddressType.SHIPPING]: "Shipping",
};

const addressTypeColors: Record<AddressType, "default" | "secondary" | "destructive" | "outline"> = {
  [AddressType.BUSINESS]: "default",
  [AddressType.BILLING]: "secondary",
  [AddressType.SHIPPING]: "outline",
};

export function AddressManager({
  addresses = [],
  onChange,
  error,
  disabled = false,
  maxAddresses = 5,
  className,
}: AddressManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(defaultAddressForm);
  const [isAdding, setIsAdding] = useState(false);

  // Validation
  const validateAddress = (address: AddressFormData): string[] => {
    const errors: string[] = [];
    
    if (!address.street.trim()) errors.push("Street address is required");
    if (!address.city.trim()) errors.push("City is required");
    if (!address.state.trim()) errors.push("State is required");
    if (!address.country.trim()) errors.push("Country is required");
    if (!address.zipCode.trim()) errors.push("ZIP code is required");
    
    // ZIP code format validation (basic)
    if (address.zipCode && !/^\d{5}(-\d{4})?$/.test(address.zipCode.trim())) {
      errors.push("Invalid ZIP code format (use 12345 or 12345-6789)");
    }
    
    return errors;
  };

  // Add new address
  const handleAddAddress = () => {
    if (addresses.length >= maxAddresses) {
      return;
    }
    
    setFormData({
      ...defaultAddressForm,
      isDefault: addresses.length === 0, // First address is default
    });
    setIsAdding(true);
    setEditingIndex(null);
  };

  // Edit existing address
  const handleEditAddress = (index: number) => {
    const address = addresses[index];
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      type: address.type || AddressType.BUSINESS,
      isDefault: address.isDefault || false,
    });
    setEditingIndex(index);
    setIsAdding(false);
  };

  // Save address (add or update)
  const handleSaveAddress = () => {
    const validationErrors = validateAddress(formData);
    if (validationErrors.length > 0) {
      // In a real app, you'd show these errors
      console.error("Validation errors:", validationErrors);
      return;
    }

    const newAddress: ISellerAddress = {
      id: editingIndex !== null ? addresses[editingIndex].id : `addr_${Date.now()}`,
      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      zipCode: formData.zipCode.trim(),
      type: formData.type,
      isDefault: formData.isDefault,
    };

    let updatedAddresses: ISellerAddress[];

    if (editingIndex !== null) {
      // Update existing address
      updatedAddresses = addresses.map((addr, index) =>
        index === editingIndex ? newAddress : addr
      );
    } else {
      // Add new address
      updatedAddresses = [...addresses, newAddress];
    }

    // If this address is set as default, unset others
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === newAddress.id,
      }));
    }

    // Ensure at least one address is default if there are addresses
    if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }

    onChange(updatedAddresses);
    handleCancelEdit();
  };

  // Delete address
  const handleDeleteAddress = (index: number) => {
    const addressToDelete = addresses[index];
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    
    // If we deleted the default address, make the first remaining address default
    if (addressToDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    onChange(updatedAddresses);
  };

  // Set address as default
  const handleSetDefault = (index: number) => {
    const updatedAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    onChange(updatedAddresses);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setFormData(defaultAddressForm);
    setEditingIndex(null);
    setIsAdding(false);
  };

  // Update form data
  const updateFormData = (field: keyof AddressFormData, value: string | boolean | AddressType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format address for display
  const formatAddress = (address: ISellerAddress): string => {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">Addresses</Label>
          <p className="text-sm text-muted-foreground">
            Manage business, billing, and shipping addresses ({addresses.length}/{maxAddresses})
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddAddress}
          disabled={disabled || addresses.length >= maxAddresses || isAdding || editingIndex !== null}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Existing Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address, index) => (
            <Card key={address.id || index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm">
                      {addressTypeLabels[address.type || AddressType.BUSINESS]}
                    </CardTitle>
                    <Badge variant={addressTypeColors[address.type || AddressType.BUSINESS]}>
                      {addressTypeLabels[address.type || AddressType.BUSINESS]}
                    </Badge>
                    {address.isDefault && (
                      <Badge variant="default" className="gap-1">
                        <Star className="h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!address.isDefault && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(index)}
                        disabled={disabled}
                        className="text-xs"
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(index)}
                      disabled={disabled || editingIndex !== null || isAdding}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(index)}
                      disabled={disabled || addresses.length === 1}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {formatAddress(address)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Address Form (Add/Edit) */}
      {(isAdding || editingIndex !== null) && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">
              {editingIndex !== null ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address Type */}
            <div className="space-y-2">
              <Label htmlFor="address-type">Address Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: AddressType) => updateFormData("type", value)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AddressType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {addressTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="address-street">Street Address *</Label>
              <Input
                id="address-street"
                placeholder="123 Main Street"
                value={formData.street}
                onChange={(e) => updateFormData("street", e.target.value)}
                disabled={disabled}
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address-city">City *</Label>
                <Input
                  id="address-city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-state">State *</Label>
                <Input
                  id="address-state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-zip">ZIP Code *</Label>
                <Input
                  id="address-zip"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="address-country">Country *</Label>
              <Input
                id="address-country"
                placeholder="United States"
                value={formData.country}
                onChange={(e) => updateFormData("country", e.target.value)}
                disabled={disabled}
              />
            </div>

            {/* Default Address Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="address-default"
                checked={formData.isDefault}
                onCheckedChange={(checked) => updateFormData("isDefault", checked)}
                disabled={disabled}
              />
              <Label htmlFor="address-default">Set as default address</Label>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                onClick={handleSaveAddress}
                disabled={disabled}
                size="sm"
              >
                {editingIndex !== null ? "Update Address" : "Add Address"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={disabled}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {addresses.length === 0 && !isAdding && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No addresses added</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add business, billing, or shipping addresses for this seller
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAddress}
              disabled={disabled}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Address
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}