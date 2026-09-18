# Portfolio

Next.js portfolio project using Supabase for its backend and database.

## Local development

Copy `.env.example` to `.env.local`, then fill in the Supabase project URL and publishable key.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Validation

```bash
npm run lint
npm run build
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add these environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Redeploy after saving the variables.

`.env.local` is ignored by Git and must never be committed. The publishable key is intended for browser use; never expose a Supabase service role key in a `NEXT_PUBLIC_*` variable.

The public portfolio and admin features can be added incrementally without changing the Vercel deployment setup.
