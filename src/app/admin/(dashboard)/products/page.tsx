import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";
import { AdminProductsClient } from "@/src/components/admin/products/AdminProductsClient";
import type { ApiProduct } from "@/src/types/product";

export const metadata: Metadata = {
  title: "Manajemen Produk",
};

export default async function AdminProductsPage() {
  const token = await getVerifiedAdminToken();
  if (!token) {
    redirect("/admin/login");
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  let products: ApiProduct[] = [];

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.items) {
          products = json.data.items as ApiProduct[];
        }
      }
    } catch (err) {
      // If backend is unreachable or errors, we pass an empty array so UI still renders gracefully
      console.error("[AdminProductsPage] Failed to fetch products from API:", err);
    }
  }

  return <AdminProductsClient initialProducts={products} />;
}
