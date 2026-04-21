"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Badge from "@/components/ui/Badge";

interface ProjectsSectionProps {
  projects: Project[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[480px] rounded-3xl overflow-hidden shadow-deep border border-border-soft`}>
        {/* Image side */}
        <div className={`relative bg-bg-tertiary ${isEven ? "lg:order-1" : "lg:order-2"}`}>
          {project.cover_image_url ? (
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-soft to-accent-lavender/30 flex items-center justify-center">
              <span className="font-accent text-4xl text-accent-deep opacity-40">Case Study</span>
            </div>
          )}
          {/* Overlay with title on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-text-primary/60 to-transparent lg:hidden flex items-end p-6">
            <h3 className="font-display text-2xl font-bold text-white">{project.title}</h3>
          </div>
        </div>

        {/* Text side */}
        <div className={`flex flex-col justify-center p-8 lg:p-12 bg-bg-primary ${isEven ? "lg:order-2" : "lg:order-1"}`}>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.category && <Badge variant="pink">{project.category}</Badge>}
            {project.year && <Badge variant="outline">{project.year}</Badge>}
            {project.client && <Badge variant="lavender">{project.client}</Badge>}
          </div>

          <h3 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-3 hidden lg:block">
            {project.title}
          </h3>

          {project.subtitle && (
            <p className="font-accent text-xl text-accent-deep mb-4">{project.subtitle}</p>
          )}

          {project.description && (
            <p className="text-text-secondary font-body leading-relaxed mb-6 line-clamp-3">
              {project.description}
            </p>
          )}

          {project.tools && project.tools.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tools.slice(0, 4).map((tool) => (
                <span key={tool} className="text-xs px-2.5 py-1 rounded-full bg-bg-secondary border border-border-soft text-text-tertiary font-mono">
                  {tool}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent-deep text-white text-sm font-medium font-body hover:bg-accent-primary transition-all hover:shadow-glow w-fit active:scale-95"
          >
            Read Case Study
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-12">
          <ScrollReveal>
            <p className="font-accent text-xl text-accent-deep mb-1">case studies</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary">
              Featured Projects
            </h2>
          </ScrollReveal>
        </div>

        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
