# Blueprint Save Fix - Verification Checklist

## Overview
This document verifies the complete fix for blueprint saving with proper error logging, atomic upsert, and RLS enforcement.

## Files Changed
1. **supabase/migrations/20260103_fix_blueprints_schema.sql** - New migration with simplified schema
2. **lib/blueprintService.ts** - Complete rewrite with enhanced error logging
3. **app/wizard/page.tsx** - Updated handleSaveBlueprint to display detailed errors

## Database Schema (FINAL)
```sql
CREATE TABLE public.blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Points:**
- ✅ `user_id` has UNIQUE constraint (enforces 1 blueprint per user)
- ✅ RLS enabled with policies for SELECT/INSERT/UPDATE/DELETE
- ✅ Automatic `updated_at` trigger on UPDATE
- ✅ ON DELETE CASCADE ensures cleanup when user is deleted

## Error Logging (FIXED)
The new `saveBlueprint()` function logs:
```
{
  message: "string",
  code: "string (e.g., '23505' for unique violation)",
  details: "string (PostgreSQL error details)",
  hint: "string (PostgreSQL hint)",
  raw: "full error object"
}
```

Example console output:
```
[saveBlueprint] Database error: {
  message: "duplicate key value violates unique constraint \"blueprints_user_id_key\"",
  code: "23505",
  details: null,
  hint: "Key (user_id)=(uuid-here) already exists.",
  raw: {...}
}
```

## Atomic Upsert (FIXED)
```typescript
const { data, error } = await supabase
  .from('blueprints')
  .upsert(
    {
      user_id: user.id,
      blueprint: payload,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id', // ← Atomic: replaces existing blueprint
    }
  )
  .select()
  .single();
```

**Why this works:**
- PostgreSQL UPSERT is atomic (no race conditions)
- `onConflict: 'user_id'` means: if user_id exists, UPDATE; else INSERT
- RLS policies enforce `auth.uid() = user_id` on both INSERT and UPDATE
- Client-side code uses authenticated session (no service role)

## RLS Policies (VERIFIED)
All four policies are in place:

1. **SELECT**: Users can only read their own blueprint
   ```sql
   USING (auth.uid() = user_id)
   ```

2. **INSERT**: Users can only insert their own blueprint
   ```sql
   WITH CHECK (auth.uid() = user_id)
   ```

3. **UPDATE**: Users can only update their own blueprint
   ```sql
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id)
   ```

4. **DELETE**: Users can only delete their own blueprint
   ```sql
   USING (auth.uid() = user_id)
   ```

## Error Response Format
The `saveBlueprint()` function returns:

**On Success:**
```typescript
{
  success: true,
  data: {
    id: "uuid",
    user_id: "uuid",
    blueprint: {...},
    created_at: "timestamp",
    updated_at: "timestamp"
  }
}
```

**On Failure:**
```typescript
{
  success: false,
  reason: "DATABASE_ERROR" | "UNAUTHENTICATED" | "VALIDATION_ERROR" | "AUTH_ERROR" | "UNKNOWN_ERROR",
  error: {
    message: "Human-readable error message",
    code?: "PostgreSQL error code",
    details?: "PostgreSQL error details",
    hint?: "PostgreSQL hint",
    raw?: "Full error object"
  }
}
```

## UI Error Display (FIXED)
The wizard page now displays:
```typescript
const errorMsg = result.error?.message || result.reason || 'Unknown error';
const errorCode = result.error?.code ? ` (${result.error.code})` : '';
const errorHint = result.error?.hint ? `\n\nTip: ${result.error.hint}` : '';

alert(`Failed to save blueprint: ${errorMsg}${errorCode}${errorHint}`);
```

Example user-facing message:
```
Failed to save blueprint: duplicate key value violates unique constraint "blueprints_user_id_key" (23505)

