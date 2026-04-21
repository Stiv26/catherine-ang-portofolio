import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";
import { ToastProvider } from "@/components/ui/Toast";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single();
  if (!project) notFound();

  return (
    <ToastProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Edit Project</h1>
          <p className="text-sm text-text-secondary mt-1 font-mono">{project.slug}</p>
        </div>
        <ProjectForm project={project} />
      </div>
    </ToastProvider>
  );
}
