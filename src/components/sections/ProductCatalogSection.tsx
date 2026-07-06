import { ProductCard } from "@/src/components/products/ProductCard";
import { Button } from "@/src/components/ui/Button";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";
import { getPublicProducts } from "@/src/lib/publicApi";
import type { Product } from "@/src/types/product";

const selectedProductSlugs = [
  "jws-p10-rgb-3-panel-frame-aluminium",
  "jws-led-tv-32-inch",
  "jws-rgb-2-panel-frame-figura-100x50",
  "jws-rgb-5-panel-frame-aluminium",
  "jws-seven-segment-jumbo-25-1-running-text",
  "lisensi-key-activation-jws-android-tv",
];

export async function ProductCatalogSection() {
  const allProducts = await getPublicProducts();
  const catalogProducts = selectedProductSlugs
    .map((slug) => allProducts.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  const displayProducts = catalogProducts.length > 0 ? catalogProducts : allProducts.slice(0, 6);

  return (
    <section id="produk" className="bg-una-soft py-12 sm:py-14 lg:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Katalog Produk</SectionLabel>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-una-ink sm:text-4xl">
              Pilih tipe JWS Digital sesuai kebutuhan
            </h2>
            <p className="mt-3 text-base leading-7 text-una-muted">
              Running text RGB hingga Android TV, tersedia berbagai ukuran dan
              anggaran dengan konsultasi pemasangan yang jelas.
            </p>
          </div>
          <Button
            href="/product"
            variant="outline"
            className="md:shrink-0"
          >
            Lihat Katalog Lengkap
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              revealDelay={(index + 1) * 70}
            />
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 text-center">
          <p className="text-sm leading-6 text-una-muted">
            Masih ada tipe single color, ukuran mini, frame figura khusus, dan
            display custom sesuai kebutuhan lokasi.
          </p>
          <Button href="/product" variant="dark">
            Lihat Katalog Lengkap
          </Button>
        </div>
      </Container>
    </section>
  );
}
