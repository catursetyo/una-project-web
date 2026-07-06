import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import type { Product, ApiProduct } from "@/src/types/product";
import type { Tutorial, ApiTutorial } from "@/src/types/tutorial";
import type { ApiTestimonial } from "@/src/types/testimonial";
import type { ApiOrderStep } from "@/src/types/orderStep";
import type { ApiWhatsAppTemplate } from "@/src/types/whatsappTemplate";
import { products as fallbackProducts } from "@/src/data/products";
import { tutorials as fallbackTutorials } from "@/src/data/tutorials";
import { testimonials as fallbackTestimonials, orderSteps as fallbackOrderSteps } from "@/src/data/landing";
import { createWhatsAppLink } from "@/src/lib/whatsapp";

function transformApiProduct(api: ApiProduct): Product {
  return {
    slug: api.slug,
    name: api.name,
    category: api.category,
    shortDescription: api.short_description,
    description: api.description,
    dimensions: api.dimensions,
    features: Array.isArray(api.features) ? api.features : [],
    priceStartFrom: api.price_start_from,
    image: api.image_url,
    videoUrl: api.video_url,
    isFeatured: api.is_featured,
    variants: (api.variants || []).map((v) => ({
      name: v.name,
      price: v.price,
      description: v.description,
    })),
  };
}

function transformApiTutorial(api: ApiTutorial): Tutorial {
  return {
    slug: api.slug,
    title: api.title,
    category: api.category,
    shortDescription: api.short_description,
    videoUrl: api.video_url,
    steps: (api.steps || []).map((s) => ({
      title: s.title,
      description: s.description,
      highlight: s.highlight,
    })),
  };
}

export async function getPublicProducts(): Promise<Product[]> {
  const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || process.env.API_URL);
  if (!apiUrl) return fallbackProducts;

  try {
    const res = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return fallbackProducts;
    const json = await res.json();
    if (json.success && json.data) {
      const items = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiProduct[];
      const activeItems = items.filter((item) => item.is_active !== false);
      if (activeItems.length > 0) {
        return activeItems.map(transformApiProduct);
      }
    }
  } catch (err) {
    console.error("[publicApi] Failed to fetch products from API, using fallback:", err);
  }
  return fallbackProducts;
}

export async function getPublicProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getPublicProducts();
  return products.find((p) => p.slug === slug);
}

export type PublicTestimonial = {
  title: string;
  description: string;
  imageAlt: string;
  rating?: number;
  customer?: string;
  role?: string;
  imageUrl?: string;
};

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || process.env.API_URL);
  if (!apiUrl) return fallbackTestimonials;

  try {
    const res = await fetch(`${apiUrl}/testimonials`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return fallbackTestimonials;
    const json = await res.json();
    if (json.success && json.data) {
      const items = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiTestimonial[];
      const activeItems = items.filter((item) => item.is_active !== false);
      if (activeItems.length > 0) {
        return activeItems.map((api) => ({
          title: api.title,
          description: api.description,
          imageAlt: api.customer || api.title,
          rating: api.rating,
          customer: api.customer,
          role: api.role,
          imageUrl: api.image_url,
        }));
      }
    }
  } catch (err) {
    console.error("[publicApi] Failed to fetch testimonials from API, using fallback:", err);
  }
  return fallbackTestimonials;
}

export async function getPublicTutorials(): Promise<Tutorial[]> {
  const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || process.env.API_URL);
  if (!apiUrl) return fallbackTutorials;

  try {
    const res = await fetch(`${apiUrl}/tutorials`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return fallbackTutorials;
    const json = await res.json();
    if (json.success && json.data) {
      const items = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiTutorial[];
      const activeItems = items.filter((item) => item.is_active !== false);
      if (activeItems.length > 0) {
        return activeItems.map(transformApiTutorial);
      }
    }
  } catch (err) {
    console.error("[publicApi] Failed to fetch tutorials from API, using fallback:", err);
  }
  return fallbackTutorials;
}

export type PublicOrderStep = {
  number: string;
  title: string;
  description: string;
};

export async function getPublicOrderSteps(): Promise<PublicOrderStep[]> {
  const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || process.env.API_URL);
  if (!apiUrl) return fallbackOrderSteps;

  try {
    const res = await fetch(`${apiUrl}/order-steps`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return fallbackOrderSteps;
    const json = await res.json();
    if (json.success && json.data) {
      const items = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiOrderStep[];
      const activeItems = items.filter((item) => item.is_active !== false);
      if (activeItems.length > 0) {
        return activeItems.map((s) => ({
          number: s.step_number,
          title: s.title,
          description: s.description,
        }));
      }
    }
  } catch (err) {
    console.error("[publicApi] Failed to fetch order steps from API, using fallback:", err);
  }
  return fallbackOrderSteps;
}

export async function getPublicWhatsAppTemplates(): Promise<ApiWhatsAppTemplate[]> {
  const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || process.env.API_URL);
  if (!apiUrl) return [];

  try {
    const res = await fetch(`${apiUrl}/whatsapp-templates`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.success && json.data) {
      const items = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiWhatsAppTemplate[];
      return items.filter((item) => item.is_active !== false);
    }
  } catch (err) {
    console.error("[publicApi] Failed to fetch whatsapp templates from API:", err);
  }
  return [];
}

export async function getDynamicWhatsAppLink(options?: {
  category?: string;
  productName?: string;
  price?: string | number;
}): Promise<string> {
  const templates = await getPublicWhatsAppTemplates();
  const cat = options?.category || "Konsultasi";

  let template = templates.find((t) => t.category === cat && t.is_default);
  if (!template) {
    template = templates.find((t) => t.category === cat);
  }
  if (!template && templates.length > 0) {
    template = templates[0];
  }

  if (template && template.message_pattern) {
    let msg = template.message_pattern;
    if (options?.productName) {
      msg = msg.replace(/\{product_name\}/g, options.productName);
    } else {
      msg = msg.replace(/\{product_name\}/g, "JWS UNA Project");
    }
    if (options?.price !== undefined) {
      msg = msg.replace(/\{price\}/g, String(options.price));
    } else {
      msg = msg.replace(/\{price\}/g, "");
    }
    if (options?.category) {
      msg = msg.replace(/\{category\}/g, options.category);
    }
    return `https://wa.me/6281234567890?text=${encodeURIComponent(msg.trim())}`;
  }

  return createWhatsAppLink(options?.productName);
}
