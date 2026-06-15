type FeatureCardProps = {
  label: string;
  title: string;
  description: string;
};

export function FeatureCard({ label, title, description }: FeatureCardProps) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {label}
      </p>
      <h3 className="mt-3 text-lg font-semibold text-zinc-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>
    </article>
  );
}
