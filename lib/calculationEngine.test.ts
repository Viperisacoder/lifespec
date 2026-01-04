import { BlueprintPayload, BlueprintInputs } from './blueprintTypes';
import { calculateFinancialMetrics, formatCurrency, formatPercentage, formatTimePeriod } from './calculationEngine';

describe('calculationEngine', () => {
  describe('calculateFinancialMetrics', () => {
    // Test case 1: Basic calculation with positive margin
    test('calculates metrics correctly with positive margin', () => {
      const blueprintData: BlueprintPayload = {
        totalMonthly: 5000,
        totalYearly: 60000,
        requiredGrossYearly: 120000,
        timestamp: new Date().toISOString(),
        categoryBreakdown: {
          housing: 2000,
          lifestyle: 2000,
          fixedCosts: 1000
        }
      };
      
      const inputs: BlueprintInputs = {
        annualGrossIncome: 150000,
        effectiveTaxRatePercent: 25,
        monthlySavings: 2000,
        otherMonthlyIncome: 500,
        monthlyDebtPayments: 1000
      };
      
      const metrics = calculateFinancialMetrics(blueprintData, inputs);
      
      // Net monthly income = (150000 * 0.75) / 12 = 9375
      expect(metrics.netMonthlyIncome).toBeCloseTo(9375);
      
      // Total monthly inflows = 9375 + 500 = 9875
      expect(metrics.totalMonthlyInflows).toBeCloseTo(9875);
      
      // Total monthly outflows = 5000 + 2000 + 1000 = 8000
      expect(metrics.totalMonthlyOutflows).toBeCloseTo(8000);
      
      // Margin monthly = 9875 - 8000 = 1875
      expect(metrics.marginMonthly).toBeCloseTo(1875);
      
      // Margin yearly = 1875 * 12 = 22500
      expect(metrics.marginYearly).toBeCloseTo(22500);
      
      // Required annual gross income = ((5000 + 2000 + 1000 - 500) * 12) / 0.75 = 120000
      expect(metrics.requiredAnnualGrossIncome).toBeCloseTo(120000);
      
      // Income gap = 150000 - 120000 = 30000
      expect(metrics.incomeGap).toBeCloseTo(30000);
      expect(metrics.incomeGapLabel).toBe('Surplus');
      
      // Time to equilibrium = 0 (already at equilibrium)
      expect(metrics.timeToEquilibrium).toBe(0);
      
      // Savings rate = 2000 / 9875 = 0.2025
      expect(metrics.savingsRate).toBeCloseTo(0.2025, 3);
      expect(metrics.savingsViabilityLabel).toBe('Strong');
      
      // Months to 100k = 100000 / 2000 = 50
      expect(metrics.monthsTo100k).toBe(50);
      
      // Months to 1M = 1000000 / 2000 = 500
      expect(metrics.monthsTo1M).toBe(500);
    });
    
    // Test case 2: Negative margin scenario
    test('calculates metrics correctly with negative margin', () => {
      const blueprintData: BlueprintPayload = {
        totalMonthly: 10000,
        totalYearly: 120000,
        requiredGrossYearly: 200000,
        timestamp: new Date().toISOString()
      };
      
      const inputs: BlueprintInputs = {
        annualGrossIncome: 120000,
        effectiveTaxRatePercent: 25,
        monthlySavings: 1000,
        otherMonthlyIncome: 0,
        monthlyDebtPayments: 2000
      };
      
      const metrics = calculateFinancialMetrics(blueprintData, inputs);
      
      // Net monthly income = (120000 * 0.75) / 12 = 7500
      expect(metrics.netMonthlyIncome).toBeCloseTo(7500);
      
      // Total monthly inflows = 7500 + 0 = 7500
      expect(metrics.totalMonthlyInflows).toBeCloseTo(7500);
      
      // Total monthly outflows = 10000 + 1000 + 2000 = 13000
      expect(metrics.totalMonthlyOutflows).toBeCloseTo(13000);
      
      // Margin monthly = 7500 - 13000 = -5500
      expect(metrics.marginMonthly).toBeCloseTo(-5500);
      
      // Margin yearly = -5500 * 12 = -66000
      expect(metrics.marginYearly).toBeCloseTo(-66000);
      
      // Income gap should be negative
      expect(metrics.incomeGap).toBeLessThan(0);
      expect(metrics.incomeGapLabel).toBe('Shortfall');
      
      // Time to equilibrium should be null (not achievable)
      expect(metrics.timeToEquilibrium).toBeNull();
      
      // Savings milestones should be null (not achievable)
      expect(metrics.monthsTo100k).toBeNull();
      expect(metrics.monthsTo1M).toBeNull();
    });
    
    // Test case 3: Edge case with zero income
    test('handles edge case with zero income', () => {
      const blueprintData: BlueprintPayload = {
        totalMonthly: 5000,
        totalYearly: 60000,
        requiredGrossYearly: 100000,
        timestamp: new Date().toISOString()
      };
      
      const inputs: BlueprintInputs = {
        annualGrossIncome: 0,
        effectiveTaxRatePercent: 25,
        monthlySavings: 0,
        otherMonthlyIncome: 0,
        monthlyDebtPayments: 0
      };
      
      const metrics = calculateFinancialMetrics(blueprintData, inputs);
      
      // Net monthly income should be 0
      expect(metrics.netMonthlyIncome).toBe(0);
      
      // Total monthly inflows should be 0
      expect(metrics.totalMonthlyInflows).toBe(0);
      
      // Total monthly outflows should be 5000
      expect(metrics.totalMonthlyOutflows).toBe(5000);
      
      // Margin monthly should be -5000
      expect(metrics.marginMonthly).toBe(-5000);
      
      // Income gap should be negative
      expect(metrics.incomeGap).toBeLessThan(0);
      
      // Savings rate should be 0
      expect(metrics.savingsRate).toBe(0);
      expect(metrics.savingsViabilityLabel).toBe('Low');
    });
    
    // Test case 4: Edge case with extremely high tax rate
    test('handles edge case with extremely high tax rate', () => {
      const blueprintData: BlueprintPayload = {
        totalMonthly: 5000,
        totalYearly: 60000,
        requiredGrossYearly: 100000,
        timestamp: new Date().toISOString()
      };
      
      const inputs: BlueprintInputs = {
        annualGrossIncome: 100000,
        effectiveTaxRatePercent: 90, // Extremely high tax rate
        monthlySavings: 1000,
        otherMonthlyIncome: 0,
        monthlyDebtPayments: 0
      };
      
      const metrics = calculateFinancialMetrics(blueprintData, inputs);
      
      // Tax rate should be clamped to 60%
      expect(metrics.netMonthlyIncome).toBeCloseTo((100000 * 0.4) / 12);
      
      // Required annual gross income should be very high but not infinite
      expect(Number.isFinite(metrics.requiredAnnualGrossIncome)).toBe(true);
    });
  });
  
  describe('formatCurrency', () => {
    test('formats currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1000.50)).toBe('$1,001');
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(-5000)).toBe('-$5,000');
    });
    
    test('handles edge cases', () => {
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(NaN)).toBe('—');
      expect(formatCurrency(null as any)).toBe('—');
    });
  });
  
  describe('formatPercentage', () => {
    test('formats percentage correctly', () => {
      expect(formatPercentage(0.15)).toBe('15.0%');
      expect(formatPercentage(1)).toBe('100.0%');
      expect(formatPercentage(0)).toBe('0.0%');
    });
    
    test('handles edge cases', () => {
      expect(formatPercentage(NaN)).toBe('—');
      expect(formatPercentage(null as any)).toBe('—');
    });
  });
  
  describe('formatTimePeriod', () => {
    test('formats time periods correctly', () => {
      expect(formatTimePeriod(0)).toBe('Now');
      expect(formatTimePeriod(1)).toBe('1 month');
      expect(formatTimePeriod(2)).toBe('2 months');
      expect(formatTimePeriod(12)).toBe('1 year');
      expect(formatTimePeriod(24)).toBe('2 years');
      expect(formatTimePeriod(15)).toBe('1 year, 3 months');
    });
    
    test('handles edge cases', () => {
      expect(formatTimePeriod(-1)).toBe('Never');
      expect(formatTimePeriod(null)).toBe('—');
      expect(formatTimePeriod(NaN)).toBe('—');
    });
  });
});
