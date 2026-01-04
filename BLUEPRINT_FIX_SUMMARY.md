# Blueprint Save Fix - Complete Implementation Summary

## Problem Statement
- Error logging showed empty object `{}` instead of real Supabase errors
- No atomic enforcement of "1 blueprint per user"
- Unclear error messages to users
- Race condition risk on concurrent saves

## Solution Delivered

### A) SQL Migration
**File:** `supabase/migrations/20260103_fix_blueprints_schema.sql`

**Key Changes:**
1. Simplified schema: removed `name`, `metrics_json` columns (store in `blueprint` JSONB)
2. Added `UNIQUE` constraint on `user_id` (enforces 1 per user at DB level)
3. Recreated all 4 RLS policies (SELECT, INSERT, UPDATE, DELETE)
4. Added automatic `updated_at` trigger

**Why this works:**
- PostgreSQL UNIQUE constraint prevents duplicate user_id
- UPSERT with `onConflict: 'user_id'` is atomic (no race conditions)
- RLS policies enforce `auth.uid() = user_id` on all operations
- Trigger ensures `updated_at` is always current

---

### B) TypeScript Service Layer
**File:** `lib/blueprintService.ts` (COMPLETE REWRITE)

**Key Functions:**

#### 1. `saveBlueprint(payload, name)`
```typescript
export async function saveBlueprint(
  payload: BlueprintPayload,
  name: string = 'My Blueprint'
): Promise<ServiceResult<any>>
```

**What it does:**
1. Validates payload (checks required fields)
2. Gets current user (hard-fails if not authenticated)
3. Upserts blueprint with `onConflict: 'user_id'` (atomic replacement)
4. Logs FULL error details if it fails
5. Returns structured result with error details

**Error Logging (THE FIX):**
```typescript
if (error) {
  console.error('[saveBlueprint] Database error:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    raw: JSON.stringify(error),
  });
  
  return {
    success: false,
    reason: 'DATABASE_ERROR',
    error: extractErrorDetails(error),
  };
}
```

**Result Type:**
```typescript
type ServiceResult<T> = 
  | { success: true; data: T }
  | { 
      success: false; 
      reason: string; 
      error: {
        message: string;
        code?: string;
        details?: string;
        hint?: string;
        raw?: any;
      }
    }
```

#### 2. `getBlueprint()`
- Fetches current user's blueprint
- Returns null if not found (code PGRST116)
- Full error details on failure

#### 3. `deleteBlueprint()`
- Deletes current user's blueprint
- RLS policy enforces ownership

#### 4. `importPendingBlueprint()`
- Imports blueprint from localStorage after signup
- Clears localStorage on success

---

### C) UI Layer Updates
**File:** `app/wizard/page.tsx` - `handleSaveBlueprint()` function

**Before:**
```typescript
const result = await saveBlueprint(payload);
if (result.success) {
  alert('Blueprint saved successfully!');
} else {
  throw new Error(`Failed to save blueprint: ${result.reason}`);
}
```

**After:**
```typescript
const result = await saveBlueprint(payload);
if (result.success) {
  alert('Blueprint saved successfully!');
} else {
  // Extract user-friendly error message
  const errorMsg = result.error?.message || result.reason || 'Unknown error';
  const errorCode = result.error?.code ? ` (${result.error.code})` : '';
  const errorHint = result.error?.hint ? `\n\nTip: ${result.error.hint}` : '';
  
  console.error('[handleSaveBlueprint] Save failed:', {
    reason: result.reason,
    error: result.error,
  });
  
  alert(`Failed to save blueprint: ${errorMsg}${errorCode}${errorHint}`);
}
```

**User-Facing Error Example:**
```
Failed to save blueprint: duplicate key value violates unique constraint "blueprints_user_id_key" (23505)

Tip: Key (user_id)=(abc-123-def) already exists.
```

---

## How It Fixes Each Goal

