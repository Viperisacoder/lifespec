import { BlueprintPayload, BlueprintInputs, CalculatedMetrics } from './blueprintTypes';

/**
 * Calculate financial metrics based on blueprint data and user inputs
 * @param blueprintData The blueprint data containing lifestyle costs
 * @param inputs User financial inputs
 * @returns Calculated financial metrics
 */
export function calculateFinancialMetrics(
  blueprintData: BlueprintPayload,
  inputs: BlueprintInputs
): CalculatedMetrics {
  // Extract values from inputs with defaults for missing values
  const {
    monthlyIncome = 0,
    taxRatePercent = 25, // Default 25% tax rate if not provided
    monthlySavings = 0,
    otherMonthlyIncome = 0,
    monthlyDebtPayments = 0
  } = inputs;

  // Extract values from blueprint data
  const monthlyTotalCost = blueprintData.totalMonthly || 0;

  // Ensure tax rate is valid (between 0 and 100%)
  const taxRate = Math.min(Math.max(taxRatePercent, 0), 60) / 100;

  // 1) After-tax monthly income
  const netMonthlyIncome = monthlyIncome * (1 - taxRate);

  // 2) Total monthly inflows
  const totalMonthlyInflows = netMonthlyIncome + otherMonthlyIncome;

  // 3) Total monthly outflows
  const totalMonthlyOutflows = monthlyTotalCost + monthlySavings + monthlyDebtPayments;

  // 4) Margin
  const marginMonthly = totalMonthlyInflows - totalMonthlyOutflows;
  const marginYearly = marginMonthly * 12;

  // 5) Required gross income to sustain blueprint
  // We need gross such that: (gross*(1-tax_rate)) + other_income >= monthly_total_cost + monthly_savings + monthly_debt
  // Solve for gross: required_monthly_gross_income = (monthly_total_cost + monthly_savings + monthly_debt_payments - other_monthly_income) / (1 - tax_rate)
  const requiredMonthlyGrossIncome = taxRate >= 1 
    ? Infinity // Avoid division by zero
    : Math.max(0, (monthlyTotalCost + monthlySavings + monthlyDebtPayments - otherMonthlyIncome) / (1 - taxRate));

  // 6) Income Reality gap
  const incomeGap = monthlyIncome - requiredMonthlyGrossIncome;
  const incomeGapLabel = incomeGap >= 0 ? 'Surplus' : 'Shortfall';

  // 7) "Time Pressure" / "Not achievable"
  let timeToEquilibrium: number | null = null;
  let monthsTo100k: number | null = null;

  if (marginMonthly >= 0) {
    timeToEquilibrium = 0; // Already at equilibrium
    
    // Calculate time to savings milestones if saving
    if (monthlySavings > 0) {
      monthsTo100k = Math.ceil(100000 / monthlySavings);
    }
  }

  // Calculate affordability status
  let affordabilityStatus: 'Sustainable' | 'Tight' | 'Not sustainable';
  if (marginMonthly >= 0) {
    affordabilityStatus = 'Sustainable';
  } else if (marginMonthly >= -500) {
    affordabilityStatus = 'Tight';
  } else {
    affordabilityStatus = 'Not sustainable';
  }

  // Calculate buffer ratio
  const bufferRatio = totalMonthlyInflows > 0 ? marginMonthly / totalMonthlyInflows : 0;

  return {
    netMonthlyIncome,
    totalMonthlyInflows,
    totalMonthlyOutflows,
    marginMonthly,
    marginYearly,
    requiredGrossYearly: requiredMonthlyGrossIncome * 12,
    monthlyGap: incomeGap,
    monthlyGapLabel: incomeGapLabel === 'Surplus' ? 'extra' : 'short',
    affordabilityStatus,
    bufferRatio,
    timeToSustainable: timeToEquilibrium ?? undefined,
    savingsRunwayProxy: monthsTo100k ?? undefined
  };
}

/**
 * Format a number as currency
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, options: { 
  maximumFractionDigits?: number,
  notation?: 'standard' | 'compact'
} = {}): string {
  const { maximumFractionDigits = 0, notation = 'standard' } = options;
  
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '—';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
    notation
  }).format(amount);
}

/**
 * Format a number as a percentage
 * @param value The value to format as percentage
 * @param options Formatting options
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, options: {
  maximumFractionDigits?: number,
  minimumFractionDigits?: number
} = {}): string {
  const { 
    maximumFractionDigits = 1,
    minimumFractionDigits = 1 
  } = options;
  
  if (isNaN(value) || value === null || value === undefined) {
    return '—';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits,
    minimumFractionDigits
  }).format(value);
}

/**
 * Format a time period in months to a human-readable string
 * @param months Number of months
 * @returns Formatted time string
 */
export function formatTimePeriod(months: number | null): string {
  if (months === null || isNaN(months)) {
    return '—';
  }
  
  if (months === 0) {
    return 'Now';
  }
  
  if (months < 0) {
    return 'Never';
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
}

/**
 * Get default financial inputs based on blueprint data
 * @param blueprintData The blueprint data
 * @returns Default financial inputs
 */
export function getDefaultInputs(blueprintData: BlueprintPayload): BlueprintInputs {
  // Estimate a reasonable income based on expenses
  const monthlyExpenses = blueprintData.totalMonthly || 0;
  
  // Assume 25% tax rate and 15% savings rate for default values
  const estimatedGrossMonthlyIncome = monthlyExpenses / 0.6; // Accounting for taxes and savings
  
  return {
    monthlyIncome: Math.round(estimatedGrossMonthlyIncome),
    taxRatePercent: 25,
    monthlySavings: Math.round(monthlyExpenses * 0.15), // 15% of expenses as savings
    otherMonthlyIncome: 0,
    monthlyDebtPayments: 0
  };
}
