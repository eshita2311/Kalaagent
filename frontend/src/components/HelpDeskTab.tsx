import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  timestamp: string;
}

export default function HelpDeskTab() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadTickets() {
    if (!token) return;
    fetch(`${API_URL}/api/help-tickets`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []))
      .catch(() => setError("Couldn't reach the backend."));
  }

  useEffect(loadTickets, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !subject.trim() || !message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/help-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject, message }),
      });
      if (!res.ok) throw new Error("Failed to submit ticket");
      setSubject("");
      setMessage("");
      setSubmitted(true);
      loadTickets();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError("Couldn't reach the backend. Is it running on http://localhost:4000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-display-lg text-headline-lg mb-6">{t("help.title")}</h2>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm mb-8 space-y-4">
        <div>
          <label className="block text-sm text-on-surface-variant mb-1">{t("help.subject")}</label>
          <input
            className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:border-secondary outline-none"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-on-surface-variant mb-1">{t("help.message")}</label>
          <textarea
            className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:border-secondary outline-none min-h-[100px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        {submitted && <p className="text-green-700 text-sm">{t("help.submitted")}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {t("help.submit")}
        </button>
      </form>

      {tickets.length > 0 && (
        <div>
          <h3 className="font-title-md text-title-md mb-3">{t("help.pastTickets")}</h3>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-on-background text-sm">{ticket.subject}</h4>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      ticket.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm mb-1">{ticket.message}</p>
                <p className="text-on-surface-variant text-xs">{new Date(ticket.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
