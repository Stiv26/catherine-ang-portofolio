import { createClient } from "@/lib/supabase/server";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { ToastProvider } from "@/components/ui/Toast";

export default async function NewArtworkPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <ToastProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Upload Artwork</h1>
          <p className="text-sm text-text-secondary mt-1">Add a new piece to your portfolio.</p>
        </div>
        <ArtworkForm categories={categories ?? []} />
      </div>
    </ToastProvider>
  );
}
