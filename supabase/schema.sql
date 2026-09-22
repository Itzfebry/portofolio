create extension if not exists "pgcrypto";

create table if not exists public.profile (
    id uuid primary key default gen_random_uuid(),
    name text not null default 'Your Name',
    role text not null default 'Full-stack developer',
    location text default 'Indonesia',
    email text not null default 'hello@example.com',
    bio text default 'I build digital experiences that help businesses grow.',
    headline text default 'I help brands ship polished experiences.',
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.skills (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    category text not null default 'General',
    level integer not null default 80 check (level between 0 and 100),
    image_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.skills add column if not exists image_url text;

create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    summary text not null,
    description text not null,
    status text not null default 'published' check (status in ('draft', 'published')),
    featured boolean not null default false,
    live_url text,
    github_url text,
    cover_image text,
    technologies text[] not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
    id uuid primary key default gen_random_uuid(),
    role text not null,
    company text not null,
    period text not null,
    description text not null,
    location text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.education (
    id uuid primary key default gen_random_uuid(),
    institution text not null,
    degree text not null,
    field text not null,
    period text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.services (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text not null,
    price text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
    id uuid primary key default gen_random_uuid(),
    platform text not null,
    label text not null,
    url text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_projects_status on public.projects (status);
create index if not exists idx_projects_featured on public.projects (featured);
create index if not exists idx_skills_category on public.skills (category);
create index if not exists idx_services_title on public.services (title);

alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.services enable row level security;
alter table public.social_links enable row level security;

drop policy if exists "Public read access" on public.profile;
create policy "Public read access" on public.profile
for select using (true);

drop policy if exists "Public read access" on public.skills;
create policy "Public read access" on public.skills
for select using (true);

drop policy if exists "Public read access" on public.projects;
create policy "Public read access" on public.projects
for select using (true);

drop policy if exists "Public read access" on public.experiences;
create policy "Public read access" on public.experiences
for select using (true);

drop policy if exists "Public read access" on public.education;
create policy "Public read access" on public.education
for select using (true);

drop policy if exists "Public read access" on public.services;
create policy "Public read access" on public.services
for select using (true);

drop policy if exists "Public read access" on public.social_links;
create policy "Public read access" on public.social_links
for select using (true);

drop policy if exists "Authenticated write access" on public.profile;
create policy "Authenticated write access" on public.profile
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated write access" on public.skills;
create policy "Authenticated write access" on public.skills
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated write access" on public.projects;
create policy "Authenticated write access" on public.projects
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated write access" on public.experiences;
create policy "Authenticated write access" on public.experiences
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated write access" on public.education;
create policy "Authenticated write access" on public.education
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated write access" on public.services;
create policy "Authenticated write access" on public.services
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated write access" on public.social_links;
create policy "Authenticated write access" on public.social_links
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('skill-images', 'skill-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read skill images" on storage.objects;
create policy "Public read skill images" on storage.objects
for select using (bucket_id = 'skill-images');
