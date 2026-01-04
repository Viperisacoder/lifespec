# Post-Input Flow Implementation Guide

## Overview
Complete implementation of the post-input flow for LifeSpec, including results generation, Tier-1 display, save/delete functionality, and pending blueprint mechanism for unauthenticated users.

## Files Created

### 1. Server Actions: `/app/actions/blueprintSaveActions.ts`
- `saveBlueprint(payload, title?)` - Upserts blueprint (max 1 per user)
- `getMyBlueprint()` - Fetches user's saved blueprint
- `deleteMyBlueprint()` - Deletes user's blueprint
- All return structured results (never throw)
- Validates payload before saving
- Handles auth gracefully with retry logic

### 2. UI Components

#### `ResultsLoader.tsx`
- Shows loading stages: "Analyzing inputs" → "Estimating timelines" → "Building blueprint"
- Animated progress with numbered steps
- Skeleton cards during loading
- Smooth transitions between stages

#### `BlueprintResultsPanel.tsx`
- Main results display component
- Renders Tier-1 modules when ready
- Save/Delete buttons (bottom-left, fixed position)
- Button states: idle, saving, saved, error
- Delete confirmation modal
- Handles unauthenticated save → redirect to signup with pending blueprint

#### `SavedBlueprintCard.tsx`
- Card component for dashboard showing saved blueprint
- Displays title, monthly/yearly cost, required gross income
- Clickable to view full blueprint
- Shows "Saved" badge and last updated date

### 3. Hooks

#### `usePendingBlueprintAutoSave.ts`
- Runs once on component mount
- Checks sessionStorage/localStorage for pending blueprint
- Auto-saves if user is now authenticated
- Clears pending blueprint after successful save

## Supabase Table Setup

```sql
CREATE TABLE blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own blueprint"
  ON blueprints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own blueprint"
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

## Integration Points

### 1. Results Page (After Wizard Completion)
```typescript
// In your results/wizard completion page:
import { BlueprintResultsPanel } from '@/app/components/BlueprintResultsPanel';
import { ResultsLoader } from '@/app/components/ResultsLoader';

// Show loader while calculating
const [loadingStage, setLoadingStage] = useState<'analyzing' | 'estimating' | 'building' | 'complete'>('analyzing');

// Simulate stages
useEffect(() => {
  const stages = ['analyzing', 'estimating', 'building', 'complete'] as const;
  let current = 0;
  
  const interval = setInterval(() => {
    if (current < stages.length - 1) {
      current++;
      setLoadingStage(stages[current]);
    } else {
      clearInterval(interval);
    }
  }, 1500);
  
  return () => clearInterval(interval);
}, []);

// Render
<BlueprintResultsPanel
  results={tier1Results}
  isLoading={loadingStage !== 'complete'}
  loadingStage={loadingStage}
  blueprintPayload={blueprintPayload}
  onBlueprintSaved={() => {
    // Refresh blueprint on dashboard
  }}
/>
```

### 2. Dashboard Integration
```typescript
// In dashboard/page.tsx:
import { SavedBlueprintCard } from '@/app/components/SavedBlueprintCard';
import { getMyBlueprint } from '@/app/actions/blueprintSaveActions';
import { usePendingBlueprintAutoSave } from '@/app/hooks/usePendingBlueprintAutoSave';

export default function DashboardPage() {
  const [blueprint, setBlueprint] = useState(null);
  
  // Auto-save pending blueprint after signup
  usePendingBlueprintAutoSave();
  
  useEffect(() => {
    const fetchBlueprint = async () => {
      const result = await getMyBlueprint();
      if (result.success) {
        setBlueprint(result.data);
      }
    };
    fetchBlueprint();
  }, []);
  
  return (
    <div>
      {blueprint ? (
        <SavedBlueprintCard blueprint={blueprint} />
      ) : (
        <div>No saved blueprint yet</div>
      )}
    </div>
  );
}
```

### 3. Pending Blueprint Flow
```typescript
// In BlueprintResultsPanel, when user clicks Save without auth:
const result = await saveBlueprint(blueprintPayload);

