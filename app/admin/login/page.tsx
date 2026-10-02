import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Login | Al-Huda Quran Academy",
  description: "Secure administrator access portal for Al-Huda Quran Academy.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const error = params.error === "invalid" ? "Invalid email or password. Please try again." : null;
  const next = params.next ?? "/admin/dashboard";

  return (
    <div className="min-h-screen flex font-poppins">
      {/* ── Left: Branding Panel ────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
        style={{ background: "#0f5132" }}
      >
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(201,162,39,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top: Logo mark */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(201,162,39,0.18)", color: "#c9a227" }}
            >
              ★
            </div>
            <div>
              <p className="font-montserrat font-black text-white text-lg tracking-wide">
                AL-HUDA
              </p>
              <p
                className="font-montserrat font-semibold text-xs tracking-[0.22em] uppercase"
                style={{ color: "#c9a227" }}
              >
                Quran Academy
              </p>
            </div>
          </div>
        </div>

        {/* Middle: hero text */}
        <div className="relative z-10 space-y-6">
          {/* Gold divider line */}
          <div
            className="w-12 h-1 rounded-full"
            style={{ background: "#c9a227" }}
          />
          <h1 className="font-montserrat font-black text-white text-3xl xl:text-4xl leading-tight">
            Academy
            <br />
            Administration
            <br />
            <span style={{ color: "#c9a227" }}>Portal</span>
          </h1>
          <p className="text-sm leading-7 text-white/60 max-w-xs font-poppins">
            Manage students, courses, certificates, and daily Ibadah trackers from a single secure dashboard.
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3 text-xs text-white/70 font-poppins">
            {[
              "Student enrolment & progress tracking",
              "Duas & Dhikrs assignment management",
              "Certificate generation & verification",
              "Course catalog administration",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span style={{ color: "#c9a227" }} className="mt-0.5 text-sm leading-none">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: version */}
        <div className="relative z-10">
          <p className="text-[11px] text-white/30 font-montserrat tracking-wider">
            AL-HUDA ADMIN v2.0 · SECURE ACCESS
          </p>
        </div>
      </div>

      {/* ── Right: Login Form Panel ─────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-12 bg-white">
        {/* Mobile logo (hidden on lg+) */}
        <div className="lg:hidden mb-8 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-3"
            style={{ background: "#0f5132", color: "#c9a227" }}
          >
            ★
          </div>
          <p className="font-montserrat font-black text-lg tracking-wide" style={{ color: "#0f5132" }}>
            AL-HUDA ACADEMY
          </p>
        </div>

        <div className="w-full max-w-sm">
          {/* Form header */}
          <div className="mb-8">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.25em] font-montserrat mb-3"
              style={{ color: "#c9a227" }}
            >
              Secure Login
            </p>
            <h2 className="font-montserrat font-black text-2xl text-slate-900">
              Administrator Access
            </h2>
            <p className="mt-2 text-xs text-slate-500 font-poppins">
              This portal is restricted to authorised academy staff only.
            </p>
          </div>

          {/* Login form */}
          <form
            action={`/api/admin/auth/login?next=${encodeURIComponent(next)}`}
            method="post"
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-bold uppercase tracking-[0.18em] font-montserrat mb-1.5"
                style={{ color: "#0f5132" }}
              >
                Email Address
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@alhuda.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0f5132] focus:ring-1 focus:ring-[#0f5132] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-bold uppercase tracking-[0.18em] font-montserrat mb-1.5"
                style={{ color: "#0f5132" }}
              >
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0f5132] focus:ring-1 focus:ring-[#0f5132] transition-colors"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 font-poppins">
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 px-6 rounded-lg text-white text-xs font-bold font-montserrat uppercase tracking-[0.14em] transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
              style={{ background: "#0f5132" }}
            >
              Sign In to Admin Portal
            </button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-700 font-poppins transition-colors"
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
