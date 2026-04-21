"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import type { Experience } from "@/types";
import { formatDate } from "@/lib/utils";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Badge from "@/components/ui/Badge";

interface ExperienceSectionProps {
  experiences: Experience[];
}

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative flex gap-4"
    >
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10",
            exp.is_current
              ? "bg-accent-primary shadow-soft"
              : "bg-bg-tertiary border border-border-soft"
          )}
        >
          <Briefcase
            size={15}
            className={exp.is_current ? "text-white" : "text-text-tertiary"}
          />
        </div>
        {/* Vertical line — semua kecuali card terakhir */}
        <div className="w-px flex-1 bg-border-soft mt-1 min-h-[24px]" />
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 hover:border-accent-primary/40 hover:shadow-card transition-all">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-display text-base font-semibold text-text-primary leading-snug">
                {exp.role}
              </p>
              <p className="text-sm text-text-secondary mt-0.5">
                {exp.company ?? "Self-employed"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {exp.is_current && (
                <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Present
                </span>
              )}
              {exp.employment_type && (
                <Badge variant="outline" size="sm">{exp.employment_type}</Badge>
              )}
            </div>
          </div>

          {/* Date & location */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <p className="text-xs font-mono text-text-tertiary">
              {formatDate(exp.start_date, { month: "short", year: "numeric" })}
              {" — "}
              {exp.is_current
                ? "Present"
                : exp.end_date
                ? formatDate(exp.end_date, { month: "short", year: "numeric" })
                : "—"}
            </p>
            {exp.location && (
              <span className="flex items-center gap-1 text-xs text-text-tertiary">
                <MapPin size={11} />
                {exp.location}
              </span>
            )}
          </div>

          {/* Description */}
          {exp.description && (
            <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">
              {exp.description}
            </p>
          )}

          {/* Highlights */}
          {exp.highlights && exp.highlights.length > 0 && (
            <ul className="space-y-1 mb-3">
              {exp.highlights.slice(0, 2).map((h, i) => (
                <li key={i} className="text-xs text-text-secondary flex gap-2">
                  <span className="text-accent-primary mt-0.5 shrink-0">✦</span>
                  {h}
                </li>
              ))}
            </ul>
          )}

          {/* Skills */}
          {exp.skills && exp.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-soft">
              {exp.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="pink" size="sm">{skill}</Badge>
              ))}
              {exp.skills.length > 5 && (
                <Badge variant="outline" size="sm">+{exp.skills.length - 5}</Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* cn helper lokal (hindari import extra) */
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (!experiences.length) return null;

  /* Pisah: pekerjaan utama vs volunteering */
  const mainExp = experiences.filter((e) =>
    ["Freelance", "Full-time", "Part-time", "Internship"].includes(e.employment_type ?? "") &&
    !["Sekber PMVBI", "PMBDC"].some((v) => (e.company ?? "").includes(v))
  );
  const volunteer = experiences.filter((e) =>
    ["Sekber PMVBI", "PMBDC"].some((v) => (e.company ?? "").includes(v))
  );

  return (
    <section id="experience" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal className="mb-12">
          <p className="font-accent text-xl text-accent-deep mb-1">career</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary">
            Experience
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
          {/* Kolom kiri: Work */}
          <div>
            <ScrollReveal delay={0.05}>
              <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-accent-primary inline-block" />
                Work
              </p>
            </ScrollReveal>
            {mainExp.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} />
            ))}
          </div>

          {/* Kolom kanan: Volunteering */}
          {volunteer.length > 0 && (
            <div>
              <ScrollReveal delay={0.1}>
                <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-accent-lavender inline-block" />
                  Volunteering
                </p>
              </ScrollReveal>
              {volunteer.map((exp, i) => (
                <ExperienceCard key={exp.id} exp={exp} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
