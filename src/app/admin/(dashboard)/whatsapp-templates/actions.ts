"use server";

import { revalidatePath } from "next/cache";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";

export type WhatsAppTemplateInputData = {
  template_name: string;
  category: string;
  message_pattern: string;
  is_default: boolean;
  is_active: boolean;
};

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
};

export async function createWhatsAppTemplateAction(data: WhatsAppTemplateInputData): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/whatsapp-templates`, {
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
        return { success: false, error: "Nama template tersebut sudah digunakan. Gunakan nama lain." };
      }
      return { success: false, error: resJson.message || "Gagal menyimpan template WhatsApp ke server." };
    }

    revalidatePath("/admin/whatsapp-templates");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/order");
    revalidatePath("/products/[slug]", "page");
    return { success: true, message: "Template WhatsApp baru berhasil dibuat!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}

export async function updateWhatsAppTemplateAction(id: string, data: WhatsAppTemplateInputData): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/whatsapp-templates/${id}`, {
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
        return { success: false, error: "Nama template tersebut sudah digunakan." };
      }
      return { success: false, error: resJson.message || "Gagal memperbarui template WhatsApp di server." };
    }

    revalidatePath("/admin/whatsapp-templates");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/order");
    revalidatePath("/products/[slug]", "page");
    return { success: true, message: "Template WhatsApp berhasil diperbarui!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}

export async function deleteWhatsAppTemplateAction(id: string): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/whatsapp-templates/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Template WhatsApp sudah tidak ditemukan di server." };
      }
      return { success: false, error: "Gagal menghapus template WhatsApp dari server." };
    }

    revalidatePath("/admin/whatsapp-templates");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/order");
    revalidatePath("/products/[slug]", "page");
    return { success: true, message: "Template WhatsApp berhasil dihapus!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}
