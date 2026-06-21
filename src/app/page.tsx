import { FinalCtaSection } from "@/src/components/sections/FinalCtaSection";
import { HeroSection } from "@/src/components/sections/HeroSection";
import { MurotalSection } from "@/src/components/sections/MurotalSection";
import { OrderStepsSection } from "@/src/components/sections/OrderStepsSection";
import { ProductCatalogSection } from "@/src/components/sections/ProductCatalogSection";
import { StatsStrip } from "@/src/components/sections/StatsStrip";
import { TestimonialsSection } from "@/src/components/sections/TestimonialsSection";
import { TrustBadges } from "@/src/components/sections/TrustBadges";
import { WhySection } from "@/src/components/sections/WhySection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <TrustBadges />
      <WhySection />
      <ProductCatalogSection />
      <MurotalSection />
      <OrderStepsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </>
  );
}
