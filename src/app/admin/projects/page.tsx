import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase.from("projects").select("*").order("sort_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Projects</h1>
          <p className="text-sm text-text-secondary mt-1">Case study deep-dives.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button><Plus size={16} /> New Project</Button>
        </Link>
      </div>

      {!projects?.length ? (
        <div className="text-center py-20 text-text-tertiary">
          <p className="font-display text-lg mb-2">No projects yet</p>
          <Link href="/admin/projects/new" className="text-accent-deep underline text-sm">
            Create your first case study
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 bg-bg-primary border border-border-soft rounded-xl hover:border-accent-primary/40 transition-all group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary truncate">{p.title}</p>
                  {p.is_featured && <Badge variant="pink" size="sm">Featured</Badge>}
                </div>
                <p className="text-xs text-text-tertiary mt-0.5 truncate">{p.subtitle ?? p.slug}</p>
              </div>
              <Badge variant={p.status === "published" ? "green" : "default"} size="sm">{p.status}</Badge>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/projects/${p.id}/edit`} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary transition-colors">
                  <Pencil size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
