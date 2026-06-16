"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "@/src/components/ProductGrid";
import type { Product } from "@/src/types/product";

const allProductsLabel = "Semua Produk";

type ProductCatalogProps = {
  products: Product[];
  categories: string[];
};

export function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState(allProductsLabel);

  const filteredProducts = useMemo(() => {
    if (activeCategory === allProductsLabel) {
      return products;
    }

    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  useEffect(() => {
    window.dispatchEvent(new Event("scroll-reveal:refresh"));
  }, [activeCategory]);

  return (
    <>
      <div
        className="scroll-reveal mt-8"
        data-scroll-reveal
        data-scroll-delay={100}
      >
        <div className="flex flex-wrap gap-2.5">
          {[allProductsLabel, ...categories].map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`motion-button rounded-full border px-3 py-1.5 text-xs font-black tracking-[0.08em] transition-colors sm:px-4 sm:py-2 ${
                  isActive
                    ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                    : "border-primary/20 bg-white text-primary hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm font-semibold text-zinc-500">
          Menampilkan {filteredProducts.length} produk
          {activeCategory === allProductsLabel
            ? "."
            : ` untuk kategori ${activeCategory}.`}
        </p>
      </div>

      <div className="mt-8 sm:mt-10">
        <ProductGrid products={filteredProducts} />
      </div>
    </>
  );
}