if (!result.success && result.reason === 'UNAUTHENTICATED') {
  // Store in sessionStorage (cleared on page close)
  sessionStorage.setItem('pendingBlueprint', JSON.stringify(blueprintPayload));
  // Redirect to signup
  router.push('/signup?next=/blueprints');
  // After signup, usePendingBlueprintAutoSave hook will auto-save
}
```

## UX Flow Breakdown

### Authenticated User
1. Completes wizard → Results page shows loader
2. Loader progresses through stages (1.5s each)
3. Tier-1 modules appear
4. Clicks "Save blueprint" button
5. Button shows "Saving..." then "Saved ✓"
6. Delete button appears
7. Can click "Update blueprint" to save again
8. Dashboard shows saved blueprint card

### Unauthenticated User
1. Completes wizard → Results page shows loader
2. Loader progresses through stages
3. Tier-1 modules appear
4. Clicks "Save blueprint" button
5. Blueprint stored in sessionStorage
6. Redirected to /signup?next=/blueprints
7. After signup/login, auto-save hook detects pending blueprint
8. Auto-saves to database
9. Redirects to dashboard with saved blueprint card

### Delete Flow
1. User clicks trash icon (only visible if blueprint saved)
2. Confirmation modal appears
3. User confirms deletion
4. Blueprint deleted from database
5. Save button returns to "Save blueprint"
6. Trash icon disappears
7. Dashboard updates to show empty state

## Error Handling

All server actions return structured results:
```typescript
// Success
{ success: true, data: {...} }

// Auth error
{ success: false, reason: 'UNAUTHENTICATED' }

// Validation error
{ success: false, reason: 'VALIDATION' }

// Database error
{ success: false, reason: 'DB_ERROR' }

// Unknown error
{ success: false, reason: 'UNKNOWN_ERROR' }
```

Client handles each reason appropriately:
- `UNAUTHENTICATED`: Store pending blueprint, redirect to signup
- `VALIDATION`: Show error message, don't crash
- `DB_ERROR`: Show error message, allow retry
- `UNKNOWN_ERROR`: Show error message, allow retry

## Key Features

✅ **Max 1 Blueprint Per User** - UNIQUE constraint on user_id enforces this
✅ **No Runtime Errors** - All expected scenarios return results, never throw
✅ **Pending Blueprint Mechanism** - sessionStorage stores blueprint for unauthenticated users
✅ **Auto-Save After Auth** - Hook runs once and auto-saves pending blueprint
✅ **Smooth Loading States** - Progressive loader with stages
✅ **Save/Delete Buttons** - Fixed bottom-left, proper state management
✅ **Confirmation Modal** - Required before deletion
✅ **Dashboard Integration** - Shows saved blueprint card or empty state
✅ **RLS Security** - Users can only access their own blueprint
✅ **Matching Design** - Dark grey + gold accents, minimal and clean

## Testing Checklist

- [ ] Authenticated user saves blueprint → appears on dashboard
- [ ] Unauthenticated user clicks save → redirected to signup
- [ ] After signup, pending blueprint auto-saves
- [ ] User can update existing blueprint (overwrites)
- [ ] Delete button appears only when blueprint exists
- [ ] Delete confirmation modal works
- [ ] After delete, save button returns to "Save blueprint"
- [ ] Dashboard shows empty state when no blueprint
- [ ] Dashboard shows saved blueprint card when exists
- [ ] Clicking blueprint card navigates to view page
- [ ] All error states show graceful messages
- [ ] No runtime errors for any flow

## Notes

- Loader stages take ~1.5s each for visual feedback
- sessionStorage is used (cleared on page close) for pending blueprints
- Blueprint payload must include: totalMonthly, totalYearly, requiredGrossYearly
- All timestamps are ISO format
- Button states: idle → saving → saved → idle (after 2s)
- Delete button only shows if blueprint exists
- Pending blueprint auto-save runs once per session
