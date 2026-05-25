import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

const EMPTY_PROFILE = {
  fullName: "",
  email: "",
  hallTicket: "",
  branch: "",
  regulation: "",
  joiningYear: "",
  phone: "",
  collegeName: "",
  gender: "",
  dob: "",
  avatar: ""
};

const FIELD_CONFIG = [
  { key: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
  { key: "email", label: "Email", type: "email", required: false, placeholder: "Email address", readOnly: true },
  { key: "hallTicket", label: "Hall Ticket Number", type: "text", required: false, placeholder: "Hall ticket number", readOnly: true },
  { key: "branch", label: "Branch", type: "text", required: true, placeholder: "Enter your branch" },
  { key: "regulation", label: "Regulation", type: "text", required: true, placeholder: "Ex: R23" },
  { key: "joiningYear", label: "Year of Joining", type: "number", required: true, placeholder: "Ex: 2023" },
  { key: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "Enter your phone number" },
  { key: "collegeName", label: "College Name", type: "text", required: false, placeholder: "Enter your college name" },
  { key: "gender", label: "Gender", type: "select", required: false, options: ["", "Male", "Female", "Other"] },
  { key: "dob", label: "Date of Birth", type: "date", required: false, placeholder: "" }
];

function normalizeProfile(rawProfile) {
  const profile = rawProfile || {};
  return {
    ...EMPTY_PROFILE,
    fullName: profile.fullName || profile.name || "",
    email: profile.email || "",
    hallTicket: profile.hallTicket || profile.roll || "",
    branch: profile.branch || "",
    regulation: profile.regulation || "",
    joiningYear: profile.joiningYear ? String(profile.joiningYear) : "",
    phone: profile.phone || "",
    collegeName: profile.collegeName || "",
    gender: profile.gender || "",
    dob: profile.dob || "",
    avatar: profile.avatar || profile.photoURL || ""
  };
}

function profileCompletion(profile) {
  const keys = ["fullName", "email", "hallTicket", "branch", "regulation", "joiningYear", "phone", "collegeName", "gender", "dob"];
  const complete = keys.filter(key => String(profile[key] || "").trim()).length;
  return Math.round((complete / keys.length) * 100);
}

function validateProfile(profile) {
  const errors = {};

  if (!profile.fullName.trim()) errors.fullName = "Full name is required.";
  if (!profile.branch.trim()) errors.branch = "Branch is required.";
  if (!profile.regulation.trim()) errors.regulation = "Regulation is required.";

  if (!profile.joiningYear.trim()) {
    errors.joiningYear = "Joining year is required.";
  } else {
    const year = Number(profile.joiningYear);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      errors.joiningYear = "Enter a valid joining year.";
    }
  }

  if (!profile.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\+?[0-9]{10,13}$/.test(profile.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (profile.dob) {
    const today = new Date().toISOString().slice(0, 10);
    if (profile.dob > today) {
      errors.dob = "Date of birth cannot be in the future.";
    }
  }

  return errors;
}

function placeholderFor(value, fallback = "Not available") {
  return value ? value : fallback;
}

function LoadingSkeleton() {
  return html`
    <section className="w-full min-h-[70vh] rounded-[32px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-2xl md:p-8 animate-pulse">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-24 w-24 rounded-full bg-slate-700/70"></div>
          <div className="space-y-3">
            <div className="h-6 w-48 rounded-full bg-slate-700/70"></div>
            <div className="h-3 w-64 rounded-full bg-slate-800/70"></div>
            <div className="h-3 w-40 rounded-full bg-slate-800/70"></div>
          </div>
        </div>
        <div className="h-11 w-36 rounded-2xl bg-slate-700/70"></div>
      </div>
      <div className="mt-6 space-y-5">
        <div className="h-3 w-full rounded-full bg-slate-800/70"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          ${Array.from({ length: 12 }, (_, index) => html`
            <div key=${index} className="space-y-3 rounded-[24px] border border-white/[0.08] bg-slate-950/30 p-4">
              <div className="h-3 w-28 rounded-full bg-slate-700/70"></div>
              <div className="h-12 rounded-2xl bg-slate-800/70"></div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `;
}

function FieldCard({ field, value, error, isEditing, onChange }) {
  const isLocked = field.readOnly || !isEditing;
  const hasValue = String(value || "").trim().length > 0;
  const showMissingHint = !hasValue && !field.readOnly;
  const inputClass = [
    "mt-3 w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition duration-200",
    "placeholder:text-slate-500/70 focus:-translate-y-0.5",
    isLocked ? "cursor-not-allowed" : "",
    error
      ? "border-rose-400/60 bg-rose-400/10 text-white focus:border-rose-300 focus:ring-4 focus:ring-rose-400/20"
      : showMissingHint
        ? "border-dashed border-sky-300/20 bg-white/[0.03] text-slate-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-400/20"
        : "border-white/10 bg-slate-950/40 text-white focus:border-sky-300 focus:ring-4 focus:ring-sky-400/20"
  ].join(" ");

  return html`
    <div className="rounded-[24px] border border-white/10 bg-slate-950/25 p-4 transition duration-200 hover:border-sky-300/20 hover:bg-slate-950/35">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">${field.label}</label>
        ${field.required ? html`<span className="rounded-full bg-sky-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200">Required</span>` : null}
      </div>
      ${field.type === "select"
        ? html`
          <select
            className=${inputClass}
            value=${value}
            disabled=${isLocked}
            onChange=${event => onChange(field.key, event.target.value)}
          >
            ${(field.options || []).map(option => html`<option key=${option} value=${option}>${option || "Select an option"}</option>`)}
          </select>
        `
        : html`
          <input
            className=${inputClass}
            type=${field.type}
            value=${value}
            placeholder=${field.placeholder}
            disabled=${isLocked}
            onInput=${event => onChange(field.key, event.target.value)}
          />
        `}
      ${error
        ? html`<p className="mt-2 text-sm font-medium text-rose-300">${error}</p>`
        : showMissingHint
          ? html`<p className="mt-2 text-sm italic text-slate-500">This field is empty.</p>`
          : null}
    </div>
  `;
}

function ProfilePanel(props) {
  const {
    fetchProfile,
    saveProfile,
    refreshKey,
    summary,
    statusMessage,
    onPhotoSelect,
    onCancelEdit
  } = props;

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(statusMessage || "Fetching your profile...");
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setStatus("Fetching your profile...");

      try {
        const response = await fetchProfile?.();
        if (!active) return;
        const normalized = normalizeProfile(response?.data || response);
        setProfile(normalized);
        setDraft(normalized);
        setErrors({});
        setStatus(statusMessage || "Profile synced with your account.");
      } catch (error) {
        console.error("Profile panel fetch error:", error);
        if (!active) return;
        setProfile(EMPTY_PROFILE);
        setDraft(EMPTY_PROFILE);
        setStatus("Unable to load profile details right now.");
      } finally {
        if (active) {
          setLoading(false);
          setEditing(false);
          setPhotoPreview("");
        }
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [fetchProfile, refreshKey, statusMessage]);

  const completion = useMemo(() => profileCompletion(draft), [draft]);
  const avatar = photoPreview || draft.avatar || "https://api.dicebear.com/8.x/thumbs/svg?seed=Student";

  function updateField(key, value) {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: "" }));
  }

  function beginEdit() {
    setDraft(profile);
    setErrors({});
    setEditing(true);
    setStatus("Edit mode enabled. Update the fields and save when ready.");
  }

  function cancelEdit() {
    setDraft(profile);
    setErrors({});
    setEditing(false);
    setPhotoPreview("");
    setStatus("Changes discarded.");
    onCancelEdit?.();
  }

  async function handleSave() {
    const nextErrors = validateProfile(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    setStatus("Saving profile changes...");

    try {
      const response = await saveProfile?.(draft);
      if (response === false) {
        setStatus("Unable to save profile changes right now.");
        return;
      }

      const normalized = normalizeProfile(response?.data || response || draft);
      setProfile(normalized);
      setDraft(normalized);
      setEditing(false);
      setPhotoPreview("");
      setStatus("Profile updated successfully.");
    } catch (error) {
      console.error("Profile panel save error:", error);
      setStatus("Unable to save profile changes right now.");
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    onPhotoSelect?.(file);

    const reader = new FileReader();
    reader.onload = () => {
      const preview = String(reader.result || "");
      setPhotoPreview(preview);
      setDraft(current => ({ ...current, avatar: preview }));
      setStatus("Profile photo selected. Save to upload it.");
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return html`<${LoadingSkeleton} />`;
  }

  return html`
    <section className="w-full min-h-screen overflow-y-auto rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),linear-gradient(180deg,rgba(6,12,24,0.94),rgba(11,23,45,0.96))] p-4 shadow-[0_30px_90px_rgba(2,6,23,0.55)] backdrop-blur-2xl sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="border-b border-white/10 pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="relative mx-auto md:mx-0">
                <img
                  src=${avatar}
                  alt="Student profile"
                  className="h-28 w-28 rounded-full border-4 border-sky-300/30 object-cover shadow-[0_0_0_12px_rgba(59,130,246,0.08)]"
                />
                <label className=${`absolute -bottom-2 right-0 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${editing ? "cursor-pointer border-sky-300/30 bg-sky-400 text-slate-950 hover:bg-sky-300" : "cursor-not-allowed border-white/10 bg-white/10 text-slate-300 opacity-70"}`}>
                  <i className="fa-solid fa-camera"></i>
                  Upload
                  <input type="file" accept="image/*" className="hidden" disabled=${!editing} onChange=${handlePhotoChange} />
                </label>
              </div>

              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-200/80">Student Profile Dashboard</p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white">${placeholderFor(draft.fullName, "Student Name")}</h3>
                <p className="mt-2 text-sm text-slate-300">${placeholderFor(draft.email, "No email available")}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-sky-100">${placeholderFor(draft.branch, "Branch pending")}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-sky-100">${placeholderFor(draft.regulation, "Regulation pending")}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
              ${editing
                ? html`
                  <button type="button" className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.1]" onClick=${cancelEdit} disabled=${saving}>
                    Cancel
                  </button>
                  <button type="button" className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.34)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70" onClick=${handleSave} disabled=${saving}>
                    ${saving ? "Saving..." : "Save Profile"}
                  </button>
                `
                : html`
                  <button type="button" className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.34)] transition hover:-translate-y-0.5" onClick=${beginEdit}>
                    Edit Profile
                  </button>
                `}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Profile Completion</p>
                <p className="mt-1 text-sm text-slate-300">Complete missing details to unlock a cleaner and fully personalized student dashboard.</p>
              </div>
              <span className="text-lg font-extrabold text-sky-200">${completion}%</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950/60">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 transition-all duration-500" style=${{ width: `${completion}%` }}></div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            ${FIELD_CONFIG.map(field => html`
              <${FieldCard}
                key=${field.key}
                field=${field}
                value=${draft[field.key] || ""}
                error=${errors[field.key]}
                isEditing=${editing}
                onChange=${updateField}
              />
            `)}

            ${[
              { key: "currentCgpa", label: "Current CGPA", value: (summary?.cgpa ?? 0).toFixed(2) },
              { key: "totalCredits", label: "Total Credits", value: String(summary?.totalCredits ?? 0) }
            ].map(item => html`
              <div key=${item.key} className="rounded-[24px] border border-white/10 bg-slate-950/25 p-4 transition duration-200 hover:border-sky-300/20 hover:bg-slate-950/35">
                <label className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">${item.label}</label>
                <input
                  className="mt-3 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-medium text-slate-200 outline-none"
                  type="text"
                  value=${item.value}
                  disabled
                />
              </div>
            `)}
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
          ${status || "Profile synced with your account."}
        </div>
      </div>
    </section>
  `;
}

export function mountProfilePanel(container) {
  const root = createRoot(container);
  return {
    render(nextProps) {
      root.render(html`<${ProfilePanel} ...${nextProps} />`);
    },
    unmount() {
      root.unmount();
    }
  };
}
