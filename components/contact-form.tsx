"use client";

import { FormEvent, useState, useTransition } from "react";

const initialState = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    startTransition(async () => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { message: string };
      setStatus(payload.message);

      if (response.ok) {
        setForm(initialState);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel-shadow space-y-5 rounded-[2rem] border border-border bg-surface p-8"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">
          Full name
        </label>
        <input
          required
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">
          Email address
        </label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">
          Message
        </label>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-primary-strong disabled:opacity-70"
      >
        {isPending ? "Sending" : "Send inquiry"}
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
