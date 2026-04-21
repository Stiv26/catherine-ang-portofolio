"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { ILLUSTRATION_TOOLS } from "@/lib/constants";
import type { Project } from "@/types";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import { ImageUpload, MultiImageUpload } from "./ImageUpload";
import { useToast } from "@/components/ui/Toast";

interface ProjectFormProps {
  project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    subtitle: project?.subtitle ?? "",
    description: project?.description ?? "",
    cover_image_url: project?.cover_image_url ?? "",
    images: project?.images ?? [],
    category: project?.category ?? "",
    client: project?.client ?? "",
    role: project?.role ?? "",
    year: project?.year ?? new Date().getFullYear(),
    duration: project?.duration ?? "",
    tools: project?.tools ?? [],
    tags: project?.tags ?? [],
    challenge: project?.challenge ?? "",
    process: project?.process ?? "",
    outcome: project?.outcome ?? "",
    external_url: project?.external_url ?? "",
    is_featured: project?.is_featured ?? false,
    status: project?.status ?? "draft",
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (title: string) => {
    set("title", title);
    if (!project) set("slug", generateSlug(title));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const toggleTool = (tool: string) => {
    const tools = form.tools.includes(tool)
      ? form.tools.filter((t) => t !== tool)
      : [...form.tools, tool];
    set("tools", tools);
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title) { toast("Title is required.", "error"); return; }
    setSaving(true);
    const supabase = createClient();
    const data = { ...form, status: publish ? "published" : form.status, updated_at: new Date().toISOString() };
    let error;
    if (project) {
      ({ error } = await supabase.from("projects").update(data).eq("id", project.id));
    } else {
      ({ error } = await supabase.from("projects").insert(data));
    }
    setSaving(false);
    if (error) { toast(error.message, "error"); return; }
    toast(project ? "Project updated!" : "Project created!", "success");
    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold font-display">Overview</h2>
          <Input label="Title *" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
          <Input label="Slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          <Input label="Subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="A short punchy description" />
          <Textarea label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
        </div>

        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold font-display">Case Study</h2>
          <Textarea label="Challenge / Brief" value={form.challenge} onChange={(e) => set("challenge", e.target.value)} rows={4} placeholder="What was the problem or creative brief?" />
          <Textarea label="Process" value={form.process} onChange={(e) => set("process", e.target.value)} rows={5} placeholder="How did you approach it?" />
          <Textarea label="Outcome / Result" value={form.outcome} onChange={(e) => set("outcome", e.target.value)} rows={3} placeholder="What was the result?" />
        </div>

        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold font-display">Images</h2>
          <ImageUpload value={form.cover_image_url} onChange={(url) => set("cover_image_url", url)} label="Cover Image" />
          <MultiImageUpload values={form.images as string[]} onChange={(urls) => set("images", urls)} folder="projects" />
        </div>

        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold font-display">Tools</h2>
          <div className="flex flex-wrap gap-2">
            {ILLUSTRATION_TOOLS.map((tool) => (
              <button key={tool} type="button" onClick={() => toggleTool(tool)} className={`text-xs px-3 py-1.5 rounded-full border transition-all font-mono ${form.tools.includes(tool) ? "bg-accent-soft border-accent-primary text-accent-deep" : "bg-bg-secondary border-border-soft text-text-secondary hover:border-accent-primary"}`}>
                {tool}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold font-display">Publish</h2>
          <Button onClick={() => handleSave(true)} loading={saving} className="w-full">
            {form.status === "published" ? "Update" : "Publish"}
          </Button>
          <Button onClick={() => handleSave()} variant="secondary" loading={saving} className="w-full">Save Draft</Button>
          <Button onClick={() => router.back()} variant="ghost" className="w-full">Cancel</Button>
          <div className="pt-2 border-t border-border-soft">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="accent-pink-400" />
              <span className="text-sm text-text-secondary">Featured on homepage</span>
            </label>
          </div>
        </div>

        <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-semibold font-display">Meta</h2>
          <Input label="Client" value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="Studio Name" />
          <Input label="Your Role" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Lead Illustrator" />
          <Input label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Character Design" />
          <Input label="Year" type="number" value={form.year ?? ""} onChange={(e) => set("year", parseInt(e.target.value) || null)} />
          <Input label="Duration" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="3 months" />
          <Input label="External URL" value={form.external_url} onChange={(e) => set("external_url", e.target.value)} placeholder="https://…" />
        </div>

        <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold font-display">Tags</h2>
          <div className="flex gap-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag…" className="flex-1 px-3 py-2 rounded-xl bg-bg-secondary border border-border-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary" />
            <button type="button" onClick={addTag} className="px-3 rounded-xl bg-accent-soft text-accent-deep text-sm">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent-soft text-accent-deep font-mono">
                {tag}
                <button onClick={() => set("tags", form.tags.filter((t) => t !== tag))}><X size={10} /></button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
