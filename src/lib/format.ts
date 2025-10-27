const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function formatShortNumber(value: number): string {
  return compactFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatGap(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${numberFormatter.format(value)}`;
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value);
}
