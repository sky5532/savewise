"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toNumber, useSave } from "../SaveContext";
import { ErrorText, MoneyInput, StepHeader, focusField, h1, primary } from "../ui";

export default function SetupPage() {
  const router = useRouter();
  const s = useSave();
  const [error, setError] = useState("");

  // Starting a new flow after a finished one clears the old draft.
  useEffect(() => {
    if (s.ready && s.done) s.reset();
  }, [s.ready, s.done, s.reset]);

  function next() {
    if (!(toNumber(s.income) > 0)) {
      setError("Enter your monthly income as an amount above ₦0.");
      return focusField("income");
    }
    if (s.expenses.trim() === "" || !(toNumber(s.expenses) >= 0)) {
      setError("Enter your estimated monthly expenses (₦0 or more).");
      return focusField("expenses");
    }
    router.push("/save/recommendation");
  }

  if (!s.ready) return null;

  return (
    <section>
      <StepHeader step={1} back="/home" />
      <h1 className={h1}>Let’s understand your finances.</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your monthly income and estimated expenses to see what you may be
        able to set aside.
      </p>

      <label htmlFor="income" className="mt-6 block text-xs font-medium">
        Monthly income
      </label>
      <MoneyInput id="income" value={s.income} onChange={(v) => s.update({ income: v })} />
      <p className="mt-1 text-xs text-muted">Your total income in a typical month.</p>

      <label htmlFor="expenses" className="mt-4 block text-xs font-medium">
        Estimated monthly expenses
      </label>
      <MoneyInput id="expenses" value={s.expenses} onChange={(v) => s.update({ expenses: v })} />
      <p className="mt-1 text-xs text-muted">Include your usual monthly expenses.</p>

      <ErrorText message={error} />
      <button onClick={next} className={primary}>
        Continue
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Your figures are used to generate an estimate.
      </p>
    </section>
  );
}