# Blueprint Persistence & Data Storage Test

## Changes Made

### 1. Enhanced Blueprint Data Structure
- Updated `BlueprintPayload` to include:
  - `requiredGrossYearly`: Full income requirement calculation
  - `selections`: Now contains full category + item details with names and prices
  
- Updated `BlueprintSelection` structure:
  - `categoryId`: e.g., 'home', 'vehicles'
  - `categoryName`: e.g., 'Where do you want to wake up?'
  - `items`: Array of selected items with full details

- Each `SelectedItem` now includes:
  - `id`: Original ID (h1, v4, etc.)
  - `name`: Full item name (e.g., "NYC Penthouse", "BMW X6M Competition")
  - `pricingType`: 'purchase', 'monthly', or 'yearly'
  - `amount`: Original price
  - `monthlyAmount`: Calculated monthly cost

### 2. Wizard Save Function Enhanced
- `handleSaveBlueprint()` now:
  - Maps through all steps and selections
  - Retrieves full option objects from step.options
  - Extracts item names and calculates monthly amounts
  - Builds detailed selections array with category names
  - Includes `requiredGrossYearly` calculation
  - Saves complete blueprint payload

### 3. Blueprint View Pages Updated
- `/blueprints/view` now displays:
  - Category heading (e.g., "Where do you want to wake up?")
  - Full item name (e.g., "NYC Penthouse")
  - Original price with pricing type (Purchase: $12,000,000)
  - Monthly cost contribution (right-aligned in gold)
  
- `/blueprints` card now shows:
  - Monthly cost
  - Yearly cost
  - Required gross income (yearly)
  - Number of categories selected

### 4. Persistence Verification
- Added detailed logging in both blueprint pages
- Logs user ID when authenticated
- Logs fetched blueprint data
- Logs redirect reasons if blueprint not found

## Test Procedure: Logout/Login Persistence

### Setup
1. Ensure Supabase table exists with RLS policies
2. Have an authenticated user account

### Test Steps

**Step 1: Create and Save Blueprint (Logged In)**
```
1. Log in to account
2. Go to /wizard
3. Select items from multiple categories:
   - Home: NYC Penthouse (h1)
   - Vehicles: BMW X6M Competition (v4)
   - Toys: Yacht (toy5)
   - Jewellery: Patek Philippe Aquanaut (j3)
4. Reach Results screen
5. Click "Save blueprint" button
6. Verify success alert
7. Check browser console for save confirmation
```

**Step 2: Verify Blueprint Displays (Before Logout)**
```
1. Go to /blueprints
2. Verify blueprint card displays with:
   - Monthly cost: $99,390/mo (or similar)
   - Yearly cost: $1,192,680 (or similar)
   - Required gross income
   - Categories selected: 4
3. Click card to view full blueprint
4. Verify in /blueprints/view:
   - "Where do you want to wake up?" section shows "NYC Penthouse"
   - "Choose the ride of your dreams" shows "BMW X6M Competition"
   - "Toys & Recreation" shows "Yacht"
   - "Jewellery" shows "Patek Philippe Aquanaut"
   - Each item shows original price and monthly contribution
```

**Step 3: Logout**
```
1. Click logout button (or navigate to logout endpoint)
2. Verify redirected to login page
3. Check browser console - should show no errors
```

**Step 4: Login Again**
```
1. Log back in with same credentials
2. Verify redirected to dashboard
3. Check browser console for:
   - "User authenticated: [user-id]"
   - "Fetched blueprint: [blueprint-object]"
   - "Blueprint saved to your account" (if pending blueprint auto-saved)
```

**Step 5: Verify Blueprint Still Exists**
```
1. Go to /blueprints
2. Verify SAME blueprint displays:
   - Same monthly/yearly costs
   - Same categories and items
   - Same required gross income
3. Click to view full blueprint
4. Verify all item names and prices match exactly
```

**Step 6: Verify Dashboard Integration**
```
1. Go to /dashboard
2. Click "View Blueprints" card
3. Verify routes to /blueprints
4. Verify blueprint still displays
```

## Expected Behavior

### Before Logout
- Blueprint displays with full item names (not codes)
- All selections show actual names like "NYC Penthouse", "BMW X6M Competition"
- Prices and monthly costs calculated correctly
- All data visible in /blueprints and /blueprints/view

### After Logout/Login
- Blueprint persists in Supabase database
- User can access /blueprints and see same blueprint
- All item names and prices remain intact
- No data loss or corruption
- Console logs show successful authentication and blueprint fetch

## Troubleshooting

### Blueprint Not Appearing After Login
**Check:**
1. Browser console for auth errors
2. Supabase dashboard - verify blueprint record exists for user
3. RLS policies - ensure SELECT policy allows user to read own blueprint
4. Network tab - verify API calls to blueprints table succeed

### Item Names Showing as Codes (h1, v4, etc.)
**Check:**
1. Verify wizard is saving full selection objects with names
2. Check Supabase record - blueprint.selections should have items array with names
3. Verify /blueprints/view is mapping selection.items correctly

### Monthly Costs Not Calculating
**Check:**
1. Verify computeMonthlyFromOption() is being called in handleSaveBlueprint
2. Check that monthlyAmount is included in saved SelectedItem
3. Verify /blueprints/view is displaying monthlyAmount correctly

## Data Structure Example

When saved to Supabase, blueprint should look like:

```json
{
  "user_id": "uuid-here",
  "blueprint": {
    "totalMonthly": 99390,
    "totalYearly": 1192680,
    "requiredGrossYearly": 2650400,
    "selections": [
      {
        "categoryId": "home",
        "categoryName": "Where do you want to wake up?",
        "items": [
          {
            "id": "h1",
            "name": "NYC Penthouse",
            "pricingType": "purchase",
            "amount": 12000000,
            "monthlyAmount": 80000
          }
        ]
      },
      {
        "categoryId": "vehicles",
        "categoryName": "Choose the ride of your dreams",
        "items": [
          {
            "id": "v4",
            "name": "BMW X6M Competition",
            "pricingType": "purchase",
            "amount": 120000,
            "monthlyAmount": 1950
          }
        ]
      }
    ],
    "timestamp": "2025-12-31T20:26:00.000Z"
  },
  "updated_at": "2025-12-31T20:26:00.000Z"
}
```

## Key Points

✅ Blueprint data is stored in Supabase with full item details
✅ Item names are preserved (not just IDs)
✅ Monthly costs calculated and stored for each item
✅ RLS policies ensure user can only access own blueprint
✅ Persistence verified through logout/login cycle
✅ All data displayed correctly in view pages
