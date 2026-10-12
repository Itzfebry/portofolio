-- Rasio asli tiap foto proyek, paralel dengan array `photos`.
-- Nilai berupa "16/9", "9/16", dst. String kosong = rasio tidak diketahui (data lama).
alter table public.projects add column if not exists photo_ratios text[] not null default '{}';
