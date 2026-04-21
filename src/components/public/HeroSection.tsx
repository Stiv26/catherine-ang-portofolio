"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Mail, Sparkles } from "lucide-react";
import type { Profile, Artwork } from "@/types";

interface HeroSectionProps {
  profile: Profile | null;
  featuredArtwork: Artwork | null;
  heroHeadline?: string;
  heroSubtext?: string;
}

const DOODLES = [
  { top: "10%", left: "5%", delay: 0, rotate: -15 },
  { top: "20%", right: "8%", delay: 0.5, rotate: 20 },
  { top: "75%", left: "3%", delay: 0.8, rotate: 10 },
  { top: "60%", right: "5%", delay: 0.3, rotate: -25 },
  { top: "85%", right: "15%", delay: 1.0, rotate: 5 },
];

function DoodleStar({ style, delay }: { style: React.CSSProperties; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none text-accent-primary opacity-40"
      style={style}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.5, 0.3], scale: [0, 1.2, 1], rotate: [0, 10, -5] }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
    >
      <Sparkles size={20} />
    </motion.div>
  );
}

export default function HeroSection({
  profile,
  featuredArtwork,
  heroHeadline,
  heroSubtext,
}: HeroSectionProps) {
  const scrollToGallery = () => {
    document.querySelector("#gallery")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const name = heroHeadline || profile?.name || "Cathrine";
  const tagline = profile?.tagline || "Freelance Illustrator & Character Designer";
  const bio = heroSubtext || profile?.bio_short || "";

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 px-6 overflow-hidden">
      {/* Watercolor background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-accent-soft/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent-lavender/20 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/3 w-[30vw] h-[30vw] bg-accent-peach/15 rounded-full blur-[80px]" />
      </div>

      {/* Floating doodles */}
      {DOODLES.map((d, i) => (
        <DoodleStar
          key={i}
          delay={d.delay}
          style={{
            top: d.top,
            left: (d as { left?: string }).left,
            right: (d as { right?: string }).right,
            transform: `rotate(${d.rotate}deg)`,
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          {/* Artwork — left 3 cols */}
          <motion.div
            className="lg:col-span-3 order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {featuredArtwork ? (
              <div className="relative max-w-lg mx-auto lg:mx-0">
                {/* Paint stroke border (decorative SVG ring) */}
                <div
                  className="absolute -inset-3 rounded-2xl opacity-60 dark:opacity-30"
                  style={{
                    background: `linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-lavender) 50%, var(--accent-peach) 100%)`,
                    filter: "blur(12px)",
                    transform: "rotate(-1deg)",
                  }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden shadow-deep"
                  style={{ transform: "rotate(-2deg)" }}
                >
                  <Image
                    src={featuredArtwork.cover_image_url}
                    alt={featuredArtwork.title}
                    width={680}
                    height={800}
                    className="w-full h-auto object-cover"
                    priority
                    sizes="(max-width: 1024px) 90vw, 55vw"
                    style={{ animation: "paint-reveal 0.9s ease forwards 0.3s", clipPath: "inset(0 100% 0 0)" }}
                  />
                </div>
                {/* Artwork title tag */}
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-bg-primary border border-border-soft rounded-xl px-3 py-2 shadow-soft"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                >
                  <p className="text-xs font-mono text-text-tertiary">Featured</p>
                  <p className="text-sm font-display font-medium text-text-primary truncate max-w-[160px]">
                    {featuredArtwork.title}
                  </p>
                </motion.div>
              </div>
            ) : (
              /* Placeholder if no featured artwork */
              <div className="max-w-lg mx-auto lg:mx-0 aspect-[4/5] rounded-2xl bg-gradient-to-br from-accent-soft via-accent-lavender/30 to-accent-peach/30 flex items-center justify-center" style={{ transform: "rotate(-2deg)" }}>
                <p className="font-accent text-2xl text-accent-deep opacity-60">Your Art Here</p>
              </div>
            )}
          </motion.div>

          {/* Text — right 2 cols */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <motion.p
              className="font-accent text-xl text-accent-deep mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Hello, I&apos;m
            </motion.p>

            <motion.h1
              className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary leading-[1.05] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {name}
              <span className="block text-accent-primary">.</span>
            </motion.h1>

            <motion.p
              className="font-accent text-2xl text-text-secondary mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {tagline}
            </motion.p>

            {bio && (
              <motion.p
                className="font-body text-base text-text-secondary leading-relaxed mb-8 max-w-sm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {bio}
              </motion.p>
            )}

            {/* Availability badge */}
            {profile?.availability_status && (
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft border border-accent-primary/30 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 pulse-badge" />
                <span className="text-xs font-mono text-accent-deep">
                  {profile.availability_status}
                </span>
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                onClick={scrollToGallery}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent-deep text-white font-body font-medium text-sm hover:bg-accent-primary transition-all hover:shadow-glow active:scale-95"
              >
                See My Work
                <ArrowDown size={15} />
              </button>
              <button
                onClick={scrollToContact}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-accent-primary text-accent-deep font-body font-medium text-sm hover:bg-accent-soft transition-all active:scale-95"
              >
                <Mail size={15} />
                Let&apos;s Work Together
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-xs font-mono text-text-tertiary tracking-widest">SCROLL</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-accent-primary to-transparent"
          animate={{ scaleY: [0, 1, 0], y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
