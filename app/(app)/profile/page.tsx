"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";
import { useUser } from "@/lib/useUser";

const SETTINGS = [
  "Personal information",
  "Login & security",
  "Preferences",
  "Notifications",
];

export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();
  if (!user) return null;

  const { firstName, lastName } = user.profile;
  const initials = (firstName[0] + (lastName[0] ?? "")).toUpperCase();

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <main className="mx-auto max-w-[480px] px-6 py-8">
      <h1 className="text-[26px] font-bold leading-tight">Profile</h1>

      <div className="mt-6 flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-lg font-bold text-white"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">
            {firstName} {lastName}
          </p>
          <p className="truncate text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-brand-light p-4 text-sm">
        Your savings rule: {user.settings.targetSavingsPercentage}% of what’s left
        after expenses. Currency: {user.settings.currency}.
      </div>

      <h2 className="mt-8 text-base font-semibold">Account Settings</h2>
      <div className="mt-3 rounded-2xl border border-line bg-white px-4">
        {SETTINGS.map((s) => (
          <div
            key={s}
            aria-disabled="true"
            className="flex items-center justify-between border-b border-line py-3.5 text-sm last:border-0"
          >
            <span>{s}</span>
            <span className="text-xs text-muted">Coming soon</span>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-base font-semibold">About SaveWise</h2>
      <p className="mt-2 text-sm text-muted">
        SaveWise is a savings planning demo. No real money is transferred or stored.
      </p>

      <button
        onClick={logout}
        className="mt-8 w-full rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600"
      >
        Log Out
      </button>
    </main>
  );
}