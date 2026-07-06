"use server";

import { revalidatePath } from "next/cache";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";

export type TutorialInputData = {
  slug: string;
  title: string;
  category: string;
  short_description: string;
  video_url?: string;
  is_active: boolean;
  order_index: number;
  steps: {
    step_number: number;
    title: string;
    description: string;
    highlight?: string;
  }[];
};

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
};

export async function createTutorialAction(data: TutorialInputData): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/tutorials`, {
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
        return { success: false, error: "Slug tutorial tersebut sudah digunakan. Gunakan slug lain." };
      }
      return { success: false, error: resJson.message || "Gagal menyimpan tutorial ke server." };
    }

    revalidatePath("/admin/tutorials");
    revalidatePath("/admin");
    revalidatePath("/tutorial");
    revalidatePath("/");
    return { success: true, message: "Tutorial baru berhasil dibuat!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}

export async function updateTutorialAction(id: string, data: TutorialInputData): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/tutorials/${id}`, {
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
        return { success: false, error: "Slug tutorial tersebut sudah digunakan." };
      }
      return { success: false, error: resJson.message || "Gagal memperbarui tutorial di server." };
    }

    revalidatePath("/admin/tutorials");
    revalidatePath("/admin");
    revalidatePath("/tutorial");
    revalidatePath("/");
    return { success: true, message: "Tutorial berhasil diperbarui!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}

export async function deleteTutorialAction(id: string): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/tutorials/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Tutorial sudah tidak ditemukan di server." };
      }
      return { success: false, error: "Gagal menghapus tutorial dari server." };
    }

    revalidatePath("/admin/tutorials");
    revalidatePath("/admin");
    revalidatePath("/tutorial");
    revalidatePath("/");
    return { success: true, message: "Tutorial berhasil dihapus!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}
