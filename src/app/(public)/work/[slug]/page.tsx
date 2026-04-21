import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ArtworkGrid } from "@/components/artwork/ArtworkCard";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: artwork } = await supabase
    .from("artworks")
    .select("title, description, cover_image_url")
    .eq("slug", params.slug)
    .single();

  if (!artwork) return { title: "Artwork Not Found" };

  return {
    title: `${artwork.title} — Cathrine Ang`,
    description: artwork.description ?? undefined,
    openGraph: {
      title: artwork.title,
      images: artwork.cover_image_url ? [artwork.cover_image_url] : [],
    },
  };
}

export default async function ArtworkDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: artwork } = await supabase
    .from("artworks")
    .select("*, category:categories(*)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!artwork) notFound();

  const { data: related } = await supabase
    .from("artworks")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("category_id", artwork.category_id)
    .neq("id", artwork.id)
    .order("sort_order")
    .limit(8);

  const allImages = [artwork.cover_image_url, ...(artwork.images ?? [])].filter(Boolean);

  return (
    <div className="min-h-screen pt-20">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Gallery
        </Link>
      </div>

      {/* Hero image */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative w-full rounded-3xl overflow-hidden bg-bg-secondary aspect-[4/3] shadow-deep">
          <Image
            src={artwork.cover_image_url}
            alt={artwork.title}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1024px) 90vw, 900px"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              {artwork.category?.name && (
                <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2">
                  {artwork.category.name}
                </p>
              )}
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-text-primary">
                {artwork.title}
              </h1>
            </div>

            {artwork.description && (
              <p className="font-body text-text-secondary leading-relaxed text-base">
                {artwork.description}
              </p>
            )}

            {/* Additional images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-2 gap-4 mt-8">
                {allImages.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-bg-secondary">
                    <Image
                      src={img}
                      alt={`${artwork.title} ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 45vw, 300px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-bg-secondary rounded-2xl p-6 space-y-4">
              {artwork.year && (
                <div>
                  <p className="text-xs font-mono text-text-tertiary uppercase mb-1">Year</p>
                  <p className="text-sm font-medium text-text-primary">{artwork.year}</p>
                </div>
              )}
              {artwork.client_name && (
                <div>
                  <p className="text-xs font-mono text-text-tertiary uppercase mb-1">Client</p>
                  <p className="text-sm font-medium text-text-primary">{artwork.client_name}</p>
                </div>
              )}
              {artwork.tools && artwork.tools.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-text-tertiary uppercase mb-2">Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {artwork.tools.map((t: string) => (
                      <Badge key={t} variant="pink" size="sm">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {artwork.tags && artwork.tags.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-text-tertiary uppercase mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {artwork.tags.map((t: string) => (
                      <Badge key={t} variant="outline" size="sm">#{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-8">
            More in {artwork.category?.name ?? "Gallery"}
          </h2>
          <ArtworkGrid artworks={related} />
        </div>
      )}
    </div>
  );
}
