export type ApiTestimonial = {
  id: string;
  title: string;
  description: string;
  rating: number;
  customer?: string;
  role?: string;
  image_url?: string;
  is_active: boolean;
  order_index: number;
  created_at?: string;
};
