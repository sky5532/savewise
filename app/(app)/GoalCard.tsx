import { formatNaira } from "@/lib/money";
import type { Goal } from "@/lib/savings";

export default function GoalCard({ goal }: { goal: Goal }) {
  const pct =
    goal.targetKobo > 0
      ? Math.min(100, Math.round((goal.savedKobo / goal.targetKobo) * 100))
      : 0;

  return (
    <div className="mt-3 rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{goal.name}</p>
        <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand">
          {pct >= 100 ? "Reached" : "Active"}
        </span>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-pale"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${goal.name} progress`}
      >
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted">
        {pct}% complete · {formatNaira(goal.savedKobo)} saved of{" "}
        {formatNaira(goal.targetKobo)}
      </p>
    </div>
  );
}