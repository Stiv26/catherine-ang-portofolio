"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus, GripVertical, Star, Eye, EyeOff, Trash2, Pencil, Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Artwork, Category } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

function SortableRow({ artwork, onToggle, onDelete }: {
  artwork: Artwork;
  onToggle: (id: string, field: "status" | "is_featured") => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: artwork.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-3 bg-bg-primary border border-border-soft rounded-xl hover:border-accent-primary/40 transition-all group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-text-tertiary hover:text-text-secondary touch-none cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>

      <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-secondary shrink-0">
        {artwork.cover_image_url ? (
          <Image
            src={artwork.cover_image_url}
            alt={artwork.title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
            No img
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{artwork.title}</p>
        <p className="text-xs text-text-tertiary font-mono truncate">{artwork.slug}</p>
      </div>

      <Badge variant={artwork.status === "published" ? "green" : "default"} size="sm">
        {artwork.status}
      </Badge>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggle(artwork.id, "is_featured")}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            artwork.is_featured
              ? "text-accent-deep bg-accent-soft"
              : "text-text-tertiary hover:text-accent-primary"
          )}
          title="Toggle featured"
        >
          <Star size={14} fill={artwork.is_featured ? "currentColor" : "none"} />
        </button>

        <button
          onClick={() => onToggle(artwork.id, "status")}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary transition-colors"
          title="Toggle publish"
        >
          {artwork.status === "published" ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>

        <Link
          href={`/admin/artworks/${artwork.id}/edit`}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary transition-colors"
        >
          <Pencil size={14} />
        </Link>

        <button
          onClick={() => onDelete(artwork.id)}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function AdminArtworksPage() {
  const { toast } = useToast();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [{ data: artworksData }, { data: categoriesData }] = await Promise.all([
      supabase.from("artworks").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setArtworks(artworksData ?? []);
    setCategories(categoriesData ?? []);
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

    const oldIndex = artworks.findIndex((a) => a.id === active.id);
    const newIndex = artworks.findIndex((a) => a.id === over.id);
    const reordered = arrayMove(artworks, oldIndex, newIndex);

    setArtworks(reordered);

    const supabase = createClient();
    await Promise.all(
      reordered.map((a, i) =>
        supabase.from("artworks").update({ sort_order: i }).eq("id", a.id)
      )
    );
  };

  const handleToggle = async (id: string, field: "status" | "is_featured") => {
    const artwork = artworks.find((a) => a.id === id);
    if (!artwork) return;

    const supabase = createClient();
    const newValue =
      field === "status"
        ? artwork.status === "published" ? "draft" : "published"
        : !artwork.is_featured;

    await supabase.from("artworks").update({ [field]: newValue }).eq("id", id);
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: newValue } : a))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this artwork? This cannot be undone.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("artworks").delete().eq("id", id);
    if (error) { toast("Delete failed.", "error"); return; }
    setArtworks((prev) => prev.filter((a) => a.id !== id));
    toast("Artwork deleted.", "success");
  };

  const filtered = artworks.filter((a) => {
    if (filter && a.category_id !== filter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Artworks</h1>
          <p className="text-sm text-text-secondary mt-1">
            {artworks.length} total · Drag to reorder
          </p>
        </div>
        <Link href="/admin/artworks/new">
          <Button>
            <Plus size={16} />
            Upload
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-text-tertiary" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-xl bg-bg-primary border border-border-soft text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-xl bg-bg-primary border border-border-soft text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary"
        >
          <option value="">All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[68px] rounded-xl skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-text-tertiary">
          <p className="text-lg font-display mb-2">No artworks yet</p>
          <p className="text-sm">
            <Link href="/admin/artworks/new" className="text-accent-deep underline">
              Upload your first artwork
            </Link>
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filtered.map((artwork) => (
                <SortableRow
                  key={artwork.id}
                  artwork={artwork}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
