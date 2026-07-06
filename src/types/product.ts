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

export type ApiProductVariant = {
  id?: string;
  name: string;
  price: number;
  description?: string;
  order_index?: number;
};

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  dimensions?: string;
  features: string[];
  price_start_from: number;
  image_url?: string;
  video_url?: string;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  variants: ApiProductVariant[];
  created_at?: string;
  updated_at?: string;
};
