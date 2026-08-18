import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About",
};

const aboutBlocks = [
  {
    title: "Mission",
    text: "To provide polished, peaceful, and academically grounded Quran education that respects both the sacred subject and the modern learner.",
  },
  {
    title: "Vision",
    text: "To become a trusted academy presence where families can learn, verify, and engage with confidence through one elegant digital platform.",
  },
  {
    title: "Teaching method",
    text: "We pair structured instruction, repetition, correction, and revision with clear communication and thoughtful digital presentation.",
  },
  {
    title: "Why choose us",
    text: "Because trust is not only taught through content. It is also communicated through clarity, quality, consistency, and care.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-shell py-20">
      <SectionHeading
        eyebrow="About the academy"
        title="An official academy presence shaped for trust and long-term growth."
        description="This web application is designed to reflect a serious Islamic educational institution rather than a temporary landing page."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {aboutBlocks.map((block) => (
          <article
            key={block.title}
            className="panel-shadow rounded-[2rem] border border-border bg-surface p-8"
          >
            <h2 className="font-display text-4xl font-semibold text-primary">
              {block.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">{block.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
