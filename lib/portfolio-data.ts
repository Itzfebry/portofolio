import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  bio: string;
  headline: string;
  avatar_url?: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  image_url?: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  status: "draft" | "published";
  featured: boolean;
  live_url?: string;
  github_url?: string;
  cover_image?: string;
  technologies: string[];
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  location?: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  period: string;
  field: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  price?: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  label: string;
};

export type PortfolioData = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  services: Service[];
  socialLinks: SocialLink[];
};

const DEFAULT_PROFILE: Profile = {
  name: "Mochammad Ginata Febryansyah",
  role: "Frontend Developer",
  location: "Bondowoso, Indonesia",
  email: "hello@example.com",
  bio: "Lulusan Manajemen Informatika dengan pengalaman dua tahun di bidang pengembangan web. Fokus pada pembuatan web app yang cepat, aksesibel, dan memiliki performa tinggi. Saya juga senang menulis artikel teknis dan berkontribusi di proyek open-source.",
  headline: "hello there!",
};

const DEFAULT_SKILLS: Skill[] = [
  { id: "skill-js", name: "JavaScript (ES6+)", category: "Programming Language", level: 95, image_url: "https://cdn.simpleicons.org/javascript" },
  { id: "skill-html", name: "HTML5", category: "Web Fundamentals", level: 94, image_url: "https://cdn.simpleicons.org/html5" },
  { id: "skill-css", name: "CSS3", category: "Web Fundamentals", level: 94, image_url: "https://cdn.simpleicons.org/css3" },
  { id: "skill-ts", name: "TypeScript", category: "Programming Language", level: 92, image_url: "https://cdn.simpleicons.org/typescript" },
  { id: "skill-react", name: "React.js", category: "Frontend Library", level: 95, image_url: "https://cdn.simpleicons.org/react" },
  { id: "skill-next", name: "Next.js", category: "Frontend Framework", level: 93, image_url: "https://cdn.simpleicons.org/nextdotjs/white" },
  { id: "skill-tailwind", name: "Tailwind CSS", category: "Styling", level: 92, image_url: "https://cdn.simpleicons.org/tailwindcss" },
  { id: "skill-git", name: "Git", category: "Tools", level: 88, image_url: "https://cdn.simpleicons.org/git" },
  { id: "skill-github", name: "GitHub", category: "Platform", level: 90, image_url: "https://cdn.simpleicons.org/github/white" },
  { id: "skill-figma", name: "Figma", category: "Design", level: 84, image_url: "https://cdn.simpleicons.org/figma" },
  { id: "skill-vscode", name: "VS Code", category: "Editor", level: 94, image_url: "https://cdn.simpleicons.org/visualstudiocode" },
  { id: "skill-vercel", name: "Vercel", category: "Deployment", level: 89, image_url: "https://cdn.simpleicons.org/vercel/white" },
];

const DEFAULT_SKILL_IMAGES: Record<string, string> = {
  "JavaScript (ES6+)": "https://cdn.simpleicons.org/javascript",
  HTML5: "https://cdn.simpleicons.org/html5",
  CSS3: "https://cdn.simpleicons.org/css3",
  TypeScript: "https://cdn.simpleicons.org/typescript",
  "React.js": "https://cdn.simpleicons.org/react",
  "Next.js": "https://cdn.simpleicons.org/nextdotjs/white",
  "Tailwind CSS": "https://cdn.simpleicons.org/tailwindcss",
  Git: "https://cdn.simpleicons.org/git",
  GitHub: "https://cdn.simpleicons.org/github/white",
  Figma: "https://cdn.simpleicons.org/figma",
  "VS Code": "https://cdn.simpleicons.org/visualstudiocode",
  Vercel: "https://cdn.simpleicons.org/vercel/white",
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Portfolio CMS",
    slug: "portfolio-cms",
    summary: "A content-managed portfolio for creators and agencies.",
    description:
      "A performant portfolio platform with editable sections and a secure admin area connected to Supabase.",
    status: "published",
    featured: true,
    live_url: "https://example.com",
    github_url: "https://github.com",
    technologies: ["Next.js", "Supabase", "PostgreSQL"],
  },
  {
    id: "project-2",
    title: "Launch Analytics",
    slug: "launch-analytics",
    summary: "Marketing dashboards for product teams.",
    description:
      "An internal analytics tool for tracking campaign performance and acquisition quality across channels.",
    status: "published",
    featured: false,
    github_url: "https://github.com",
    technologies: ["React", "Node.js", "PostgreSQL"],
  },
];

const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Product Engineer",
    company: "Studio North",
    period: "2023 - Present",
    description: "Leading front-end architecture, design systems, and product delivery for SaaS and marketing experiences.",
  },
  {
    id: "exp-2",
    role: "Frontend Developer",
    company: "Pixel Forge",
    period: "2021 - 2023",
    description: "Built responsive UI systems and performance-focused interfaces for client-facing applications.",
  },
];

const DEFAULT_EDUCATION: Education[] = [
  {
    id: "edu-1",
    degree: "Bachelor of Computer Science",
    institution: "University of Technology",
    period: "2015 - 2019",
    field: "Software Engineering",
  },
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: "service-1",
    title: "Product design & development",
    description: "End-to-end product design and engineering for digital experiences that convert.",
    price: "From $1,500",
  },
  {
    id: "service-2",
    title: "Landing pages / marketing sites",
    description: "Fast, polished landing pages crafted to improve conversion for new launches and campaigns.",
    price: "From $900",
  },
];

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: "social-github", platform: "GitHub", label: "GitHub", url: "https://github.com" },
  { id: "social-linkedin", platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com" },
  { id: "social-email", platform: "Email", label: "Email", url: "mailto:hello@example.com" },
];

