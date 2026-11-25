"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/money";
import { useGuard, useSave } from "../SaveContext";
import { Row, StepHeader, h1, primary } from "../ui";

export default function RecommendationPage() {
  const router = useRouter();
  const s = useSave();
  const ok = useGuard("income");
  if (!ok) return null;

  return (
    <section>
      <StepHeader step={2} back="/save/setup" />
      <h1 className={h1}>Here’s what your money could do.</h1>
      <p className="mt-2 text-sm text-muted">
        Based on the figures you provided, here’s an estimate of what may be available.
      </p>

      <div className="mt-5 rounded-2xl border border-line bg-white px-4">
        <Row k="Monthly income" v={formatNaira(s.incomeKobo)} />
        <Row k="Estimated expenses" v={formatNaira(s.expensesKobo)} />
        <Row k="Estimated remaining" v={formatNaira(s.remaining)} />
      </div>

      {s.remaining === 0 ? (
        <>
          <p className="mt-5 rounded-2xl bg-brand-light p-4 text-sm">
            Your expenses are equal to or higher than your income, so your
            suggested amount is ₦0 and a deposit isn’t possible this month.
          </p>
          <Link href="/save/setup" className={`${primary} block text-center`}>
            Edit my figures
          </Link>
        </>
      ) : (
        <>
          <div className="mt-5 rounded-2xl bg-brand-light p-5">
            <p className="text-xs font-semibold tracking-wide text-brand">
              SUGGESTED STARTING SAVINGS
            </p>
            <p className="mt-1 text-[32px] font-bold">{formatNaira(s.suggested)}</p>
            <p className="text-xs text-muted">
              {s.percent}% of your estimated remaining balance
            </p>
          </div>
          <p className="mt-3 text-xs text-muted">
            This is an estimate based on the information you provided, not
            financial advice. You can change the amount.
          </p>
          <button
            onClick={() => {
              s.update({ amount: String(s.suggested / 100) });
              router.push("/save/amount");
            }}
            className={primary}
          >
            Choose Savings Amount
          </button>
        </>
      )}
    </section>
  );
}