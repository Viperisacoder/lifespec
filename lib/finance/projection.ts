export interface ProjectionPoint {
  age: number;
  netWorth: number;
}

export function calculateProjection(
  currentAge: number,
  startingNetWorth: number,
  contributionMonthly: number,
  returnRate: number,
  maxAge: number
): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  let netWorth = startingNetWorth;

  for (let age = currentAge; age <= maxAge; age++) {
    points.push({ age, netWorth });

    // Add monthly contributions and compound returns
    for (let month = 0; month < 12; month++) {
      netWorth += contributionMonthly;
      netWorth *= 1 + returnRate / 12;
    }
  }

  return points;
}

export function calculateMillionaireAge(
  currentAge: number,
  startingNetWorth: number,
  contributionMonthly: number,
  returnRate: number
): number | null {
  if (contributionMonthly <= 0) return null;

  const millionTarget = 1000000;
  let netWorth = startingNetWorth;
  let age = currentAge;

  // Simple iteration to find when net worth reaches $1M
  for (let month = 0; month < 12 * 100; month++) {
    netWorth += contributionMonthly;
    netWorth *= 1 + returnRate / 12;

    if (netWorth >= millionTarget) {
      return age + Math.floor(month / 12);
    }
  }

  return null;
}

export function calculateDreamCompletionAge(
  currentAge: number,
  startingNetWorth: number,
  contributionMonthly: number,
  returnRate: number,
  blueprintMonthlyCost: number,
  currentMonthlyIncome: number
): number | null {
  // If current income already covers blueprint, dream is affordable now
  if (currentMonthlyIncome >= blueprintMonthlyCost) {
    return currentAge;
  }

  if (contributionMonthly <= 0) return null;

  let netWorth = startingNetWorth;
  let age = currentAge;

  // Calculate when passive income (4% rule) covers blueprint cost
  const targetNetWorth = (blueprintMonthlyCost * 12) / 0.04;

  for (let month = 0; month < 12 * 100; month++) {
    netWorth += contributionMonthly;
    netWorth *= 1 + returnRate / 12;

    if (netWorth >= targetNetWorth) {
      return age + Math.floor(month / 12);
    }
  }

  return null;
}
