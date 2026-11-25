export function calcSuggestion(
  incomeKobo: number,
  expensesKobo: number,
  percent = 20
) {
  const remaining = Math.max(0, incomeKobo - expensesKobo);
  const suggested = Math.floor((remaining * percent) / 100 / 100) * 100;
  return { remaining, suggested };
}