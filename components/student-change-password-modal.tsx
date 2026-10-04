"use client";

import { useState } from "react";

export function StudentChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function resetState() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
    setIsOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/student/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      setSuccess("Password changed successfully! Keep your new password safe.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error changing password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setSuccess(null);
          setIsOpen(true);
        }}
        className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white cursor-pointer inline-flex items-center gap-1.5"
      >
        <span>🔐</span>
        <span>Change Password</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 sm:p-8 panel-shadow relative">
            <button
              type="button"
              onClick={resetState}
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-surface-muted border border-border flex items-center justify-center text-xs text-muted hover:text-foreground transition"
            >
              ✕
            </button>

            <div className="mb-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                <span>🔐 Security</span>
              </div>
              <h3 className="font-display text-xl font-bold text-primary">
                Change Your Password
              </h3>
              <p className="text-xs text-muted mt-1">
                Enter your current (old) password followed by your new password to update your login credentials.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">
                  Current (Old) Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:bg-surface focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">
                  New Password * (Min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:bg-surface focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:bg-surface focus:outline-none transition"
                />
              </div>

              <div className="mt-6 flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-primary py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-strong transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={resetState}
                  className="rounded-full border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-medium text-muted hover:text-foreground transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
