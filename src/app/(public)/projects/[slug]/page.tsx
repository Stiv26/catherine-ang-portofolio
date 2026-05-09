export const revalidate = 3600;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map(({ slug }) => ({ slug }));
}

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("title, description, cover_image_url")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Project Not Found" };

  return {
    title: `${data.title} — Cathrine Ang`,
    description: data.description ?? undefined,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!project) notFound();

  return (
    <div className="min-h-screen pt-20">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={15} />
          Back to Projects
        </Link>
      </div>

      {/* Hero */}
      {project.cover_image_url && (
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative w-full rounded-3xl overflow-hidden bg-bg-secondary aspect-[16/7] shadow-deep">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/60 via-text-primary/10 to-transparent flex items-end p-8 lg:p-12">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.category && <Badge variant="pink">{project.category}</Badge>}
                  {project.year && <Badge variant="outline" className="bg-white/20 text-white border-white/30">{project.year}</Badge>}
                </div>
                <h1 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="font-accent text-xl text-white/80 mt-2">{project.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Meta row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-bg-secondary rounded-2xl border border-border-soft">
          {project.client && (
            <div>
              <p className="text-xs font-mono text-text-tertiary uppercase mb-1">Client</p>
              <p className="text-sm font-semibold text-text-primary">{project.client}</p>
            </div>
          )}
          {project.role && (
            <div>
              <p className="text-xs font-mono text-text-tertiary uppercase mb-1">Role</p>
              <p className="text-sm font-semibold text-text-primary">{project.role}</p>
            </div>
          )}
          {project.duration && (
            <div>
              <p className="text-xs font-mono text-text-tertiary uppercase mb-1">Duration</p>
              <p className="text-sm font-semibold text-text-primary">{project.duration}</p>
            </div>
          )}
          {project.tools && project.tools.length > 0 && (
            <div>
              <p className="text-xs font-mono text-text-tertiary uppercase mb-1">Tools</p>
              <div className="flex flex-wrap gap-1">
                {project.tools.slice(0, 3).map((t: string) => (
                  <Badge key={t} variant="pink" size="sm">{t}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="font-body text-text-secondary text-lg leading-relaxed">{project.description}</p>
        )}

        {/* Case study sections */}
        {project.challenge && (
          <section>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <span className="text-accent-primary">01</span> The Challenge
            </h2>
            <p className="font-body text-text-secondary leading-relaxed whitespace-pre-line">{project.challenge}</p>
          </section>
        )}

        {/* Process images */}
        {project.images && project.images.length > 0 && (
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-4" style={{ width: "max-content" }}>
              {project.images.map((img: string, i: number) => (
                <div key={i} className="relative w-64 h-48 rounded-2xl overflow-hidden bg-bg-secondary shrink-0">
                  <Image
                    src={img}
                    alt={`Process ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {project.process && (
          <section>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <span className="text-accent-primary">02</span> The Process
            </h2>
            <p className="font-body text-text-secondary leading-relaxed whitespace-pre-line">{project.process}</p>
          </section>
        )}

        {project.outcome && (
          <section>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <span className="text-accent-primary">03</span> The Outcome
            </h2>
            <p className="font-body text-text-secondary leading-relaxed whitespace-pre-line">{project.outcome}</p>
          </section>
        )}

        {project.external_url && (
          <a
            href={project.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent-deep text-white text-sm font-medium hover:bg-accent-primary transition-all"
          >
            View Live Project <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
