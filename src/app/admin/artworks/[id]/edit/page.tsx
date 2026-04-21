import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { ToastProvider } from "@/components/ui/Toast";

export default async function EditArtworkPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: artwork }, { data: categories }] = await Promise.all([
    supabase.from("artworks").select("*").eq("id", params.id).single(),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  if (!artwork) notFound();

  return (
    <ToastProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Edit Artwork</h1>
          <p className="text-sm text-text-secondary mt-1 font-mono">{artwork.slug}</p>
        </div>
        <ArtworkForm artwork={artwork} categories={categories ?? []} />
      </div>
    </ToastProvider>
  );
}
