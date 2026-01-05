import { useMemo } from 'react';

export interface CashflowAssumptions {
  grossYearly: number;
  taxRate: number;
  savingsRate: number;
  investmentReturn: number;
  startingNetWorth: number;
}

export interface BudgetItem {
  category: string;
  current: number;
  planned: number;
}

export interface CashflowSummary {
  grossMonthly: number;
  taxMonthly: number;
  netMonthly: number;
  investMonthly: number;
  plannedLifestyleMonthly: number;
  surplusMonthly: number;
  contributionMonthly: number;
}

export function useCashflowModel(
  assumptions: CashflowAssumptions,
  budgetItems: BudgetItem[]
): CashflowSummary {
  return useMemo(() => {
    // Validate inputs
    const grossYearly = Math.max(0, assumptions.grossYearly || 0);
    const taxRate = Math.max(0, Math.min(1, assumptions.taxRate || 0));
    const savingsRate = Math.max(0, Math.min(1, assumptions.savingsRate || 0));

    // Calculate monthly figures
    const grossMonthly = grossYearly / 12;
    const taxMonthly = grossMonthly * taxRate;
    const netMonthly = grossMonthly - taxMonthly;
    const investMonthly = netMonthly * savingsRate;

    // Calculate planned lifestyle total
    const plannedLifestyleMonthly = budgetItems.reduce((sum, item) => sum + (item.planned || 0), 0);

    // Calculate surplus/deficit
    const surplusMonthly = netMonthly - investMonthly - plannedLifestyleMonthly;

    // Contribution is investing + any surplus (if positive)
    const contributionMonthly = investMonthly + Math.max(0, surplusMonthly);

    return {
      grossMonthly,
      taxMonthly,
      netMonthly,
      investMonthly,
      plannedLifestyleMonthly,
      surplusMonthly,
      contributionMonthly,
    };
  }, [assumptions, budgetItems]);
}
