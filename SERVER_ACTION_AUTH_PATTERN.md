# Server Action Authentication Pattern - Best Practices

## Problem: Why the Original Code Failed

### Root Cause
The original server action threw errors when authentication failed:

```typescript
// ❌ WRONG: Throws on auth failure
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error('User not authenticated');
```

**Why this causes crashes:**
1. Server actions in Next.js App Router don't have automatic error boundaries
2. Throwing from a server action crashes the entire request with a 500 error
3. Supabase auth can fail for several reasons:
   - Missing session cookie
   - Expired authentication token
   - User not logged in
   - Auth session not yet initialized
4. Users attempting to save before signing in would crash the app

### The Error We Saw
```
Auth error: [Error [AuthSessionMissingError]: Auth session missing!]
Failed to upsert user inputs: Error: Authentication failed
⨯ Error: User not authenticated
POST /blueprints 500 in 404ms
```

This happened because:
- User was not authenticated when the drawer tried to save
- The server action threw an error
- Next.js converted it to a 500 response
- The client had no graceful way to handle it

---

## Solution: Result Pattern (Never Throw Auth Errors)

### New Pattern

```typescript
// ✅ CORRECT: Returns result object, never throws
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; reason: 'UNAUTHENTICATED' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'UNKNOWN_ERROR' };

async function getAuthenticatedUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error.message);
      return { user: null, error: 'UNAUTHENTICATED' as const };
    }
    
    if (!data.user) {
      return { user: null, error: 'UNAUTHENTICATED' as const };
    }
    
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Unexpected auth error:', error);
    return { user: null, error: 'UNAUTHENTICATED' as const };
  }
}

export async function upsertUserInputs(inputs: Partial<UserInputs>): Promise<ActionResult<UserInputs>> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    
    if (authError) {
      // Return error result instead of throwing
      return { success: false, reason: authError };
    }

    // ... rest of logic
    return { success: true, data: result };
  } catch (error) {
    // Catch unexpected errors, never throw
    console.error('Unexpected error:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}
```

### Key Principles

1. **Never throw on auth failure** - Return a result object instead
2. **Catch all errors** - Wrap everything in try/catch
3. **Type-safe results** - Use discriminated unions for type safety
4. **Specific error reasons** - Categorize errors for better UX
5. **Always return** - Never let an error propagate

---

## Client-Side Handling

### Pattern for Consuming Results

```typescript
const result = await upsertUserInputs(payload);

if (!result.success) {
  // Handle specific error reasons
  const errorMessages: Record<string, string> = {
    UNAUTHENTICATED: 'Please sign in to save your inputs.',
    NOT_FOUND: 'Could not find your profile.',
    DATABASE_ERROR: 'Failed to save. Please try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
  };
  
  setError(errorMessages[result.reason]);
  return; // Don't crash, just show error
}

// Success path
onSave(result.data);
onClose();
```

### Benefits
- ✅ No unhandled promise rejections
- ✅ Graceful error messages
- ✅ User stays in the app
- ✅ Can retry without page reload
- ✅ Type-safe error handling

---

## Defensive Checks Implemented

### 1. Auth Error Check
```typescript
if (error) {
  console.error('Auth error:', error.message);
  return { user: null, error: 'UNAUTHENTICATED' as const };
}
```
Catches Supabase auth errors (missing session, expired tokens, etc.)

### 2. Missing User Check
```typescript
if (!data.user) {
  return { user: null, error: 'UNAUTHENTICATED' as const };
}
```
Handles case where auth succeeds but no user is returned

### 3. Unexpected Exception Catch
```typescript
catch (error) {
  console.error('Unexpected auth error:', error);
  return { user: null, error: 'UNAUTHENTICATED' as const };
}
```
Catches any unexpected errors in auth check

### 4. Database Error Handling
```typescript
if (error) {
  if (error.code === 'PGRST116') {
    return { success: false, reason: 'NOT_FOUND' };
  }
  return { success: false, reason: 'DATABASE_ERROR' };
}
```
Distinguishes between "not found" and actual database errors

### 5. Outer Try/Catch
```typescript
try {
  // ... all logic
} catch (error) {
  console.error('Unexpected error:', error);
  return { success: false, reason: 'UNKNOWN_ERROR' };
}
```
Final safety net for any unexpected exceptions

---

## Why This Prevents Runtime Errors

### Before (Throwing Pattern)
```
User clicks Save
  ↓
Server action throws on auth failure
  ↓
Next.js catches unhandled error
  ↓
Returns 500 error
  ↓
Client crashes or shows generic error
  ↓
User confused, app broken
```

### After (Result Pattern)
```
User clicks Save
  ↓
Server action checks auth
  ↓
Returns { success: false, reason: 'UNAUTHENTICATED' }
  ↓
Client receives result
  ↓
Shows user-friendly message: "Please sign in to save"
  ↓
User stays in app, can sign in and retry
  ↓
No crashes, good UX
```

---

## Extending This Pattern

### Template for New Server Actions

```typescript
export async function myNewAction(input: InputType): Promise<ActionResult<OutputType>> {
  try {
    // 1. Check auth first
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) {
      return { success: false, reason: authError };
    }

    // 2. Validate input
    if (!input.required_field) {
      return { success: false, reason: 'VALIDATION_ERROR' };
    }

    // 3. Database operation
    const { data, error } = await supabase
      .from('table_name')
      .operation()
      .eq('user_id', user!.id);

    if (error) {
      console.error('Database error:', error);
      return { success: false, reason: 'DATABASE_ERROR' };
    }

    // 4. Return success
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}
```

### Adding New Error Reasons

1. Add to `ErrorResult` type:
```typescript
type ErrorResult = { 
  success: false; 
  reason: 'UNAUTHENTICATED' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR' 
};
```

2. Handle in client:
```typescript
const errorMessages: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  // ... other messages
};
```

---

## Testing the Pattern

### Test Case 1: Unauthenticated User
```typescript
// User not logged in
const result = await upsertUserInputs(payload);
// Expected: { success: false, reason: 'UNAUTHENTICATED' }
// Actual behavior: Shows "Please sign in to save your inputs."
// No crash ✅
```

### Test Case 2: Valid User
```typescript
// User logged in with valid session
const result = await upsertUserInputs(payload);
// Expected: { success: true, data: UserInputs }
// Actual behavior: Saves and closes drawer
// Success ✅
```

### Test Case 3: Database Error
```typescript
// Valid auth but database error
const result = await upsertUserInputs(payload);
// Expected: { success: false, reason: 'DATABASE_ERROR' }
// Actual behavior: Shows "Failed to save. Please try again."
// Graceful error ✅
```

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Auth Failure | Throws error → 500 crash | Returns result → graceful error |
| User Experience | App breaks | Shows friendly message |
| Error Handling | Unhandled promise rejection | Explicit result checking |
| Type Safety | Implicit error types | Discriminated union types |
| Extensibility | Hard to add error types | Easy to add new reasons |
| Testing | Difficult to test errors | Easy to test all paths |

This pattern is the industry standard for Next.js server actions and should be used for all future server-side operations.
