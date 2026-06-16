import type { Metadata } from "next";
import { TutorialMediaPlaceholder } from "@/src/components/TutorialMediaPlaceholder";
import { tutorials } from "@/src/data/tutorials";

export const metadata: Metadata = {
  title: "Tutorial Setting | UNA Project",
  description:
    "Panduan setting jam waktu sholat dan running text digital UNA Project.",
};

export default function TutorialPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div
          className="scroll-reveal mx-auto max-w-3xl text-center"
          data-scroll-reveal
        >
          <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">
            Panduan Resmi
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
            Tutorial Setting JWS
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            Pelajari cara mengatur jam waktu sholat dan running text digital
            dari UNA Project dengan langkah sederhana berikut.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {tutorials.map((tutorial, tutorialIndex) => (
            <article
              key={tutorial.slug}
              data-scroll-reveal="scale"
              data-scroll-delay={tutorialIndex * 120}
              className="scroll-reveal motion-card rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-primary/5 sm:p-8"
            >
              <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">
                {tutorial.category}
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-zinc-950 sm:text-4xl">
                {tutorial.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                {tutorial.shortDescription}
              </p>

              <TutorialMediaPlaceholder tutorial={tutorial} />

              <ol className="mt-8 space-y-4">
                {tutorial.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="motion-card rounded-xl border border-zinc-100 bg-background p-4"
                  >
                    <div className="flex gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-black text-zinc-950 sm:text-lg">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                          {step.description}
                          {step.highlight ? (
                            <>
                              {" "}
                              <code className="rounded bg-primary/10 px-2 py-1 font-mono text-sm font-bold text-primary">
                                {step.highlight}
                              </code>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
