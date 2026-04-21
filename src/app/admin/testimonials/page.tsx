"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/types";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

const EMPTY = {
  client_name: "", client_title: "", client_avatar_url: "",
  quote: "", is_featured: false, sort_order: 0,
};

export default function AdminTestimonialsPage() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setTestimonials(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => { setForm(EMPTY); setCreating(true); setEditing(null); };
  const openEdit = (t: Testimonial) => {
    setForm({
      client_name: t.client_name,
      client_title: t.client_title ?? "",
      client_avatar_url: t.client_avatar_url ?? "",
      quote: t.quote,
      is_featured: t.is_featured,
      sort_order: t.sort_order,
    });
    setEditing(t);
    setCreating(false);
  };
  const closeForm = () => { setCreating(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.client_name || !form.quote) {
      toast("Name and quote are required.", "error");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    let error;
    if (editing) {
      ({ error } = await supabase.from("testimonials").update(form).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("testimonials").insert({ ...form, sort_order: testimonials.length }));
    }
    setSaving(false);
    if (error) { toast(error.message, "error"); return; }
    toast(editing ? "Updated!" : "Added!", "success");
    closeForm();
    load();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("testimonials").update({ is_featured: !current }).eq("id", id);
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, is_featured: !current } : t));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    toast("Deleted.", "success");
  };

  const isOpen = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Testimonials</h1>
          <p className="text-sm text-text-secondary mt-1">Client reviews and feedback.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add</Button>
      </div>

      {isOpen && (
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-display">{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
            <button onClick={closeForm}><X size={18} className="text-text-tertiary" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Client Name *" value={form.client_name} onChange={(e) => set("client_name", e.target.value)} />
            <Input label="Title / Company" value={form.client_title ?? ""} onChange={(e) => set("client_title", e.target.value)} placeholder="Art Director at Studio X" />
          </div>
          <Textarea label="Quote *" value={form.quote} onChange={(e) => set("quote", e.target.value)} rows={3} placeholder="Working with Cathrine was…" />
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="accent-pink-400" />
            <span className="text-sm text-text-secondary">Featured (shown on homepage)</span>
          </label>
          <div className="flex gap-2 pt-2 border-t border-border-soft">
            <Button onClick={handleSave} loading={saving}>{editing ? "Update" : "Add"}</Button>
            <Button variant="ghost" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-[90px] rounded-xl skeleton" />)}</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 text-text-tertiary font-display">No testimonials yet.</div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="flex gap-4 p-4 bg-bg-primary border border-border-soft rounded-xl group hover:border-accent-primary/40 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-text-primary">{t.client_name}</p>
                  {t.client_title && <span className="text-xs text-text-tertiary">— {t.client_title}</span>}
                  {t.is_featured && <Badge variant="pink" size="sm">Featured</Badge>}
                </div>
                <p className="text-sm text-text-secondary italic line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => handleToggleFeatured(t.id, t.is_featured)} className={`p-1.5 rounded-lg transition-colors ${t.is_featured ? "text-accent-deep bg-accent-soft" : "text-text-tertiary hover:text-accent-primary"}`}>
                  <Star size={14} fill={t.is_featured ? "currentColor" : "none"} />
                </button>
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-text-tertiary hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
