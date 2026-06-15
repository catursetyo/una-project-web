import { FeaturesSection } from "@/src/components/FeaturesSection";
import { FeaturedProductsSection } from "@/src/components/FeaturedProductsSection";
import { HeroSection } from "@/src/components/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection />
    </>
  );
}
