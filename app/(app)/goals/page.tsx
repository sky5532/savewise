"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getGoals, type Goal } from "@/lib/savings";
import { useUser } from "@/lib/useUser";
import GoalCard from "../GoalCard";

export default function GoalsPage() {
  const user = useUser();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  if (!user) return null;
  const active = goals.filter((g) => g.savedKobo < g.targetKobo).length;

  return (
    <main className="mx-auto max-w-[480px] px-6 py-8">
      <h1 className="text-[26px] font-bold leading-tight">My Goals</h1>
      <p className="mt-1 text-sm text-muted">
        Every goal brings you closer to what matters
      </p>

      <div className="mt-6 rounded-2xl bg-brand-light p-5">
        <p className="text-xs font-semibold tracking-wide text-brand">ACTIVE GOALS</p>
        <p className="mt-1 text-[32px] font-bold">{active}</p>
      </div>

      <h2 className="mt-8 text-base font-semibold">Your Savings Goals</h2>
      {goals.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-line bg-white p-6 text-center">
          <p className="text-sm font-medium">Nothing here yet</p>
          <p className="mt-1 text-xs text-muted">
            Your savings goals will appear here once you create one.
          </p>
        </div>
      ) : (
        goals.map((g) => <GoalCard key={g.name} goal={g} />)
      )}

      <Link
        href="/save"
        className="mt-5 block rounded-xl bg-brand py-3.5 text-center font-semibold text-white"
      >
        {goals.length === 0 ? "+ Create a goal" : "+ Add a goal"}
      </Link>
    </main>
  );
}