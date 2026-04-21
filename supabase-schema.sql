-- =============================================
-- Cathrine Portfolio — Supabase Schema
-- Run this in the Supabase SQL editor
-- =============================================

-- Art categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Portfolio artworks
CREATE TABLE IF NOT EXISTS artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  cover_image_url TEXT NOT NULL,
  images TEXT[],
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  display_size TEXT DEFAULT 'medium',
  tags TEXT[],
  tools TEXT[],
  year INT,
  client_name TEXT,
  is_client_work BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Work experience
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT,
  company_logo_url TEXT,
  employment_type TEXT,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  highlights TEXT[],
  skills TEXT[],
  sort_order INT DEFAULT 0
);

-- Featured projects (case studies)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image_url TEXT,
  images TEXT[],
  category TEXT,
  client TEXT,
  role TEXT,
  year INT,
  duration TEXT,
  tools TEXT[],
  tags TEXT[],
  challenge TEXT,
  process TEXT,
  outcome TEXT,
  external_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- About / profile (single row)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Cathrine',
  tagline TEXT,
  bio_short TEXT,
  bio_long TEXT,
  profile_photo_url TEXT,
  email TEXT,
  location TEXT,
  availability_status TEXT,
  availability_note TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  behance_url TEXT,
  artstation_url TEXT,
  tiktok_url TEXT,
  services TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_avatar_url TEXT,
  quote TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site settings (key-value)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Storage buckets (run via Supabase dashboard
-- or use the Storage API)
-- =============================================
-- Create bucket "artworks" (public)
-- Create bucket "admin-assets" (private)

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read artworks" ON artworks FOR SELECT USING (status = 'published');
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Authenticated (admin) can do everything
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all artworks" ON artworks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- Sample seed data
-- =============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Illustration', 'illustration', 'General illustration work', 1),
  ('Character Design', 'character-design', 'Original character concepts', 2),
  ('Fan Art', 'fan-art', 'Fan-made artwork', 3),
  ('Editorial', 'editorial', 'Editorial and book illustration', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO profile (name, tagline, bio_short, bio_long, availability_status, services)
VALUES (
  'Cathrine',
  'Freelance Illustrator & Character Designer',
  'I create whimsical, story-driven illustrations and character designs that bring imagination to life.',
  'Hi! I''m Cathrine, a DKV graduate and freelance illustrator based in Indonesia. I specialize in character design, editorial illustration, and world-building. My work blends dreamy color palettes with detailed linework to create characters and worlds that feel alive.

I''ve worked with indie game studios, publishers, and brands to bring their visions to life. When I''m not illustrating, you can find me sketching in coffee shops or exploring new color combinations.',
  'Available for work',
  ARRAY['Character Design', 'Editorial Illustration', 'Book Illustration', 'Brand Illustration', 'Commission Art']
) ON CONFLICT DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('site_title', 'Cathrine — Freelance Illustrator & Character Designer'),
  ('meta_description', 'Portfolio of Cathrine, a freelance illustrator and character designer creating whimsical, story-driven art.')
ON CONFLICT (key) DO NOTHING;
