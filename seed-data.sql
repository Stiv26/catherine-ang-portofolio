-- =============================================
-- Cathrine Ang — Seed Data (dari LinkedIn)
-- Jalankan di Supabase SQL Editor
-- =============================================

-- =============================================
-- UPDATE PROFILE
-- =============================================
UPDATE profile SET
  name = 'Cathrine Ang',
  tagline = 'Freelance Illustrator & Character Designer',
  bio_short = 'DKV graduate from Petra Christian University, creating character designs and digital illustrations since 2020.',
  bio_long = 'Hi! I''m Cathrine, a Visual Communication Design (DKV) student at Petra Christian University (Universitas Kristen Petra), Surabaya — graduating in 2025.

I''ve been working as a freelance illustrator since 2020 and currently serve as Head of Art Department at Adventroupe Studio, an indie game studio where I lead the creative team for character design and branding.

My work spans game art, character design, and visual storytelling. I love bringing characters to life with expressive designs, vibrant color palettes, and detailed linework — whether for games, social media, or personal commissions.

When I''m not illustrating, I contribute to community organizations as a social media designer, combining my passion for art with meaningful social work.',
  location = 'Surabaya, Jawa Timur, Indonesia',
  availability_status = 'Available for work',
  availability_note = 'Open for commissions & freelance projects',
  services = ARRAY[
    'Character Design',
    'Digital Illustration',
    'Game Art / Concept Art',
    'Social Media Design',
    'Brand Illustration',
    'Commission Art'
  ],
  updated_at = now();

-- =============================================
-- EXPERIENCES (dari LinkedIn)
-- =============================================
DELETE FROM experiences;

INSERT INTO experiences (role, company, employment_type, location, start_date, end_date, is_current, description, highlights, skills, sort_order) VALUES

-- 1. Head of Art Department (current)
(
  'Head of Art Department',
  'Adventroupe Studio',
  'Freelance',
  'Surabaya, Jawa Timur, Indonesia',
  '2025-03-01',
  NULL,
  true,
  'Lead the creative team at Adventroupe Studio, an indie game studio, focusing on character design and illustration to support the studio''s branding and marketing efforts, especially for social media platforms.',
  ARRAY[
    'Lead creative team for character design and illustration',
    'Drive visual branding and social media content for indie game studio',
    'Coordinate art direction across studio projects'
  ],
  ARRAY['Clip Studio Paint', 'Digital Illustration', 'Character Design', 'Art Direction', 'Team Leadership'],
  0
),

-- 2. Freelance Illustrator (current)
(
  'Freelance Illustrator',
  'Self-employed',
  'Freelance',
  NULL,
  '2020-04-01',
  NULL,
  true,
  'Providing freelance illustration and character design services to various clients. Specializing in character concepts, digital illustrations, and commission-based artwork.',
  ARRAY[
    'Character design commissions for individual and studio clients',
    'Digital illustration across multiple styles and genres',
    'Social media illustration and content creation'
  ],
  ARRAY['Clip Studio Paint', 'Digital Illustration', 'Character Design', 'Adobe Illustrator', 'Adobe Photoshop', 'Paint Tool SAI', 'Adobe Premiere Pro'],
  1
),

-- 3. Art Department Intern
(
  'Art Department Intern',
  'Adventroupe Studio',
  'Internship',
  'Surabaya, Jawa Timur, Indonesia',
  '2024-07-01',
  '2024-12-31',
  false,
  'Supported the Art Department in creating character designs and illustrations primarily for social media promotion of the indie game Artisan Story. Produced concept sketches and refined character visuals and idle animations for the game.',
  ARRAY[
    'Character design for indie game Artisan Story (Now on Steam Early Access)',
    'Concept sketches and character visual refinement',
    'Social media promotional illustrations for game launch',
    'Character idle animation visuals'
  ],
  ARRAY['Digital Illustration', 'Adobe Illustrator', 'Character Design', 'Clip Studio Paint', '2D Animation', 'Concept Art'],
  2
),

