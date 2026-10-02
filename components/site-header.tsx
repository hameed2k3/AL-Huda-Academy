"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, PhoneCall } from "lucide-react";
import { academy, navItems } from "@/lib/site-data";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="container-shell flex h-[4.5rem] items-center justify-between gap-4 py-4">
        {/* Brand Logo */}
        <Link href="/" className="min-w-0 flex flex-col">
          <span className="font-display text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
            {academy.shortName}
          </span>
          <span className="-mt-1 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-muted font-medium">
            Quran Academy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/90 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-primary/25 px-4 py-2 text-xs sm:text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Portal Login
          </Link>
          <a
            href={academy.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/login"
            className="rounded-full border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
          >
            Login
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-border text-foreground hover:bg-surface-muted transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[4.5rem] z-50 bg-background/98 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container-shell py-6 flex flex-col h-[calc(100vh-4.5rem)] justify-between overflow-y-auto">
            <nav className="flex flex-col space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-2">
                Navigation
              </p>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-base font-semibold text-foreground hover:bg-surface hover:text-primary transition-all border border-transparent hover:border-border/60"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted" />
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-border flex flex-col gap-3 pb-8">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-2xl border border-primary/30 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Student & Admin Login
              </Link>
              <a
                href={academy.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-strong"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

