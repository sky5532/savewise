"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatNaira } from "@/lib/money";
import { toNumber, useGuard, useSave } from "../SaveContext";
import { ErrorText, MoneyInput, Row, StepHeader, focusField, h1, primary } from "../ui";

export default function AmountPage() {
  const router = useRouter();
  const s = useSave();
  const ok = useGuard("income");
  const [error, setError] = useState("");
  if (!ok) return null;

  function next() {
    if (!(toNumber(s.amount) > 0)) {
      setError("Enter an amount above ₦0 to continue.");
      return focusField("amount");
    }
    if (s.amountKobo > s.remaining) {
      setError(
        `Your savings amount can’t be more than your estimated remaining balance of ${formatNaira(s.remaining)}.`
      );
      return focusField("amount");
    }
    router.push("/save/goal");
  }

  const amountKobo = s.amountKobo || 0;

  return (
    <section>
      <StepHeader step={3} back="/save/recommendation" />
      <h1 className={h1}>How much would you like to save?</h1>
      <p className="mt-2 text-sm text-muted">
        Choose an amount that works for you. You can adjust it to suit your needs.
      </p>

      <label htmlFor="amount" className="mt-6 block text-xs font-semibold tracking-wide">
        SAVINGS AMOUNT
      </label>
      <MoneyInput id="amount" value={s.amount} onChange={(v) => s.update({ amount: v })} />
      <ErrorText message={error} />
      <button
        onClick={() => s.update({ amount: String(s.suggested / 100) })}
        className="mt-2 text-sm font-medium text-brand"
      >
        Use suggested
      </button>

      <div className="mt-4 rounded-2xl border border-line bg-white px-4">
        <Row k="Estimated remaining" v={formatNaira(s.remaining)} />
        <Row k="Amount to save" v={formatNaira(amountKobo)} />
        <Row k="Left after saving" v={formatNaira(Math.max(0, s.remaining - amountKobo))} />
      </div>

      <button onClick={next} className={primary}>
        Continue
      </button>
    </section>
  );
}