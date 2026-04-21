"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Artwork } from "@/types";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: Artwork;
  onOpenLightbox?: (artwork: Artwork) => void;
}

/* Aspect ratio berdasarkan display_size */
const ASPECT_CLASSES: Record<string, string> = {
  small:  "aspect-square",
  medium: "aspect-[3/4]",
  large:  "aspect-[2/3]",
  wide:   "aspect-[4/3]",
  tall:   "aspect-[9/16]",
};

/* Gradient placeholder agar tetap cantik walau gambar belum ada */
const GRADIENTS = [
  "from-[#F4A7B9] to-[#D4B8E0]",
  "from-[#D4B8E0] to-[#FFCBA4]",
  "from-[#B8E0D2] to-[#F4A7B9]",
  "from-[#FFCBA4] to-[#FADADD]",
  "from-[#E8789A] to-[#D4B8E0]",
  "from-[#B8E0D2] to-[#D4B8E0]",
];

const RADIUS_VARIANTS = ["rounded-2xl", "rounded-3xl", "rounded-xl", "rounded-[20px]"];

export default function ArtworkCard({ artwork, onOpenLightbox }: ArtworkCardProps) {
  const [imgError, setImgError] = useState(false);

  const charCode  = artwork.title.charCodeAt(0);
  const radius    = RADIUS_VARIANTS[charCode % RADIUS_VARIANTS.length];
  const aspect    = ASPECT_CLASSES[artwork.display_size ?? "medium"];
  const gradient  = GRADIENTS[charCode % GRADIENTS.length];

  const showPlaceholder = imgError || !artwork.cover_image_url;

  return (
    <motion.div
      className={cn("relative overflow-hidden group cursor-pointer w-full", radius, aspect)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpenLightbox?.(artwork)}
      style={{ boxShadow: "0 2px 12px var(--shadow-color)" }}
    >
      {/* Gradient placeholder atau gambar */}
      {showPlaceholder ? (
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradient, "flex items-end p-4")}>
          <p className="font-accent text-white/70 text-sm">{artwork.title}</p>
        </div>
      ) : (
        <Image
          src={artwork.cover_image_url}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImgError(true)}
          unoptimized={artwork.cover_image_url?.includes("picsum.photos")}
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
        <p className="text-white font-display font-semibold text-sm leading-snug translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {artwork.title}
        </p>
        {artwork.year && (
          <p className="text-white/60 font-mono text-xs mt-0.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {artwork.year}
          </p>
        )}
        {artwork.tools && artwork.tools.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
            {artwork.tools.slice(0, 2).map((tool) => (
              <span key={tool} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono backdrop-blur-sm">
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── True masonry menggunakan CSS columns ── */
export function ArtworkGrid({
  artworks,
  onOpenLightbox,
}: {
  artworks: Artwork[];
  onOpenLightbox?: (artwork: Artwork) => void;
}) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4" style={{ columnGap: "12px" }}>
      {artworks.map((artwork, i) => (
        <motion.div
          key={artwork.id}
          className="break-inside-avoid mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: (i % 8) * 0.06 }}
        >
          <ArtworkCard artwork={artwork} onOpenLightbox={onOpenLightbox} />
        </motion.div>
      ))}
    </div>
  );
}

/* Export agar tidak ada import error di file lain */
export const SIZE_CLASSES: Record<string, string> = {
  small:  "col-span-1 row-span-1",
  medium: "col-span-1 row-span-2",
  large:  "col-span-1 row-span-3",
  wide:   "col-span-2 row-span-1",
  tall:   "col-span-1 row-span-3",
};
