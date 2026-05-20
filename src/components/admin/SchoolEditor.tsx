"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { School } from "@/lib/schools";

type Mode = "create" | "edit";

const BLANK: Omit<School, "id"> = {
  name: "",
  short: "",
  tagline: "",
  brand: "#1B4332",
  brandDeep: "#0F2D1F",
  brandSoft: "#E3EFE8",
  active: false, // start hidden — admin flips on once permission is on file
};

export function SchoolEditor({ initial }: { initial: School[] }) {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("create");
  const [form, setForm] = useState<Omit<School, "id"> & { id?: string }>({ ...BLANK });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  function startCreate() {
    setMode("create");
    setEditingId(null);
    setForm({ ...BLANK });
    setErr(null);
    setOkMsg(null);
  }
  function startEdit(s: School) {
    setMode("edit");
    setEditingId(s.id);
    setForm({ ...s });
    setErr(null);
    setOkMsg(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setOkMsg(null);
    try {
      const url = mode === "edit" ? `/api/admin/schools/${editingId}` : "/api/admin/schools";
      const method = mode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const fieldErrors = data?.details?.fieldErrors as Record<string, string[]> | undefined;
        const first = fieldErrors ? Object.values(fieldErrors).flat()[0] : null;
        setErr(first ?? data?.error ?? "Save failed");
        return;
      }
      const updated = mode === "edit"
        ? schools.map((s) => (s.id === editingId ? data.school : s))
        : [...schools, data.school];
      setSchools(updated);
      setOkMsg(mode === "edit" ? "Saved." : "School added.");
      startCreate();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete school '${id}'? Tutors who picked this area will need re-assignment.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/schools/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSchools(schools.filter((s) => s.id !== id));
        if (editingId === id) startCreate();
        router.refresh();
      } else {
        const data = await res.json();
        setErr(data?.error ?? "Delete failed");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="schools-editor">
      <div className="schools-list">
        <div className="schools-list-head">
          <h2>Schools ({schools.length})</h2>
          <button type="button" className="btn brand sm" onClick={startCreate}>
            + Add school
          </button>
        </div>
        <ul>
          {schools.map((s) => (
            <li key={s.id} className={editingId === s.id ? "is-editing" : ""}>
              <span className="school-swatch" style={{ background: s.brand }} aria-hidden />
              <div className="school-meta">
                <strong>{s.name}</strong>
                <span className="mono">{s.id}</span>
                <span className={`status-pill ${s.active ? "approved" : "paused"}`}>
                  {s.active ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="school-actions">
                <button type="button" className="btn ghost sm" onClick={() => startEdit(s)}>Edit</button>
                <button type="button" className="btn ghost sm danger" onClick={() => remove(s.id)} disabled={busy}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form className="school-form" onSubmit={save}>
        <h3>{mode === "edit" ? `Edit '${editingId}'` : "Add new school"}</h3>

        {mode === "create" && (
          <label className="field">
            <span>Slug (URL piece, optional — auto-generated from name)</span>
            <input
              value={form.id ?? ""}
              onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase() })}
              placeholder="e.g. james-ruse"
              pattern="[a-z0-9-]+"
            />
          </label>
        )}

        <label className="field">
          <span>Full name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={120}
          />
        </label>
        <label className="field">
          <span>Short name (for chips/tabs)</span>
          <input
            value={form.short}
            onChange={(e) => setForm({ ...form, short: e.target.value })}
            required
            maxLength={40}
          />
        </label>
        <label className="field">
          <span>Tagline (shown under the school name)</span>
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            required
            maxLength={200}
          />
        </label>

        <div className="school-color-row">
          <label className="field">
            <span>Brand (hex)</span>
            <div className="color-pair">
              <input type="color" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                pattern="#[0-9A-Fa-f]{6}"
              />
            </div>
          </label>
          <label className="field">
            <span>Brand deep</span>
            <div className="color-pair">
              <input
                type="color"
                value={form.brandDeep}
                onChange={(e) => setForm({ ...form, brandDeep: e.target.value })}
              />
              <input
                type="text"
                value={form.brandDeep}
                onChange={(e) => setForm({ ...form, brandDeep: e.target.value })}
                pattern="#[0-9A-Fa-f]{6}"
              />
            </div>
          </label>
          <label className="field">
            <span>Brand soft</span>
            <div className="color-pair">
              <input
                type="color"
                value={form.brandSoft}
                onChange={(e) => setForm({ ...form, brandSoft: e.target.value })}
              />
              <input
                type="text"
                value={form.brandSoft}
                onChange={(e) => setForm({ ...form, brandSoft: e.target.value })}
                pattern="#[0-9A-Fa-f]{6}"
              />
            </div>
          </label>
        </div>

        <label className="field check-field">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <span>Active — show on public site</span>
        </label>

        {err && <div className="auth-error">{err}</div>}
        {okMsg && <div className="success-banner">{okMsg}</div>}

        <div className="form-submit-row">
          <button type="submit" className="btn brand" disabled={busy}>
            {busy ? "Saving…" : mode === "edit" ? "Save changes" : "Add school"}
          </button>
        </div>
      </form>
    </div>
  );
}
