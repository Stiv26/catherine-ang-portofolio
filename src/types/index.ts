export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
}

export type DisplaySize = "small" | "medium" | "large" | "wide" | "tall";
export type ArtworkStatus = "draft" | "published";

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  category?: Category;
  cover_image_url: string;
  images: string[] | null;
  is_featured: boolean;
  sort_order: number;
  display_size: DisplaySize;
  tags: string[] | null;
  tools: string[] | null;
  year: number | null;
  client_name: string | null;
  is_client_work: boolean;
  status: ArtworkStatus;
  created_at: string;
  updated_at: string;
}

export type EmploymentType = "Freelance" | "Full-time" | "Part-time" | "Internship";

export interface Experience {
  id: string;
  role: string;
  company: string | null;
  company_logo_url: string | null;
  employment_type: EmploymentType | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  highlights: string[] | null;
  skills: string[] | null;
  sort_order: number;
}

export type ProjectStatus = "draft" | "published";

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  cover_image_url: string | null;
  images: string[] | null;
  category: string | null;
  client: string | null;
  role: string | null;
  year: number | null;
  duration: string | null;
  tools: string[] | null;
  tags: string[] | null;
  challenge: string | null;
  process: string | null;
  outcome: string | null;
  external_url: string | null;
  is_featured: boolean;
  sort_order: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export type AvailabilityStatus = "Available for work" | "Fully booked" | "Selective";

export interface Profile {
  id: string;
  name: string;
  tagline: string | null;
  bio_short: string | null;
  bio_long: string | null;
  profile_photo_url: string | null;
  email: string | null;
  location: string | null;
  availability_status: AvailabilityStatus | null;
  availability_note: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  behance_url: string | null;
  artstation_url: string | null;
  tiktok_url: string | null;
  services: string[] | null;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string | null;
  client_avatar_url: string | null;
  quote: string;
  project_id: string | null;
  project?: Project;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface CommissionPackage {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  price_note: string | null;
  includes: string[] | null;
  turnaround: string | null;
  badge: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  site_title?: string;
  meta_description?: string;
  og_image_url?: string;
  hero_headline?: string;
  hero_subtext?: string;
  commission_status?: string;
  commission_open?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  project_type: string;
  budget: string;
  message: string;
}
