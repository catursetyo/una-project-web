import { JwsDisplayMockup } from "@/src/components/ui/JwsDisplayMockup";
import { Container } from "@/src/components/layout/Container";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-una-deep text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(44,140,114,0.34),transparent_42%),linear-gradient(180deg,#0a211d_0%,#071713_100%)]"
      />
      <div
        aria-hidden="true"
        className="led-dot-grid absolute inset-0 opacity-[0.07]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[58%] h-40 w-[min(76vw,760px)] -translate-x-1/2 rounded-full bg-una-gold/10 blur-3xl"
      />
      <Container className="relative z-10 flex flex-col items-center justify-center py-12 text-center sm:py-14 lg:py-16">
        <div className="w-full max-w-5xl">
          <h1 className="font-heading text-[clamp(3.5rem,10vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
            UNA <span className="text-una-gold-light">Project</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-white/75 sm:text-xl sm:leading-8">
            Menyediakan running text dan jam waktu sholat sesuai kebutuhan Anda.
          </p>

          <div className="mx-auto mt-8 max-w-3xl sm:mt-9">
            <JwsDisplayMockup />
          </div>

          <a
            href="#ringkasan"
            aria-label="Lihat ringkasan layanan"
            className="mx-auto mt-8 grid size-10 place-items-center rounded-full border border-white/25 text-una-gold-light transition-colors hover:border-una-gold-light hover:bg-una-gold-light hover:text-una-gold-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-una-gold-light"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              aria-hidden="true"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </Container>
    </section>
  );
}
