import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/ui/reveal";
import SaberGlow from "@/components/ui/saber-glow";
import SitePage from "@/components/ui/site-page";
import TiltCard from "@/components/ui/tilt-card";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Kumpulan project Mochammad Ginata Febryansyah — setiap project punya halaman detail sendiri.",
  alternates: {
    canonical: "/project",
  },
  openGraph: {
    url: "/project",
  },
};

function ArrowUpRight({ className = "arrow h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export default async function ProjectListPage() {
  const data = await getPortfolioData();
  const projects = data.projects.filter((project) => project.status === "published");

  return (
    <SitePage variant="saber" seed={11} footerName={data.profile.name}>
      <Reveal>
        <div className="section-head">
          <div>
            <p className="section-index">Projects</p>
            <h2 className="section-title">
              What I have <span className="gradient-text">done</span>.
            </h2>
          </div>
          <p className="section-note">{projects.length} case studies</p>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 relative z-10">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 110} className="h-full relative z-10">
            <TiltCard className="glass project-tile h-full" max={7}>
              <SaberGlow seed={index + 3} beams={4} />

              <article className="project-card">
                <div className="project-card__media">
                  {project.photos && project.photos.length > 0 ? (
                    <Image
                      src={project.photos[0]}
                      alt={project.title}
                      width={1280}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 640px"
                    />
                  ) : project.cover_image ? (
                    <Image
                      src={project.cover_image}
                      alt={project.title}
                      width={1280}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 640px"
                    />
                  ) : null}
                  <span className="project-card__badge">{project.year ?? project.status}</span>
                </div>

                <div className="project-card__body">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
                    {project.featured ? <span className="tag">Featured</span> : null}
                  </div>

                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-cyan-300/80">
                    {project.client ? `${project.role ?? "Fullstack"} · ${project.client}` : project.role ?? "Fullstack"}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">{project.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-5 pt-6 text-sm">
                    <Link href={`/project/${project.slug}`} className="link-arrow text-white hover:text-cyan-200">
                      View detail <ArrowUpRight />
                    </Link>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-arrow text-zinc-500 hover:text-white"
                      >
                        Live demo <ArrowUpRight />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {projects.length === 0 && (
        <Reveal delay={80} className="relative z-10">
          <div className="glass rounded-3xl p-9 text-center text-zinc-400">
            Belum ada project dipublikasikan.
          </div>
        </Reveal>
      )}
    </SitePage>
  );
}
