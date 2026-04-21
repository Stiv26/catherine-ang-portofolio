import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Image, Folder, Briefcase, Plus, Star } from "lucide-react";

async function getStats() {
  const supabase = createClient();
  const [artworks, projects, experiences, categories] = await Promise.all([
    supabase.from("artworks").select("id, is_featured, status"),
    supabase.from("projects").select("id, status"),
    supabase.from("experiences").select("id"),
    supabase.from("categories").select("id"),
  ]);

  const totalArtworks = artworks.data?.length ?? 0;
  const featuredArtworks = artworks.data?.filter((a) => a.is_featured).length ?? 0;
  const publishedArtworks = artworks.data?.filter((a) => a.status === "published").length ?? 0;
  const totalProjects = projects.data?.length ?? 0;
  const totalExperiences = experiences.data?.length ?? 0;
  const totalCategories = categories.data?.length ?? 0;

  return { totalArtworks, featuredArtworks, publishedArtworks, totalProjects, totalExperiences, totalCategories };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Artworks",
      value: stats.totalArtworks,
      sub: `${stats.publishedArtworks} published`,
      icon: Image,
      color: "bg-accent-soft text-accent-deep",
      href: "/admin/artworks",
    },
    {
      label: "Featured",
      value: stats.featuredArtworks,
      sub: "in hero & highlights",
      icon: Star,
      color: "bg-[rgba(212,184,224,0.3)] text-[#7B5EA7]",
      href: "/admin/artworks",
    },
    {
      label: "Projects",
      value: stats.totalProjects,
      sub: "case studies",
      icon: Folder,
      color: "bg-[rgba(184,224,210,0.3)] text-[#3D8B70]",
      href: "/admin/projects",
    },
    {
      label: "Experience",
      value: stats.totalExperiences,
      sub: `${stats.totalCategories} categories`,
      icon: Briefcase,
      color: "bg-[rgba(255,203,164,0.3)] text-[#C47B3A]",
      href: "/admin/experience",
    },
  ];

  const quickActions = [
    { label: "Upload Artwork", href: "/admin/artworks/new", icon: Image },
    { label: "New Project", href: "/admin/projects/new", icon: Folder },
    { label: "Add Experience", href: "/admin/experience", icon: Briefcase },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1 font-body text-sm">
          Welcome back. Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-bg-primary border border-border-soft rounded-2xl p-5 hover:shadow-card transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold font-display text-text-primary">{value}</p>
            <p className="text-sm font-medium text-text-secondary mt-0.5">{label}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold font-display text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-2.5 bg-bg-primary border border-border-soft rounded-xl text-sm font-medium font-body text-text-secondary hover:text-accent-deep hover:border-accent-primary hover:bg-accent-soft transition-all"
            >
              <Plus size={15} className="text-accent-deep" />
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-accent-soft/40 border border-accent-primary/20 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-accent-deep mb-2">
          ✦ Getting Started
        </h3>
        <ol className="text-sm text-text-secondary space-y-1.5 list-decimal list-inside">
          <li>Upload your best artworks and mark a few as <strong>Featured</strong></li>
          <li>Fill in your <strong>Profile</strong> — bio, photo, and social links</li>
          <li>Add your <strong>Experience</strong> timeline</li>
          <li>Create 2–3 <strong>Project</strong> case studies for depth</li>
          <li>Set your <strong>availability status</strong> in Settings</li>
        </ol>
      </div>
    </div>
  );
}