function normalizeTechnologies(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
      .filter(Boolean);
  }

  if (typeof input === "string") {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

async function fetchDataFromSupabase(): Promise<PortfolioData | null> {
  const supabase = await createServerSupabaseClient();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return null;
  }

  try {
    const [profileResult, skillsResult, projectsResult, experienceResult, educationResult, servicesResult, socialsResult] = await Promise.all([
      supabase.from("profile").select("*").order("updated_at", { ascending: false }).limit(1),
      supabase.from("skills").select("*").order("created_at", { ascending: true }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("experiences").select("*").order("created_at", { ascending: false }),
      supabase.from("education").select("*").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("created_at", { ascending: true }),
      supabase.from("social_links").select("*").order("created_at", { ascending: true }),
    ]);

    if (
      profileResult.error ||
      skillsResult.error ||
      projectsResult.error ||
      experienceResult.error ||
      educationResult.error ||
      servicesResult.error ||
      socialsResult.error
    ) {
      return null;
    }

    const profileRow = profileResult.data?.[0] ?? DEFAULT_PROFILE;

    return {
      profile: {
        name: String(profileRow.name ?? DEFAULT_PROFILE.name),
        role: String(profileRow.role ?? DEFAULT_PROFILE.role),
        location: String(profileRow.location ?? DEFAULT_PROFILE.location),
        email: String(profileRow.email ?? DEFAULT_PROFILE.email),
        bio: String(profileRow.bio ?? DEFAULT_PROFILE.bio),
        headline: String(profileRow.headline ?? DEFAULT_PROFILE.headline),
        avatar_url: profileRow.avatar_url ?? DEFAULT_PROFILE.avatar_url,
      },
      skills: (skillsResult.data ?? []).map((item: Record<string, unknown>) => ({
        id: String(item.id ?? crypto.randomUUID()),
        name: String(item.name ?? "Untitled skill"),
        category: String(item.category ?? "General"),
        level: Number(item.level ?? 80),
        image_url:
          typeof item.image_url === "string" && item.image_url
            ? item.image_url
            : DEFAULT_SKILL_IMAGES[String(item.name ?? "")],
      })),
      projects: (projectsResult.data ?? []).map((item: Record<string, unknown>) => ({
        id: String(item.id ?? crypto.randomUUID()),
        title: String(item.title ?? "Untitled project"),
        slug: String(item.slug ?? (item.title ?? "untitled-project").toString().toLowerCase().replace(/\s+/g, "-")),
        summary: String(item.summary ?? item.description ?? "Project summary"),
        description: String(item.description ?? item.summary ?? "Project description"),
        status: item.status === "draft" ? "draft" : "published",
        featured: Boolean(item.featured),
        live_url: typeof item.live_url === "string" ? item.live_url : undefined,
        github_url: typeof item.github_url === "string" ? item.github_url : undefined,
        cover_image: typeof item.cover_image === "string" ? item.cover_image : undefined,
        technologies: normalizeTechnologies(item.technologies),
      })),
      experiences: (experienceResult.data ?? []).map((item: Record<string, unknown>) => ({
        id: String(item.id ?? crypto.randomUUID()),
        role: String(item.role ?? "Role"),
        company: String(item.company ?? "Company"),
        period: String(item.period ?? "Present"),
        description: String(item.description ?? "Experience description"),
        location: typeof item.location === "string" ? item.location : undefined,
      })),
      education: (educationResult.data ?? []).map((item: Record<string, unknown>) => ({
        id: String(item.id ?? crypto.randomUUID()),
        institution: String(item.institution ?? "Institution"),
        degree: String(item.degree ?? "Degree"),
        period: String(item.period ?? "2010 - 2014"),
        field: String(item.field ?? "General"),
      })),
      services: (servicesResult.data ?? []).map((item: Record<string, unknown>) => ({
        id: String(item.id ?? crypto.randomUUID()),
        title: String(item.title ?? "Service"),
        description: String(item.description ?? "Service description"),
        price: typeof item.price === "string" ? item.price : undefined,
      })),
      socialLinks: (socialsResult.data ?? []).map((item: Record<string, unknown>) => ({
        id: String(item.id ?? crypto.randomUUID()),
        platform: String(item.platform ?? "Social"),
        url: String(item.url ?? "#"),
        label: String(item.label ?? item.platform ?? "Link"),
      })),
    };
  } catch {
    return null;
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const data = await fetchDataFromSupabase();

  if (data) {
    return {
      profile: data.profile,
      skills: data.skills.length ? data.skills : DEFAULT_SKILLS,
      projects: data.projects.length ? data.projects : DEFAULT_PROJECTS,
      experiences: data.experiences.length ? data.experiences : DEFAULT_EXPERIENCE,
      education: data.education.length ? data.education : DEFAULT_EDUCATION,
      services: data.services.length ? data.services : DEFAULT_SERVICES,
      socialLinks: data.socialLinks.length ? data.socialLinks : DEFAULT_SOCIALS,
    };
  }

  return {
    profile: DEFAULT_PROFILE,
    skills: DEFAULT_SKILLS,
    projects: DEFAULT_PROJECTS,
    experiences: DEFAULT_EXPERIENCE,
    education: DEFAULT_EDUCATION,
    services: DEFAULT_SERVICES,
    socialLinks: DEFAULT_SOCIALS,
  };
}
