export interface SelectedItem {
  id: string;
  name: string;
  pricingType: 'purchase' | 'monthly' | 'yearly';
  amount: number;
  monthlyAmount: number;
}

export interface BlueprintSelection {
  categoryId: string;
  categoryName: string;
  items: SelectedItem[];
}

export interface BlueprintPayload {
  totalMonthly: number;
  totalYearly: number;
  requiredGrossYearly: number;
  timestamp: string;
  selections?: BlueprintSelection[];
  categoryBreakdown?: {
    housing: number;
    lifestyle: number;
    fixedCosts: number;
  };
}

export interface BlueprintInputs {
  monthlyIncome: number;
  taxRatePercent: number;
  monthlySavings: number;
  otherMonthlyIncome?: number;
  monthlyDebtPayments?: number;
}

export interface SavedBlueprint {
  id: string;
  user_id: string;
  blueprint: BlueprintPayload;
  created_at: string;
  updated_at: string;
}

export interface CalculatedMetrics {
  netMonthlyIncome: number;
  totalMonthlyInflows: number;
  totalMonthlyOutflows: number;
  marginMonthly: number;
  marginYearly: number;
  requiredGrossYearly: number;
  monthlyGap: number;
  monthlyGapLabel: 'short' | 'extra';
  affordabilityStatus: 'Sustainable' | 'Tight' | 'Not sustainable';
  bufferRatio: number;
  savingsRunwayProxy?: number;
  timeToSustainable?: number | null;
}
