type ProductVariant = {
  name: string;
  price: number;
  description?: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  dimensions?: string;
  features: string[];
  priceStartFrom: number;
  variants?: ProductVariant[];
  image?: string;
  videoUrl?: string;
  isFeatured?: boolean;
};
