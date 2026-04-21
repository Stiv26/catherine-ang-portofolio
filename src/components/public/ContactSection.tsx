"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Globe, ExternalLink, CheckCircle } from "lucide-react";
import type { Profile } from "@/types";
import { PROJECT_TYPES, BUDGET_RANGES } from "@/lib/constants";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface ContactSectionProps {
  profile: Profile | null;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    project_type: "",
    budget: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try emailing directly.");
    } finally {
      setSending(false);
    }
  };

  const socialLinks = [
    { url: profile?.instagram_url, icon: Globe, label: "Instagram" },
    { url: profile?.twitter_url, icon: Globe, label: "Twitter" },
    { url: profile?.behance_url, icon: ExternalLink, label: "Behance" },
    { url: profile?.artstation_url, icon: ExternalLink, label: "ArtStation" },
  ].filter((s) => s.url);

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-soft/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-mint/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <div className="space-y-8">
            <ScrollReveal>
              <p className="font-accent text-xl text-accent-deep">let&apos;s create</p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary mt-1">
                Work Together
              </h2>
            </ScrollReveal>

            {/* Availability */}
            {profile?.availability_status && (
              <ScrollReveal delay={0.1}>
                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-accent-soft border border-accent-primary/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 pulse-badge shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-accent-deep">
                      {profile.availability_status}
                    </p>
                    {profile.availability_note && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        {profile.availability_note}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.15}>
              <p className="font-body text-text-secondary leading-relaxed">
                Have a project in mind? Whether it&apos;s a character design, book illustration, or brand identity — I&apos;d love to hear about it. Fill out the form and I&apos;ll get back to you within 2 business days.
              </p>
            </ScrollReveal>

            {profile?.email && (
              <ScrollReveal delay={0.2}>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm font-mono text-accent-deep hover:underline"
                >
                  {profile.email}
                </a>
              </ScrollReveal>
            )}

            {/* Social */}
            {socialLinks.length > 0 && (
              <ScrollReveal delay={0.25}>
                <div>
                  <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-3">
                    Find me on
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map(({ url, icon: Icon, label }) => (
                      <a
                        key={label}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-secondary border border-border-soft text-sm text-text-secondary hover:text-accent-deep hover:border-accent-primary transition-all"
                        title={label}
                      >
                        <Icon size={15} />
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Decorative arrow */}
            <div className="hidden lg:block">
              <motion.p
                className="font-accent text-6xl text-accent-primary/20"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.p>
            </div>
          </div>

          {/* Right: form */}
          <ScrollReveal delay={0.1}>
            <div className="bg-bg-primary border border-border-soft rounded-3xl p-8 shadow-soft">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                    >
                      <CheckCircle size={32} className="text-green-500" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold text-text-primary">Message sent!</h3>
                    <p className="text-text-secondary text-sm">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", project_type: "", budget: "", message: "" }); }}
                      className="text-sm text-accent-deep underline mt-2"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" required />
                      <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-text-secondary">Project Type</label>
                      <select
                        value={form.project_type}
                        onChange={(e) => set("project_type", e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                      >
                        <option value="">Select type…</option>
                        {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-text-secondary">Budget Range</label>
                      <select
                        value={form.budget}
                        onChange={(e) => set("budget", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-soft text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                      >
                        <option value="">Select budget…</option>
                        {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    <Textarea
                      label="Message"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Tell me about your project…"
                      rows={4}
                      required
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" loading={sending} size="lg" className="w-full">
                      <Send size={16} />
                      Send Message
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
