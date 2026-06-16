import { ProductCard } from "@/src/components/ProductCard";
import type { Product } from "@/src/types/product";

type ProductGridProps = {
  products: Product[];
};

const staggerDelayClasses = [
  "animate-delay-100",
  "animate-delay-200",
  "animate-delay-300",
  "animate-delay-400",
  "animate-delay-500",
];

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.slug}
          product={product}
          className={staggerDelayClasses[index % staggerDelayClasses.length]}
        />
      ))}
    </div>
  );
}
