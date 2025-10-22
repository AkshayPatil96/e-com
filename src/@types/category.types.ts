import { IAttributes, IImage, IMetadata } from "./common";

export interface ICategory {
  _id: string;
  name: string;
  parent: string | null;
  ancestors: string[];
  attributes: IAttributes;
  metadata: IMetadata;
  isDeleted: boolean;
  images: IImage[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  path: string;
  __v: number;
  createdBy: string;
  updatedBy: string;
  order?: number;
  children?: ICategory[];
}
