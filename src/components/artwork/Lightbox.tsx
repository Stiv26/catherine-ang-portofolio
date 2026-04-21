"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { Artwork } from "@/types";

interface LightboxProps {
  artwork: Artwork | null;
  artworks: Artwork[];
  onClose: () => void;
}

const GRADIENTS = [
  "from-[#F4A7B9] to-[#D4B8E0]",
  "from-[#D4B8E0] to-[#FFCBA4]",
  "from-[#B8E0D2] to-[#F4A7B9]",
  "from-[#FFCBA4] to-[#FADADD]",
  "from-[#E8789A] to-[#D4B8E0]",
  "from-[#B8E0D2] to-[#D4B8E0]",
];

export default function Lightbox({ artwork, artworks, onClose }: LightboxProps) {
  const [current, setCurrent] = useState<Artwork | null>(artwork);
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setCurrent(artwork);
    setImgIdx(0);
    setImgError(false);
  }, [artwork]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") navigateArtwork(1);
      if (e.key === "ArrowLeft") navigateArtwork(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const navigateArtwork = (dir: number) => {
    if (!current) return;
    const idx = artworks.findIndex((a) => a.id === current.id);
    const next = artworks[(idx + dir + artworks.length) % artworks.length];
    setCurrent(next);
    setImgIdx(0);
    setImgError(false);
  };

  if (!current) return null;

  const allImages = [current.cover_image_url, ...(current.images ?? [])].filter(Boolean);
  const gradient = GRADIENTS[current.title.charCodeAt(0) % GRADIENTS.length];
  const showPlaceholder = imgError || !allImages[imgIdx];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop — gelap solid */}
        <div
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/10"
        >
          <X size={18} />
        </button>

        {/* Prev */}
        <button
          onClick={() => navigateArtwork(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next */}
        <button
          onClick={() => navigateArtwork(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
        >
          <ChevronRight size={20} />
        </button>

        {/* Main card */}
        <motion.div
          className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Image panel ── */}
          <div className="flex-1 relative bg-[#12090f] flex flex-col min-h-[280px] lg:min-h-0">
            {showPlaceholder ? (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <p className="font-accent text-white/60 text-xl px-8 text-center">
                  {current.title}
                </p>
              </div>
            ) : (
              <Image
                src={allImages[imgIdx]}
                alt={current.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 60vw"
                onError={() => setImgError(true)}
                unoptimized={allImages[imgIdx]?.includes("picsum.photos")}
              />
            )}

            {/* Thumbnail dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setImgIdx(i); setImgError(false); }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === imgIdx ? "w-5 bg-accent-primary" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Info panel — background gelap solid ── */}
          <div className="lg:w-[300px] shrink-0 bg-[#1a1018] flex flex-col gap-5 p-6 overflow-y-auto max-h-[50vh] lg:max-h-[90vh]">

            {/* Category + title */}
            <div>
              {current.category?.name && (
                <p className="text-[10px] font-mono text-accent-primary/70 uppercase tracking-[0.15em] mb-2">
                  {current.category.name}
                </p>
              )}
              <h2 className="font-display text-xl font-bold text-white leading-snug">
                {current.title}
              </h2>
              {current.year && (
                <p className="text-sm text-white/50 font-mono mt-1">{current.year}</p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Description */}
            {current.description && (
              <p className="text-sm text-white/70 leading-relaxed">
                {current.description}
              </p>
            )}

            {/* Tools */}
            {current.tools && current.tools.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                  Tools
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {current.tools.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-mono border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {current.tags && current.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {current.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* View full page */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <Link
                href={`/work/${current.slug}`}
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-medium text-accent-primary hover:text-white transition-colors"
              >
                View Full Page
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
