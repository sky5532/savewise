"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/money";
import { useGuard, useSave } from "../SaveContext";
import { Row, StepHeader, h1, primary } from "../ui";

export default function ReviewPage() {
  const router = useRouter();
  const s = useSave();
  const ok = useGuard("goal");
  if (!ok) return null;

  return (
    <section>
      <StepHeader step={5} back="/save/goal" />
      <h1 className={h1}>Review your savings decision</h1>
      <p className="mt-2 text-sm text-muted">
        Take a moment to check the details before confirming.
      </p>

      <div className="mt-5 rounded-2xl border border-line bg-white px-4">
        <Row k="Monthly income" v={formatNaira(s.incomeKobo)} />
        <Row k="Estimated expenses" v={formatNaira(s.expensesKobo)} />
        <Row k="Savings amount" v={formatNaira(s.amountKobo)} />
        <Row k="Savings goal" v={s.goal} />
        <Row k="Remaining after saving" v={formatNaira(s.remaining - s.amountKobo)} />
      </div>
      <p className="mt-3 text-xs text-muted">
        Your savings action will be simulated in this demo. No real money will move.
      </p>

      <button onClick={() => router.push("/save/confirm")} className={primary}>
        Continue
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        You can{" "}
        <Link href="/save/amount" className="font-semibold text-brand">
          go back to change your savings amount
        </Link>
        .
      </p>
    </section>
  );
}