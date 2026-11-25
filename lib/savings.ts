import { getSession, saveSession } from "./auth";

export type Goal = { name: string; targetKobo: number; savedKobo: number };
export type Deposit = {
  id: string;
  goal: string;
  amountKobo: number;
  date: string;
};

const GOALS = "savewise.goals";
const DEPOSITS = "savewise.deposits";

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

export const getGoals = () => read<Goal>(GOALS);
export const getDeposits = () => read<Deposit>(DEPOSITS);

export function recordDeposit(input: {
  goal: string;
  targetKobo: number;
  amountKobo: number;
}) {
  const goals = getGoals();
  const existing = goals.find((g) => g.name === input.goal);
  if (existing) {
    existing.savedKobo += input.amountKobo;
  } else {
    goals.push({
      name: input.goal,
      targetKobo: input.targetKobo,
      savedKobo: input.amountKobo,
    });
  }

  const deposits: Deposit[] = [
    {
      id: crypto.randomUUID(),
      goal: input.goal,
      amountKobo: input.amountKobo,
      date: new Date().toISOString(),
    },
    ...getDeposits(),
  ];

  localStorage.setItem(GOALS, JSON.stringify(goals));
  localStorage.setItem(DEPOSITS, JSON.stringify(deposits));

  const session = getSession();
  if (session) {
    session.user.walletBalanceKobo += input.amountKobo;
    saveSession(session);
    return session.user.walletBalanceKobo;
  }
  return input.amountKobo;
}