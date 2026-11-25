"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatNaira } from "@/lib/money";
import { recordDeposit } from "@/lib/savings";
import { useGuard, useSave } from "../SaveContext";
import { Row, StepHeader, ghost, h1, primary } from "../ui";

export default function ConfirmPage() {
  const router = useRouter();
  const s = useSave();
  const ok = useGuard("goal");
  const [busy, setBusy] = useState(false);

  // If this deposit was already recorded, never record it twice.
  useEffect(() => {
    if (s.done) router.replace("/save/success");
  }, [s.done, router]);

  if (!ok) return null;

  function confirm() {
    if (busy) return;
    setBusy(true);
    const balance = recordDeposit({
      goal: s.goal,
      targetKobo: s.remaining,
      amountKobo: s.amountKobo,
    });
    s.update({ done: true, balance });
    router.push("/save/success");
  }

  return (
    <section>
      <StepHeader step={6} back="/save/review" />
      <h1 className={h1}>Ready to make your saving count?</h1>
      <p className="mt-2 text-sm text-muted">Review your savings plan before confirming.</p>

      <p className="mt-5 text-[32px] font-bold">{formatNaira(s.amountKobo)}</p>
      <div className="mt-2 rounded-2xl border border-line bg-white px-4">
        <Row k="Savings goal" v={s.goal} />
        <Row k="Deposit type" v="Simulated deposit" />
      </div>
      <p className="mt-3 text-xs text-muted">
        This is a demonstration. No real money will be transferred or deducted
        from your bank account.
      </p>

      <button onClick={confirm} disabled={busy} className={`${primary} disabled:opacity-60`}>
        Confirm Demo Deposit
      </button>
      <Link href="/save/review" className={`${ghost} block text-center`}>
        Cancel
      </Link>
      <p className="mt-3 text-center text-xs text-muted">
        Tapping confirm records this demo savings action once.
      </p>
    </section>
  );
}