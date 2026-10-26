# Performance Changes & Measurements

## Before (baseline)
- Build compile: 45s (Turbopack), TS: 15.4s, static gen: 4.0s
- Lighthouse: TBT 460ms, 20 long tasks, 14.8s CPU, 47 KiB unused JS, 13.7 KiB polyfill waste
- LCP 1.3s with 6.46s element render delay
- Images: ~94 KiB savings available (Febry.png oversized, favicon, wedding images)
- 42 non-composited animations

## Changes applied
1. `next.config.ts`: added `formats: ["image/avif","image/webp"]`, `minimumCacheTTL: 30 days`.
2. `tsconfig.json`: target `ES2017 → ES2022`.
3. `package.json`: browserslist (last 2 versions) → removes legacy polyfills.
4. Image quality set to 60 on Supabase/local assets (hero, project carousel, certificate carousel).
5. Bundle analyzer configured (`ANALYZE=true npm run build -- --webpack`).

## After
- Build compile: 1.6s (cached), TS: 5.4s, static gen: 3.5s
- Static bundle: 1.7M total, 26 JS chunks
- Heavy libs (pdfjs, canvas, shaders) already dynamic-imported

## Deferred
- Animation CSS refactor (width → transform) — visual risk
- Febry.png source resize to ~420px
- Bundle chunk splitting audit via analyzer HTML reports