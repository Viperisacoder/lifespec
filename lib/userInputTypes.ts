// Define basic types for user inputs

export interface Tier1Results {
  // Basic structure for tier 1 results
  [key: string]: any;
}

export interface UserInputs {
  yearlyLifestyleCost?: number;
  annualGrossIncome?: number;
  effectiveTaxRatePercent?: number;
  monthlySavings?: number;
  otherMonthlyIncome?: number;
  monthlyDebtPayments?: number;
}
