export interface IMetadata {
  _id: string;
  title?: string;
  description?: string;
  keywords?: string[];
  images?: string[];
}

export interface IAttributes {
  [key: string]: string;
}

export interface IImage {
  url: string;
  alt: string;
  caption?: string;
  isPrimary?: boolean;
}
