# Saved Blueprint + Reality Timeline Testing Checklist

## Blueprint Creation & Saving
- [ ] Complete the wizard flow to generate a blueprint
- [ ] Click "Save blueprint" button on results page
- [ ] Verify toast notification shows "Blueprint saved successfully!"
- [ ] Verify button changes to "Update blueprint" after saving

## Unauthenticated Flow
- [ ] Log out and complete the wizard flow
- [ ] Click "Save blueprint" button on results page
- [ ] Verify blueprint is saved to localStorage
- [ ] Verify redirect to signup page
- [ ] Complete signup/login
- [ ] Verify pending blueprint is imported automatically
- [ ] Verify toast notification shows "Blueprint imported from your previous session"

## Blueprints Page
- [ ] Navigate to /blueprints page when logged in with a saved blueprint
- [ ] Verify blueprint card shows with correct metrics:
  - [ ] Monthly Cost
  - [ ] Yearly Cost
  - [ ] Required Gross Income
- [ ] Verify "Last updated" date is correct
- [ ] Click on blueprint card navigates to detail page
- [ ] Click delete button shows confirmation modal
- [ ] Cancel deletion closes modal without deleting
- [ ] Confirm deletion removes blueprint and shows empty state
- [ ] Empty state "Create Blueprint" button navigates to wizard

## Reality Timeline Panel
- [ ] Enter Monthly Income, Tax Rate, and Monthly Savings
- [ ] Verify Net Monthly Income calculation is correct
- [ ] Verify Blueprint Affordability status changes appropriately:
  - [ ] "Not sustainable" when net income < monthly cost
  - [ ] "Tight" when net income >= monthly cost but < (monthly cost + savings)
  - [ ] "Sustainable" when net income >= (monthly cost + savings)
- [ ] Verify Monthly Gap calculation is correct
- [ ] Verify Buffer Ratio calculation is correct
- [ ] Verify Insight message changes based on affordability status

## Dashboard Integration
- [ ] Verify "View Blueprints" button on dashboard navigates to /blueprints
- [ ] Verify "Create Blueprint" button on dashboard navigates to /wizard

## Error Handling
- [ ] Test offline scenario (simulate with browser dev tools)
- [ ] Verify appropriate error messages when Supabase operations fail
- [ ] Verify no UI crashes on null/undefined values

## Edge Cases
- [ ] Test with very large numbers in blueprint metrics
- [ ] Test with very large numbers in Reality Timeline inputs
- [ ] Test with zero values in Reality Timeline inputs
- [ ] Test deleting a blueprint while on the detail page

## Cross-browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile devices

## Performance
- [ ] Verify page loads quickly with saved blueprint
- [ ] Verify Reality Timeline calculations perform well with rapid input changes

## Accessibility
- [ ] Verify all interactive elements are keyboard accessible
- [ ] Verify color contrast meets WCAG standards
- [ ] Verify screen readers can access all content
