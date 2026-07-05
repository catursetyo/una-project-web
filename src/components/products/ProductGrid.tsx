import { ProductCard } from "@/src/components/products/ProductCard";
import type { Product } from "@/src/types/product";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.slug}
          product={product}
          revealDelay={(index % 5) * 80}
        />
      ))}
    </div>
  );
}