-- 4. Social Media Designer Coordinator (current)
(
  'Social Media Designer Coordinator',
  'PMBDC (Persaudaraan Muda-Mudi Vihara Buddhayana Dharmawira Centre)',
  'Part-time',
  'Surabaya, Indonesia',
  '2025-06-01',
  NULL,
  true,
  'Serving as Media and Communications Coordinator for PMBDC 2025–2026 period. Leading the division responsible for managing the organization''s digital presence, content creation, and community engagement.',
  ARRAY[
    'Lead media and communications division',
    'Manage organizational digital presence and Instagram account',
    'Oversee content creation and community engagement campaigns'
  ],
  ARRAY['Canva', 'Adobe Photoshop', 'Social Media Management', 'Content Creation', 'Adobe Illustrator'],
  3
),

-- 5. Social Media Designer Team - Sekber PMVBI (current)
(
  'Social Media Designer Team',
  'Sekber PMVBI (Pemuda Buddhayana) Jawa Timur',
  'Part-time',
  'Jawa Timur, Indonesia',
  '2024-05-01',
  NULL,
  true,
  'Managing the organization''s Instagram account by creating visual and written content, documenting events, and maintaining a consistent and engaging online presence. Collaborating with team members to support public relations and promote community activities.',
  ARRAY[
    'Visual and written content creation for Instagram',
    'Event documentation and coverage',
    'Community PR and online presence management'
  ],
  ARRAY['Canva', 'Adobe Photoshop', 'Content Creation', 'Social Media Management'],
  4
),

-- 6. Social Media Designer Team - PMBDC (past)
(
  'Social Media Designer Team',
  'PMBDC (Persaudaraan Muda-Mudi Vihara Buddhayana Dharmawira Centre)',
  'Part-time',
  'Surabaya, Indonesia',
  '2024-03-01',
  '2025-05-31',
  false,
  'Member of Media and Communications division. Responsible for supporting the creation and publication of social media content to promote events, spread positive messages, and strengthen community engagement.',
  ARRAY[
    'Social media content design and publication',
    'Event promotion visuals',
    'Community engagement through creative content'
  ],
  ARRAY['Canva', 'Adobe Photoshop', 'Social Media Management', 'Adobe Illustrator'],
  5
);

-- =============================================
-- CATEGORIES (untuk gallery)
-- =============================================
DELETE FROM categories;

INSERT INTO categories (name, slug, description, color, sort_order, is_active) VALUES
  ('Character Design', 'character-design', 'Original character concepts and designs', '#F4A7B9', 1, true),
  ('Digital Illustration', 'digital-illustration', 'Digital artwork and illustrations', '#D4B8E0', 2, true),
  ('Fan Art', 'fan-art', 'Fan-made artwork from games, anime, and pop culture', '#FFCBA4', 3, true),
  ('Game Art', 'game-art', 'Artwork created for indie games and game projects', '#B8E0D2', 4, true),
  ('Social Media Design', 'social-media-design', 'Graphics and visuals for social media', '#FADADD', 5, true);

-- =============================================
-- DUMMY ARTWORKS (placeholder sampai upload gambar asli)
-- =============================================
DELETE FROM artworks;

INSERT INTO artworks (title, slug, description, category_id, cover_image_url, is_featured, sort_order, display_size, tags, tools, year, status) VALUES

