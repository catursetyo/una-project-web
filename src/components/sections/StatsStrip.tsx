import { stats } from "@/src/data/landing";
import { Container } from "@/src/components/layout/Container";

export function StatsStrip() {
  return (
    <section className="border-b border-black/10 bg-white py-0">
      <Container>
        <div className="grid grid-cols-2 divide-x divide-y divide-black/10 border-x border-black/10 md:grid-cols-4 md:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-5 py-8 sm:px-7 sm:py-9">
              <p className="font-heading text-3xl font-extrabold leading-none tracking-[-0.03em] text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold leading-5 text-una-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
