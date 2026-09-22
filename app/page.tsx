/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";

import HeroScene from "@/components/ui/hero-scene";
import LiquidGlassShell from "@/components/ui/liquid-glass-shell";
import Reveal from "@/components/ui/reveal";
import SiteNav from "@/components/ui/site-nav";
import TiltCard from "@/components/ui/tilt-card";
import { getPortfolioData } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="arrow h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function yearsOfExperience(periods: string[]) {
  const years = periods.flatMap((period) => (period.match(/\d{4}/g) ?? []).map(Number));
  if (!years.length) return 2;
  return Math.max(1, new Date().getFullYear() - Math.min(...years));
}

export default async function Home() {
  const data = await getPortfolioData();

  const stats = [
    { value: `${yearsOfExperience(data.experiences.map((item) => item.period))}+`, label: "Years building" },
    { value: `${data.projects.length}+`, label: "Projects shipped" },
    { value: `${data.skills.length}`, label: "Technologies" },
  ];

  const marqueeItems = [
    ...data.skills.map((skill) => skill.name),
    ...data.projects.map((project) => project.title),
    ...data.services.map((service) => service.title),
  ];

  return (
    <>
      <SiteNav email={data.profile.email} />

      <LiquidGlassShell>
        <main className="relative text-white">
          <HeroScene profile={data.profile} socialLinks={data.socialLinks} stats={stats} />

          {/* ---------------------------------------------------- marquee */}
          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-10 pr-10">
                  {marqueeItems.map((item, index) => (
                    <span key={`${copy}-${index}`} className="marquee__item">
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------ about */}
          <section id="about" className="section">
            <div className="section-head">
              <div>
                <p className="section-index">01 — About</p>
                <h2 className="section-title">
                  Thoughtful digital experiences,
                  <br />
                  built to <span className="gradient-text">last</span>.
                </h2>
              </div>
              <p className="section-note">Who I am &amp; how I work</p>
            </div>

            <div className="grid gap-5 md:grid-cols-[1.25fr_.75fr]">
              <Reveal className="h-full">
                <div className="glass rgb-ring lift h-full rounded-3xl p-7 sm:p-9">
                  <p className="text-lg leading-8 text-zinc-300">{data.profile.bio}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="tag">Frontend</span>
                    <span className="tag">Mobile</span>
                    <span className="tag">User-centered</span>
                    <span className="tag">Performance</span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120} className="h-full">
                <div className="glass lift h-full rounded-3xl p-7 sm:p-9">
                  <p className="section-index">Details</p>
                  <dl className="mt-7 space-y-5 text-sm">
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-4">
                      <dt className="text-zinc-500">Role</dt>
                      <dd className="text-right font-medium text-zinc-200">{data.profile.role}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-4">
                      <dt className="text-zinc-500">Based in</dt>
                      <dd className="text-right font-medium text-zinc-200">{data.profile.location}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-4">
                      <dt className="text-zinc-500">Focus</dt>
                      <dd className="text-right font-medium text-zinc-200">Web · Mobile · UI</dd>
                    </div>
                    {data.education.slice(0, 1).map((entry) => (
                      <div key={entry.id} className="flex items-start justify-between gap-4">
                        <dt className="text-zinc-500">Education</dt>
                        <dd className="text-right font-medium text-zinc-200">
                          {entry.degree}
                          <span className="mt-1 block text-xs font-normal text-zinc-500">
                            {entry.institution} · {entry.period}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ----------------------------------------------------- skills */}
          <section id="skills" className="section">
            <div className="section-head">
              <div>
                <p className="section-index">02 — Capabilities</p>
                <h2 className="section-title">
                  Tools of the <span className="gradient-text">craft</span>.
                </h2>
              </div>
              <p className="section-note">{data.skills.length} technologies</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.skills.map((skill, index) => (
                <Reveal key={skill.id} delay={(index % 3) * 90} className="h-full">
                  <TiltCard className="glass h-full" max={10}>
                    <div className="skill-card">
                      <div className="flex items-center gap-3">
                        <div className="skill-card__icon">
                          {skill.image_url ? (
                            <img src={skill.image_url} alt="" loading="lazy" />
                          ) : (
                            <span className="text-xs text-zinc-400">{skill.name.slice(0, 2)}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{skill.name}</p>
                          <p className="mt-1 text-xs text-zinc-500">{skill.category}</p>
                        </div>
                        <span className="font-mono text-xs text-zinc-500">{skill.level}%</span>
                      </div>
                      <div className="bar">
                        <span style={{ "--level": `${skill.level}%` } as CSSProperties} />
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </section>

          {/* --------------------------------------------------- projects */}
          <section id="projects" className="section">
            <div className="section-head">
              <div>
                <p className="section-index">03 — Selected work</p>
                <h2 className="section-title">
                  Projects with <span className="gradient-text">purpose</span>.
                </h2>
              </div>
              <p className="section-note">{data.projects.length} case studies</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {data.projects.map((project, index) => (
                <Reveal key={project.id} delay={index * 110} className="h-full">
                  <TiltCard className="glass h-full" max={7}>
                    <article className="project-card">
                      <div className="project-card__media">
                        {project.cover_image ? (
                          <img src={project.cover_image} alt={project.title} loading="lazy" />
                        ) : null}
                        <span className="project-card__badge">{project.status}</span>
                      </div>

                      <div className="project-card__body">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
                          {project.featured ? <span className="tag">Featured</span> : null}
                        </div>

                        <p className="mt-3 text-sm leading-6 text-zinc-400">{project.summary}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="chip">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex gap-5 pt-6 text-sm">
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noreferrer"
                              className="link-arrow text-white hover:text-cyan-200"
                            >
                              Live demo <ArrowUpRight />
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="link-arrow text-zinc-500 hover:text-white"
                            >
                              Source <ArrowUpRight />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------- experience */}
          <section id="experience" className="section">
            <div className="section-head">
              <div>
                <p className="section-index">04 — Experience</p>
                <h2 className="section-title">
                  A considered <span className="gradient-text">approach</span>.
                </h2>
              </div>
              <p className="section-note">{data.experiences.length} roles</p>
            </div>

            <div className="timeline">
              {data.experiences.map((item, index) => (
                <Reveal key={item.id} delay={index * 110} className="timeline__item">
                  <TiltCard className="glass" max={5}>
                    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold tracking-tight">{item.role}</h3>
                          <span className="period-pill">{item.period}</span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-500">
                          {item.company}
                          {item.location ? ` · ${item.location}` : ""}
                        </p>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">{item.description}</p>
                      </div>
                      <span className="shrink-0 font-mono text-xs uppercase tracking-[.2em] text-zinc-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </section>

          {/* --------------------------------------------------- contact */}
          <section id="contact" className="section pb-24">
            <Reveal>
              <div className="glass rgb-ring contact-panel">
                <div className="contact-panel__glow" aria-hidden="true" />

                <div className="relative grid gap-10 md:grid-cols-2 md:items-end">
                  <div>
                    <p className="section-index">05 — Contact</p>
                    <h2 className="section-title mt-6">
                      Let&apos;s build something
                      <br className="hidden sm:block" /> <span className="gradient-text">together</span>.
                    </h2>
                    <p className="mt-5 max-w-md text-zinc-400">
                      Have a project in mind or want to say hello? I&apos;d love to hear from you.
                    </p>
                    <div className="mt-8 flex items-center gap-2.5 text-sm text-zinc-400">
                      <span className="pulse-dot" aria-hidden="true" />
                      Available for new opportunities
                    </div>
                  </div>

                  <div className="md:justify-self-end">
                    <a className="mail-link" href={`mailto:${data.profile.email}`}>
                      {data.profile.email}
                      <ArrowUpRight />
                    </a>
                    <div className="socials mt-7 md:justify-end">
                      {data.socialLinks.map((link) => (
                        <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="social-link">
                          {link.label}
                          <ArrowUpRight />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <p>
              © {new Date().getFullYear()} {data.profile.name}
            </p>
            <p className="hidden sm:block">Next.js · Tailwind CSS · Supabase</p>
            <a href="#top" className="link-arrow text-zinc-400 hover:text-white">
              Back to top <ArrowUpRight />
            </a>
          </div>
        </footer>
      </LiquidGlassShell>
    </>
  );
}