-- Character Design
(
  'Forest Spirit — Original Character',
  'forest-spirit-oc',
  'An original character inspired by forest spirits and nature mythology. Soft color palette with detailed costume design.',
  (SELECT id FROM categories WHERE slug = 'character-design'),
  'https://picsum.photos/seed/forest-spirit/800/1000',
  true,
  0, 'tall',
  ARRAY['original character', 'fantasy', 'nature', 'spirit'],
  ARRAY['Clip Studio Paint', 'Digital Illustration'],
  2024, 'published'
),
(
  'Artisan Story — Game Character',
  'artisan-story-character',
  'Character design created during internship at Adventroupe Studio for the indie game Artisan Story, now on Steam Early Access.',
  (SELECT id FROM categories WHERE slug = 'game-art'),
  'https://picsum.photos/seed/artisan/800/1000',
  true,
  1, 'medium',
  ARRAY['game art', 'character design', 'artisan story', 'indie game'],
  ARRAY['Clip Studio Paint', 'Digital Illustration', 'Character Design'],
  2024, 'published'
),
(
  'Witch Academia — Fan Art',
  'witch-academia-fanart',
  'Fan art tribute to Little Witch Academia. Vibrant colors and dynamic pose capturing the magic of the series.',
  (SELECT id FROM categories WHERE slug = 'fan-art'),
  'https://picsum.photos/seed/witch/800/1200',
  false,
  2, 'tall',
  ARRAY['fan art', 'anime', 'witch', 'magic'],
  ARRAY['Clip Studio Paint', 'Digital Illustration'],
  2023, 'published'
),
(
  'Cafe Barista OC',
  'cafe-barista-oc',
  'A cozy original character design — a barista with a warm personality and love for latte art.',
  (SELECT id FROM categories WHERE slug = 'character-design'),
  'https://picsum.photos/seed/barista/800/900',
  false,
  3, 'medium',
  ARRAY['original character', 'cozy', 'cafe', 'slice of life'],
  ARRAY['Clip Studio Paint'],
  2024, 'published'
),
(
  'Adventroupe Studio — Promo Illustration',
  'adventroupe-promo',
  'Social media promotional illustration created as Head of Art Department at Adventroupe Studio.',
  (SELECT id FROM categories WHERE slug = 'social-media-design'),
  'https://picsum.photos/seed/adventroupe/1200/800',
  false,
  4, 'wide',
  ARRAY['studio art', 'promo', 'social media', 'game studio'],
  ARRAY['Clip Studio Paint', 'Adobe Photoshop'],
  2025, 'published'
),
(
  'Mermaid Princess',
  'mermaid-princess',
  'An underwater fantasy character design with flowing hair and iridescent scales. Pastel ocean color palette.',
  (SELECT id FROM categories WHERE slug = 'character-design'),
  'https://picsum.photos/seed/mermaid/700/1100',
  false,
  5, 'tall',
  ARRAY['fantasy', 'mermaid', 'ocean', 'princess'],
  ARRAY['Clip Studio Paint', 'Digital Illustration'],
  2023, 'published'
),
(
  'Spring Fairy',
  'spring-fairy',
  'A delicate fairy character surrounded by cherry blossoms. Soft pinks and warm tones capture the feeling of spring.',
  (SELECT id FROM categories WHERE slug = 'character-design'),
  'https://picsum.photos/seed/fairy/800/800',
  true,
  6, 'medium',
  ARRAY['fantasy', 'fairy', 'spring', 'floral'],
  ARRAY['Clip Studio Paint'],
  2024, 'published'
),
(
  'Genshin Impact — Keqing Fan Art',
  'keqing-genshin-fanart',
  'Fan art of Keqing from Genshin Impact. Dynamic lighting with electric purple accents.',
  (SELECT id FROM categories WHERE slug = 'fan-art'),
  'https://picsum.photos/seed/keqing/800/1000',
  false,
  7, 'medium',
  ARRAY['genshin impact', 'fan art', 'keqing', 'game fan art'],
  ARRAY['Clip Studio Paint', 'Digital Illustration'],
  2023, 'published'
),
(
  'Night Market Scene',
  'night-market-scene',
  'A full illustration of a vibrant Indonesian night market. Warm lantern lights and busy street atmosphere.',
  (SELECT id FROM categories WHERE slug = 'digital-illustration'),
  'https://picsum.photos/seed/nightmarket/1200/800',
  false,
  8, 'wide',
  ARRAY['scene', 'indonesia', 'night market', 'environment'],
  ARRAY['Clip Studio Paint', 'Adobe Photoshop'],
  2024, 'published'
),
(
  'Vampire Butler OC',
  'vampire-butler-oc',
  'An elegant original character design — a vampire butler with old-world charm and sharp eyes.',
  (SELECT id FROM categories WHERE slug = 'character-design'),
  'https://picsum.photos/seed/vampire/800/1000',
  false,
  9, 'medium',
  ARRAY['original character', 'vampire', 'dark fantasy', 'butler'],
  ARRAY['Clip Studio Paint'],
  2023, 'published'
),
(
  'PMVBI Event Poster',
  'pmvbi-event-poster',
  'Social media design created for Sekber PMVBI Jawa Timur community event.',
  (SELECT id FROM categories WHERE slug = 'social-media-design'),
  'https://picsum.photos/seed/poster/800/800',
  false,
  10, 'small',
  ARRAY['social media', 'poster', 'event design', 'community'],
  ARRAY['Canva', 'Adobe Photoshop'],
  2024, 'published'
),
(
  'Dragon Rider — Concept Art',
  'dragon-rider-concept',
  'Concept art for a dragon rider character. Detailed armor design with a companion dragon sketch.',
  (SELECT id FROM categories WHERE slug = 'game-art'),
  'https://picsum.photos/seed/dragon/1200/900',
  false,
  11, 'wide',
  ARRAY['concept art', 'dragon', 'fantasy', 'game art'],
  ARRAY['Clip Studio Paint', 'Digital Illustration', 'Adobe Photoshop'],
  2025, 'published'
);

