import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[480px] px-6 py-10">
      <Image src="/logo.png" alt="SaveWise" width={160} height={80} priority />
      <h1 className="mt-6 text-[26px] font-bold leading-tight">
        Forgot your password?
      </h1>
      <p className="mt-2 text-sm text-muted">
        Password reset isn’t available in this demo yet. For now, you can
        create a new account to try SaveWise.
      </p>
      <Link
        href="/login"
        className="mt-8 block rounded-xl bg-brand py-3.5 text-center font-semibold text-white"
      >
        Back to Login
      </Link>
      <Link
        href="/signup"
        className="mt-3 block rounded-xl border border-line py-3.5 text-center font-semibold text-brand"
      >
        Create an account
      </Link>
    </main>
  );
}