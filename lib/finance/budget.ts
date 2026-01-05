export interface BudgetCategory {
  id: string;
  name: string;
  group: 'NEEDS' | 'LIFESTYLE' | 'OTHER';
  monthlyAmount: number;
  guideline?: number; // as % of take-home
}

export interface BudgetInputs {
  grossYearly: number;
  taxRate: number;
  savingsMode: 'percent' | 'fixed';
  savingsRate: number; // if percent mode
  savingsFixed: number; // if fixed mode
  returnRate: number;
  startingNetWorth: number;
}

export interface BudgetSummary {
  grossMonthly: number;
  takeHomeMonthly: number;
  savingsTargetMonthly: number;
  totalExpensesMonthly: number;
  surplusMonthly: number;
  contributionMonthly: number;
}

export interface BudgetFlag {
  categoryId: string;
  categoryName: string;
  percentage: number;
  guideline: number;
  isExceeded: boolean;
}

export interface CutSuggestion {
  categoryId: string;
  categoryName: string;
  currentAmount: number;
  suggestedCut: number;
}

export interface BudgetInsights {
  flags: BudgetFlag[];
  cutSuggestions: CutSuggestion[];
  messages: string[];
}

// Default budget categories
export const DEFAULT_CATEGORIES: BudgetCategory[] = [
  // NEEDS
  { id: 'rent', name: 'Rent/Mortgage', group: 'NEEDS', monthlyAmount: 0, guideline: 0.35 },
  { id: 'utilities', name: 'Utilities', group: 'NEEDS', monthlyAmount: 0 },
  { id: 'groceries', name: 'Groceries', group: 'NEEDS', monthlyAmount: 0 },
  { id: 'transportation', name: 'Transportation', group: 'NEEDS', monthlyAmount: 0, guideline: 0.15 },
  { id: 'insurance', name: 'Insurance', group: 'NEEDS', monthlyAmount: 0 },
  { id: 'debt', name: 'Debt payments', group: 'NEEDS', monthlyAmount: 0, guideline: 0.2 },
  // LIFESTYLE
  { id: 'eating_out', name: 'Eating out', group: 'LIFESTYLE', monthlyAmount: 0 },
  { id: 'subscriptions', name: 'Subscriptions', group: 'LIFESTYLE', monthlyAmount: 0 },
  { id: 'shopping', name: 'Shopping', group: 'LIFESTYLE', monthlyAmount: 0 },
  { id: 'entertainment', name: 'Entertainment', group: 'LIFESTYLE', monthlyAmount: 0 },
  { id: 'travel', name: 'Travel', group: 'LIFESTYLE', monthlyAmount: 0 },
  // OTHER
  { id: 'other', name: 'Other', group: 'OTHER', monthlyAmount: 0 },
];

export const DEFAULT_INPUTS: BudgetInputs = {
  grossYearly: 150000,
  taxRate: 0.28,
  savingsMode: 'percent',
  savingsRate: 0.25,
  savingsFixed: 0,
  returnRate: 0.08,
  startingNetWorth: 0,
};

export function computeBudgetSummary(
  inputs: BudgetInputs,
  categories: BudgetCategory[]
): BudgetSummary {
  const grossMonthly = inputs.grossYearly / 12;
  const takeHomeMonthly = grossMonthly * (1 - inputs.taxRate);

  const savingsTargetMonthly =
    inputs.savingsMode === 'percent'
      ? takeHomeMonthly * inputs.savingsRate
      : inputs.savingsFixed;

  const totalExpensesMonthly = categories.reduce((sum, cat) => sum + (cat.monthlyAmount || 0), 0);
  const surplusMonthly = takeHomeMonthly - totalExpensesMonthly - savingsTargetMonthly;
  const contributionMonthly = Math.max(0, savingsTargetMonthly + Math.max(0, surplusMonthly));

  return {
    grossMonthly,
    takeHomeMonthly,
    savingsTargetMonthly,
    totalExpensesMonthly,
    surplusMonthly,
    contributionMonthly,
  };
}

export function computeFlags(
  categories: BudgetCategory[],
  takeHomeMonthly: number
): BudgetFlag[] {
  const flags: BudgetFlag[] = [];

  const categoryGuidelines: Record<string, number> = {
    rent: 0.35,
    transportation: 0.15,
    debt: 0.2,
  };

  categories.forEach((cat) => {
    const guideline = categoryGuidelines[cat.id];
    if (guideline) {
      const percentage = takeHomeMonthly > 0 ? cat.monthlyAmount / takeHomeMonthly : 0;
      if (percentage > guideline) {
        flags.push({
          categoryId: cat.id,
          categoryName: cat.name,
          percentage,
          guideline,
          isExceeded: true,
        });
      }
    }
  });

  // Check discretionary spending
  const discretionaryIds = ['eating_out', 'shopping', 'entertainment', 'subscriptions', 'travel'];
  const discretionaryTotal = categories
    .filter((cat) => discretionaryIds.includes(cat.id))
    .reduce((sum, cat) => sum + (cat.monthlyAmount || 0), 0);

  const discretionaryPct = takeHomeMonthly > 0 ? discretionaryTotal / takeHomeMonthly : 0;
  if (discretionaryPct > 0.2) {
    flags.push({
      categoryId: 'discretionary',
      categoryName: 'Discretionary spending',
      percentage: discretionaryPct,
      guideline: 0.2,
      isExceeded: true,
    });
  }

  return flags;
}

export function computeCutSuggestions(
  categories: BudgetCategory[],
  surplusMonthly: number
): CutSuggestion[] {
  if (surplusMonthly >= 0) return [];

  const requiredCut = Math.abs(surplusMonthly);
  const discretionaryIds = ['eating_out', 'shopping', 'entertainment', 'subscriptions', 'travel'];

  const discretionaryCategories = categories
    .filter((cat) => discretionaryIds.includes(cat.id) && cat.monthlyAmount > 0)
    .sort((a, b) => (b.monthlyAmount || 0) - (a.monthlyAmount || 0));

  const suggestions: CutSuggestion[] = [];
  let remaining = requiredCut;

  for (const cat of discretionaryCategories) {
    if (remaining <= 0) break;

    const suggestedCut = Math.min(cat.monthlyAmount || 0, remaining);
    suggestions.push({
      categoryId: cat.id,
      categoryName: cat.name,
      currentAmount: cat.monthlyAmount || 0,
      suggestedCut,
    });
    remaining -= suggestedCut;
  }

  return suggestions;
}

export function computeInsights(
  categories: BudgetCategory[],
  summary: BudgetSummary
): BudgetInsights {
  const flags = computeFlags(categories, summary.takeHomeMonthly);
  const cutSuggestions = computeCutSuggestions(categories, summary.surplusMonthly);

  const messages: string[] = [];

  if (summary.surplusMonthly < 0) {
    messages.push(
      `You're overspending by $${Math.abs(summary.surplusMonthly).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}/mo. Consider cutting discretionary spending.`
    );
  } else if (summary.surplusMonthly > 0) {
    messages.push(
      `Great! You have a surplus of $${summary.surplusMonthly.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}/mo after savings.`
    );
  }

  if (flags.length > 0) {
    const flagNames = flags.map((f) => f.categoryName).join(', ');
    messages.push(`${flagNames} exceeds recommended guidelines.`);
  }

  return {
    flags,
    cutSuggestions,
    messages,
  };
}
