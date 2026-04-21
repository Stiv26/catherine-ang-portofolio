"use client";

import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, GripVertical, BadgeCheck, ToggleLeft, ToggleRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { CommissionPackage } from "@/types";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

/* ─── helpers ─── */
const CURRENCIES = ["IDR", "USD", "EUR", "SGD"];

const EMPTY_FORM: Omit<CommissionPackage, "id" | "created_at" | "updated_at"> = {
  title: "",
  description: "",
  price: 0,
  currency: "IDR",
  price_note: "",
  includes: [],
  turnaround: "",
  badge: "",
  is_available: true,
  sort_order: 0,
};

/* ─── Modal ─── */
function PackageModal({
  initial,
  onClose,
  onSave,
}: {
  initial: typeof EMPTY_FORM & { id?: string };
  onClose: () => void;
  onSave: (data: typeof EMPTY_FORM & { id?: string }) => Promise<void>;
}) {
  const [form, setForm] = useState(initial);
  const [includesText, setIncludesText] = useState((initial.includes ?? []).join("\n"));
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof EMPTY_FORM>(k: K, v: (typeof EMPTY_FORM)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const includes = includesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    await onSave({ ...form, includes });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-bg-primary border border-border-soft rounded-2xl shadow-deep p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="font-display text-lg font-bold text-text-primary">
          {form.id ? "Edit Package" : "New Package"}
        </h2>

        <Input
          label="Package Title *"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Bust Illustration"
        />

        <Textarea
          label="Short Description"
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          rows={2}
          placeholder="Brief description of what this package covers"
        />

        {/* Price row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Price *</label>
            <input
              type="number"
              value={form.price}
              min={0}
              onChange={(e) => set("price", Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Price Note"
          value={form.price_note ?? ""}
          onChange={(e) => set("price_note", e.target.value)}
          placeholder='e.g. "starting from" or "per character"'
        />

        <Input
          label="Turnaround"
          value={form.turnaround ?? ""}
          onChange={(e) => set("turnaround", e.target.value)}
          placeholder="e.g. 5–7 business days"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            What&apos;s Included
            <span className="text-text-tertiary font-normal ml-1">(one item per line)</span>
          </label>
          <textarea
            value={includesText}
            onChange={(e) => setIncludesText(e.target.value)}
            rows={5}
            placeholder={"Full body character illustration\n2 revisions included\nHigh-res PNG file\nCommercial license"}
            className="px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all resize-none"
          />
        </div>

        <Input
          label="Badge"
          value={form.badge ?? ""}
          onChange={(e) => set("badge", e.target.value)}
          placeholder='e.g. "Popular" or "Best Value" — leave empty to hide'
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              min={0}
              onChange={(e) => set("sort_order", Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Available</label>
            <button
              type="button"
              onClick={() => set("is_available", !form.is_available)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                form.is_available
                  ? "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
                  : "bg-bg-secondary border-border-soft text-text-tertiary"
              }`}
            >
              {form.is_available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              {form.is_available ? "Shown" : "Hidden"}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border-soft">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>Save Package</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminCommissionsPage() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<CommissionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [commissionOpen, setCommissionOpen] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [modal, setModal] = useState<(typeof EMPTY_FORM & { id?: string }) | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  /* fetch */
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const [{ data: pkgs }, { data: settings }] = await Promise.all([
        supabase.from("commission_packages").select("*").order("sort_order"),
        supabase.from("settings").select("value").eq("key", "commission_open").single(),
      ]);
      setPackages(pkgs ?? []);
      setCommissionOpen((settings?.value ?? "true") !== "false");
      setLoading(false);
    };
    load();
  }, []);

  /* toggle open/closed status */
  const toggleStatus = async () => {
    setSavingStatus(true);
    const supabase = createClient();
    const newVal = !commissionOpen;
    await supabase
      .from("settings")
      .upsert({ key: "commission_open", value: String(newVal), updated_at: new Date().toISOString() }, { onConflict: "key" });
    setCommissionOpen(newVal);
    setSavingStatus(false);
    toast(`Commissions are now ${newVal ? "open" : "closed"}`, "success");
  };

  /* save (create / update) */
  const handleSave = async (data: typeof EMPTY_FORM & { id?: string }) => {
    const supabase = createClient();
    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await supabase
        .from("commission_packages")
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) { toast(error.message, "error"); return; }
      setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...rest } as CommissionPackage : p)));
      toast("Package updated!", "success");
    } else {
      const { data: created, error } = await supabase
        .from("commission_packages")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) { toast(error.message, "error"); return; }
      setPackages((prev) => [...prev, created]);
      toast("Package created!", "success");
    }
    setModal(null);
  };

  /* delete */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase.from("commission_packages").delete().eq("id", id);
    if (error) { toast(error.message, "error"); setDeleting(null); return; }
    setPackages((prev) => prev.filter((p) => p.id !== id));
    toast("Package deleted.", "success");
    setDeleting(null);
  };

  const openCreate = () =>
    setModal({ ...EMPTY_FORM, sort_order: packages.length });
  const openEdit = (pkg: CommissionPackage) =>
    setModal({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description ?? "",
      price: pkg.price,
      currency: pkg.currency,
      price_note: pkg.price_note ?? "",
      includes: pkg.includes ?? [],
      turnaround: pkg.turnaround ?? "",
      badge: pkg.badge ?? "",
      is_available: pkg.is_available,
      sort_order: pkg.sort_order,
    });

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-2xl skeleton" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Commissions</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your commission packages and availability.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={15} />
          Add Package
        </Button>
      </div>

      {/* Commission Status toggle */}
      <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${commissionOpen ? "bg-green-100 dark:bg-green-900/30" : "bg-bg-tertiary"}`}>
            <BadgeCheck size={18} className={commissionOpen ? "text-green-600 dark:text-green-400" : "text-text-tertiary"} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary font-display">Commission Status</p>
            <p className="text-xs text-text-tertiary mt-0.5">
              {commissionOpen
                ? "Visible on public page as OPEN — visitors can book"
                : "Visible on public page as CLOSED — booking disabled"}
            </p>
          </div>
        </div>
        <button
          onClick={toggleStatus}
          disabled={savingStatus}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
            commissionOpen
              ? "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/40"
              : "bg-bg-secondary border-border-soft text-text-secondary hover:bg-bg-tertiary"
          } disabled:opacity-60`}
        >
          {commissionOpen ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          {commissionOpen ? "Open" : "Closed"}
        </button>
      </div>

      {/* Packages list */}
      <div className="space-y-3">
        {packages.length === 0 ? (
          <div className="text-center py-16 text-text-tertiary font-mono text-sm border border-dashed border-border-soft rounded-2xl">
            No packages yet — click &quot;Add Package&quot; to create one.
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-bg-primary border border-border-soft rounded-2xl p-5 flex items-start gap-4 hover:border-accent-primary/30 transition-colors"
            >
              <GripVertical size={16} className="text-text-tertiary mt-1 shrink-0 cursor-grab" />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-display font-semibold text-text-primary">{pkg.title}</p>
                  {pkg.badge && (
                    <span className="text-[10px] bg-accent-primary text-white px-2 py-0.5 rounded-full font-mono">
                      {pkg.badge}
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      pkg.is_available
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-bg-tertiary text-text-tertiary"
                    }`}
                  >
                    {pkg.is_available ? "Shown" : "Hidden"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-text-secondary mt-1">
                  <span className="font-mono font-semibold text-text-primary">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: pkg.currency,
                      maximumFractionDigits: 0,
                    }).format(pkg.price)}
                  </span>
                  {pkg.turnaround && (
                    <span className="text-text-tertiary font-mono text-xs">{pkg.turnaround}</span>
                  )}
                  {pkg.includes && pkg.includes.length > 0 && (
                    <span className="text-text-tertiary text-xs">
                      {pkg.includes.length} items included
                    </span>
                  )}
                </div>

                {pkg.description && (
                  <p className="text-xs text-text-tertiary mt-1 line-clamp-1">{pkg.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(pkg)}
                  className="p-2 rounded-lg text-text-tertiary hover:text-accent-deep hover:bg-accent-soft transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  disabled={deleting === pkg.id}
                  className="p-2 rounded-lg text-text-tertiary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modal && (
        <PackageModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
