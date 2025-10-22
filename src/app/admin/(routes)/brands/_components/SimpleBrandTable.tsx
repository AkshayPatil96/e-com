/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { nameInitials } from "@/lib/utils";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { IBrandAdminItem } from "../_types/brand.types";

interface SimpleBrandTableProps {
  brands: IBrandAdminItem[];
  isLoading?: boolean;
  onEdit?: (brand: IBrandAdminItem) => void;
  onDelete?: (brandId: string) => void;
}

export const SimpleBrandTable = ({
  brands,
  isLoading = false,
  onEdit,
  onDelete,
}: SimpleBrandTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="h-32 flex items-center justify-center">
          <p className="text-muted-foreground">Loading brands...</p>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="h-32 flex items-center justify-center">
          <p className="text-muted-foreground">No brands found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand: any) => (
            <TableRow key={brand._id}>
              <TableCell className="font-medium flex items-center">
                {brand.logo ? (
                  <Image
                    src={brand.logo?.url}
                    alt={brand.name}
                    width={40}
                    height={40}
                    className="inline-block mr-2 h-10 w-10 rounded-md object-contain border shadow-sm"
                  />
                ) : (
                  <div className="mr-2 h-10 w-10 rounded-md object-contain text-lg text-placeholder border shadow-sm flex items-center justify-center">
                    {brand?.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{brand.name}</p>
                  <p className="text-sm text-muted-foreground">/{brand.slug}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={brand.isActive ? "default" : "secondary"}>
                  {brand.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={brand.isFeatured ? "default" : "outline"}>
                  {brand.isFeatured ? "Featured" : "Standard"}
                </Badge>
              </TableCell>
              <TableCell>{brand.analytics?.productCount || 0}</TableCell>
              <TableCell>{brand.createdByName}</TableCell>
              <TableCell>
                {new Date(brand.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(brand)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(brand._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
