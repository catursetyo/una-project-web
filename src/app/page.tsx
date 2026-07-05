import { FinalCtaSection } from "@/src/components/sections/FinalCtaSection";
import { HeroSection } from "@/src/components/sections/HeroSection";
import { OrderStepsSection } from "@/src/components/sections/OrderStepsSection";
import { ProductCatalogSection } from "@/src/components/sections/ProductCatalogSection";
import { StatsStrip } from "@/src/components/sections/StatsStrip";
import { TestimonialsSection } from "@/src/components/sections/TestimonialsSection";
import { WhySection } from "@/src/components/sections/WhySection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <WhySection />
      <ProductCatalogSection />
      <OrderStepsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </>
  );
}
