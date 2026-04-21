"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import type { Artwork, Category } from "@/types";
import { ArtworkGrid } from "@/components/artwork/ArtworkCard";
import Lightbox from "@/components/artwork/Lightbox";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  artworks: Artwork[];
  categories: Category[];
}

export default function GallerySection({ artworks, categories }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);

  const filtered =
    activeCategory === "all"
      ? artworks
      : artworks.filter((a) => a.category_id === activeCategory);

  return (
    <section id="gallery" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p
              className="font-accent text-xl text-accent-deep mb-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              portfolio
            </motion.p>
            <motion.h2
              className="font-display text-4xl lg:text-5xl font-bold text-text-primary"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              My Work
            </motion.h2>
          </div>

          {/* Category filter */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body transition-all",
                activeCategory === "all"
                  ? "bg-accent-deep text-white shadow-soft"
                  : "bg-bg-secondary text-text-secondary border border-border-soft hover:border-accent-primary"
              )}
            >
              <LayoutGrid size={14} />
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-body transition-all",
                  activeCategory === cat.id
                    ? "bg-accent-deep text-white shadow-soft"
                    : "bg-bg-secondary text-text-secondary border border-border-soft hover:border-accent-primary"
                )}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.length > 0 ? (
              <ArtworkGrid artworks={filtered} onOpenLightbox={setLightboxArtwork} />
            ) : (
              <div className="text-center py-20 text-text-tertiary">
                <p className="font-accent text-2xl">No artworks in this category yet</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxArtwork && (
          <Lightbox
            artwork={lightboxArtwork}
            artworks={filtered}
            onClose={() => setLightboxArtwork(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
