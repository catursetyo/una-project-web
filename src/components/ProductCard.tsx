import Link from "next/link";
import { formatPrice } from "@/src/lib/formatPrice";
import type { Product } from "@/src/types/product";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className = "" }: ProductCardProps) {
  return (
    <article
      className={`motion-card animate-fade-up flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-primary/5 ${className}`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-primary">
          {product.category}
        </span>
        {product.dimensions ? (
          <span className="text-xs font-semibold tracking-[0.14em] text-zinc-500">
            {product.dimensions}
          </span>
        ) : null}
      </div>

      <h3 className="text-2xl font-black leading-tight text-zinc-950">
        {product.name}
      </h3>
      <p className="mt-4 text-sm leading-6 text-zinc-600">
        {product.shortDescription}
      </p>

      <ul className="mt-6 space-y-3 text-sm text-zinc-700">
        {product.features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-1.5 size-2 rounded-full bg-primary"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-zinc-200 pt-6">
        {product.variants?.length ? (
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-zinc-500">
            {product.variants.length} opsi varian
          </p>
        ) : null}
        <p className="text-xs font-bold tracking-[0.18em] text-zinc-500">
          Mulai Dari
        </p>
        <p className="mt-2 text-3xl font-black text-primary">
          {formatPrice(product.priceStartFrom)}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="motion-button mt-5 inline-flex w-full items-center justify-center rounded-xl border-2 border-primary px-5 py-3 text-sm font-bold tracking-[0.12em] text-primary hover:bg-primary hover:text-white"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}
