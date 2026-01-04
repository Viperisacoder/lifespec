# Tier-1 Intelligence Modules Implementation

## Overview
Implemented 4 Tier-1 intelligence modules on the blueprint page that calculate real financial forecasts based on user inputs and saved blueprint data. All calculations are transparent, explainable, and based on real financial modeling.

## Files Created/Modified

### New Files Created

1. **`/lib/userInputTypes.ts`**
   - TypeScript interfaces for user inputs and Tier-1 results
   - `UserInputs`: Stores personal financial data per user
   - `Tier1Results`: Output structure for all 4 modules
   - `CalculationInputs`: Input structure for calculation engine

2. **`/lib/tier1Calculations.ts`**
   - Pure calculation engine with no side effects
   - 4 main calculation functions:
     - `calculateWealthTimeline()`: Years to reach milestones
     - `calculateDreamFeasibilityScore()`: 0-100 feasibility score
     - `calculateBottleneckDetector()`: Identifies limiting factor
     - `calculateDoNothingProjection()`: 5/10 year net worth projection
   - Helper functions for validation and net worth growth modeling
   - All calculations include sanity checks (NaN, negative value detection)

3. **`/app/actions/blueprintActions.ts`** (Server Actions)
   - `fetchUserInputs()`: Retrieves user's saved inputs from Supabase
   - `upsertUserInputs()`: Saves/updates user inputs (upsert pattern)
   - `deleteBlueprint()`: Removes blueprint from database
   - `fetchBlueprintFromDB()`: Fetches blueprint data

4. **`/app/components/EditInputsDrawer.tsx`**
   - Collapsible drawer component for editing personal inputs
   - Fields:
     - Current age (optional)
     - Current income (yearly gross)
     - Savings rate (%) OR monthly savings amount
     - Current net worth
     - Advanced: income growth, investment return, inflation, tax rate
   - Form validation and error handling
   - Auto-saves to Supabase on submit

5. **`/app/components/Tier1Modules.tsx`**
   - Renders 4 module cards in responsive 2-column grid
   - Each card displays:
     - Title
     - Primary metric (large, gold accent)
     - Supporting metrics
     - Assumptions footer
   - Matches existing design: dark background, gold accents, subtle borders

### Modified Files

1. **`/app/blueprints/page.tsx`**
   - Added state for user inputs, Tier-1 results, and UI controls
   - Integrated `loadData()` function to fetch blueprint + inputs
   - Added delete button (trash icon) on blueprint card
   - Delete confirmation modal with warning
   - Conditional rendering:
     - If Tier-1 results exist: show modules
     - If inputs missing: show "Unlock Tier 1 Insights" CTA
   - Edit Inputs button to modify inputs
   - Responsive layout (max-w-4xl)

## Supabase Schema

### Table: `lifespec_blueprints`
```sql
CREATE TABLE lifespec_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_cost NUMERIC NOT NULL,
  yearly_cost NUMERIC NOT NULL,
  required_gross_income_yearly NUMERIC NOT NULL,
  blueprint_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `lifespec_user_inputs`
```sql
CREATE TABLE lifespec_user_inputs (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_age INT,
  current_income_yearly_gross NUMERIC,
  savings_rate_percent NUMERIC,
  monthly_savings_amount NUMERIC,
  current_net_worth NUMERIC,
  income_growth_percent_yearly NUMERIC DEFAULT 4,
  investment_return_percent_yearly NUMERIC DEFAULT 7,
  inflation_percent_yearly NUMERIC DEFAULT 2,
  tax_rate_effective_percent NUMERIC DEFAULT 30,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies
All tables have 4 policies (SELECT, INSERT, UPDATE, DELETE) that enforce `user_id = auth.uid()`.

## Calculation Logic

### 1. Wealth Timeline
**Formula:**
- Freedom Number = `yearlyCost / 0.04` (4% rule)
- Net worth growth per year: `networth(t+1) = networth(t) * (1 + return) + savings(t)`
- Savings grow with income: `savings(t) = savings(t-1) * (1 + income_growth)`

**Scenarios:**
- Conservative: return-2%, growth-1%
- Expected: input values
- Aggressive: return+2%, growth+1%
- All returns/growth clamped to 0-15% bounds

**Output:**
- Years to reach Freedom Number (3 scenarios)
- Age at freedom (if current age provided)
- Milestone ages for $100k, $1M

### 2. Dream Feasibility Score (0-100)
**Base Score Mapping:**
- ≤7 years → 90-100 ("Excellent trajectory")
- 8-15 years → 70-89 ("Strong path")
- 16-25 years → 45-69 ("Moderate timeline")
- 26-35 years → 25-44 ("Extended timeline")
- >35 years → 5-24 ("Long-term goal")

**Adjustments:**
- +10 if savings rate > 50%
- -15 if savings rate < 10%
- -20 if emergency buffer < 3 months expenses

**Output:**
- Score (0-100)
- Years to target
- Top reason (from base mapping)
- Top lever (savings rate)
- Savings rate %

### 3. Biggest Bottleneck Detector
**Tests 3 levers:**
- A) +5% savings rate → measure year reduction
- B) +2% income growth → measure year reduction
- C) +2% investment return → measure year reduction

