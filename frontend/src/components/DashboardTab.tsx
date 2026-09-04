import { useEffect, useState } from "react";
import { fetchStats } from "../api";
import type { Stats } from "../types";

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm">
      <p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-headline-lg font-headline-lg font-bold ${accent ? "text-primary" : "text-on-background"}`}>
        {value}
      </p>
    </div>
  );
}

export default function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => setError("Couldn't reach the backend. Is it running on http://localhost:4000?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-on-surface-variant text-sm">Loading dashboard…</p>;
  if (error) return <p className="text-error text-sm">{error}</p>;
  if (!stats) return null;

  return (
    <div>
      <h2 className="font-display-lg text-headline-lg mb-6">Agent Performance Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Queries" value={stats.total_queries.toLocaleString("en-IN")} />
        <StatCard label="Match Rate" value={`${stats.match_rate}%`} accent />
        <StatCard label="Declined" value={stats.declined_count.toLocaleString("en-IN")} />
        <StatCard
          label="Revenue (Test Mode)"
          value={`₹${stats.total_revenue_test_mode.toLocaleString("en-IN")}`}
          accent
        />
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
        <h3 className="font-title-md text-title-md mb-4">Order Funnel</h3>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-on-surface-variant">Matched Queries</span>
          <span className="font-bold text-on-background">{stats.matched_count}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-on-surface-variant">Orders Created</span>
          <span className="font-bold text-on-background">{stats.total_orders}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant">Orders Paid</span>
          <span className="font-bold text-on-background">{stats.paid_orders}</span>
        </div>
      </div>

      <p className="text-on-surface-variant text-xs mt-6">
        Every number above is computed live from the audit log — nothing here is hardcoded.
      </p>
    </div>
  );
}
