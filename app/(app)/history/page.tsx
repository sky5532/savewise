"use client";

import { useEffect, useState } from "react";
import { formatNaira } from "@/lib/money";
import { getDeposits, type Deposit } from "@/lib/savings";
import { useUser } from "@/lib/useUser";

export default function HistoryPage() {
  const user = useUser();
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
    setDeposits(getDeposits());
  }, []);

  if (!user) return null;
  const total = deposits.reduce((sum, d) => sum + d.amountKobo, 0);

  return (
    <main className="mx-auto max-w-[480px] px-6 py-8">
      <h1 className="text-[26px] font-bold leading-tight">Recent Activity</h1>
      <p className="mt-1 text-sm text-muted">Keep track of your savings activity</p>

      <div className="mt-6 rounded-2xl bg-brand p-5 text-white">
        <p className="text-xs font-medium tracking-wide opacity-80">TOTAL SAVED</p>
        <p className="mt-1 text-[32px] font-bold">{formatNaira(total)}</p>
        <p className="text-xs opacity-80">All deposits</p>
      </div>

      <h2 className="mt-8 text-base font-semibold">Transaction History</h2>
      {deposits.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-line bg-white p-6 text-center">
          <p className="text-sm font-medium">Nothing here yet</p>
          <p className="mt-1 text-xs text-muted">
            Your savings activity will appear here once you make your first deposit.
          </p>
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-line bg-white px-4">
          {deposits.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between border-b border-line py-3 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold">{d.goal}</p>
                <p className="text-xs text-muted">
                  {new Date(d.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="text-sm font-semibold text-success">
                + {formatNaira(d.amountKobo)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}