Tip: Key (user_id)=(uuid-here) already exists.
```

---

## VERIFICATION TESTS

### Test 1: RLS Policy Enforcement
**Goal:** Verify that RLS prevents unauthorized access

**Steps:**
1. Sign in as User A
2. Save a blueprint
3. Open browser DevTools → Network tab
4. Manually craft a request to update User B's blueprint (different user_id)
5. Verify request is rejected with 403 Forbidden

**Expected Result:** ✅ Request blocked by RLS policy

---

### Test 2: Logged-In User Can Save
**Goal:** Verify authenticated users can save blueprints

**Steps:**
1. Sign in to the app
2. Complete the wizard
3. Click "Save Blueprint"
4. Check browser console for `[saveBlueprint] Blueprint saved successfully: {id}`
5. Verify success alert appears

**Expected Result:** ✅ Blueprint saved, success message shown

---

### Test 3: Atomic Replacement (1 Blueprint Per User)
**Goal:** Verify that saving a second blueprint replaces the first atomically

**Steps:**
1. Sign in as User A
2. Save Blueprint #1 (e.g., $5,000/month)
3. Wait 2 seconds
4. Save Blueprint #2 (e.g., $7,000/month)
5. Query the database: `SELECT COUNT(*) FROM blueprints WHERE user_id = '{user_id}'`
6. Verify count is 1 (not 2)
7. Verify the blueprint data is Blueprint #2

**Expected Result:** ✅ Only 1 blueprint exists, it's the newest one

---

### Test 4: Detailed Error Logging
**Goal:** Verify error messages are logged with full details

**Steps:**
1. Sign in as User A
2. Save Blueprint #1
3. Manually corrupt the database (e.g., set `blueprint` to NULL)
4. Try to save Blueprint #2
5. Check browser console for error object with: message, code, details, hint, raw

**Expected Result:** ✅ Console shows full error details, not empty `{}`

---

### Test 5: Unauthenticated User Redirect
**Goal:** Verify unauthenticated users cannot save

**Steps:**
1. Sign out
2. Complete the wizard
3. Click "Save Blueprint"
4. Verify alert: "Blueprint saved temporarily. Please sign up to save permanently."
5. Verify redirected to `/signup?next=/blueprints`
6. Verify blueprint is in localStorage under key `lifespec_pending_blueprint`

**Expected Result:** ✅ Redirected to signup, blueprint stored in localStorage

---

### Test 6: Validation Error
**Goal:** Verify invalid payloads are rejected

**Steps:**
1. Sign in
2. Modify wizard code to send invalid payload (missing `totalMonthly`)
3. Try to save
4. Verify alert: "Invalid blueprint payload: missing required fields..."

**Expected Result:** ✅ Validation error shown before database call

---

## Deployment Checklist

- [ ] Run migration: `supabase migration up` (or apply 20260103_fix_blueprints_schema.sql)
- [ ] Verify blueprints table exists: `SELECT * FROM information_schema.tables WHERE table_name='blueprints';`
- [ ] Verify RLS is enabled: `SELECT relrowsecurity FROM pg_class WHERE relname='blueprints';` (should be `t`)
- [ ] Verify policies exist: `SELECT policyname FROM pg_policies WHERE tablename='blueprints';` (should show 4 policies)
- [ ] Verify unique constraint: `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='blueprints' AND constraint_type='UNIQUE';` (should show `blueprints_user_id_key`)
- [ ] Deploy updated TypeScript files
- [ ] Test in development environment
- [ ] Test in staging environment
- [ ] Deploy to production

---

## Rollback Plan

If issues occur:

1. **Revert migration:** Delete the `20260103_fix_blueprints_schema.sql` migration and run `supabase migration down`
2. **Revert code:** Restore previous `blueprintService.ts` and `wizard/page.tsx` from git
3. **Verify:** Run Test 1-6 again to confirm rollback

---

## Summary

✅ **Error Logging:** Full Supabase error details now logged (message, code, details, hint, raw)
✅ **Atomic Upsert:** 1 blueprint per user enforced atomically with `onConflict: 'user_id'`
✅ **RLS Enforcement:** All 4 policies in place, no service role used on client
✅ **Error Response:** Detailed error object returned to UI with user-friendly messages
✅ **UI Display:** Wizard page shows full error details including PostgreSQL hints

**Status:** READY FOR TESTING
