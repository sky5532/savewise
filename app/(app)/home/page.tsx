"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSession, type User } from "@/lib/auth";
import { formatNaira } from "@/lib/money";
import { getDeposits, getGoals, type Deposit, type Goal } from "@/lib/savings";

function dayLabel(iso: string) {
  const d = new Date(iso);
  if (d.toDateString() === new Date().toDateString()) return "Today";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session.user);
    setGoals(getGoals());
    setDeposits(getDeposits());
  }, [router]);

  function logout() {
    clearSession();
    router.replace("/login");
  }

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-[480px] px-6 py-10 text-sm text-muted">
        Loading…
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-[480px] px-6 py-8">
      <h1 className="text-[26px] font-bold leading-tight">
        Hello, {user.profile.firstName} 👋
      </h1>
      <p className="mt-1 text-sm text-muted">
        {deposits.length
          ? "Here’s how your savings are growing"
          : "Let’s make your savings goals happen"}
      </p>

      <section className="mt-6 rounded-2xl bg-brand p-5 text-white">
        <p className="text-xs font-medium tracking-wide opacity-80">
          TOTAL DEMO SAVINGS
        </p>
        <p className="mt-1 text-[32px] font-bold">
          {formatNaira(user.walletBalanceKobo)}
        </p>
        <p className="text-xs opacity-80">Your simulated savings balance</p>
      </section>

      <Link
        href="/save"
        className="mt-4 block rounded-xl bg-gold py-3.5 text-center font-semibold text-ink"
      >
        Save Now
      </Link>

      <h2 className="mt-8 text-base font-semibold">Your Savings Goals</h2>
      {goals.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-line bg-white p-5 text-center">
          <p className="text-sm font-medium">No savings goal yet</p>
          <p className="mt-1 text-xs text-muted">
            Your savings goals will appear here once you create one.
          </p>
        </div>
      ) : (
        goals.map((g) => {
          const pct =
            g.targetKobo > 0
              ? Math.min(100, Math.round((g.savedKobo / g.targetKobo) * 100))
              : 0;
          return (
            <div
              key={g.name}
              className="mt-3 rounded-2xl border border-line bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{g.name}</p>
                <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand">
                  {pct >= 100 ? "Reached" : "Active"}
                </span>
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-pale"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${g.name} progress`}
              >
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                {pct}% complete · {formatNaira(g.savedKobo)} saved of{" "}
                {formatNaira(g.targetKobo)}
              </p>
            </div>
          );
        })
      )}

      <h2 className="mt-8 text-base font-semibold">Recent Activity</h2>
      {deposits.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-line bg-white p-5 text-center">
          <p className="text-sm font-medium">No savings activity yet</p>
          <p className="mt-1 text-xs text-muted">
            Your savings activity will appear here once you make a deposit.
          </p>
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-line bg-white px-4">
          {deposits.slice(0, 5).map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between border-b border-line py-3 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold">Savings Recorded</p>
                <p className="text-xs text-muted">
                  {dayLabel(d.date)} · {d.goal}
                </p>
              </div>
              <p className="text-sm font-semibold text-success">
                + {formatNaira(d.amountKobo)}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={logout}
        className="mt-8 w-full rounded-xl border border-line py-3 text-sm font-semibold text-muted"
      >
        Log out
      </button>
    </main>
  );
}