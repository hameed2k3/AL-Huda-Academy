"use client";

import { useEffect, useState } from "react";
import type { DuaItem, CreateDuaInput, UpdateDuaInput } from "@/lib/ibadah-types";

const emptyDuaForm: CreateDuaInput = {
  title: "",
  arabicText: "",
  transliteration: "",
  translation: "",
  reference: "",
  category: "Daily Life",
  active: true,
};

export function AdminDuasClient() {
  const [duas, setDuas] = useState<DuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateDuaInput>(emptyDuaForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  async function loadDuas() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/duas", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load Duas.");
      setDuas(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading Duas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDuas();
  }, []);

  function handleOpenCreate() {
    setEditingId(null);
    setForm(emptyDuaForm);
    setIsModalOpen(true);
  }

  function handleEdit(item: DuaItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      arabicText: item.arabicText,
      transliteration: item.transliteration,
      translation: item.translation,
      reference: item.reference,
      category: item.category,
      active: item.active,
    });
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyDuaForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.arabicText) return;

    try {
      setSaving(true);
      if (editingId) {
        const res = await fetch(`/api/admin/duas/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form as UpdateDuaInput),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.message || "Failed to update Dua");
      } else {
        const res = await fetch("/api/admin/duas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.message || "Failed to create Dua");
      }
      handleCloseModal();
      await loadDuas();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save Dua.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this Dua? This will also remove any student assignments.")) return;
    try {
      const res = await fetch(`/api/admin/duas/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to delete Dua");
      await loadDuas();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete Dua.");
    }
  }

  const filteredDuas = duas.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.translation.toLowerCase().includes(q) ||
      d.reference?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* 1. Top Header & Search Bar */}
      <section className="rounded-3xl border border-border bg-surface p-4 sm:p-6 panel-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Ibadah Curriculum
              </p>
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-primary">
              Dua Repository ({duas.length})
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Manage academy Duas, Arabic texts, translations, and student assignments.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-primary-strong active:scale-95 cursor-pointer shrink-0"
          >
            <span>+ Add New Dua</span>
          </button>
        </div>

        {/* Search Strip */}
        <div className="mt-4 pt-4 border-t border-border">
          <input
            type="text"
            placeholder="Search Duas by title, category, meaning, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-primary focus:bg-surface transition"
          />
        </div>
      </section>

      {/* 2. Duas Card Grid */}
      <section className="space-y-3">
        {loading && (
          <div className="rounded-3xl border border-border bg-surface p-8 text-center text-sm text-muted">
            Loading Dua repository...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-center text-xs text-rose-700">
            {error}
          </div>
        )}

        {!loading && filteredDuas.length === 0 && (
          <div className="rounded-3xl border border-border bg-surface p-8 text-center text-sm text-muted">
            No Duas found matching your query.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="rounded-3xl border border-border bg-surface p-5 panel-shadow hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {dua.category}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      dua.active
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-surface-muted text-muted"
                    }`}
                  >
                    {dua.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-primary mt-2">
                  {dua.title}
                </h3>

                {/* Arabic Card */}
                <div className="my-3 rounded-2xl bg-amber-50/50 border border-amber-200/40 p-4 text-right">
                  <p className="font-arabic text-lg sm:text-2xl leading-loose text-primary-strong">
                    {dua.arabicText}
                  </p>
                </div>

                {dua.transliteration && (
                  <p className="text-xs text-foreground/85 italic mb-1.5">
                    "{dua.transliteration}"
                  </p>
                )}

                <p className="text-xs text-muted leading-relaxed">
                  {dua.translation}
                </p>

                {dua.reference && (
                  <p className="mt-2 text-[11px] font-semibold text-accent">
                    Ref: {dua.reference}
                  </p>
                )}
              </div>

              {/* Card Action Buttons */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(dua)}
                  className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(dua.id)}
                  className="rounded-full border border-rose-200 px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Edit / Create Modal with Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-5 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  {editingId ? "Modify Existing Item" : "Create New Item"}
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-primary">
                  {editingId ? `Edit: ${form.title || "Dua"}` : "Add New Dua to Repository"}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">
                    Dua Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Dua for Parents"
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs sm:text-sm focus:border-primary focus:bg-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Family, Daily Life, Bedtime"
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs sm:text-sm focus:border-primary focus:bg-surface outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">
                  Arabic Text *
                </label>
                <textarea
                  required
                  dir="rtl"
                  rows={3}
                  value={form.arabicText}
                  onChange={(e) => setForm({ ...form, arabicText: e.target.value })}
                  placeholder="رَّبِّ ارْحَمْهُمَا..."
                  className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-lg sm:text-xl font-arabic leading-relaxed text-right focus:border-primary focus:bg-surface outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">
                    Transliteration / Pronunciation
                  </label>
                  <textarea
                    rows={2}
                    value={form.transliteration}
                    onChange={(e) => setForm({ ...form, transliteration: e.target.value })}
                    placeholder="e.g. Rabbir-hamhuma kama..."
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs focus:border-primary focus:bg-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">
                    English Translation
                  </label>
                  <textarea
                    rows={2}
                    value={form.translation}
                    onChange={(e) => setForm({ ...form, translation: e.target.value })}
                    placeholder="e.g. My Lord, have mercy upon them..."
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs focus:border-primary focus:bg-surface outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 items-center">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">
                    Reference / Source
                  </label>
                  <input
                    type="text"
                    value={form.reference}
                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                    placeholder="e.g. Surah Al-Isra (17:24)"
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs sm:text-sm focus:border-primary focus:bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    Active (visible for student assignments)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-primary px-6 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-primary-strong disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving Changes..." : editingId ? "Save Changes" : "Create Dua"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
