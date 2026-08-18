import Link from "next/link";
import { HeroTextGroup, HeroVisual } from "@/components/home-hero-motion";
import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  academy,
  academyValues,
  courseCatalog,
  whyChooseUs,
} from "@/lib/site-data";

export default function HomePage() {
  return (
    <div>
      <section className="overflow-hidden border-b border-border bg-background">
        <div className="container-shell grid gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <HeroTextGroup>
            <div className="space-y-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Premium Islamic education
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-tight text-primary text-balance sm:text-6xl lg:text-7xl">
                {academy.heroTitle}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                {academy.heroText}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={academy.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-primary-strong"
                >
                  Enroll now
                </a>
                <Link
                  href="/verify"
                  className="inline-flex rounded-full border border-primary/20 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition hover:bg-primary/5"
                >
                  Verify certificate
                </Link>
              </div>
            </div>
          </HeroTextGroup>

          <HeroVisual>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2.5rem] islamic-glow" />
              <div className="card-shadow overflow-hidden rounded-[2.5rem] border border-border bg-surface">
                <div className="pattern-stars border-b border-border px-8 py-7">
                  <p className="font-arabic text-4xl text-primary/70">
                    بسم الله الرحمن الرحيم
                  </p>
                </div>
                <div className="space-y-6 p-8">
                  <div className="rounded-[1.75rem] border border-border bg-background p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                      Official website
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-primary">
                      Designed for families, students, and trust.
                    </h2>
                    <p className="mt-4 text-base leading-7 text-muted">
                      Courses, contact, verification, and academy administration
                      sit together inside one calm, polished experience.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.75rem] border border-border bg-surface-muted p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-32px_rgba(15,81,50,0.55)]">
                      <p className="text-sm font-semibold text-primary">
                        Verification ready
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        Search certificate IDs and open secure student records.
                      </p>
                    </div>
                    <div className="rounded-[1.75rem] border border-border bg-surface-muted p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-32px_rgba(15,81,50,0.55)]">
                      <p className="text-sm font-semibold text-primary">
                        Elegant certificates
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        Present student achievement with a print-ready academy
                        layout.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HeroVisual>
        </div>
      </section>

      <MotionReveal>
        <section className="container-shell py-20">
          <SectionHeading
            eyebrow="Academy values"
            title="A trustworthy digital presence rooted in peace, clarity, and academic dignity."
            description="The website is built to feel handcrafted rather than templated, with soft hierarchy, meaningful spacing, and subtle Islamic character."
            center
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {academyValues.map((value, index) => (
              <MotionReveal key={value.title} delay={index * 0.08}>
                <article className="panel-shadow rounded-[2rem] border border-border bg-surface p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-34px_rgba(15,81,50,0.5)]">
                  <h3 className="font-display text-3xl font-semibold text-primary">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-muted">
                    {value.description}
                  </p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="border-y border-border bg-surface-muted py-20">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Courses"
              title="Structured pathways from first reading to memorization."
              description="Each course has a clear purpose, strong learning outcomes, and certificate eligibility where applicable."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2)">
              {courseCatalog.map((course, index) => (
                <MotionReveal key={course.slug} delay={index * 0.08}>
                  <article className="card-shadow rounded-[2rem] border border-border bg-surface p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_-38px_rgba(15,81,50,0.48)]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {course.level}
                      </span>
                      <span className="rounded-full border border-accent/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        {course.duration}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-4xl font-semibold text-primary">
                      {course.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-muted">
                      {course.description}
                    </p>
                    <ul className="mt-5 space-y-2 text-sm leading-6 text-foreground">
                      {course.outcomes.map((outcome) => (
                        <li key={outcome}>• {outcome}</li>
                      ))}
                    </ul>
                  </article>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="container-shell py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2.5rem] bg-primary p-10 text-white panel-shadow">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Why families choose us
              </p>
              <h2 className="mt-4 font-display text-5xl font-semibold">
                Serious learning without visual noise.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/80">
                The academy experience is designed to feel gentle, premium, and
                dependable across public information, enrollment touchpoints, and
                certificate validation.
              </p>
            </div>

            <div className="grid gap-4">
              {whyChooseUs.map((reason, index) => (
                <MotionReveal key={reason} delay={index * 0.08}>
                  <div className="rounded-[1.75rem] border border-border bg-surface p-6 panel-shadow transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-34px_rgba(15,81,50,0.4)]">
                    <p className="text-lg leading-8 text-foreground">{reason}</p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>
      </MotionReveal>
    </div>
  );
}