-- =============================================
-- DUMMY PROJECT (Case Study)
-- =============================================
DELETE FROM projects;

INSERT INTO projects (title, slug, subtitle, description, cover_image_url, category, client, role, year, duration, tools, tags, challenge, process, outcome, is_featured, sort_order, status) VALUES
(
  'Artisan Story — Character Design',
  'artisan-story-character-design',
  'Character design & idle animation visuals for an indie farming RPG',
  'A series of character designs and idle animation visuals created during my internship at Adventroupe Studio for their indie game Artisan Story, a cozy farming RPG now available on Steam Early Access.',
  'https://picsum.photos/seed/artisanproject/1400/800',
  'Game Art',
  'Adventroupe Studio',
  'Art Department Intern',
  2024,
  '6 months',
  ARRAY['Clip Studio Paint', 'Digital Illustration', 'Adobe Illustrator', '2D Animation'],
  ARRAY['game art', 'character design', 'indie game', 'steam', 'internship'],
  'Adventroupe Studio needed a series of character designs and idle animation visuals for their cozy farming RPG, Artisan Story. The challenge was creating characters that felt warm and approachable while fitting the game''s cozy aesthetic — all within tight production timelines.',
  'I began with rough concept sketches exploring different silhouettes and personalities for each character. After feedback rounds with the art director, I refined the chosen directions into clean digital illustrations using Clip Studio Paint. For idle animations, I created frame-by-frame visuals that conveyed each character''s personality through subtle movements.',
  'The character designs were successfully integrated into the game and used extensively for social media promotion leading up to the Steam Early Access launch. Artisan Story is now available on Steam, featuring characters I helped bring to life during my internship.',
  true,
  0,
  'published'
),
(
  'Adventroupe Studio — Social Media Branding',
  'adventroupe-social-media-branding',
  'Visual identity and social media content for an indie game studio',
  'As Head of Art Department at Adventroupe Studio, I lead the creation of consistent visual branding and social media illustration content to grow the studio''s online presence.',
  'https://picsum.photos/seed/branding/1400/800',
  'Social Media Design',
  'Adventroupe Studio',
  'Head of Art Department',
  2025,
  'Ongoing',
  ARRAY['Clip Studio Paint', 'Adobe Photoshop', 'Digital Illustration'],
  ARRAY['branding', 'social media', 'game studio', 'illustration'],
  'Adventroupe Studio needed a cohesive visual identity across social media platforms to build brand recognition and engage their growing community of indie game enthusiasts.',
  'I established a consistent visual style guide for the studio''s social media presence. This included defining color palettes, character illustration styles, and post layout templates. I lead the art team in producing regular content that balances promotional material with engaging community posts.',
  'The studio''s social media presence grew significantly with consistent, on-brand visual content. The cohesive aesthetic helped establish Adventroupe Studio''s identity in the indie game space.',
  true,
  1,
  'published'
);

-- =============================================
-- SETTINGS
-- =============================================
INSERT INTO settings (key, value, updated_at) VALUES
  ('site_title', 'Cathrine Ang — Freelance Illustrator & Character Designer', now()),
  ('meta_description', 'Portfolio of Cathrine Ang, a freelance illustrator and character designer from Surabaya specializing in character design, game art, and digital illustration.', now()),
  ('hero_headline', NULL, now()),
  ('hero_subtext', NULL, now()),
  ('commission_status', NULL, now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
