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
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="scroll-reveal max-w-3xl" data-scroll-reveal>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">
            Katalog Produk
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
            Pilih produk sesuai kebutuhan tempat Anda
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            Halaman ini menampilkan daftar produk awal UNA Project. Data produk
            masih bisa kamu edit langsung dari file data sebelum nanti kita
            lanjut ke halaman detail.
          </p>
        </div>

        <div
          className="scroll-reveal mt-8 flex flex-wrap gap-3"
          data-scroll-reveal
          data-scroll-delay={100}
        >
          {categories.map((category) => (
            <span
              key={category}
              className="motion-card rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-black tracking-[0.1em] text-primary sm:px-4 sm:py-2 sm:text-sm"
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
