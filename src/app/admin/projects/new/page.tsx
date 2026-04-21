import ProjectForm from "@/components/admin/ProjectForm";
import { ToastProvider } from "@/components/ui/Toast";

export default function NewProjectPage() {
  return (
    <ToastProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">New Project</h1>
          <p className="text-sm text-text-secondary mt-1">Create a case study.</p>
        </div>
        <ProjectForm />
      </div>
    </ToastProvider>
  );
}
