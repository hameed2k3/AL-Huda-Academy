type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: SectionHeadingProps) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
