import { getPublicTestimonials } from "@/src/lib/publicApi";
import { Container } from "@/src/components/layout/Container";
import { TestimonialsCarousel } from "@/src/components/sections/TestimonialsCarousel";

export async function TestimonialsSection() {
  const testimonials = await getPublicTestimonials();

  return (
    <section id="testimoni" className="bg-una-soft py-12 sm:py-14 lg:py-16">
      <Container>
        <h2
          data-scroll-reveal
          className="scroll-reveal text-center font-heading text-3xl font-extrabold leading-tight text-una-ink sm:text-4xl"
        >
          Testimoni
        </h2>

        <TestimonialsCarousel testimonials={testimonials} />
      </Container>
    </section>
  );
}
