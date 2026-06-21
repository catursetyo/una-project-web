import { trustBadges } from "@/src/data/landing";
import { Container } from "@/src/components/layout/Container";
import { Icon } from "@/src/components/ui/Icon";

export function TrustBadges() {
  return (
    <section className="border-b border-black/10 bg-una-soft py-5">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-between">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="inline-flex items-center gap-2 text-sm font-bold text-una-soft-text"
            >
              <Icon name={badge.icon} className="size-4 text-primary" />
              {badge.label}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
