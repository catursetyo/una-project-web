import Link from "next/link";
import { formatPrice } from "@/src/lib/formatPrice";
import {
  MiniLedPreview,
  type MiniLedPreviewKind,
} from "@/src/components/ui/MiniLedPreview";
import { Icon } from "@/src/components/ui/Icon";
import type { Product } from "@/src/types/product";

type ProductCardProps = {
  product: Product;
  className?: string;
  revealDelay?: number;
};

function getPreviewKind(product: Product): MiniLedPreviewKind {
  if (product.category === "Lisensi Aplikasi") {
    return "key";
  }

  if (product.name.toLowerCase().includes("tv")) {
    return "tv";
  }

  if (product.category === "Seven Segment" || product.name.includes("1 Warna")) {
    return "single-time";
  }

  return "rgb-time";
}

function getPreviewValue(product: Product) {
  if (product.name.includes("Seven")) {
    return "04:15";
  }

  if (product.name.includes("5 Panel")) {
    return "17:58";
  }

  if (product.name.includes("2 Panel")) {
    return "09:30";
  }

  return "12:45";
}

function getSecondaryPriceLabel(product: Product) {
  const autoMurotalVariant = product.variants?.find((variant) =>
    variant.name.toLowerCase().includes("murotal"),
  );

  if (!autoMurotalVariant) {
    return product.variants && product.variants.length > 1
      ? `${product.variants.length} opsi varian`
      : undefined;
  }

  return `Auto-murotal ${formatPrice(autoMurotalVariant.price)}`;
}

export function ProductCard({
  product,
  className = "",
  revealDelay,
}: ProductCardProps) {
  return (
    <article
      data-scroll-reveal="scale"
      data-scroll-delay={revealDelay}
      className={`scroll-reveal flex h-full flex-col overflow-hidden rounded-lg border border-black/10 bg-white transition-colors hover:bg-una-cream ${className}`}
    >
      <MiniLedPreview
        kind={getPreviewKind(product)}
        tag={product.category}
        value={getPreviewValue(product)}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em] text-primary">
            {product.dimensions ?? "Custom"}
          </span>
          {product.isFeatured ? (
            <span className="text-xs font-black text-una-gold">Unggulan</span>
          ) : null}
        </div>

        <h3 className="text-lg font-extrabold leading-snug text-una-ink">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-una-muted">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-black/10 pt-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-una-muted">
              Mulai dari
            </p>
            <p className="mt-1 font-heading text-xl font-extrabold text-primary">
              {formatPrice(product.priceStartFrom)}
            </p>
            {getSecondaryPriceLabel(product) ? (
              <p className="mt-1 text-xs font-semibold text-una-muted">
                {getSecondaryPriceLabel(product)}
              </p>
            ) : null}
          </div>

          <Link
            href={`/products/${product.slug}`}
            aria-label={`Lihat detail ${product.name}`}
            className="motion-button grid size-10 shrink-0 place-items-center rounded-full bg-una-deep text-white hover:bg-una-gold hover:text-una-gold-ink"
          >
            <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
