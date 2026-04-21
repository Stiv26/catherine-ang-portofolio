"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/types";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

/* ─── Change Password Section ─── */
function ChangePasswordCard() {
  const { toast } = useToast();
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.current) e.current = "Enter your current password";
    if (form.newPw.length < 8) e.newPw = "Password must be at least 8 characters";
    if (form.newPw !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = async () => {
    if (!validate()) return;
    setSaving(true);

    const supabase = createClient();

    // Re-auth dengan password lama dulu untuk verifikasi
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { toast("Not authenticated", "error"); setSaving(false); return; }

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: form.current,
    });

    if (signInErr) {
      setErrors({ current: "Current password is incorrect" });
      setSaving(false);
      return;
    }

    // Update ke password baru
    const { error } = await supabase.auth.updateUser({ password: form.newPw });
    setSaving(false);

    if (error) {
      toast(error.message, "error");
      return;
    }

    toast("Password changed successfully!", "success");
    setForm({ current: "", newPw: "", confirm: "" });
    setErrors({});
  };

  const PasswordInput = ({
    label, field, placeholder,
  }: { label: string; field: "current" | "newPw" | "confirm"; placeholder?: string }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <div className="relative">
        <input
          type={show[field] ? "text" : "password"}
          value={form[field]}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          placeholder={placeholder ?? "••••••••"}
          className="w-full px-4 py-2.5 pr-11 rounded-xl bg-bg-secondary border border-border-soft text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((p) => ({ ...p, [field]: !p[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
        >
          {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
          <KeyRound size={15} className="text-accent-deep" />
        </div>
        <div>
          <h2 className="text-base font-semibold font-display text-text-primary">Change Password</h2>
          <p className="text-xs text-text-tertiary">Update your admin login password</p>
        </div>
      </div>

      <PasswordInput label="Current Password" field="current" />
      <PasswordInput label="New Password" field="newPw" placeholder="Min. 8 characters" />
      <PasswordInput label="Confirm New Password" field="confirm" />

      <Button onClick={handleChange} loading={saving} className="w-full sm:w-auto">
        <ShieldCheck size={15} />
        Update Password
      </Button>
    </div>
  );
}

/* ─── Main Settings Page ─── */
export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("*");
      if (data) {
        const map: SiteSettings = {};
        data.forEach(({ key, value }: { key: string; value: string }) => {
          (map as Record<string, string>)[key] = value;
        });
        setSettings(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  const set = (key: keyof SiteSettings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const entries = Object.entries(settings).map(([key, value]) => ({
      key,
      value: value ?? "",
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("settings").upsert(entries, { onConflict: "key" });
    setSaving(false);
    if (error) { toast(error.message, "error"); return; }
    toast("Settings saved!", "success");
  };

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-2xl skeleton" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Settings</h1>
          <p className="text-sm text-text-secondary mt-1">Site-wide configuration.</p>
        </div>
        <Button onClick={handleSave} loading={saving}>Save</Button>
      </div>

      {/* SEO */}
      <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold font-display text-text-primary">SEO & Meta</h2>
        <Input
          label="Site Title"
          value={settings.site_title ?? ""}
          onChange={(e) => set("site_title", e.target.value)}
          placeholder="Cathrine Ang — Freelance Illustrator"
        />
        <Textarea
          label="Meta Description"
          value={settings.meta_description ?? ""}
          onChange={(e) => set("meta_description", e.target.value)}
          rows={2}
          placeholder="Portfolio of Cathrine Ang…"
        />
        <Input
          label="OG Image URL"
          value={settings.og_image_url ?? ""}
          onChange={(e) => set("og_image_url", e.target.value)}
          placeholder="https://…"
        />
      </div>

      {/* Hero override */}
      <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold font-display text-text-primary">Hero Override</h2>
        <Input
          label="Hero Headline"
          value={settings.hero_headline ?? ""}
          onChange={(e) => set("hero_headline", e.target.value)}
          placeholder="Leave blank to use profile name"
        />
        <Textarea
          label="Hero Subtext"
          value={settings.hero_subtext ?? ""}
          onChange={(e) => set("hero_subtext", e.target.value)}
          rows={2}
          placeholder="Leave blank to use short bio"
        />
      </div>

      {/* Commission banner */}
      <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold font-display text-text-primary">
          Commission Status Banner
        </h2>
        <p className="text-sm text-text-secondary">
          Shown as a top banner on the public site when set.
        </p>
        <Input
          label="Banner Text"
          value={settings.commission_status ?? ""}
          onChange={(e) => set("commission_status", e.target.value)}
          placeholder="✦ Currently open for commissions — DM on Instagram"
          hint="Leave empty to hide the banner."
        />
      </div>

      {/* Change Password */}
      <ChangePasswordCard />
    </div>
  );
}
