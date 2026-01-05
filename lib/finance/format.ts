export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '$0';
  
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${Math.round(value).toLocaleString()}`;
}

export function formatCurrencyDetailed(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '$0';
  return `$${Math.round(value).toLocaleString()}`;
}

export function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0%';
  return `${(value * 100).toFixed(1)}%`;
}
