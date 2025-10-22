import { ICategory } from "./category.types";
import { IImage, IMetadata } from "./common";

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: ICategory;
  // variations: IVariation[];
  images: IImage[];
  basePrice: number;
  discount?: number;
  stockQuantity: number;
  soldQuantity: number;
  sku: string;
  averageRating: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isPublished?: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seller: string;
  manufacturer?: string;
  tags?: string[];
  metadata?: IMetadata;
  warranty?: string;
  returnPolicy?: {
    available: boolean;
    policy: string;
  };
  replacementPolicy?: {
    available: boolean;
    policy: string;
  };
  createdBy: string;
  updatedBy: string;

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
