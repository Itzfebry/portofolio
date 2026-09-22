/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import GatewayFlow from "@/components/ui/gateway-flow";
import LiquidGlassShell from "@/components/ui/liquid-glass-shell";
import { getPortfolioData } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function LocationIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.2" /></svg>;
}

function MailIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" /></svg>;
}

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <LiquidGlassShell>
      <main className="relative text-white">
        <header className="sticky top-4 z-30 mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-6">
          <div className="rainbow-text text-xs font-semibold tracking-[.2em]">PORTFOLIO</div>
          <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
            {["about", "skills", "projects", "experience", "contact"].map((item) => (
              <a key={item} href={`#${item}`} className="rainbow-text capitalize">{item}</a>
            ))}
          </nav>
          <a href={`mailto:${data.profile.email}`} className="rainbow-text text-sm">Let&apos;s talk <ArrowIcon /></a>
        </header>

        <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-16 text-center sm:px-6">
          <div className="crypto-atmosphere -z-20" />
          <GatewayFlow className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-35" density={.65} opacity={.32} speed={.25} />
          <div className="hero-orb -left-48 top-20 bg-cyan-300" />
          <div className="hero-orb -right-48 top-36 bg-pink-300 [animation-delay:-5s]" />
          <p className="relative text-xs font-medium uppercase tracking-[.34em] text-zinc-400">Junior Web &amp; Mobile Developer</p>
          <div className="relative mt-8">
            <div className="absolute inset-x-8 bottom-8 h-32 rounded-full bg-cyan-200/10 blur-3xl" />
            <div className="portrait-stage">
              <Image src="/images/Febry.png" alt={`${data.profile.name}, ${data.profile.role}`} width={520} height={780} priority className="relative z-10 h-full w-auto object-contain object-bottom drop-shadow-[0_28px_28px_rgba(0,0,0,.7)]" />
            </div>
            <div className="glass hero-chip hero-chip--left absolute rounded-xl px-3 py-2 text-left text-[10px] font-medium uppercase tracking-[.18em] text-zinc-300 shadow-xl"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7]" />Open to work</div>
            <div className="glass hero-chip hero-chip--right absolute rounded-xl px-3 py-2 text-[10px] font-medium tracking-wider text-zinc-300 shadow-xl">Web · Mobile · UI</div>
          </div>
          <h1 className="mt-9 text-4xl font-semibold tracking-[-.04em] text-white sm:text-6xl"><span className="rainbow-text inline-block">Mochammad Ginata</span><br /><span className="rainbow-text inline-block">Febryansyah</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">Building responsive web and mobile experiences with a focus on clean interfaces, practical functionality, and user-centered design.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-zinc-200">View My Projects <ArrowIcon /></a>
            <a href="#contact" className="glass rounded-2xl px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5">Contact Me</a>
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5 text-sm text-zinc-500">
            {data.socialLinks.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="transition hover:text-white">{link.label}</a>)}
            <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />
            <span className="flex items-center gap-2"><LocationIcon />{data.profile.location}</span>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 sm:px-6">
          <div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]">
            <div className="glass rgb-ring rounded-3xl p-7 sm:p-9"><p className="text-xs uppercase tracking-[.28em] text-zinc-500">01 / About</p><h2 className="mt-14 text-3xl font-semibold tracking-tight">Thoughtful digital experiences, built to last.</h2></div>
            <div className="glass rounded-3xl p-7 sm:p-9"><p className="text-lg leading-8 text-zinc-300">{data.profile.bio}</p><div className="mt-10 flex flex-wrap gap-3 text-xs uppercase tracking-wider text-zinc-500"><span className="rounded-full border border-white/10 px-3 py-2">Frontend</span><span className="rounded-full border border-white/10 px-3 py-2">Mobile</span><span className="rounded-full border border-white/10 px-3 py-2">User-centered</span></div></div>
          </div>
        </section>

        <section id="skills" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 sm:px-6">
          <div className="mb-8 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.28em] text-zinc-500">02 / Capabilities</p><h2 className="mt-3 text-3xl font-semibold">Tools of the craft</h2></div><span className="text-sm text-zinc-600">{data.skills.length} technologies</span></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.skills.map((skill) => <div key={skill.id} className="glass rounded-2xl p-4 transition"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 p-2">{skill.image_url ? <img src={skill.image_url} alt="" className="h-full w-full object-contain" loading="lazy" /> : <span className="text-xs text-zinc-400">{skill.name.slice(0, 2)}</span>}</div><div className="min-w-0 flex-1"><p className="truncate font-medium">{skill.name}</p><p className="mt-1 text-xs text-zinc-500">{skill.category}</p></div><span className="text-xs text-zinc-500">{skill.level}%</span></div><div className="mt-4 h-1 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-pink-300" style={{ width: `${skill.level}%` }} /></div></div>)}
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 sm:px-6">
          <div className="mb-8"><p className="text-xs uppercase tracking-[.28em] text-zinc-500">03 / Selected work</p><h2 className="mt-3 text-3xl font-semibold">Projects with purpose.</h2></div>
          <div className="grid gap-5 md:grid-cols-2">
            {data.projects.map((project) => <article key={project.id} className="glass group rounded-3xl p-2 transition"><div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 via-violet-500/10 to-zinc-900">{project.cover_image ? <img src={project.cover_image} alt="" className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100" loading="lazy" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.18),transparent_35%)] transition duration-700 group-hover:scale-110" />}</div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-xl font-medium">{project.title}</h3><span className="text-xs text-zinc-500">{project.status}</span></div><p className="mt-3 text-sm leading-6 text-zinc-400">{project.summary}</p><div className="mt-5 flex flex-wrap gap-2">{project.technologies.map((tech) => <span key={tech} className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-zinc-400">{tech}</span>)}</div><div className="mt-6 flex gap-4 text-sm">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="text-white hover:text-cyan-200">Live demo <ArrowIcon /></a>}{project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white">Source <ArrowIcon /></a>}</div></div></article>)}
          </div>
        </section>

        <section id="experience" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 sm:px-6">
          <div className="mb-8"><p className="text-xs uppercase tracking-[.28em] text-zinc-500">04 / Experience</p><h2 className="mt-3 text-3xl font-semibold">A considered approach.</h2></div>
          <div className="space-y-3">{data.experiences.map((item) => <div key={item.id} className="glass rounded-2xl p-5 sm:flex sm:items-center sm:justify-between sm:p-6"><div><h3 className="text-lg font-medium">{item.role}</h3><p className="mt-1 text-sm text-zinc-500">{item.company}{item.location ? ` · ${item.location}` : ""}</p><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{item.description}</p></div><p className="mt-4 shrink-0 text-sm text-zinc-500 sm:mt-0">{item.period}</p></div>)}</div>
        </section>

        <section id="contact" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 pb-28 sm:px-6">
          <div className="glass rgb-ring overflow-hidden rounded-3xl p-8 sm:p-12"><div className="hero-orb -right-40 -top-40 bg-violet-400" /><p className="relative text-xs uppercase tracking-[.28em] text-zinc-500">05 / Contact</p><div className="relative mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><h2 className="text-4xl font-semibold tracking-tight">Let&apos;s build something<br className="hidden sm:block" /> together.</h2><p className="mt-4 max-w-md text-zinc-400">Have a project in mind or want to say hello? I&apos;d love to hear from you.</p></div><a href={`mailto:${data.profile.email}`} className="inline-flex items-center gap-2 text-lg text-white underline decoration-white/20 underline-offset-8 transition hover:decoration-white">{data.profile.email} <ArrowIcon /></a></div><div className="relative mt-10 flex items-center gap-2 text-sm text-zinc-500"><MailIcon />Available for new opportunities</div></div>
        </section>
      </main>
    </LiquidGlassShell>
  );
}
