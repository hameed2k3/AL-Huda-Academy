"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function StudentLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/student/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to log in.");
      }

      router.push("/student/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials() {
    setEmail("amina@example.com");
    setPassword("student123");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="panel-shadow rounded-[2.5rem] border border-border bg-surface p-8 sm:p-10">
        <div className="text-center mb-8">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Student Portal
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-primary">
            Student Login
          </h1>
          <p className="mt-2 text-sm text-muted">
            Access your daily prayers, Duas, Dhikrs, and course certificates.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Student Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. amina@example.com"
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3.5 text-sm text-foreground focus:border-accent focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3.5 text-sm text-foreground focus:border-accent focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-strong transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In to Portal"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border/80">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full rounded-2xl border border-dashed border-accent/40 bg-accent/5 py-2.5 text-xs font-medium text-accent hover:bg-accent/10 transition"
          >
            Fill Demo Student Credentials (Amina Rahman)
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-xs font-medium text-muted hover:text-primary transition"
          >
            Are you an administrator? Sign in to Admin Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
