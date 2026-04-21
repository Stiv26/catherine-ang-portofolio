"use client";

import { motion } from "framer-motion";
import { Check, Clock, MessageCircle, CreditCard, ImageIcon, Sparkles } from "lucide-react";
import type { CommissionPackage } from "@/types";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface CommissionSectionProps {
  packages: CommissionPackage[];
  isOpen: boolean;
}

const STEPS = [
  {
    icon: MessageCircle,
    title: "1. Contact Me",
    desc: "Send a message via the contact form or DM on Instagram with your idea and references.",
  },
  {
    icon: CreditCard,
    title: "2. Agree & Pay",
    desc: "We'll discuss the details, agree on the scope, then you send a 50% down payment.",
  },
  {
    icon: ImageIcon,
    title: "3. Receive Art",
    desc: "I'll deliver your illustration within the agreed turnaround. Revisions included!",
  },
];

function formatPrice(price: number, currency: string) {
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

const CARD_GRADIENTS = [
  "from-[#F4A7B9]/20 to-[#D4B8E0]/10",
  "from-[#D4B8E0]/20 to-[#FFCBA4]/10",
  "from-[#B8E0D2]/20 to-[#F4A7B9]/10",
  "from-[#FFCBA4]/20 to-[#FADADD]/10",
];

export default function CommissionSection({ packages, isOpen }: CommissionSectionProps) {
  const available = packages.filter((p) => p.is_available);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="commissions" className="py-24 px-6 bg-bg-primary">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <ScrollReveal className="mb-14">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <p className="font-accent text-xl text-accent-deep">commissions</p>
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full border ${
                isOpen
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              {isOpen ? "Currently Open" : "Closed for now"}
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary">
            Open Commissions
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl leading-relaxed">
            I create custom illustrations — character designs, portraits, book covers, and more.
            Each piece is made with care and tailored just for you.
          </p>
        </ScrollReveal>

        {/* ── How it works ── */}
        <ScrollReveal delay={0.05} className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex gap-4 p-5 rounded-2xl bg-bg-secondary border border-border-soft"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-9 h-9 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
                  <step.icon size={16} className="text-accent-deep" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-text-primary mb-1">
                    {step.title}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Packages ── */}
        {available.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {available.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border overflow-hidden bg-gradient-to-br ${
                  CARD_GRADIENTS[i % CARD_GRADIENTS.length]
                } ${
                  pkg.badge
                    ? "border-accent-primary/50 shadow-[0_0_0_1px_var(--accent-primary),0_4px_24px_rgba(0,0,0,0.06)]"
                    : "border-border-soft hover:border-accent-primary/30"
                } transition-all duration-300 hover:shadow-card`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-accent-primary text-white text-[10px] font-mono px-2.5 py-1 rounded-full">
                    <Sparkles size={9} />
                    {pkg.badge}
                  </div>
                )}

                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Title */}
                  <div>
                    <h3 className="font-display text-lg font-bold text-text-primary leading-snug">
                      {pkg.title}
                    </h3>
                    {pkg.description && (
                      <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                        {pkg.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <p className="font-display text-3xl font-bold text-text-primary">
                      {formatPrice(pkg.price, pkg.currency)}
                    </p>
                    {pkg.price_note && (
                      <p className="text-xs text-text-tertiary font-mono mt-0.5">{pkg.price_note}</p>
                    )}
                  </div>

                  {/* Turnaround */}
                  {pkg.turnaround && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Clock size={13} className="text-accent-primary shrink-0" />
                      {pkg.turnaround}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-border-soft" />

                  {/* Includes */}
                  {pkg.includes && pkg.includes.length > 0 && (
                    <ul className="space-y-2 flex-1">
                      {pkg.includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                          <Check size={13} className="text-accent-primary mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA */}
                  <button
                    onClick={scrollToContact}
                    disabled={!isOpen}
                    className="mt-auto w-full py-2.5 rounded-xl text-sm font-medium font-body transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-accent-primary text-white hover:bg-accent-deep active:scale-[0.98]"
                  >
                    {isOpen ? "Book This Package" : "Currently Closed"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-tertiary font-mono text-sm">
            No packages listed yet.
          </div>
        )}

        {/* ── Footer note ── */}
        {isOpen && (
          <ScrollReveal delay={0.1} className="mt-10 text-center">
            <p className="text-sm text-text-tertiary">
              Don&apos;t see what you need?{" "}
              <button
                onClick={scrollToContact}
                className="text-accent-primary hover:underline font-medium"
              >
                Send me a message
              </button>{" "}
              and we&apos;ll figure it out together.
            </p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
