"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { apiRequest, ApiError } from "@/lib/api";
import { saveSession, type LoginResponse } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: "Enter a valid email address." });
      emailRef.current?.focus();
      return;
    }
    if (password.length < 8) {
      setErrors({ password: "Your password must be at least 8 characters." });
      passwordRef.current?.focus();
      return;
    }

    setErrors({});
    setFormError("");
    setLoading(true);
    try {
      const res = await apiRequest<LoginResponse>("/api/v1/auth/login", {
        method: "POST",
        body: { email, password },
      });
      saveSession(res.data);
      router.push("/home");
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-sm outline-none focus:border-brand";

  return (
    <main className="mx-auto min-h-screen max-w-[480px] px-6 py-10">
      <Image src="/logo.png" alt="SaveWise" width={160} height={80} priority />
      <h1 className="mt-6 text-[26px] font-bold leading-tight">Welcome Back!</h1>
      <p className="mt-1 text-sm text-muted">
        Log in to continue your saving habits.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <label htmlFor="email" className="text-xs font-medium">
          Email
        </label>
        <input
          id="email"
          ref={emailRef}
          type="email"
          placeholder="@gmail.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={`${inputClass} mt-1.5`}
        />
        {errors.email && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.email}
          </p>
        )}

        <label htmlFor="password" className="mt-4 block text-xs font-medium">
          Password
        </label>
        <input
          id="password"
          ref={passwordRef}
          type="password"
          placeholder="Must contain at least 8 characters"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className={`${inputClass} mt-1.5`}
        />
        {errors.password && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.password}
          </p>
        )}

        <Link
          href="/forgot-password"
          className="mt-3 block text-right text-xs font-medium text-brand"
        >
          Forgot Password?
        </Link>

        {formError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-brand py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Don’t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand">
          Create one
        </Link>
      </p>
      <p className="mt-6 text-center text-xs text-muted">
        Demo wallet only. No real money transfers.
      </p>
    </main>
  );
}