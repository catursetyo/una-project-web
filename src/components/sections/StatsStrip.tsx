import { stats } from "@/src/data/landing";
import { Container } from "@/src/components/layout/Container";

export function StatsStrip() {
  return (
    <section id="ringkasan" className="border-b border-black/10 bg-una-soft">
      <Container>
        <div className="grid grid-cols-2 divide-x divide-y divide-black/10 md:grid-cols-4 md:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-6 sm:px-6 sm:py-7">
              <p className="font-heading text-3xl font-extrabold leading-none tracking-[-0.03em] text-primary sm:text-4xl">
                {stat.value}
                {stat.accent && (
                  <span className="text-[#b77900]">{stat.accent}</span>
                )}
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
