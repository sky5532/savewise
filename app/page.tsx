import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[480px] flex-col justify-center px-6">
      <Image
        src="/logo.png"
        alt="SaveWise"
        width={240}
        height={120}
        priority
        className="mx-auto"
      />
      <h1 className="mt-6 text-[26px] font-bold leading-tight">
        Make saving feel achievable.
      </h1>
      <p className="mt-2 text-sm text-muted">
        Understand what may be left after your expenses, choose an amount to
        save and track your progress.
      </p>
      <Link
        href="/signup"
        className="mt-8 block rounded-xl bg-brand py-3.5 text-center font-semibold text-white"
      >
        Get Started
      </Link>
      <Link
        href="/login"
        className="mt-3 block rounded-xl border border-line py-3.5 text-center font-semibold text-brand"
      >
        I already have an account
      </Link>
      <p className="mt-4 text-center text-xs text-muted">
        Demo wallet only. No real money transfers.
      </p>
    </main>
  );
}