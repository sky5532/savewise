"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { calcSuggestion } from "@/lib/calc";
import { nairaToKobo } from "@/lib/money";

export const toNumber = (v: string) => Number(v.replace(/,/g, ""));

type Draft = {
  income: string;
  expenses: string;
  amount: string;
  picked: string;
  custom: string;
  balance: number;
  done: boolean;
};

const EMPTY: Draft = {
  income: "",
  expenses: "",
  amount: "",
  picked: "",
  custom: "",
  balance: 0,
  done: false,
};
const KEY = "savewise.draft";

function derive(d: Draft, percent: number) {
  const incomeKobo = nairaToKobo(toNumber(d.income));
  const expensesKobo = nairaToKobo(toNumber(d.expenses));
  const { remaining, suggested } = calcSuggestion(incomeKobo, expensesKobo, percent);
  return {
    percent,
    incomeKobo,
    expensesKobo,
    amountKobo: nairaToKobo(toNumber(d.amount)),
    remaining,
    suggested,
    goal: d.custom.trim() || d.picked,
  };
}

type Ctx = Draft &
  ReturnType<typeof derive> & {
    ready: boolean;
    update: (patch: Partial<Draft>) => void;
    reset: () => void;
  };

const SaveCtx = createContext<Ctx | null>(null);

export function SaveProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [percent, setPercent] = useState(20);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setPercent(session.user.settings.targetSavingsPercentage || 20);
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setDraft({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(draft));
    } catch {}
  }, [ready, draft]);

  const update = useCallback(
    (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch })),
    []
  );
  const reset = useCallback(() => setDraft(EMPTY), []);

  return (
    <SaveCtx.Provider
      value={{ ...draft, ...derive(draft, percent), ready, update, reset }}
    >
      {children}
    </SaveCtx.Provider>
  );
}

export function useSave() {
  const ctx = useContext(SaveCtx);
  if (!ctx) throw new Error("useSave must be used inside SaveProvider");
  return ctx;
}

// Sends the user back to Step 1 if they land on a later page without the data it needs.
export function useGuard(need: "income" | "amount" | "goal") {
  const s = useSave();
  const router = useRouter();
  const ok =
    need === "income"
      ? s.incomeKobo > 0
      : need === "amount"
        ? s.incomeKobo > 0 && s.amountKobo > 0
        : s.incomeKobo > 0 && s.amountKobo > 0 && !!s.goal;

  useEffect(() => {
    if (s.ready && !ok) router.replace("/save/setup");
  }, [s.ready, ok, router]);

  return s.ready && ok;
}