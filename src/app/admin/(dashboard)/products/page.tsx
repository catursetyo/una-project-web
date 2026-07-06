import type { Metadata } from "next";
import { getAdminCollection } from "@/src/lib/adminApi";
import { AdminProductsClient } from "@/src/components/admin/products/AdminProductsClient";
import type { ApiProduct } from "@/src/types/product";

export const metadata: Metadata = {
  title: "Manajemen Produk",
};

export default async function AdminProductsPage() {
  const products = await getAdminCollection<ApiProduct>("products");
  return <AdminProductsClient initialProducts={products} />;
}
