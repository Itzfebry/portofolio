import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { GithubIcon } from "@/components/ui/brand-icons";
import { Markdown } from "@/components/ui/markdown";
import ProjectGallery from "@/components/ui/project-gallery";
import Reveal from "@/components/ui/reveal";
import SitePage from "@/components/ui/site-page";
import { getPortfolioData, type Project } from "@/lib/portfolio-data";

export const revalidate = 300;

async function findProject(slug: string): Promise<Project | undefined> {
  const data = await getPortfolioData();
  return data.projects.find((item) => item.slug === slug && item.status === "published");
}

export async function generateStaticParams() {
  const data = await getPortfolioData();
  return data.projects
    .filter((project) => project.status === "published")
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await findProject(slug);

  if (!project) return { title: "Project tidak ditemukan" };

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/project/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/project/${slug}`,
      images: project.cover_image ? [project.cover_image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPortfolioData();
  const project = data.projects.find((item) => item.slug === slug && item.status === "published");

  if (!project) notFound();

  const photos = project.photos ?? [];
  const description = project.detail_description?.trim() || project.description;

  return (
    <SitePage variant="saber" seed={11} footerName={data.profile.name}>
      <Reveal>
        <div className="section-head">
          <div>
            <p className="section-index">Project — Detail</p>
            <h2 className="section-title">
              {project.title.split(" ").slice(0, -1).join(" ")}
              {project.title.split(" ").length > 1 ? " " : ""}
              <span className="gradient-text">{project.title.split(" ").slice(-1)}</span>
            </h2>
          </div>
          <p className="section-note">{project.technologies.length} teknologi</p>
        </div>
      </Reveal>

      <Reveal delay={90} className="relative z-10">
        <div className="pdetail-meta">
          <div className="pdetail-meta__item">
            <p className="pdetail-meta__label">Tahun</p>
            <p className="pdetail-meta__value">{project.year || "—"}</p>
          </div>
          <div className="pdetail-meta__item">
            <p className="pdetail-meta__label">Klien</p>
            <p className="pdetail-meta__value">{project.client || "—"}</p>
          </div>
          <div className="pdetail-meta__item">
            <p className="pdetail-meta__label">Peran</p>
            <p className="pdetail-meta__value">{project.role ?? "Fullstack"}</p>
          </div>
          <div className="pdetail-meta__item">
            <p className="pdetail-meta__label">Status</p>
            <p className="pdetail-meta__value capitalize">{project.status}</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 relative z-10">
        <Reveal delay={110} className="relative z-10">
          <div className="glass rounded-3xl p-5 sm:p-7">
            <p className="section-index">Highlights</p>
            <div className="pdetail-highlights mt-5">
              {(project.highlights ?? []).length > 0 ? (
                (project.highlights ?? []).map((item) => (
                  <p key={item} className="pdetail-highlight">
                    {item}
                  </p>
                ))
              ) : (
                <p className="pdetail-highlight">{project.summary}</p>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={150} className="relative z-10">
          <div className="glass rgb-ring rounded-3xl p-5 sm:p-7">
            <p className="section-index">Overview</p>
            <Markdown
              text={description}
              className="mt-5 text-justify text-lg leading-8 text-zinc-300"
            />

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-arrow text-white hover:text-cyan-200"
                >
                  Live demo <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-arrow text-zinc-500 hover:text-white"
                >
                  Source <GithubIcon size={15} />
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {photos.length > 0 && (
        <Reveal delay={140} className="mt-12 relative z-10">
          <p className="section-index">Galeri</p>
          <ProjectGallery photos={photos} ratios={project.photo_ratios ?? []} title={project.title} />
        </Reveal>
      )}

      <Reveal delay={120} className="mt-14 relative z-10">
        <div className="border-t border-white/8 pt-8">
          <p className="text-xs uppercase tracking-[.2em] text-zinc-600">
            /project/{project.slug}
          </p>
        </div>
      </Reveal>
    </SitePage>
  );
}
