export const ILLUSTRATION_TOOLS = [
  "Procreate",
  "Clip Studio Paint",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe Fresco",
  "Affinity Designer",
  "Krita",
  "MediBang Paint",
  "Pencil",
  "Watercolor",
  "Ink",
  "Mixed Media",
];

export const PROJECT_TYPES = [
  "Character Design",
  "Book Illustration",
  "Editorial Illustration",
  "Brand Illustration",
  "Fan Art / Personal",
  "Album / Merchandise Art",
  "Children's Illustration",
  "Game Art",
  "Animation",
  "Other",
];

export const EMPLOYMENT_TYPES = ["Freelance", "Full-time", "Part-time", "Internship"] as const;

export const DISPLAY_SIZES = [
  { value: "small", label: "Small", description: "1×1 grid" },
  { value: "medium", label: "Medium", description: "1×1 taller" },
  { value: "large", label: "Large", description: "1×2 tall" },
  { value: "wide", label: "Wide", description: "2×1 span" },
  { value: "tall", label: "Tall", description: "1×2 tall" },
] as const;

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Artworks", href: "/admin/artworks", icon: "Image" },
  { label: "Categories", href: "/admin/categories", icon: "Tag" },
  { label: "Projects", href: "/admin/projects", icon: "Folder" },
  { label: "Commissions", href: "/admin/commissions", icon: "Brush" },
  { label: "Experience", href: "/admin/experience", icon: "Briefcase" },
  { label: "Profile", href: "/admin/profile", icon: "User" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const MAX_FILE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
