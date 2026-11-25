"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest, ApiError } from "@/lib/api";

type FieldId = "fullName" | "email" | "password" | "confirm";
type Errors = Partial<Record<FieldId, string>>;

const FIELDS: {
  id: FieldId;
  label: string;
  type: string;
  placeholder: string;
  auto: string;
}[] = [
  { id: "fullName", label: "Full Name", type: "text", placeholder: "e.g Jane Doe", auto: "name" },
  { id: "email", label: "Email", type: "email", placeholder: "@gmail.com", auto: "email" },
  { id: "password", label: "Password", type: "password", placeholder: "Must contain at least 8 characters", auto: "new-password" },
  { id: "confirm", label: "Confirm Password", type: "password", placeholder: "Repeat your password", auto: "new-password" },
];

export default function SignupPage() {
  const router = useRouter();
  const [values, setValues] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.id]: e.target.value });
  }

  function validate(): Errors {
    const found: Errors = {};
    const parts = values.fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) found.fullName = "Enter your first and last name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) found.email = "Enter a valid email address.";
    if (values.password.length < 8) found.password = "Your password must be at least 8 characters.";
    if (values.confirm !== values.password) found.confirm = "Passwords don’t match.";
    return found;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate();
    const firstBad = FIELDS.find((f) => found[f.id]);
    if (firstBad) {
      setErrors(found);
      document.getElementById(firstBad.id)?.focus();
      return;
    }

    setErrors({});
    setFormError("");
    setLoading(true);

    const parts = values.fullName.trim().split(/\s+/);
    try {
      const data = await apiRequest("/api/v1/auth/register", {
        method: "POST",
        body: {
          firstName: parts[0],
          lastName: parts.slice(1).join(" "),
          email: values.email.trim(),
          password: values.password,
        },
      });
      console.log("Register response:", data);
      router.push("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldMap: Record<string, FieldId> = {
          email: "email",
          password: "password",
          firstName: "fullName",
          lastName: "fullName",
        };
        const fromServer: Errors = {};
        err.errors.forEach((x) => {
          const key = fieldMap[x.field];
          if (key && !fromServer[key]) fromServer[key] = x.message;
        });
        if (Object.keys(fromServer).length) setErrors(fromServer);
        else setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-[480px] px-6 py-10">
      <Image src="/logo.png" alt="SaveWise" width={160} height={80} priority />
      <h1 className="mt-6 text-[26px] font-bold leading-tight">Let’s Get You Started</h1>
      <p className="mt-1 text-sm text-muted">
        Create an account to keep track of your savings journey.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        {FIELDS.map((f) => (
          <div key={f.id} className="mb-4">
            <label htmlFor={f.id} className="text-xs font-medium">
              {f.label}
            </label>
            <input
              id={f.id}
              type={f.type}
              value={values[f.id]}
              onChange={handleChange}
              placeholder={f.placeholder}
              autoComplete={f.auto}
              aria-invalid={!!errors[f.id]}
              className="mt-1.5 w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-sm outline-none focus:border-brand"
            />
            {errors[f.id] && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors[f.id]}
              </p>
            )}
          </div>
        ))}

        {formError && (
          <p role="alert" className="text-sm text-red-600">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-brand py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand">
          Login
        </Link>
      </p>
      <p className="mt-6 text-center text-xs text-muted">
        Demo wallet only. No real money transfers.
      </p>
    </main>
  );
}