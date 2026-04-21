"use client";

import Image from "next/image";
import { Globe, ExternalLink } from "lucide-react";
import type { Profile } from "@/types";
import ScrollReveal, { StaggerChildren, StaggerItem } from "@/components/animations/ScrollReveal";

interface AboutSectionProps {
  profile: Profile | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  const socialLinks = [
    { url: profile.instagram_url, icon: Globe, label: "Instagram" },
    { url: profile.twitter_url, icon: Globe, label: "Twitter" },
    { url: profile.behance_url, icon: ExternalLink, label: "Behance" },
    { url: profile.artstation_url, icon: ExternalLink, label: "ArtStation" },
  ].filter((s) => s.url);

  return (
    <section id="about" className="py-24 px-6 bg-bg-secondary relative overflow-hidden">
      {/* Watercolor blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-lavender/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-peach/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Decorative quote */}
        <ScrollReveal className="text-center mb-16">
          <p className="font-accent text-3xl lg:text-4xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            &ldquo;Every illustration is a window into a world that didn&apos;t exist before.&rdquo;
          </p>
        </ScrollReveal>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: photo */}
          <ScrollReveal direction="left" className="flex flex-col items-center gap-6">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-blob bg-gradient-to-br from-accent-soft via-accent-lavender/30 to-accent-peach/30 blur-lg opacity-70" />
              <div className="relative w-72 h-80 rounded-blob overflow-hidden shadow-deep border-4 border-bg-primary">
                {profile.profile_photo_url ? (
                  <Image
                    src={profile.profile_photo_url}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-soft to-accent-lavender/40 flex items-center justify-center">
                    <span className="font-accent text-6xl text-accent-deep opacity-40">
                      {profile.name[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-bg-primary border border-border-soft text-text-secondary hover:text-accent-deep hover:border-accent-primary transition-all hover:shadow-soft"
                    title={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* Right: bio */}
          <div className="space-y-8">
            <ScrollReveal>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary">
                About{" "}
                <span className="text-accent-primary italic">me</span>
              </h2>
            </ScrollReveal>

            {profile.bio_long && (
              <ScrollReveal delay={0.1}>
                <p className="font-body text-text-secondary leading-relaxed text-base whitespace-pre-line">
                  {profile.bio_long}
                </p>
              </ScrollReveal>
            )}

            {profile.location && (
              <ScrollReveal delay={0.15}>
                <p className="text-sm text-text-tertiary font-mono">
                  📍 {profile.location}
                </p>
              </ScrollReveal>
            )}

            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <ScrollReveal delay={0.2}>
                <div>
                  <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-3">
                    Services
                  </p>
                  <StaggerChildren className="flex flex-wrap gap-2" stagger={0.05}>
                    {profile.services.map((service) => (
                      <StaggerItem key={service}>
                        <span className="px-4 py-2 rounded-full bg-bg-primary border border-border-soft text-sm font-body text-text-secondary hover:border-accent-primary hover:text-accent-deep transition-all cursor-default">
                          {service}
                        </span>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
