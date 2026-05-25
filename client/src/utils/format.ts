export function formatSalary(amount: number, country: string): string {
  const currency =
    country === 'India' ? 'INR' : country === 'United Kingdom' ? 'GBP' : 'USD';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
