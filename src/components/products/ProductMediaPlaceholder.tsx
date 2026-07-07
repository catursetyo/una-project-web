/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/src/types/product";
import { toYouTubeEmbedUrl } from "@/src/lib/youtube";

type ProductMediaPlaceholderProps = {
  product: Product;
  compact?: boolean;
};

export function ProductMediaPlaceholder({
  product,
  compact = false,
}: ProductMediaPlaceholderProps) {
  const embedUrl = toYouTubeEmbedUrl(product.videoUrl);

  if (embedUrl) {
    return (
      <div
        className={`overflow-hidden rounded-xl border border-primary/15 bg-una-deep ${
          compact ? "mb-5 aspect-[16/10]" : "aspect-video"
        }`}
      >
        <iframe
          src={embedUrl}
          title={`Video produk ${product.name}`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (product.image) {
    return (
      <div
        className={`overflow-hidden rounded-xl border border-primary/15 bg-una-deep ${
          compact ? "mb-5 aspect-[16/10]" : "aspect-video"
        }`}
      >
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-primary/15 bg-background ${
        compact ? "mb-5 aspect-[16/10]" : "aspect-video"
      }`}
    >
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-60">
        {Array.from({ length: 24 }).map((_, index) => (
          <span key={index} className="border border-white/70" />
        ))}
      </div>

      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
              Media Produk
            </p>
            <p className="mt-1 text-sm font-bold text-zinc-600">
              Ilustrasi tampilan produk
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-primary shadow-sm">
            16:9
          </span>
        </div>

        <div>
          <p
            className={`max-w-sm font-black leading-tight text-zinc-950 ${
              compact ? "text-lg" : "text-2xl sm:text-3xl"
            }`}
          >
            {product.name}
          </p>
          <span className="mt-4 inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-black tracking-[0.08em] text-zinc-500">
            Media belum tersedia
          </span>
        </div>
      </div>
    </div>
  );
}