**Output:**
- Bottleneck: which lever has biggest impact
- Impact: years saved by fixing it
- Second lever: next best improvement
- Second impact: years saved

### 4. If You Do Nothing Projection
**Assumptions:**
- Income and savings remain constant
- Investment returns applied annually
- No behavioral changes

**Calculation:**
- Project net worth 5 years forward
- Project net worth 10 years forward
- Calculate progress % toward Freedom Number

**Output:**
- Net worth in 5 years
- Net worth in 10 years
- Progress to freedom (%)

## Data Flow

```
User saves blueprint
    ↓
Blueprint stored in Supabase (lifespec_blueprints)
    ↓
User opens /blueprints page
    ↓
Page fetches blueprint + user inputs
    ↓
If inputs exist:
  - Calculate Tier-1 results
  - Display 4 modules
Else:
  - Show "Unlock Tier 1 Insights" CTA
    ↓
User clicks "Add Inputs"
    ↓
EditInputsDrawer opens
    ↓
User fills form + clicks Save
    ↓
Server action upserts to lifespec_user_inputs
    ↓
Page reloads data + recalculates Tier-1
    ↓
Modules display with fresh results
```

## UI/UX Features

### Blueprint Card
- Displays monthly/yearly cost + required gross income
- Delete button (trash icon) in top-right
- Hover effect on delete button
- Click card to view full blueprint details

### Delete Confirmation
- Modal overlay with backdrop
- Clear warning message
- Cancel/Delete buttons
- Delete button shows loading state

### Tier-1 Section
- Header: "Tier 1 — Future Clarity"
- Subtext: "Real forecasts from your blueprint + your inputs."
- 2-column grid on desktop, 1-column on mobile
- Each card:
  - Dark background (var(--bg-secondary))
  - Subtle gold border (rgba(212, 175, 55, 0.2))
  - Soft shadow
  - Gold accent for primary metrics
  - Compact typography

### Edit Inputs Drawer
- Slides in from right side
- Backdrop overlay
- Close button (×) in top-right
- Form fields with defaults
- Advanced section (collapsed by default)
- Save/Cancel buttons
- Error messaging
- Loading state on save

### Empty State
- If no inputs: "Unlock Tier 1 Insights" card with CTA
- Shows which inputs are missing
- "Add Inputs" button

## Validation & Error Handling

### Input Validation
- Required: yearly cost, current income, savings (rate or amount), net worth
- Optional: current age
- All numeric fields validated for NaN, negative values
- Clamps returns/growth to 0-15%

### Calculation Safety
- Sanity checks for NaN in final results
- Max year cap at 100 years (prevents infinite loops)
- Division by zero protection
- Returns error message if calculation fails

### UI Error States
- Form shows error message if save fails
- Missing inputs clearly listed in CTA
- Disabled buttons during async operations

## Assumptions & Transparency

**Displayed in UI:**
- Calculations use current income, savings rate, net worth, investment returns
- Scenarios adjust returns and income growth by ±2%
- All values are estimates and not financial advice

**Implementation Details:**
- Savings grow with income (compound effect)
- 4% rule used for Freedom Number (standard FIRE metric)
- Emergency buffer = net worth / monthly expenses
- Tax rate stored but not used in current calculations (extensible)

## Testing Checklist

- [ ] Create blueprint in wizard
- [ ] Navigate to /blueprints
- [ ] See blueprint card with delete button
- [ ] Click "Add Inputs" button
- [ ] Fill form with test data
- [ ] Save inputs
- [ ] Verify Tier-1 modules appear
- [ ] Check all 4 modules display correctly
- [ ] Verify numbers are reasonable
- [ ] Edit inputs and verify modules recalculate
- [ ] Click delete button
- [ ] Confirm modal appears
- [ ] Cancel deletion
- [ ] Click delete again and confirm
- [ ] Verify blueprint removed and empty state shows
- [ ] Log out and log back in
- [ ] Verify blueprint persists (if not deleted)
- [ ] Test on mobile (responsive layout)

## Future Enhancements

- Add chart/sparkline visualization for wealth timeline
- Export blueprint + Tier-1 results as PDF
- Compare multiple scenarios side-by-side
- Add tax optimization calculations
- Historical tracking of inputs/results
- Share blueprint with advisor/partner
- Goal-based planning (e.g., "retire by age 50")

## Notes

- All calculations are deterministic (same inputs = same outputs)
- No external API calls or AI involved
- Fully transparent and explainable to users
- Extensible calculation engine for future modules
- Server actions ensure data security (RLS enforced)
