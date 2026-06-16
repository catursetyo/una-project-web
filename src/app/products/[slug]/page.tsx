import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppButton } from "@/src/components/WhatsAppButton";
import { products } from "@/src/data/products";
import { formatPrice } from "@/src/lib/formatPrice";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | UNA Project",
    };
  }

  return {
    title: `${product.name} | UNA Project`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="text-sm font-semibold text-primary transition-colors hover:text-tertiary"
        >
          Kembali ke katalog
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-primary/5 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {product.category}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-600">
              {product.description}
            </p>

            {product.dimensions ? (
              <div className="mt-8 rounded-xl bg-primary/5 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Ukuran
                </p>
                <p className="mt-2 text-lg font-bold text-zinc-950">
                  {product.dimensions}
                </p>
              </div>
            ) : null}

            <div className="mt-8">
              <h2 className="text-xl font-black text-zinc-950">
                Fitur Produk
              </h2>
              <ul className="mt-5 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-2 rounded-full bg-primary"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {product.variants?.length ? (
              <div className="mt-8">
                <h2 className="text-xl font-black text-zinc-950">
                  Opsi Varian
                </h2>
                <div className="mt-5 grid gap-4">
                  {product.variants.map((variant) => (
                    <article
                      key={variant.name}
                      className="motion-card rounded-xl border border-zinc-200 bg-background p-5"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-bold text-zinc-950">
                            {variant.name}
                          </h3>
                          {variant.description ? (
                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                              {variant.description}
                            </p>
                          ) : null}
                        </div>
                        <p className="shrink-0 text-lg font-black text-primary">
                          {formatPrice(variant.price)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="animate-fade-up animate-delay-200 h-fit rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-primary/5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Mulai Dari
            </p>
            <p className="mt-3 text-4xl font-black text-primary">
              {formatPrice(product.priceStartFrom)}
            </p>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              Harga dapat berubah sesuai ukuran, bahan, fitur tambahan, dan
              kebutuhan pemasangan. Konsultasikan dulu agar estimasi lebih
              akurat.
            </p>

            <div className="mt-8">
              <WhatsAppButton productName={product.name} fullWidth />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
