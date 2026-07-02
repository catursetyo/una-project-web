import { products } from "@/src/data/products";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { ProductCard } from "@/src/components/products/ProductCard";
import { Button } from "@/src/components/ui/Button";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";
import type { Product } from "@/src/types/product";

const selectedProductSlugs = [
  "jws-p10-rgb-3-panel-frame-aluminium",
  "jws-led-tv-32-inch",
  "jws-rgb-2-panel-frame-figura-100x50",
  "jws-rgb-5-panel-frame-aluminium",
  "jws-seven-segment-jumbo-25-1-running-text",
  "lisensi-key-activation-jws-android-tv",
];

const catalogProducts = selectedProductSlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter((product): product is Product => Boolean(product));

export function ProductCatalogSection() {
  return (
    <section id="produk" className="bg-una-soft py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Katalog Produk</SectionLabel>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-una-ink sm:text-4xl">
              Pilih tipe JWS Digital sesuai kebutuhan
            </h2>
            <p className="mt-4 text-base leading-8 text-una-muted">
              Running text RGB hingga Android TV, tersedia berbagai ukuran dan
              anggaran dengan konsultasi pemasangan yang jelas.
            </p>
          </div>
          <Button
            href={createWhatsAppLink({
              message:
                "Halo UNA Project, saya ingin lihat katalog lengkap JWS Digital.",
            })}
            target="_blank"
            variant="outline"
            className="md:shrink-0"
          >
            Katalog Lengkap
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalogProducts.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              revealDelay={(index + 1) * 70}
            />
          ))}
        </div>

        <div className="mx-auto mt-11 flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="text-sm leading-6 text-una-muted">
            Masih ada tipe single color, ukuran mini, frame figura khusus, dan
            display custom sesuai kebutuhan lokasi.
          </p>
          <Button
            href={createWhatsAppLink({
              message:
                "Halo UNA Project, saya ingin minta katalog lengkap JWS Digital.",
            })}
            target="_blank"
            variant="dark"
          >
            Minta Katalog Lengkap
          </Button>
        </div>
      </Container>
    </section>
  );
}
