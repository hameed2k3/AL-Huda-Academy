import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { courseCatalog } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Courses",
};

export default function CoursesPage() {
  return (
    <div className="container-shell py-20">
      <SectionHeading
        eyebrow="Course catalog"
        title="Purposeful Quran learning paths for every stage."
        description="The public course page is structured like a proper academy catalog, with clean summaries and certificate eligibility."
      />
      <div className="mt-12 grid gap-6 xl:grid-cols-2">
        {courseCatalog.map((course) => (
          <article
            key={course.slug}
            className="card-shadow rounded-[2rem] border border-border bg-surface p-8"
          >
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {course.level}
              </span>
              <span className="rounded-full border border-accent/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {course.duration}
              </span>
              {course.certificateAvailable ? (
                <span className="rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Certificate available
                </span>
              ) : null}
            </div>
            <h2 className="mt-5 font-display text-4xl font-semibold text-primary">
              {course.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              {course.description}
            </p>
            <div className="mt-6 h-px w-full gold-divider" />
            <ul className="mt-6 space-y-3 text-sm leading-6 text-foreground">
              {course.outcomes.map((outcome) => (
                <li key={outcome}>• {outcome}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
