"use server";

import { revalidatePath } from "next/cache";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";

export type ProductInputData = {
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
  variants: {
    name: string;
    price: number;
    description?: string;
    order_index: number;
  }[];
};

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
};

export async function createProductAction(data: ProductInputData): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 422) {
        return {
          success: false,
          error: "Periksa kembali input form anda.",
          errors: resJson.errors as Record<string, string>,
        };
      }
      if (response.status === 409) {
        return { success: false, error: "Slug produk tersebut sudah digunakan. Gunakan slug lain." };
      }
      return { success: false, error: resJson.message || "Gagal menyimpan produk ke server." };
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Produk baru berhasil dibuat!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}

export async function updateProductAction(id: string, data: ProductInputData): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 422) {
        return {
          success: false,
          error: "Periksa kembali input form anda.",
          errors: resJson.errors as Record<string, string>,
        };
      }
      if (response.status === 409) {
        return { success: false, error: "Slug produk tersebut sudah digunakan." };
      }
      return { success: false, error: resJson.message || "Gagal memperbarui produk di server." };
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Produk berhasil diperbarui!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Produk sudah tidak ditemukan di server." };
      }
      return { success: false, error: "Gagal menghapus produk dari server." };
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Produk berhasil dihapus!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}
