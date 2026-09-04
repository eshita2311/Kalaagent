import { useState } from "react";
import { useAuth } from "../AuthContext";
import type { TabId } from "../types";

interface LoginTabProps {
  onSuccess: (nextTab: TabId) => void;
}

export default function LoginTab({ onSuccess }: LoginTabProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onSuccess("search");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="font-display-lg text-headline-lg mb-6 text-center">
        {mode === "login" ? "Log in" : "Create an account"}
      </h2>

      <div className="flex mb-6 border border-outline-variant rounded-full p-1">
        <button
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${
            mode === "login" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant"
          }`}
          onClick={() => setMode("login")}
        >
          Log in
        </button>
        <button
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${
            mode === "register" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant"
          }`}
          onClick={() => setMode("register")}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-sm text-on-surface-variant mb-1">Name</label>
            <input
              className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:border-secondary outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm text-on-surface-variant mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:border-secondary outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-on-surface-variant mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:border-secondary outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-container text-on-primary-container py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
