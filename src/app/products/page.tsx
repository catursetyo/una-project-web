import type { Metadata } from "next";
import { ProductCatalog } from "@/src/components/products/ProductCatalog";
import { getPublicProducts } from "@/src/lib/publicApi";

export const metadata: Metadata = {
  title: "Katalog Produk | UNA Project",
  description:
    "Katalog produk UNA Project untuk jam waktu sholat digital, running text LED, dan produk custom.",
};

export default async function ProductsPage() {
  const products = await getPublicProducts();
  const categories = Array.from(
    new Set(products.map((product) => product.category)),
  );

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="scroll-reveal max-w-3xl" data-scroll-reveal>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">
            Katalog Produk
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
            Pilih produk sesuai kebutuhan tempat Anda
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            Temukan pilihan JWS digital, running text, jam seven segment,
            Android TV, dan paket auto-murotal yang bisa disesuaikan dengan
            kebutuhan masjid, mushola, kantor, atau sekolah.
          </p>
        </div>

        <ProductCatalog products={products} categories={categories} />
      </div>
    </section>
  );
}