### Goal 1: Real Error Logging ✅
**Before:** `console.error('Database error saving blueprint: {}')`
**After:** 
```
console.error('[saveBlueprint] Database error:', {
  message: "duplicate key value violates unique constraint...",
  code: "23505",
  details: null,
  hint: "Key (user_id)=(uuid) already exists.",
  raw: {...}
})
```

### Goal 2: Atomic 1 Blueprint Per User ✅
**Before:** No enforcement, race condition possible
**After:**
```typescript
.upsert(
  { user_id, blueprint, updated_at },
  { onConflict: 'user_id' }  // ← Atomic: UPDATE if exists, INSERT if not
)
```
Plus UNIQUE constraint at DB level.

### Goal 3: RLS Enforcement ✅
All 4 policies created:
- SELECT: `USING (auth.uid() = user_id)`
- INSERT: `WITH CHECK (auth.uid() = user_id)`
- UPDATE: `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)`
- DELETE: `USING (auth.uid() = user_id)`

No service role used in client code.

### Goal 4: Useful Error Info ✅
Structured error response with:
- `message`: Human-readable error
- `code`: PostgreSQL error code (e.g., "23505" for unique violation)
- `details`: PostgreSQL details
- `hint`: PostgreSQL hint (shown to user)
- `raw`: Full error object for debugging

### Goal 5: Correct Architecture ✅
- `saveBlueprint()` in `lib/blueprintService.ts`
- Called from `app/wizard/page.tsx`
- Uses browser client (authenticated session)
- No server actions needed (RLS handles auth)

---

## Testing Checklist

### Quick Smoke Test
1. **Sign in**
2. **Complete wizard**
3. **Click "Save Blueprint"**
4. **Check browser console** for `[saveBlueprint] Blueprint saved successfully: {id}`
5. **Verify success alert** appears

### Full Verification
See `BLUEPRINT_FIX_VERIFICATION.md` for 6 comprehensive tests:
1. RLS Policy Enforcement
2. Logged-In User Can Save
3. Atomic Replacement (1 Blueprint Per User)
4. Detailed Error Logging
5. Unauthenticated User Redirect
6. Validation Error

---

## Database Migration Steps

1. **Apply migration:**
   ```bash
   supabase migration up
   # OR manually run: supabase/migrations/20260103_fix_blueprints_schema.sql
   ```

2. **Verify in Supabase Dashboard:**
   - Go to SQL Editor
   - Run: `SELECT * FROM information_schema.tables WHERE table_name='blueprints';`
   - Verify table exists with columns: id, user_id, blueprint, created_at, updated_at

3. **Verify RLS:**
   - Run: `SELECT policyname FROM pg_policies WHERE tablename='blueprints';`
   - Should show 4 policies

4. **Verify Unique Constraint:**
   - Run: `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='blueprints' AND constraint_type='UNIQUE';`
   - Should show: `blueprints_user_id_key`

---

## Files Modified

| File | Change | Reason |
|------|--------|--------|
| `supabase/migrations/20260103_fix_blueprints_schema.sql` | NEW | Simplified schema, UNIQUE constraint, RLS policies |
| `lib/blueprintService.ts` | REWRITE | Full error logging, atomic upsert, structured responses |
| `app/wizard/page.tsx` | UPDATE | Display detailed error messages to user |

---

## Rollback Plan

If issues occur:

1. Delete migration: `supabase/migrations/20260103_fix_blueprints_schema.sql`
2. Run: `supabase migration down`
3. Restore previous `blueprintService.ts` from git
4. Restore previous `wizard/page.tsx` from git
5. Redeploy

---

## Production Readiness

✅ Error logging shows real Supabase errors (message, code, details, hint)
✅ Atomic upsert prevents race conditions
✅ UNIQUE constraint enforces 1 blueprint per user at DB level
✅ RLS policies protect data (no cross-user access)
✅ Client code uses authenticated session (no service role)
✅ User-friendly error messages with PostgreSQL hints
✅ Validation before database call
✅ Proper error handling for all failure modes

**Status: READY FOR DEPLOYMENT**
