"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { ILLUSTRATION_TOOLS, DISPLAY_SIZES } from "@/lib/constants";
import type { Artwork, Category, DisplaySize } from "@/types";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import { ImageUpload, MultiImageUpload } from "./ImageUpload";
import { useToast } from "@/components/ui/Toast";

interface ArtworkFormProps {
  artwork?: Artwork;
  categories: Category[];
}

export default function ArtworkForm({ artwork, categories }: ArtworkFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: artwork?.title ?? "",
    slug: artwork?.slug ?? "",
    description: artwork?.description ?? "",
    category_id: artwork?.category_id ?? "",
    cover_image_url: artwork?.cover_image_url ?? "",
    images: artwork?.images ?? [],
    is_featured: artwork?.is_featured ?? false,
    display_size: (artwork?.display_size ?? "medium") as DisplaySize,
    tags: artwork?.tags ?? [],
    tools: artwork?.tools ?? [],
    year: artwork?.year ?? new Date().getFullYear(),
    client_name: artwork?.client_name ?? "",
    is_client_work: artwork?.is_client_work ?? false,
    status: artwork?.status ?? "draft",
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (title: string) => {
    set("title", title);
    if (!artwork) set("slug", generateSlug(title));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      set("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => set("tags", form.tags.filter((t) => t !== tag));

  const toggleTool = (tool: string) => {
    const tools = form.tools.includes(tool)
      ? form.tools.filter((t) => t !== tool)
      : [...form.tools, tool];
    set("tools", tools);
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.cover_image_url) {
      toast("Title and cover image are required.", "error");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const data = {
      ...form,
      status: publish ? "published" : form.status,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (artwork) {
      ({ error } = await supabase.from("artworks").update(data).eq("id", artwork.id));
    } else {
      ({ error } = await supabase.from("artworks").insert(data));
    }

    setSaving(false);
    if (error) {
      toast(error.message, "error");
      return;
    }

    toast(artwork ? "Artwork updated!" : "Artwork created!", "success");
    router.push("/admin/artworks");
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Main form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold font-display text-text-primary">Details</h2>

          <Input
            label="Title *"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Moonlit Forest"
          />

          <Input
            label="Slug (URL)"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="moonlit-forest"
            hint="Auto-generated from title. Edit if needed."
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="A brief description of this artwork…"
            rows={4}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary font-body">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold font-display text-text-primary">Images</h2>
          <ImageUpload
            label="Cover Image *"
            value={form.cover_image_url}
            onChange={(url) => set("cover_image_url", url)}
          />
          <MultiImageUpload
            values={form.images as string[]}
            onChange={(urls) => set("images", urls)}
          />
        </div>

        {/* Tools */}
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold font-display text-text-primary">Tools Used</h2>
          <div className="flex flex-wrap gap-2">
            {ILLUSTRATION_TOOLS.map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-mono ${
                  form.tools.includes(tool)
                    ? "bg-accent-soft border-accent-primary text-accent-deep"
                    : "bg-bg-secondary border-border-soft text-text-secondary hover:border-accent-primary"
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold font-display text-text-primary">Tags</h2>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add tag…"
              className="flex-1 px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary font-body text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>
              <Plus size={14} />
              Add
            </Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent-soft text-accent-deep font-mono"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-accent-deep/60">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Settings */}
      <div className="space-y-4">
        {/* Publish */}
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold font-display text-text-primary">Publish</h2>
          <div className="flex flex-col gap-2">
            <Button onClick={() => handleSave(true)} loading={saving} className="w-full">
              {form.status === "published" ? "Update" : "Publish"}
            </Button>
            <Button onClick={() => handleSave()} variant="secondary" loading={saving} className="w-full">
              Save Draft
            </Button>
            <Button onClick={() => router.back()} variant="ghost" className="w-full">
              Cancel
            </Button>
          </div>
          <div className="pt-2 border-t border-border-soft">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set("is_featured", e.target.checked)}
                className="w-4 h-4 accent-pink-400"
              />
              <span className="text-sm text-text-secondary">Featured in Hero</span>
            </label>
          </div>
        </div>

        {/* Display size */}
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold font-display text-text-primary">Display Size</h2>
          <div className="space-y-2">
            {DISPLAY_SIZES.map(({ value, label, description }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-bg-secondary transition-colors">
                <input
                  type="radio"
                  name="display_size"
                  value={value}
                  checked={form.display_size === value}
                  onChange={() => set("display_size", value)}
                  className="accent-pink-400"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">{label}</p>
                  <p className="text-xs text-text-tertiary">{description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-semibold font-display text-text-primary">Meta</h2>
          <Input
            label="Year"
            type="number"
            value={form.year ?? ""}
            onChange={(e) => set("year", parseInt(e.target.value) || null)}
            min={2000}
            max={2099}
          />
          <Input
            label="Client Name"
            value={form.client_name}
            onChange={(e) => set("client_name", e.target.value)}
            placeholder="Optional"
          />
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_client_work}
              onChange={(e) => set("is_client_work", e.target.checked)}
              className="w-4 h-4 accent-pink-400"
            />
            <span className="text-sm text-text-secondary">Client work</span>
          </label>
        </div>
      </div>
    </div>
  );
}
