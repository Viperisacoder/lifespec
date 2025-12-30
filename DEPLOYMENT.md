# LifeSpec Deployment Guide

## Environment Variables Required

For production deployment on Vercel, ensure these environment variables are set:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** 
- Use the **ANON KEY** only (not the secret key)
- Both variables must be prefixed with `NEXT_PUBLIC_` to be accessible in browser context
- These are safe to expose in the browser as they use row-level security (RLS)

### Vercel Analytics
- `@vercel/analytics` is already installed and configured in `app/layout.tsx`
- No additional configuration needed; analytics will automatically track visitors

## Supabase Client Architecture

The app uses a lazy-loading Supabase client to prevent build-time failures:

### Browser Client (`lib/supabase/browser.ts`)
- Used in all client components (`'use client'`)
- Lazily initializes only when first called in browser context
- Throws clear error if env vars are missing at runtime
- Used by: AuthContext, login/signup pages

### Server Client (`lib/supabase/server.ts`)
- For future server actions and route handlers
- Currently not in use but available for server-side auth flows

## Build & Deployment

### Local Testing
```bash
npm run build
```

This will:
1. Compile all TypeScript
2. Prerender static pages
3. **NOT** fail on missing Supabase env vars (lazy initialization prevents this)

### Vercel Deployment
1. Push code to GitHub
2. Vercel automatically detects Next.js and builds
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Troubleshooting

### Build Error: "supabaseUrl is required"
- **Cause:** Old `lib/supabaseClient.ts` was being imported at build time
- **Solution:** Already fixed! Using lazy-loading client in `lib/supabase/browser.ts`

### Auth Not Working
- Verify env vars are set in Vercel dashboard
- Check Supabase project settings (Email provider enabled)
- Verify RLS policies allow auth operations

### Images Not Showing
- Check image paths in `app/wizard/page.tsx` imageMap
- Verify images exist in `public/` directory
- Use correct case-sensitive paths (e.g., `/Food/`, `/healthandwellness/`)

## Key Files

- `lib/supabase/browser.ts` - Lazy-loading browser client
- `lib/supabase/server.ts` - Server client (for future use)
- `app/contexts/AuthContext.tsx` - Auth state management
- `app/layout.tsx` - Root layout with Analytics
- `app/not-found.tsx` - 404 page handler
