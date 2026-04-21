import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/public/HeroSection";
import GallerySection from "@/components/public/GallerySection";
import AboutSection from "@/components/public/AboutSection";
import ExperienceSection from "@/components/public/ExperienceSection";
import ProjectsSection from "@/components/public/ProjectsSection";
import ContactSection from "@/components/public/ContactSection";
import CommissionSection from "@/components/public/CommissionSection";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase.from("profile").select("name, tagline, bio_short").single(),
    supabase.from("settings").select("*"),
  ]);

  const settingsMap: Record<string, string> = {};
  (settings ?? []).forEach(({ key, value }: { key: string; value: string }) => {
    settingsMap[key] = value;
  });

  const title = settingsMap.site_title || `${profile?.name ?? "Cathrine"} — ${profile?.tagline ?? "Freelance Illustrator"}`;
  const description = settingsMap.meta_description || profile?.bio_short || "Freelance illustrator and character designer.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: settingsMap.og_image_url ? [settingsMap.og_image_url] : [],
    },
  };
}

async function getPageData() {
  const supabase = createClient();

  const [
    { data: profile },
    { data: artworks },
    { data: categories },
    { data: experiences },
    { data: projects },
    { data: settings },
    { data: commissionPackages },
  ] = await Promise.all([
    supabase.from("profile").select("*").single(),
    supabase
      .from("artworks")
      .select("*, category:categories(*)")
      .eq("status", "published")
      .order("sort_order"),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("experiences").select("*").order("sort_order"),
    supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("sort_order")
      .limit(3),
    supabase.from("settings").select("*"),
    supabase
      .from("commission_packages")
      .select("*")
      .order("sort_order"),
  ]);

  const settingsMap: Record<string, string> = {};
  (settings ?? []).forEach(({ key, value }: { key: string; value: string }) => {
    settingsMap[key] = value;
  });

  const featuredArtwork = (artworks ?? []).find((a) => a.is_featured) ?? artworks?.[0] ?? null;

  return {
    profile: profile ?? null,
    artworks: artworks ?? [],
    categories: categories ?? [],
    experiences: experiences ?? [],
    projects: projects ?? [],
    commissionPackages: commissionPackages ?? [],
    featuredArtwork,
    heroHeadline: settingsMap.hero_headline,
    heroSubtext: settingsMap.hero_subtext,
    commissionBanner: settingsMap.commission_status,
    commissionOpen: settingsMap.commission_open !== "false",
  };
}

export default async function HomePage() {
  const data = await getPageData();

  return (
    <>
      {/* Commission status banner */}
      {data.commissionBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 py-2 px-6 bg-accent-primary text-center">
          <p className="text-sm font-body font-medium text-white">{data.commissionBanner}</p>
        </div>
      )}

      <HeroSection
        profile={data.profile}
        featuredArtwork={data.featuredArtwork}
        heroHeadline={data.heroHeadline}
        heroSubtext={data.heroSubtext}
      />

      <GallerySection artworks={data.artworks} categories={data.categories} />

      <AboutSection profile={data.profile} />

      <ExperienceSection experiences={data.experiences} />

      <ProjectsSection projects={data.projects} />

      <CommissionSection
        packages={data.commissionPackages}
        isOpen={data.commissionOpen}
      />

      <ContactSection profile={data.profile} />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border-soft bg-bg-primary">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-tertiary font-mono">
          <p>
            © {new Date().getFullYear()} {data.profile?.name ?? "Cathrine"}. All rights reserved.
          </p>
          <p>Crafted with love ✦</p>
        </div>
      </footer>
    </>
  );
}
