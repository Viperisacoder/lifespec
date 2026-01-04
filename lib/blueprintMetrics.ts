/**
 * Safe blueprint metrics calculator
 * Handles missing inputs gracefully and returns formatted values
 */

export interface BlueprintMetricsInput {
  monthlyLifestyleCost?: number;
  yearlyLifestyleCost?: number;
  userIncomeYearlyGross?: number;
  userIncomeMonthlyGross?: number;
  taxRate?: number;
  savingsRate?: number;
  yearlySavingsTarget?: number;
  // New user input fields
  currentGrossIncomeYearly?: number;
  plannedSavingsMonthly?: number;
  effectiveTaxRatePercent?: number;
  otherMonthlyIncome?: number;
  monthlyDebtPayments?: number;
}

export interface BlueprintMetrics {
  netIncome: {
    value: string;
    raw: number | null;
    breakdown: string;
    isValid: boolean;
  };
  requiredGrossIncome: {
    value: string;
    raw: number | null;
    isValid: boolean;
  };
  savingsViability: {
    label: string;
    marginPercent: string;
    marginRaw: number | null;
    barPercent: number;
    isValid: boolean;
  };
  timeToMilestones: {
    milestone100k: string;
    milestone1m: string;
    yearsRaw100k: number | null;
    yearsRaw1m: number | null;
    isValid: boolean;
  };
}

function formatMoney(value: number | null): string {
  if (value === null || !isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYears(value: number | null): string {
  if (value === null || !isFinite(value) || value < 0) return '—';
  if (value < 10) {
    return value.toFixed(1);
  }
  return Math.round(value).toString();
}

function formatPercent(value: number | null): string {
  if (value === null || !isFinite(value)) return '—';
  return (value * 100).toFixed(0) + '%';
}

export function computeBlueprintMetrics(input: BlueprintMetricsInput): BlueprintMetrics {
  // Normalize inputs - prefer new user input fields
  const yearlyLifestyleCost = input.yearlyLifestyleCost ?? (input.monthlyLifestyleCost ? input.monthlyLifestyleCost * 12 : null);
  const userIncomeYearly = input.currentGrossIncomeYearly ?? input.userIncomeYearlyGross ?? (input.userIncomeMonthlyGross ? input.userIncomeMonthlyGross * 12 : null);
  const taxRate = (input.effectiveTaxRatePercent ?? (input.taxRate ? input.taxRate * 100 : 30)) / 100;
  
  // Calculate planned savings and other income/debt
  let plannedSavings = 0;
  if (input.plannedSavingsMonthly !== undefined) {
    plannedSavings = input.plannedSavingsMonthly * 12;
  } else if (input.savingsRate !== undefined && userIncomeYearly) {
    plannedSavings = userIncomeYearly * input.savingsRate;
  } else if (input.yearlySavingsTarget !== undefined) {
    plannedSavings = input.yearlySavingsTarget;
  }

  const yearlyOtherIncome = (input.otherMonthlyIncome ?? 0) * 12;
  const yearlyDebtPayments = (input.monthlyDebtPayments ?? 0) * 12;

  // A) Estimated Net Income
  let netIncomeRaw: number | null = null;
  let netIncomeBreakdown = '';
  if (userIncomeYearly !== null && yearlyLifestyleCost !== null) {
    const postTaxIncome = userIncomeYearly * (1 - taxRate);
    netIncomeRaw = postTaxIncome + yearlyOtherIncome - yearlyDebtPayments - plannedSavings;
    netIncomeBreakdown = `Gross: ${formatMoney(userIncomeYearly)} • Tax: ${formatMoney(userIncomeYearly * taxRate)} • Savings: ${formatMoney(plannedSavings)}`;
  }

  // B) Required Gross Income
  let requiredGrossRaw: number | null = null;
  if (yearlyLifestyleCost !== null && taxRate < 0.95) {
    requiredGrossRaw = (yearlyLifestyleCost + plannedSavings + yearlyDebtPayments - yearlyOtherIncome) / (1 - taxRate);
  }

  // C) Savings Viability
  let viabilityLabel = '';
  let marginRaw: number | null = null;
  let barPercent = 0;
  if (userIncomeYearly !== null && yearlyLifestyleCost !== null) {
    const postTaxIncome = userIncomeYearly * (1 - taxRate);
    const leftover = postTaxIncome + yearlyOtherIncome - yearlyDebtPayments - yearlyLifestyleCost - plannedSavings;
    marginRaw = leftover / userIncomeYearly;
    barPercent = Math.max(0, Math.min(100, marginRaw * 100));

    if (marginRaw >= 0.2) {
      viabilityLabel = 'Sustainable';
    } else if (marginRaw >= 0.05) {
      viabilityLabel = 'Tight';
    } else {
      viabilityLabel = 'Unsustainable';
    }
  }

  // D) Time to Milestones
  let yearsTo100k: number | null = null;
  let yearsTo1m: number | null = null;
  if (plannedSavings > 0) {
    yearsTo100k = 100000 / plannedSavings;
    yearsTo1m = 1000000 / plannedSavings;
  }

  return {
    netIncome: {
      value: formatMoney(netIncomeRaw),
      raw: netIncomeRaw,
      breakdown: netIncomeBreakdown,
      isValid: netIncomeRaw !== null,
    },
    requiredGrossIncome: {
      value: formatMoney(requiredGrossRaw),
      raw: requiredGrossRaw,
      isValid: requiredGrossRaw !== null,
    },
    savingsViability: {
      label: viabilityLabel,
      marginPercent: formatPercent(marginRaw),
      marginRaw,
      barPercent,
      isValid: marginRaw !== null,
    },
    timeToMilestones: {
      milestone100k: formatYears(yearsTo100k),
      milestone1m: formatYears(yearsTo1m),
      yearsRaw100k: yearsTo100k,
      yearsRaw1m: yearsTo1m,
      isValid: yearsTo100k !== null && yearsTo1m !== null,
    },
  };
}
