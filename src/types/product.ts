export type Product = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  dimensions?: string;
  features: string[];
  priceStartFrom: number;
  image?: string;
  isFeatured?: boolean;
};
