# Save Blueprint Feature Implementation

## Overview
Implemented a complete "Save Blueprint" feature with 1-blueprint-per-user limit, including guest-to-signup carryover using localStorage.

## Files Created

### 1. `/lib/blueprintTypes.ts`
TypeScript interfaces for blueprint data structures:
- `BlueprintSelection`: Individual category selection
- `BlueprintPayload`: Complete blueprint data with totals
- `SavedBlueprint`: Database record structure

### 2. `/lib/blueprintUtils.ts`
Core utility functions:
- `saveBlueprint(payload)`: Upserts blueprint to Supabase (overwrites existing)
- `fetchBlueprint()`: Retrieves user's single blueprint
- `getPendingBlueprint()`: Reads from localStorage
- `setPendingBlueprint(payload)`: Stores to localStorage
- `clearPendingBlueprint()`: Removes from localStorage

### 3. `/app/hooks/usePendingBlueprintSaver.ts`
React hook that:
- Runs once per session (uses ref to prevent double-save)
- Checks for pending blueprint in localStorage
- Auto-saves to Supabase when user logs in
- Clears localStorage after successful save

### 4. `/app/blueprints/page.tsx`
Main blueprints page:
- Requires authentication (redirects to /signup if not logged in)
- Shows single blueprint card if exists
- Shows "No blueprint yet" empty state with "Create Blueprint" button
- Displays monthly/yearly costs and last updated date
- Clickable card routes to /blueprints/view

### 5. `/app/blueprints/view/page.tsx`
Read-only blueprint view page:
- Requires authentication
- Displays full blueprint breakdown
- Shows monthly/yearly costs
- Lists all selections by category
- Back button to return to /blueprints

## Files Modified

### 1. `/app/wizard/page.tsx`
Added:
- Imports: `useRouter`, `supabase`, `saveBlueprint`, `setPendingBlueprint`, `BlueprintPayload`
- `handleSaveBlueprint()` function in ResultsScreen component
- "Save blueprint" button pinned to bottom-left of results
- Button shows loading state while saving
- Handles both authenticated and guest flows

### 2. `/app/dashboard/page.tsx`
Modified:
- Added import for `usePendingBlueprintSaver` hook
- Called hook in component to auto-save pending blueprints
- Changed "View Blueprints" card from static to clickable button
- Routes to `/blueprints` on click

## Supabase Setup

### SQL to Run in Supabase Dashboard

```sql
-- Create blueprints table
CREATE TABLE blueprints (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can select their own blueprint"
  ON blueprints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blueprint"
  ON blueprints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blueprint"
  ON blueprints FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blueprint"
  ON blueprints FOR DELETE
  USING (auth.uid() = user_id);
```

## User Flows

### Flow 1: Authenticated User Saves Blueprint
1. User completes wizard and reaches Results screen
2. Clicks "Save blueprint" button (bottom-left)
3. System checks auth status → user is logged in
4. Calls `saveBlueprint(payload)` → upserts to Supabase
5. Shows success alert
6. Blueprint overwrites any existing blueprint for that user

### Flow 2: Guest User Saves Blueprint
1. User completes wizard and reaches Results screen
2. Clicks "Save blueprint" button
3. System checks auth status → user is NOT logged in
4. Stores blueprint to localStorage as `lifespec_pending_blueprint`
5. Redirects to `/signup?next=/dashboard`
6. User signs up/logs in
7. Dashboard loads and calls `usePendingBlueprintSaver` hook
8. Hook detects pending blueprint and auto-saves to Supabase
9. Shows toast "Blueprint saved to your account"
10. Clears localStorage

### Flow 3: View Saved Blueprint
1. User clicks "View Blueprints" on dashboard
2. Routes to `/blueprints`
3. Page fetches user's blueprint from Supabase
4. Shows blueprint card with key metrics
5. Clicking card routes to `/blueprints/view`
6. Full blueprint displayed in read-only format

## Key Features

✅ **1 Blueprint Per User Maximum**
- Uses `user_id` as PRIMARY KEY in database
- Upsert operation overwrites existing blueprint
- No way to have multiple blueprints

✅ **Guest-to-Signup Carryover**
- localStorage stores pending blueprint
- Auto-save hook runs on dashboard load
- Seamless transition from guest to authenticated user

✅ **RLS Security**
- Users can only see/modify their own blueprint
- All policies enforce `auth.uid() = user_id`

✅ **Error Handling**
- JSON parsing errors caught gracefully
- Auth errors handled with redirects
- User feedback via alerts and loading states

✅ **Styling Consistency**
- Uses existing dark grey + gold accent theme
- Matches wizard and dashboard styling
- Responsive design (mobile + desktop)

## Testing Checklist

### Test 1: Authenticated User Save
- [ ] Log in to existing account
- [ ] Go to /wizard
- [ ] Complete wizard and reach Results
- [ ] Click "Save blueprint" button
- [ ] Verify success alert appears
- [ ] Go to /blueprints
- [ ] Verify blueprint card displays with correct totals
- [ ] Click card to view full blueprint
- [ ] Verify all selections display correctly

### Test 2: Guest User Save & Auto-Save
- [ ] Log out or use incognito window
- [ ] Go to /wizard
- [ ] Complete wizard and reach Results
- [ ] Click "Save blueprint" button
- [ ] Verify redirect to /signup
- [ ] Complete signup process
- [ ] Verify auto-redirect to /dashboard
- [ ] Check browser console for "Blueprint saved to your account" log
- [ ] Go to /blueprints
- [ ] Verify blueprint was saved and displays correctly

### Test 3: Blueprint Overwrite
- [ ] Log in with account that has saved blueprint
- [ ] Go to /wizard
- [ ] Create different selections
- [ ] Click "Save blueprint"
- [ ] Go to /blueprints
- [ ] Verify NEW blueprint displays (not old one)
- [ ] Verify only ONE blueprint exists

### Test 4: Empty State
- [ ] Create new account (no blueprint)
- [ ] Go to /blueprints
- [ ] Verify "No Blueprint Yet" message displays
- [ ] Click "Create Blueprint" button
- [ ] Verify routes to /wizard

### Test 5: Auth Protection
- [ ] Log out
- [ ] Try to access /blueprints directly
- [ ] Verify redirects to /signup?next=/blueprints
- [ ] Try to access /blueprints/view directly
- [ ] Verify redirects to /signup?next=/blueprints/view

### Test 6: Dashboard Integration
- [ ] Log in to dashboard
- [ ] Verify "View Blueprints" card is clickable
- [ ] Click card
- [ ] Verify routes to /blueprints
- [ ] Verify "Create Blueprint" card still routes to /wizard

## Notes

- The `usePendingBlueprintSaver` hook uses a `useRef` flag to ensure it only runs once per session, preventing double-saves
- Blueprint payload includes `timestamp` for future audit trails
- All localStorage operations check for `typeof window` to prevent SSR errors
- Error messages use alerts (can be upgraded to toast notifications)
- The feature maintains backward compatibility with existing wizard flow
