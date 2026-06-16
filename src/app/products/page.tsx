import type { Metadata } from "next";
import { ProductGrid } from "@/src/components/ProductGrid";
import { products } from "@/src/data/products";

export const metadata: Metadata = {
  title: "Katalog Produk | UNA Project",
  description:
    "Katalog produk UNA Project untuk jam waktu sholat digital, running text LED, dan produk custom.",
};

const categories = Array.from(
  new Set(products.map((product) => product.category)),
);

export default function ProductsPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-fade-up max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Katalog Produk
          </p>
          <h1 className="mt-4 text-4xl font-black text-zinc-950 sm:text-5xl">
            Pilih produk sesuai kebutuhan tempat Anda
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-600">
            Halaman ini menampilkan daftar produk awal UNA Project. Data produk
            masih bisa kamu edit langsung dari file data sebelum nanti kita
            lanjut ke halaman detail.
          </p>
        </div>

        <div className="animate-fade-up animate-delay-100 mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="motion-card rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-bold tracking-[0.14em] text-primary"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
