'use client';

import { useState, useEffect } from 'react';
import { saveBlueprintInputs, fetchBlueprintInputs, type BlueprintInputs } from '@/app/actions/blueprintSaveActions';

interface YourInputsCardProps {
  onInputsChange: (inputs: BlueprintInputs) => void;
  isVisible: boolean;
}

export function YourInputsCard({ onInputsChange, isVisible }: YourInputsCardProps) {
  const [formData, setFormData] = useState<BlueprintInputs>({
    currentGrossIncomeYearly: 0,
    plannedSavingsMonthly: 0,
    effectiveTaxRatePercent: 30,
    otherMonthlyIncome: 0,
    monthlyDebtPayments: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load existing inputs on mount
  useEffect(() => {
    const loadInputs = async () => {
      const result = await fetchBlueprintInputs();
      if (result.success && result.data) {
        setFormData(result.data);
        onInputsChange(result.data);
      }
    };
    loadInputs();
  }, [onInputsChange]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentGrossIncomeYearly || formData.currentGrossIncomeYearly < 0) {
      newErrors.currentGrossIncomeYearly = 'Required and must be positive';
    }
    if (!formData.plannedSavingsMonthly || formData.plannedSavingsMonthly < 0) {
      newErrors.plannedSavingsMonthly = 'Required and must be positive';
    }
    if (formData.effectiveTaxRatePercent < 0 || formData.effectiveTaxRatePercent > 60) {
      newErrors.effectiveTaxRatePercent = 'Must be between 0 and 60';
    }
    if ((formData.otherMonthlyIncome ?? 0) < 0) {
      newErrors.otherMonthlyIncome = 'Must be positive';
    }
    if ((formData.monthlyDebtPayments ?? 0) < 0) {
      newErrors.monthlyDebtPayments = 'Must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof BlueprintInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updated = { ...formData, [field]: numValue };
    setFormData(updated);
    onInputsChange(updated);
    setSaveMessage('');
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const result = await saveBlueprintInputs(formData);
      if (result.success) {
        setSaveMessage('Inputs saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save inputs');
      }
    } catch (error) {
      console.error('Error saving inputs:', error);
      setSaveMessage('Error saving inputs');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      currentGrossIncomeYearly: 0,
      plannedSavingsMonthly: 0,
      effectiveTaxRatePercent: 30,
      otherMonthlyIncome: 0,
      monthlyDebtPayments: 0,
    });
    setErrors({});
    setSaveMessage('');
  };

  if (!isVisible) return null;

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 border transition-all duration-200 mb-8"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Your Inputs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Current Gross Income Yearly */}
        <div>
          <label className="text-xs uppercase tracking-wide mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Annual Gross Income
          </label>
          <input
            type="number"
            value={formData.currentGrossIncomeYearly}
            onChange={(e) => handleChange('currentGrossIncomeYearly', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2 rounded-lg border transition-all focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: errors.currentGrossIncomeYearly ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
              color: 'var(--text-primary)',
              boxShadow: errors.currentGrossIncomeYearly ? 'none' : 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--white)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.currentGrossIncomeYearly ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.currentGrossIncomeYearly && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.currentGrossIncomeYearly}</p>
          )}
        </div>

        {/* Planned Savings Monthly */}
        <div>
          <label className="text-xs uppercase tracking-wide mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Monthly Savings
          </label>
          <input
            type="number"
            value={formData.plannedSavingsMonthly}
            onChange={(e) => handleChange('plannedSavingsMonthly', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2 rounded-lg border transition-all focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: errors.plannedSavingsMonthly ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--white)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.plannedSavingsMonthly ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.plannedSavingsMonthly && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.plannedSavingsMonthly}</p>
          )}
        </div>

        {/* Effective Tax Rate */}
        <div>
          <label className="text-xs uppercase tracking-wide mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Effective Tax Rate (%)
          </label>
          <input
            type="number"
            value={formData.effectiveTaxRatePercent}
            onChange={(e) => handleChange('effectiveTaxRatePercent', e.target.value)}
            placeholder="30"
            min="0"
            max="60"
            className="w-full px-4 py-2 rounded-lg border transition-all focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: errors.effectiveTaxRatePercent ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--white)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.effectiveTaxRatePercent ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.effectiveTaxRatePercent && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.effectiveTaxRatePercent}</p>
          )}
        </div>

        {/* Other Monthly Income */}
        <div>
          <label className="text-xs uppercase tracking-wide mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Other Monthly Income (Optional)
          </label>
          <input
            type="number"
            value={formData.otherMonthlyIncome ?? 0}
            onChange={(e) => handleChange('otherMonthlyIncome', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2 rounded-lg border transition-all focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: errors.otherMonthlyIncome ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--white)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.otherMonthlyIncome ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.otherMonthlyIncome && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.otherMonthlyIncome}</p>
          )}
        </div>

        {/* Monthly Debt Payments */}
        <div>
          <label className="text-xs uppercase tracking-wide mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Monthly Debt Payments (Optional)
          </label>
          <input
            type="number"
            value={formData.monthlyDebtPayments ?? 0}
            onChange={(e) => handleChange('monthlyDebtPayments', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2 rounded-lg border transition-all focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: errors.monthlyDebtPayments ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--white)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.monthlyDebtPayments ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.monthlyDebtPayments && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.monthlyDebtPayments}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleSave}
          disabled={isSaving || Object.keys(errors).length > 0}
          className="flex-1 px-6 py-2 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'var(--white)',
            color: 'var(--bg-primary)',
            opacity: isSaving || Object.keys(errors).length > 0 ? 0.5 : 1,
            cursor: isSaving || Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isSaving && Object.keys(errors).length === 0) {
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isSaving ? 'Saving...' : 'Save Inputs'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--white)';
            e.currentTarget.style.color = 'var(--white)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          Reset
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <p className="text-sm" style={{ color: saveMessage.includes('success') ? 'var(--white)' : '#ef4444' }}>
          {saveMessage}
        </p>
      )}
    </div>
  );
}
