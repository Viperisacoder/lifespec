# Millionaire Age & Goal Completion Age - Implementation Summary

## Overview
Added two new metric cards to the Reality Timeline section in `/app/blueprints/page.tsx`:
1. **Millionaire Age** - Estimates age when user reaches $1M in savings
2. **Goal Completion Age** - Estimates age when user can sustain blueprint + savings goals

## New Inputs Added

### 1. Current Age
- **Label**: "Current Age"
- **Type**: number
- **Range**: 0–120
- **Validation**: Only accepts valid ages; shows "NA" if empty or invalid
- **Placeholder**: "e.g. 25"

### 2. Annual Income Growth (%)
- **Label**: "Annual Income Growth (%)"
- **Type**: number
- **Range**: 0–50
- **Default**: 0
- **Step**: 0.1
- **Purpose**: Used for Goal Completion Age forecast

## Helper Functions

### `formatAge(age: number | null): string`
Formats age display, returns "NA" if invalid or null.
```typescript
function formatAge(age: number | null): string {
  if (age === null || isNaN(age)) return 'NA';
  return Math.ceil(age).toString();
}
```

### `calculateMillionaireAge(currentAge, monthlyWealthIncrease, startingNetWorth = 0)`
**Logic:**
- Requires valid Current Age (0–120); returns "NA" if missing
- If monthlyWealthIncrease <= 0, returns "NA" (can't save to millionaire)
- Formula: `monthsToMillion = ceil((1,000,000 - startingNetWorth) / monthlyWealthIncrease)`
- Result: `millionaireAge = currentAge + (monthsToMillion / 12)`
- Displays age rounded UP to next whole number
- Subtext: "Assumes $X/month saved, no investment returns."

**Return Type:**
```typescript
{
  age: string;        // "NA" or age as integer
  subtext: string;    // Explanation of assumptions
}
```

### `calculateGoalCompletionAge(currentAge, netMonthlyIncome, blueprintMonthlyCost, monthlySavings, annualIncomeGrowth = 0)`
**Logic:**
- Requires valid Current Age (0–120); returns "NA" if missing
- **Check A (Possible Now):**
  - If `netMonthlyIncome - blueprintMonthlyCost >= monthlySavings`, return "Now"
  - Subtext: "Based on current inputs"
- **Check B (Not Possible Now):**
  - If `annualIncomeGrowth == 0` and not possible now, return "Not possible"
  - Subtext: "Requires income growth or cost reduction"
- **Check C (Future Possible):**
  - If `annualIncomeGrowth > 0`, forecast when income grows enough
  - Formula: `netMonthlyIncomeYearN = netMonthlyIncome * (1 + growthRate)^N`
  - Find smallest N where `netMonthlyIncomeYearN >= blueprintMonthlyCost + monthlySavings`
  - Result: `goalCompletionAge = currentAge + N`
  - Subtext: "Assumes X% annual income growth"

**Return Type:**
```typescript
{
  age: string;        // "NA", "Now", "Not possible", or age as integer
  subtext: string;    // Explanation of assumptions
}
```

## State Variables Added

```typescript
const [currentAge, setCurrentAge] = useState<number | null>(null);
const [annualIncomeGrowth, setAnnualIncomeGrowth] = useState<number>(0);
```

## Card Styling

Both cards use the same styling as existing metric cards:
- **Background**: `rgba(255, 255, 255, 0.03)`
- **Border**: `1px solid rgba(255, 255, 255, 0.06)`
- **Border Radius**: `rounded-xl`
- **Padding**: `p-4`
- **Typography**:
  - Label: `text-xs uppercase tracking-wide` (secondary color)
  - Value: `text-2xl font-bold` (gold for valid, secondary for NA)
  - Subtext: `text-xs` (secondary color)

### Color Logic
- **Millionaire Age**: Gold if valid, secondary if "NA"
- **Goal Completion Age**: 
  - Gold if valid age or "Now"
  - Red (#EF4444) if "Not possible"
  - Secondary if "NA"

## Grid Layout

Cards are placed in a 2-column grid on desktop (md:grid-cols-2), 1-column on mobile:
```
[Net Monthly Income] [Blueprint Affordability]
[Monthly Gap]        [Buffer Ratio]
[Millionaire Age]    [Goal Completion Age]
[Insight (full width)]
```

## Calculation Assumptions

### Millionaire Age
- Starting net worth: $0 (configurable in function)
- Monthly wealth increase = Monthly Savings amount
- No investment returns (simple linear accumulation)
- Formula: `age = currentAge + ceil((1,000,000 / monthlySavings) / 12)`

### Goal Completion Age
- Blueprint monthly cost: Static (no inflation assumed)
- Income grows at annual rate: `(1 + growthRate)^years`
- Tax rate: Remains constant
- Goal: Sustain blueprint costs AND hit savings target
- Forecast window: Up to 100 years

## Edge Cases Handled

1. **Missing Current Age**: Both cards show "NA"
2. **Invalid Age (< 0 or > 120)**: Shows "NA"
3. **Zero Monthly Savings**: Millionaire Age shows "NA"
4. **Zero Annual Income Growth + Not Affordable Now**: Goal Completion shows "Not possible"
5. **Already Sustainable**: Goal Completion shows "Now"
6. **NaN Prevention**: All calculations validated before display

## No Re-render Lag

- Calculations run inline within the results grid (inside IIFE)
- Only recalculate when inputs change (userInputs, currentAge, annualIncomeGrowth)
- No unnecessary useMemo needed (calculations are lightweight)

## Testing Checklist

- [ ] Enter Current Age = 25, Monthly Savings = $1,000 → Millionaire Age should show ~57
- [ ] Enter Current Age = 25, Monthly Income = $5,000, Tax = 20%, Blueprint = $2,000, Savings = $500 → Goal Completion should show "Now"
- [ ] Enter Current Age = 25, Monthly Income = $2,000, Tax = 20%, Blueprint = $2,000, Savings = $500, Growth = 0% → Goal Completion should show "Not possible"
- [ ] Enter Current Age = 25, Monthly Income = $2,000, Tax = 20%, Blueprint = $2,000, Savings = $500, Growth = 5% → Goal Completion should calculate years needed
- [ ] Leave Current Age empty → Both cards show "NA"
- [ ] Set Monthly Savings = $0 → Millionaire Age shows "NA"

## Files Modified

- `/Users/panavgulati/Desktop/lifespec/lifespec/app/blueprints/page.tsx`
  - Added helper functions: `formatAge`, `calculateMillionaireAge`, `calculateGoalCompletionAge`
  - Added state: `currentAge`, `annualIncomeGrowth`
  - Added input fields: Current Age, Annual Income Growth
  - Added metric cards: Millionaire Age, Goal Completion Age
