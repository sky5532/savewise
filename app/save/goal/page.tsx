"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGuard, useSave } from "../SaveContext";
import { ErrorText, StepHeader, focusField, h1, primary } from "../ui";

const GOALS = ["Emergency Fund", "Rent", "Education", "A big purchase"];

export default function GoalPage() {
  const router = useRouter();
  const s = useSave();
  const ok = useGuard("amount");
  const [error, setError] = useState("");
  if (!ok) return null;

  function next() {
    if (!s.goal) {
      setError("Choose a goal or create your own.");
      return focusField("custom");
    }
    router.push("/save/review");
  }

  return (
    <section>
      <StepHeader step={4} back="/save/amount" />
      <h1 className={h1}>What are you saving for?</h1>
      <p className="mt-2 text-sm text-muted">
        Give your savings a purpose. Choose a goal or add your own.
      </p>

      <div className="mt-4">
        {GOALS.map((g) => {
          const on = s.picked === g && !s.custom.trim();
          return (
            <button
              key={g}
              type="button"
              aria-pressed={on}
              onClick={() => s.update({ picked: g, custom: "" })}
              className={`mt-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                on ? "border-brand bg-brand-light" : "border-line bg-white"
              }`}
            >
              {g}
              <span>{on ? "●" : "○"}</span>
            </button>
          );
        })}
      </div>

      <label htmlFor="custom" className="mt-5 block text-xs font-medium">
        Or create a custom goal
      </label>
      <input
        id="custom"
        value={s.custom}
        onChange={(e) => s.update({ custom: e.target.value })}
        maxLength={40}
        placeholder="e.g. New laptop"
        className="mt-1.5 w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-sm outline-none focus:border-brand"
      />
      <ErrorText message={error} />
      <button onClick={next} className={primary}>
        Continue
      </button>
    </section>
  );
}