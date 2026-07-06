"use server";

import { revalidatePath } from "next/cache";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";

export type OrderStepInputData = {
  step_number: string;
  title: string;
  description: string;
  icon_name: string;
  is_active: boolean;
  order_index: number;
};

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
};

export async function replaceAllOrderStepsAction(steps: OrderStepInputData[]): Promise<ActionResponse> {
  const token = await getVerifiedAdminToken();
  if (!token) {
    return { success: false, error: "Sesi admin berakhir atau tidak valid. Silakan login ulang." };
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) {
    return { success: false, error: "Konfigurasi API_URL belum diatur di server." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/order-steps`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ steps }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 422) {
        return {
          success: false,
          error: "Periksa kembali input langkah pemesanan anda.",
          errors: resJson.errors as Record<string, string>,
        };
      }
      return { success: false, error: resJson.message || "Gagal menyimpan urutan alur pemesanan ke server." };
    }

    revalidatePath("/admin/order-steps");
    revalidatePath("/admin");
    revalidatePath("/order");
    return { success: true, message: "Urutan alur pemesanan berhasil diperbarui!" };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend." };
  }
}
