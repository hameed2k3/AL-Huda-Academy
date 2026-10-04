"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function StudentLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "reset">("login");
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset form state
  const [resetEmail, setResetEmail] = useState("");
  const [verification, setVerification] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/student/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          verificationCodeOrPhone: verification,
          newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess("Password reset successfully! You can now sign in with your new password.");
      setEmail(resetEmail);
      setPassword(newPassword);
      setMode("login");
      setResetEmail("");
      setVerification("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials() {
    setEmail("amina@example.com");
    setPassword("student123");
    setError(null);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="panel-shadow rounded-[2.5rem] border border-border bg-surface p-8 sm:p-10">
        <div className="text-center mb-8">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Student Portal
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-primary">
            {mode === "login" ? "Student Login" : "Reset Password"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login"
              ? "Access your daily prayers, Duas, Dhikrs, and course certificates."
              : "Verify your student record to create a new login password."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {success}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3.5 text-sm text-foreground focus:border-accent focus:bg-surface focus:outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSuccess(null);
                    setResetEmail(email);
                    setMode("reset");
                  }}
                  className="text-xs font-medium text-accent hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3.5 text-sm text-foreground focus:border-accent focus:bg-surface focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-strong transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In to Portal"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Registered Student Email *
              </label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="e.g. amina@example.com"
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground focus:border-accent focus:bg-surface focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Registered Phone or Guardian Name *
              </label>
              <input
                type="text"
                required
                value={verification}
                onChange={(e) => setVerification(e.target.value)}
                placeholder="e.g. +91 9000000001 or Guardian Name"
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground focus:border-accent focus:bg-surface focus:outline-none transition"
              />
              <p className="mt-1 text-[11px] text-muted">
                Used to verify student identity before resetting credentials.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                New Password * (Min 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground focus:border-accent focus:bg-surface focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground focus:border-accent focus:bg-surface focus:outline-none transition"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-strong transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Resetting..." : "Save New Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode("login");
                }}
                className="rounded-full border border-border bg-surface px-4 py-3 text-xs font-medium text-muted hover:text-foreground transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-border/80">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full rounded-2xl border border-dashed border-accent/40 bg-accent/5 py-2.5 text-xs font-medium text-accent hover:bg-accent/10 transition cursor-pointer"
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
