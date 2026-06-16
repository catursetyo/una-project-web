type FeatureCardProps = {
  label: string;
  title: string;
  description: string;
  className?: string;
  revealDelay?: number;
};

export function FeatureCard({
  label,
  title,
  description,
  className = "",
  revealDelay,
}: FeatureCardProps) {
  return (
    <article
      data-scroll-reveal="scale"
      data-scroll-delay={revealDelay}
      className={`scroll-reveal motion-card rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
        {label}
      </p>
      <h3 className="mt-3 text-xl font-black text-zinc-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
        {description}
      </p>
    </article>
  );
}
