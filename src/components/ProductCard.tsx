import Link from "next/link";
import { formatPrice } from "@/src/lib/formatPrice";
import type { Product } from "@/src/types/product";

type ProductCardProps = {
  product: Product;
  className?: string;
  revealDelay?: number;
};

export function ProductCard({
  product,
  className = "",
  revealDelay,
}: ProductCardProps) {
  return (
    <article
      data-scroll-reveal="scale"
      data-scroll-delay={revealDelay}
      className={`scroll-reveal motion-card flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-primary/5 sm:p-6 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black tracking-[0.12em] text-primary sm:px-4 sm:py-2 sm:text-sm">
          {product.category}
        </span>
        {product.dimensions ? (
          <span className="text-xs font-bold tracking-[0.1em] text-zinc-500 sm:text-sm">
            {product.dimensions}
          </span>
        ) : null}
      </div>

      <h3 className="text-xl font-black leading-tight text-zinc-950 sm:text-2xl">
        {product.name}
      </h3>
      <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
        {product.shortDescription}
      </p>

      <ul className="mt-5 space-y-3 text-sm text-zinc-700 sm:text-base">
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
          <p className="mb-3 text-xs font-bold tracking-[0.12em] text-zinc-500 sm:text-sm">
            {product.variants.length} opsi varian
          </p>
        ) : null}
        <p className="text-xs font-black tracking-[0.16em] text-zinc-500 sm:text-sm">
          Mulai Dari
        </p>
        <p className="mt-2 text-2xl font-black text-primary sm:text-3xl">
          {formatPrice(product.priceStartFrom)}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="motion-button mt-5 inline-flex w-full items-center justify-center rounded-xl border-2 border-primary px-5 py-3 text-sm font-black tracking-[0.08em] text-primary hover:bg-primary hover:text-white sm:text-base"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}
