export type ApiTestimonial = {
  id: string;
  title: string;
  description: string;
  rating: number;
  image_url?: string;
  image_alt: string;
  role_location?: string;
  is_active: boolean;
  order_index: number;
  created_at?: string;
};
