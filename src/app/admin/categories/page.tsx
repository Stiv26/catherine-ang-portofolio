"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

const PRESET_COLORS = [
  "#F4A7B9", "#D4B8E0", "#FFCBA4", "#B8E0D2",
  "#FADADD", "#A8D8EA", "#FCE4A8", "#C8E6C9",
];

const EMPTY = { name: "", slug: "", description: "", color: "#F4A7B9", is_active: true };

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function CategoryCard({ cat, onEdit, onDelete, onToggle }: {
  cat: Category;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 p-4 bg-bg-primary border border-border-soft rounded-xl group hover:border-accent-primary/40 transition-all"
    >
      <button {...attributes} {...listeners} className="text-text-tertiary hover:text-text-secondary cursor-grab touch-none">
        <GripVertical size={16} />
      </button>

      <div
        className="w-4 h-4 rounded-full shrink-0 border border-black/10"
        style={{ backgroundColor: cat.color ?? "#F4A7B9" }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text-primary">{cat.name}</p>
          <span className="text-xs font-mono text-text-tertiary">/{cat.slug}</span>
          {!cat.is_active && <Badge variant="outline" size="sm">Hidden</Badge>}
        </div>
        {cat.description && (
          <p className="text-xs text-text-tertiary mt-0.5 truncate">{cat.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggle(cat.id, cat.is_active)}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary transition-colors"
          title={cat.is_active ? "Hide from gallery" : "Show in gallery"}
        >
          {cat.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button
          onClick={() => onEdit(cat)}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(cat.id)}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);
    const supabase = createClient();
    await Promise.all(reordered.map((c, i) =>
      supabase.from("categories").update({ sort_order: i }).eq("id", c.id)
    ));
  };

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setForm(EMPTY);
    setSlugManual(false);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      color: cat.color ?? "#F4A7B9",
      is_active: cat.is_active,
    });
    setSlugManual(true);
    setEditing(cat);
    setCreating(false);
  };

  const closeForm = () => { setCreating(false); setEditing(null); };

  const handleNameChange = (name: string) => {
    set("name", name);
    if (!slugManual) set("slug", slugify(name));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast("Name and slug are required.", "error");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    let error;
    if (editing) {
      ({ error } = await supabase.from("categories").update(form).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("categories").insert({ ...form, sort_order: categories.length }));
    }
    setSaving(false);
    if (error) {
      toast(error.message.includes("unique") ? "Slug already exists." : error.message, "error");
      return;
    }
    toast(editing ? "Updated!" : "Category added!", "success");
    closeForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Artworks using it will lose their category.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast(error.message, "error"); return; }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast("Deleted.", "success");
  };

  const handleToggle = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("categories").update({ is_active: !current }).eq("id", id);
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c));
    toast(current ? "Hidden from gallery." : "Visible in gallery.", "success");
  };

  const isOpen = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Categories</h1>
          <p className="text-sm text-text-secondary mt-1">Manage gallery filter categories.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add</Button>
      </div>

      {isOpen && (
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-display text-text-primary">
              {editing ? "Edit Category" : "New Category"}
            </h2>
            <button onClick={closeForm} className="text-text-tertiary hover:text-text-primary">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name *"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Character Design"
            />
            <Input
              label="Slug *"
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set("slug", slugify(e.target.value)); }}
              placeholder="character-design"
              hint="Used in URL filters — lowercase, no spaces"
            />
          </div>

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Short description of this category"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">Color</label>
            <div className="flex flex-wrap gap-2 items-center">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("color", c)}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: form.color === c ? "#2D1B1B" : "transparent",
                    transform: form.color === c ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
              <div className="flex items-center gap-2 ml-1">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-border-soft"
                  title="Custom color"
                />
                <span className="text-xs font-mono text-text-tertiary">{form.color}</span>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
              className="accent-pink-400"
            />
            <span className="text-sm text-text-secondary">Visible in gallery filter</span>
          </label>

          <div className="flex gap-2 pt-2 border-t border-border-soft">
            <Button onClick={handleSave} loading={saving}>{editing ? "Update" : "Add"}</Button>
            <Button variant="ghost" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-[68px] rounded-xl skeleton" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-text-tertiary border border-dashed border-border-soft rounded-2xl">
          <p className="font-display">No categories yet.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
