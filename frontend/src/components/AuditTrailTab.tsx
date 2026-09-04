import { useEffect, useState } from "react";
import { fetchAuditLog } from "../api";
import type { AuditLogEntry } from "../types";

export default function AuditTrailTab() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditLog()
      .then(setLogs)
      .catch(() => setError("Couldn't reach the backend. Is it running on http://localhost:4000?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
        <h2 className="font-title-md text-title-md">AI Query Audit Log</h2>
        <button className="text-secondary border border-secondary px-3 py-1.5 rounded text-sm font-medium hover:bg-surface-container-low transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">download</span> Export CSV
        </button>
      </div>

      {loading && <p className="p-4 text-on-surface-variant text-sm">Loading audit log…</p>}
      {error && <p className="p-4 text-error text-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F3F5] text-on-surface-variant text-label-sm uppercase tracking-wider">
                <th className="p-3 border-b border-outline-variant font-medium">Timestamp</th>
                <th className="p-3 border-b border-outline-variant font-medium">Query Text</th>
                <th className="p-3 border-b border-outline-variant font-medium">Matches</th>
                <th className="p-3 border-b border-outline-variant font-medium">AI Reasoning</th>
                <th className="p-3 border-b border-outline-variant font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="font-mono-data text-mono-data text-on-background">
              {logs.map((log) => {
                const matchCount = (() => {
                  try {
                    return (JSON.parse(log.matched_product_ids) as string[]).length;
                  } catch {
                    return 0;
                  }
                })();
                const isDeclined = log.status === "declined";
                return (
                  <tr
                    key={log.id}
                    className={`hover:bg-surface-container-low transition-colors border-b border-outline-variant ${
                      isDeclined ? "bg-error-container/20" : ""
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap text-on-surface-variant">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">"{log.query_text}"</td>
                    <td className="p-3">{matchCount}</td>
                    <td className="p-3">
                      <div
                        className={`p-2 rounded text-xs ${
                          isDeclined ? "bg-error-container text-on-error-container" : "bg-[#F5F7FF] text-secondary"
                        }`}
                      >
                        {log.reasoning_text}
                      </div>
                    </td>
                    <td className="p-3">
                      {isDeclined ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Declined</span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                          Success
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-on-surface-variant">
                    No queries logged yet — try a search first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
