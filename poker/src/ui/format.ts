/** Chips shown as dollars: 9600 -> "$9,600". */
export function money(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}
