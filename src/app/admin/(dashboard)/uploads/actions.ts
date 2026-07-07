"use server";

import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";

export async function uploadMediaAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  const token = await getVerifiedAdminToken();
  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!token || !apiUrl) {
    return { success: false, error: "Sesi atau API belum tersedia." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Pilih file gambar terlebih dahulu." };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) {
      return { success: false, error: payload.message || "Upload gambar gagal." };
    }
    return { success: true, url: payload.data?.url };
  } catch {
    return { success: false, error: "Gagal terhubung ke server upload." };
  }
}
