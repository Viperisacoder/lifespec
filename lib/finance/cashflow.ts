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

// Input normalization and validation functions
export function normalizePercent(input: number | string): number {
  if (typeof input === 'string') {
    const parsed = parseFloat(input);
    if (isNaN(parsed)) return 0;
    // If input is > 1, assume it's a percentage (e.g., "30" means 30%)
    if (parsed > 1) return parsed / 100;
    return parsed;
  }
  // If input is > 1, assume it's a percentage
  if (input > 1) return input / 100;
  return input;
}

export function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function sanitizeCurrencyInput(input: string | number): number {
  if (typeof input === 'number') {
    return isNaN(input) ? 0 : input;
  }
  const parsed = parseFloat(input.replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

// Default values
export const DEFAULT_INPUTS: PlannerInputs = {
  grossYearly: 150000,
  taxRate: 0.30,
  savingsRate: 0.25,
  returnRate: 0.07,
  startingNetWorth: 0,
};

// Minimum gross yearly income to prevent unrealistic values
const MIN_GROSS_YEARLY = 10000;

export function validateInputs(inputs: Partial<PlannerInputs>): PlannerInputs {
  const grossYearly = sanitizeCurrencyInput(inputs.grossYearly ?? DEFAULT_INPUTS.grossYearly);
  const taxRate = clamp(normalizePercent(inputs.taxRate ?? DEFAULT_INPUTS.taxRate), 0, 0.6);
  const savingsRate = clamp(normalizePercent(inputs.savingsRate ?? DEFAULT_INPUTS.savingsRate), 0, 0.8);
  const returnRate = clamp(normalizePercent(inputs.returnRate ?? DEFAULT_INPUTS.returnRate), 0, 0.15);
  const startingNetWorth = sanitizeCurrencyInput(inputs.startingNetWorth ?? DEFAULT_INPUTS.startingNetWorth);

  // If gross yearly is below minimum, use default
  const validGrossYearly = grossYearly < MIN_GROSS_YEARLY ? DEFAULT_INPUTS.grossYearly : grossYearly;

  return {
    grossYearly: validGrossYearly,
    taxRate,
    savingsRate,
    returnRate,
    startingNetWorth,
  };
}

export function calculateCashflow(
  inputs: PlannerInputs,
  plannedLifestyleMonthly: number
): CashflowSummary {
  // Validate inputs
  const validated = validateInputs(inputs);

  // Calculate monthly figures using exact formulas
  const grossMonthly = validated.grossYearly / 12;
  const taxMonthly = grossMonthly * validated.taxRate;
  const netMonthly = grossMonthly - taxMonthly;
  const investMonthly = netMonthly * validated.savingsRate;

  // Ensure lifestyle is valid
  const lifestyle = isNaN(plannedLifestyleMonthly) ? 0 : Math.max(0, plannedLifestyleMonthly);

  // Calculate surplus/deficit
  const surplusMonthly = netMonthly - investMonthly - lifestyle;

  // Contribution is investing + any surplus (if positive)
  const contributionMonthly = Math.max(0, investMonthly + Math.max(0, surplusMonthly));

  return {
    grossMonthly,
    taxMonthly,
    netMonthly,
    investMonthly,
    plannedLifestyleMonthly: lifestyle,
    surplusMonthly,
    contributionMonthly,
  };
}

export const PRESET_PROFILES = {
  conservative: { taxRate: 0.30, savingsRate: 0.15, returnRate: 0.06 },
  standard: { taxRate: 0.28, savingsRate: 0.25, returnRate: 0.08 },
  aggressive: { taxRate: 0.25, savingsRate: 0.35, returnRate: 0.10 },
};
