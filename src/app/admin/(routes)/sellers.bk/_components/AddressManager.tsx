"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getData } from "country-list";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ISellerAddress, SellerFormValues } from "../_types/seller.types";

interface AddressManagerProps {
  form: UseFormReturn<SellerFormValues>;
  disabled?: boolean;
}

const AddressManager = ({ form, disabled = false }: AddressManagerProps) => {
  const [expandedAddress, setExpandedAddress] = useState<number | null>(0);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const countries = getData().map((country) => country.name);

  const addNewAddress = () => {
    const newAddress: ISellerAddress = {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      type: "business",
      isDefault: fields.length === 0, // First address is default
    };
    append(newAddress);
    setExpandedAddress(fields.length); // Expand the new address
  };

  const removeAddress = (index: number) => {
    // If removing default address, make the first remaining address default
    const addressToRemove = fields[index];
    if (addressToRemove.isDefault && fields.length > 1) {
      const remainingIndex = index === 0 ? 1 : 0;
      form.setValue(`addresses.${remainingIndex}.isDefault`, true);
    }
    remove(index);
    
    // Adjust expanded address index
    if (expandedAddress === index) {
      setExpandedAddress(null);
    } else if (expandedAddress !== null && expandedAddress > index) {
      setExpandedAddress(expandedAddress - 1);
    }
  };

  const setDefaultAddress = (index: number) => {
    // Set all addresses to non-default first
    fields.forEach((_, i) => {
      form.setValue(`addresses.${i}.isDefault`, false);
    });
    // Set the selected address as default
    form.setValue(`addresses.${index}.isDefault`, true);
  };

  const getAddressPreview = (address: ISellerAddress) => {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
    ].filter(Boolean);
    return parts.join(", ") || "Incomplete address";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Addresses</h3>
          <p className="text-xs text-muted-foreground">
            Manage seller business and contact addresses
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewAddress}
          disabled={disabled || fields.length >= 5} // Limit to 5 addresses
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {fields.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              No addresses added yet
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={addNewAddress}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Address
            </Button>
          </CardContent>
        </Card>
      )}

      {fields.map((field, index) => {
        const isExpanded = expandedAddress === index;
        const address = form.watch(`addresses.${index}`);

        return (
          <Card key={field.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-sm">
                    Address {index + 1}
                    {address?.isDefault && (
                      <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    {address?.type && (
                      <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded capitalize">
                        {address.type}
                      </span>
                    )}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedAddress(isExpanded ? null : index)
                    }
                    disabled={disabled}
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </Button>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAddress(index)}
                      disabled={disabled}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {!isExpanded && (
                <p className="text-xs text-muted-foreground">
                  {getAddressPreview(address)}
                </p>
              )}
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={disabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="shipping">Shipping</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.isDefault`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Default Address</FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Use as primary business address
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setDefaultAddress(index);
                              }
                            }}
                            disabled={disabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`addresses.${index}.street`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter street address"
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.city`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.state`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter state or province"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.country`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={disabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.zipCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP/Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter ZIP or postal code"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {fields.length >= 5 && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum of 5 addresses allowed
        </p>
      )}
    </div>
  );
};

export default AddressManager;