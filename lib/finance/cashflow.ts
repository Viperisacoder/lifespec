export interface PlannerInputs {
  grossYearly: number;
  taxRate: number;
  savingsRate: number;
  returnRate: number;
  startingNetWorth: number;
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

export function calculateCashflow(
  inputs: PlannerInputs,
  plannedLifestyleMonthly: number
): CashflowSummary {
  // Validate inputs
  const grossYearly = Math.max(0, inputs.grossYearly || 0);
  const taxRate = Math.max(0, Math.min(0.9, inputs.taxRate || 0));
  const savingsRate = Math.max(0, Math.min(0.9, inputs.savingsRate || 0));

  // Calculate monthly figures
  const grossMonthly = grossYearly / 12;
  const taxMonthly = grossMonthly * taxRate;
  const netMonthly = grossMonthly - taxMonthly;
  const investMonthly = netMonthly * savingsRate;

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
}

export const PRESET_PROFILES = {
  conservative: { taxRate: 0.30, savingsRate: 0.15, returnRate: 0.06 },
  standard: { taxRate: 0.28, savingsRate: 0.25, returnRate: 0.08 },
  aggressive: { taxRate: 0.25, savingsRate: 0.35, returnRate: 0.10 },
};
