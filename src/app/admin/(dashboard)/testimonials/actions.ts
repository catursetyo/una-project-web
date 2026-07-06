"use server";

import { revalidatePath } from "next/cache";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";

export type TestimonialInputData = {
  title: string;
  description: string;
  rating: number;
  image_url?: string;
  image_alt: string;
  role_location?: string;
  is_active: boolean;
  order_index: number;
};

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
};

export async function createTestimonialAction(data: TestimonialInputData): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/testimonials`, {
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
      return { success: false, error: resJson.message || "Gagal menyimpan testimoni ke server." };
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Testimoni baru berhasil dibuat!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}

export async function updateTestimonialAction(id: string, data: TestimonialInputData): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/testimonials/${id}`, {
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
      return { success: false, error: resJson.message || "Gagal memperbarui testimoni di server." };
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Testimoni berhasil diperbarui!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}

export async function deleteTestimonialAction(id: string): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Testimoni sudah tidak ditemukan di server." };
      }
      return { success: false, error: "Gagal menghapus testimoni dari server." };
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Testimoni berhasil dihapus!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}
