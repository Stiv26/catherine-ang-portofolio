"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

const AVAILABILITY_OPTIONS = ["Available for work", "Fully booked", "Selective"] as const;

export default function AdminProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: "Cathrine",
    tagline: "",
    bio_short: "",
    bio_long: "",
    profile_photo_url: "",
    email: "",
    location: "",
    availability_status: "Available for work",
    availability_note: "",
    instagram_url: "",
    twitter_url: "",
    behance_url: "",
    artstation_url: "",
    tiktok_url: "",
    services: [],
  });
  const [serviceInput, setServiceInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("profile").select("*").single();
      if (data) setProfile(data);
      setLoading(false);
    };
    load();
  }, []);

  const set = (key: string, value: unknown) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const addService = () => {
    const s = serviceInput.trim();
    if (s && !(profile.services ?? []).includes(s)) {
      set("services", [...(profile.services ?? []), s]);
    }
    setServiceInput("");
  };

  const removeService = (s: string) =>
    set("services", (profile.services ?? []).filter((x) => x !== s));

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: existing } = await supabase.from("profile").select("id").single();
    let error;
    if (existing) {
      ({ error } = await supabase.from("profile").update({ ...profile, updated_at: new Date().toISOString() }).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("profile").insert(profile));
    }
    setSaving(false);
    if (error) { toast(error.message, "error"); return; }
    toast("Profile saved!", "success");
  };

  if (loading) return <div className="h-48 rounded-2xl skeleton" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Profile</h1>
          <p className="text-sm text-text-secondary mt-1">Edit your public about section.</p>
        </div>
        <Button onClick={handleSave} loading={saving}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold font-display">Identity</h2>
            <Input label="Name" value={profile.name ?? ""} onChange={(e) => set("name", e.target.value)} />
            <Input label="Tagline" value={profile.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} placeholder="Freelance Illustrator & Character Designer" />
            <Textarea label="Short Bio (Hero)" value={profile.bio_short ?? ""} onChange={(e) => set("bio_short", e.target.value)} rows={2} placeholder="1-2 sentences for the hero section" />
            <Textarea label="Full Bio (About)" value={profile.bio_long ?? ""} onChange={(e) => set("bio_long", e.target.value)} rows={6} placeholder="Tell your story…" />
          </div>

          <div className="bg-bg-primary border border-border-soft rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold font-display">Social Links</h2>
            <Input label="Email" type="email" value={profile.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            <Input label="Location" value={profile.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="Jakarta, Indonesia" />
            <Input label="Instagram" value={profile.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value)} placeholder="https://instagram.com/…" />
            <Input label="Twitter / X" value={profile.twitter_url ?? ""} onChange={(e) => set("twitter_url", e.target.value)} placeholder="https://twitter.com/…" />
            <Input label="Behance" value={profile.behance_url ?? ""} onChange={(e) => set("behance_url", e.target.value)} placeholder="https://behance.net/…" />
            <Input label="ArtStation" value={profile.artstation_url ?? ""} onChange={(e) => set("artstation_url", e.target.value)} placeholder="https://artstation.com/…" />
            <Input label="TikTok" value={profile.tiktok_url ?? ""} onChange={(e) => set("tiktok_url", e.target.value)} placeholder="https://tiktok.com/@…" />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold font-display">Photo</h2>
            <ImageUpload
              value={profile.profile_photo_url ?? ""}
              onChange={(url) => set("profile_photo_url", url)}
              bucket="artworks"
              folder="profile"
              label=""
            />
          </div>

          <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-3">
            <h2 className="text-base font-semibold font-display">Availability</h2>
            {AVAILABILITY_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  value={opt}
                  checked={profile.availability_status === opt}
                  onChange={() => set("availability_status", opt)}
                  className="accent-pink-400"
                />
                <span className="text-sm text-text-secondary">{opt}</span>
              </label>
            ))}
            <Input
              label="Availability Note"
              value={profile.availability_note ?? ""}
              onChange={(e) => set("availability_note", e.target.value)}
              placeholder="Taking commissions from June 2025"
            />
          </div>

          <div className="bg-bg-primary border border-border-soft rounded-2xl p-5 space-y-3">
            <h2 className="text-base font-semibold font-display">Services</h2>
            <div className="flex gap-2">
              <input
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                placeholder="Add service…"
                className="flex-1 px-3 py-2 rounded-xl bg-bg-secondary border border-border-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <button type="button" onClick={addService} className="px-3 rounded-xl bg-accent-soft text-accent-deep text-sm font-medium">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.services ?? []).map((s) => (
                <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent-soft text-accent-deep font-mono">
                  {s}
                  <button onClick={() => removeService(s)} className="hover:opacity-60">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
