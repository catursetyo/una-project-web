import { ProductGrid } from "@/src/components/ProductGrid";
import { products } from "@/src/data/products";

const featuredProducts = products.filter((product) => product.isFeatured);

export function FeaturedProductsSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Produk Unggulan
            </p>
            <h2 className="mt-3 text-3xl font-black text-zinc-950 sm:text-4xl">
              Pilihan produk UNA Project
            </h2>
          </div>
        </div>

        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
}
