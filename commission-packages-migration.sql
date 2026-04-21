-- ============================================================
-- Migration: commission_packages table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS commission_packages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  price         numeric(12, 2) NOT NULL DEFAULT 0,
  currency      text NOT NULL DEFAULT 'IDR',
  price_note    text,
  includes      text[],
  turnaround    text,
  badge         text,
  is_available  boolean NOT NULL DEFAULT true,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE commission_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read commission_packages"
  ON commission_packages FOR SELECT
  USING (true);

CREATE POLICY "Auth full access commission_packages"
  ON commission_packages FOR ALL
  USING (auth.role() = 'authenticated');

-- ── Seed data (3 example packages) ──────────────────────────
INSERT INTO commission_packages
  (title, description, price, currency, price_note, includes, turnaround, badge, is_available, sort_order)
VALUES
  (
    'Bust Illustration',
    'A detailed character bust — shoulders up, full color with simple background.',
    150000, 'IDR', 'starting from',
    ARRAY[
      'Colored bust (shoulders up)',
      'Simple flat background',
      '2 rounds of revisions',
      'High-res PNG (3000×3000px)',
      'Personal use license'
    ],
    '5–7 business days',
    NULL,
    true, 0
  ),
  (
    'Full Body Character',
    'A fully rendered character illustration with detailed outfit and expression.',
    350000, 'IDR', 'starting from',
    ARRAY[
      'Full body character illustration',
      'Detailed outfit & accessories',
      'Color background included',
      '3 rounds of revisions',
      'High-res PNG + layered PSD',
      'Commercial license available'
    ],
    '7–10 business days',
    'Popular',
    true, 1
  ),
  (
    'Character Sheet',
    'A complete character reference sheet — front, side, and expression chart.',
    550000, 'IDR', 'starting from',
    ARRAY[
      'Front + side view poses',
      'Expression chart (4 expressions)',
      'Color palette reference',
      'Flat color rendering',
      '3 rounds of revisions',
      'High-res PNG + PDF',
      'Full commercial license'
    ],
    '14–21 business days',
    'Best Value',
    true, 2
  );
