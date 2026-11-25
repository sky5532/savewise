"use client";

import Link from "next/link";

export const h1 = "mt-1 text-[26px] font-bold leading-tight";
export const primary = "mt-6 w-full rounded-xl bg-brand py-3.5 font-semibold text-white";
export const ghost = "mt-3 w-full rounded-xl border border-line py-3.5 font-semibold text-brand";

export const focusField = (id: string) => document.getElementById(id)?.focus();

export function StepHeader({ step, back }: { step: number; back: string }) {
  return (
    <>
      <Link href={back} className="mb-3 block text-sm font-medium text-brand">
        ← Back
      </Link>
      <p className="text-xs font-semibold tracking-wide text-brand">STEP {step} OF 6</p>
    </>
  );
}

export function MoneyInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-1.5 flex items-center rounded-[10px] border border-line bg-white px-3.5 focus-within:border-brand">
      <span className="text-muted">₦</span>
      <input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full bg-transparent px-2 py-3 text-sm outline-none"
      />
    </div>
  );
}

export function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-line py-2.5 text-sm last:border-0">
      <span className="text-muted">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

export function ErrorText({ message }: { message: string }) {
  return message ? (
    <p role="alert" className="mt-2 text-xs text-red-600">
      {message}
    </p>
  ) : null;
}