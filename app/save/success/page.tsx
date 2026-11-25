"use client";

import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/money";
import { useGuard, useSave } from "../SaveContext";
import { Row, h1, primary } from "../ui";

export default function SuccessPage() {
  const router = useRouter();
  const s = useSave();
  const ok = useGuard("goal");
  if (!ok) return null;

  return (
    <section className="pt-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-3xl text-white">
        ✓
      </div>
      <h1 className={`${h1} mt-5`}>You’re off to a great start!</h1>
      <p className="mt-2 text-sm text-muted">Your demo savings action has been recorded.</p>

      <p className="mt-5 text-[32px] font-bold">{formatNaira(s.amountKobo)}</p>
      <div className="mt-3 rounded-2xl border border-line bg-white px-4 text-left">
        <Row k="Goal" v={s.goal} />
        <Row k="Demo wallet balance" v={formatNaira(s.balance)} />
      </div>

      <button onClick={() => router.push("/home")} className={primary}>
        View Demo Wallet
      </button>
      <p className="mt-4 text-xs text-muted">Demo wallet only. No real money transfers.</p>
    </section>
  );
}