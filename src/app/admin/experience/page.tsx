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
import { Plus, GripVertical, Pencil, Trash2, X, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/types";
import { EMPLOYMENT_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

const EMPTY: Omit<Experience, "id" | "sort_order"> = {
  role: "", company: "", company_logo_url: "", employment_type: "Freelance",
  location: "", start_date: "", end_date: null, is_current: false,
  description: "", highlights: [], skills: [],
};

function ExperienceCard({ exp, onEdit, onDelete }: {
  exp: Experience;
  onEdit: (exp: Experience) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: exp.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-start gap-3 p-4 bg-bg-primary border border-border-soft rounded-xl group hover:border-accent-primary/40 transition-all"
    >
      <button {...attributes} {...listeners} className="mt-1 text-text-tertiary hover:text-text-secondary cursor-grab touch-none">
        <GripVertical size={16} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-text-primary">{exp.role}</p>
            <p className="text-sm text-text-secondary">{exp.company}</p>
          </div>
          {exp.is_current && <Badge variant="green" size="sm">Current</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-xs text-text-tertiary">
            {formatDate(exp.start_date, { month: "short", year: "numeric" })}
            {" — "}
            {exp.is_current ? "Present" : exp.end_date ? formatDate(exp.end_date, { month: "short", year: "numeric" }) : "—"}
          </span>
          {exp.employment_type && (
            <Badge variant="outline" size="sm">{exp.employment_type}</Badge>
          )}
          {exp.location && <span className="text-xs text-text-tertiary">{exp.location}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(exp)} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(exp.id)} className="p-1.5 rounded-lg text-text-tertiary hover:text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function AdminExperiencePage() {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Experience, "id" | "sort_order">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("experiences").select("*").order("sort_order");
    setExperiences(data ?? []);
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
    const oldIndex = experiences.findIndex((e) => e.id === active.id);
    const newIndex = experiences.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(experiences, oldIndex, newIndex);
    setExperiences(reordered);
    const supabase = createClient();
    await Promise.all(reordered.map((e, i) => supabase.from("experiences").update({ sort_order: i }).eq("id", e.id)));
  };

  const openCreate = () => {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (exp: Experience) => {
    setForm({ ...exp });
    setEditing(exp);
    setCreating(false);
  };

  const closeForm = () => { setCreating(false); setEditing(null); };

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addHighlight = () => {
    const h = highlightInput.trim();
    if (h) { set("highlights", [...(form.highlights ?? []), h]); setHighlightInput(""); }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s) { set("skills", [...(form.skills ?? []), s]); setSkillInput(""); }
  };

  const handleSave = async () => {
    if (!form.role || !form.start_date) {
      toast("Role and start date are required.", "error");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    let error;
    if (editing) {
      ({ error } = await supabase.from("experiences").update(form).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("experiences").insert({ ...form, sort_order: experiences.length }));
    }
    setSaving(false);
    if (error) { toast(error.message, "error"); return; }
    toast(editing ? "Updated!" : "Added!", "success");
    closeForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    const supabase = createClient();
    await supabase.from("experiences").delete().eq("id", id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    toast("Deleted.", "success");
  };

  const isOpen = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Experience</h1>
          <p className="text-sm text-text-secondary mt-1">Your career timeline.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add</Button>
      </div>

      {isOpen && (
        <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-display text-text-primary">
              {editing ? "Edit Experience" : "New Experience"}
            </h2>
            <button onClick={closeForm} className="text-text-tertiary hover:text-text-primary">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Role *" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Freelance Illustrator" />
            <Input label="Company" value={form.company ?? ""} onChange={(e) => set("company", e.target.value)} placeholder="Self-employed" />
            <Input label="Location" value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="Jakarta, Indonesia" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Employment Type</label>
              <select value={form.employment_type ?? ""} onChange={(e) => set("employment_type", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary">
                {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Start Date *" type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            <div>
              <Input label="End Date" type="date" value={form.end_date ?? ""} onChange={(e) => set("end_date", e.target.value || null)} disabled={form.is_current} />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={form.is_current} onChange={(e) => { set("is_current", e.target.checked); if (e.target.checked) set("end_date", null); }} className="accent-pink-400" />
                <span className="text-sm text-text-secondary">Currently here</span>
              </label>
            </div>
          </div>

          <Textarea label="Description" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} />

          <div>
            <label className="text-sm font-medium text-text-secondary">Highlights</label>
            <div className="flex gap-2 mt-1.5">
              <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())} placeholder="Add highlight…" className="flex-1 px-4 py-2 rounded-xl bg-bg-secondary border border-border-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              <button type="button" onClick={addHighlight} className="px-3 rounded-xl bg-accent-soft text-accent-deep text-sm"><Check size={14} /></button>
            </div>
            <ul className="mt-2 space-y-1">
              {(form.highlights ?? []).map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="text-accent-primary">•</span> {h}
                  <button onClick={() => set("highlights", form.highlights!.filter((_, j) => j !== i))} className="text-text-tertiary hover:text-red-400 ml-auto"><X size={12} /></button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="text-sm font-medium text-text-secondary">Skills</label>
            <div className="flex gap-2 mt-1.5">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add skill…" className="flex-1 px-4 py-2 rounded-xl bg-bg-secondary border border-border-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              <button type="button" onClick={addSkill} className="px-3 rounded-xl bg-accent-soft text-accent-deep text-sm"><Check size={14} /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(form.skills ?? []).map((s, i) => (
                <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent-soft text-accent-deep font-mono">
                  {s}
                  <button onClick={() => set("skills", form.skills!.filter((_, j) => j !== i))}><X size={10} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border-soft">
            <Button onClick={handleSave} loading={saving}>{editing ? "Update" : "Add"}</Button>
            <Button variant="ghost" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-[80px] rounded-xl skeleton" />)}</div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-16 text-text-tertiary">
          <p className="font-display">No experience added yet.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={experiences.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
