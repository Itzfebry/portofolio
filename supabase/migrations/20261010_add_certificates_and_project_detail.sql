-- Certificates: table + RLS + storage bucket (file maks 2MB, gambar/PDF)
create table if not exists public.certificates (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    issuer text not null default '',
    issued_at text,
    credential_id text,
    category text not null default 'Lainnya',
    file_url text not null,
    file_type text not null default 'image' check (file_type in ('image', 'pdf')),
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_certificates_sort on public.certificates (sort_order);
create index if not exists idx_certificates_category on public.certificates (category);

alter table public.certificates enable row level security;

drop policy if exists "Public read access" on public.certificates;
create policy "Public read access" on public.certificates
for select using (true);

drop policy if exists "Authenticated write access" on public.certificates;
create policy "Authenticated write access" on public.certificates
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Bucket sertifikat (publik, dipakai service role dari server action admin)
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read certificates" on storage.objects;
create policy "Public read certificates" on storage.objects
for select using (bucket_id = 'certificates');

-- Detail proyek: dipakai halaman /project/[slug]
alter table public.projects add column if not exists year text;
alter table public.projects add column if not exists client text;
alter table public.projects add column if not exists highlights text[] not null default '{}';
alter table public.projects add column if not exists detail_description text;
