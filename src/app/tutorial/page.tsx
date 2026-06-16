import type { Metadata } from "next";
import { tutorials } from "@/src/data/tutorials";

export const metadata: Metadata = {
  title: "Tutorial Setting | UNA Project",
  description:
    "Panduan setting jam waktu sholat dan running text digital UNA Project.",
};

const tutorialDelayClasses = ["animate-delay-100", "animate-delay-200"];

export default function TutorialPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-fade-up mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Panduan Resmi
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
            Tutorial Setting JWS
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-600">
            Pelajari cara mengatur jam waktu sholat dan running text digital
            dari UNA Project dengan langkah sederhana berikut.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {tutorials.map((tutorial, tutorialIndex) => (
            <article
              key={tutorial.slug}
              className={`motion-card animate-fade-up rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-primary/5 sm:p-8 ${
                tutorialDelayClasses[tutorialIndex]
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                {tutorial.category}
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-zinc-950">
                {tutorial.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600">
                {tutorial.shortDescription}
              </p>

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
                        <h3 className="font-bold text-zinc-950">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-zinc-600">
                          {step.description}
                          {step.highlight ? (
                            <>
                              {" "}
                              <code className="rounded bg-primary/10 px-2 py-1 font-mono text-primary">
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
