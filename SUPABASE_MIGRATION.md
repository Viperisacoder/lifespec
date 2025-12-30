# Supabase Client Migration Summary

## Problem
Build was failing with: `Error occurred prerendering page '/_not-found' … Error: supabaseUrl is required`

This happened because `lib/supabaseClient.ts` was being imported at build time (during prerendering), and it immediately tried to create a Supabase client with environment variables that weren't available during the build process.

## Solution
Implemented a lazy-loading Supabase client architecture that only initializes when actually needed in the browser.

## Changes Made

### 1. New Files Created

#### `lib/supabase/browser.ts`
- Lazy-loads Supabase client only when called
- Only works in browser context (checks `typeof window`)
- Throws clear error if env vars missing at runtime (not build time)
- Used by all client components

#### `lib/supabase/server.ts`
- For future server actions and route handlers
- Available but not currently in use

### 2. Updated Files

#### `app/contexts/AuthContext.tsx`
- Changed from: `import { supabase } from '@/lib/supabaseClient'`
- Changed to: `import { getSupabaseBrowserClient } from '@/lib/supabase/browser'`
- Calls `getSupabaseBrowserClient()` inside useEffect and auth methods
- Added proper error handling for missing env vars

#### `app/signup/page.tsx`
- Changed from: `import { supabase } from '@/lib/supabaseClient'`
- Changed to: `import { getSupabaseBrowserClient } from '@/lib/supabase/browser'`
- Wrapped signup logic in try-catch
- Calls `getSupabaseBrowserClient()` inside handleSubmit

#### `app/login/page.tsx`
- Changed from: `import { supabase } from '@/lib/supabaseClient'`
- Changed to: `import { getSupabaseBrowserClient } from '@/lib/supabase/browser'`
- Wrapped login logic in try-catch
- Calls `getSupabaseBrowserClient()` inside handleSubmit

#### `app/not-found.tsx`
- Made it a client component (`'use client'`)
- Uses `useRouter` instead of `Link` to avoid SSR issues
- No Supabase imports

### 3. Old File
- `lib/supabaseClient.ts` - No longer imported anywhere, can be safely deleted

## Why This Works

1. **Lazy Initialization**: `getSupabaseBrowserClient()` only creates the client when called
2. **Browser-Only**: Checks `typeof window` to ensure it only runs in browser context
3. **No Build-Time Execution**: The client creation code never runs during `npm run build`
4. **Runtime Errors Only**: If env vars are missing, error occurs when user tries to auth (not during build)
5. **Proper Error Handling**: Try-catch blocks in auth pages handle missing env var errors gracefully

## Environment Variables

Required in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- Use the **ANON KEY** (not secret key)
- Both must have `NEXT_PUBLIC_` prefix
- Safe to expose in browser (uses RLS)

## Testing

Local build should now succeed:
```bash
npm run build
```

No prerender errors for `/_not-found` or other pages.

## Deployment

1. Push to GitHub
2. Vercel auto-detects and builds
3. Set env vars in Vercel dashboard
4. Deploy succeeds without build errors
