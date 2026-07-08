import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";
import { getAcademicYearRange } from "./app.js";

const ADMISSION_TYPE_OPTIONS = ["Regular", "Lateral Entry (LE)"];

const html = htm.bind(React.createElement);

const EMPTY_PROFILE = {
  fullName: "",
  email: "",
  hallTicket: "",
  branch: "",
  regulation: "",
  admissionType: "Regular",
  joiningYear: "",
  phone: "",
  collegeName: "",
  gender: "",
  dob: ""
};

const REGULATION_OPTIONS = ["R23", "R20"];

const FIELD_CONFIG = [
  { key: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
  { key: "email", label: "Email", type: "email", required: false, placeholder: "Email address", readOnly: true },
  { key: "hallTicket", label: "Hall Ticket Number", type: "text", required: false, placeholder: "Hall ticket number", readOnly: true },
  { key: "branch", label: "Branch", type: "text", required: true, placeholder: "Enter your branch" },
  { key: "regulation", label: "Regulation", type: "select", required: true, options: REGULATION_OPTIONS, readOnly: true },
  { key: "admissionType", label: "Admission Type", type: "select", required: true, options: ["", ...ADMISSION_TYPE_OPTIONS] },
  { key: "joiningYear", label: "Year of Joining", type: "number", required: true, placeholder: "Ex: 2023" },
  { key: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "Enter your phone number" },
  { key: "collegeName", label: "College Name", type: "text", required: false, placeholder: "Enter your college name" },
  { key: "gender", label: "Gender", type: "select", required: false, options: ["", "Male", "Female", "Other"] },
  { key: "dob", label: "Date of Birth", type: "date", required: false, placeholder: "" }
];

const FIELD_GROUPS = [
  {
    title: "Identity",
    description: "Your academic identity and regulation details.",
    fields: ["fullName", "hallTicket", "branch", "regulation", "admissionType"]
  },
  {
    title: "Contact",
    description: "Personal and institutional contact information.",
    fields: ["email", "phone", "collegeName"]
  },
  {
    title: "Personal",
    description: "Background information used for a more complete profile.",
    fields: ["joiningYear", "gender", "dob"]
  }
];

function normalizeProfile(rawProfile) {
  const profile = rawProfile || {};
  const regulation = REGULATION_OPTIONS.includes(String(profile.regulation || "").trim().toUpperCase())
    ? String(profile.regulation || "").trim().toUpperCase()
    : "R23";
  return {
    ...EMPTY_PROFILE,
    fullName: profile.fullName || profile.name || "",
    email: profile.email || "",
    hallTicket: profile.hallTicket || profile.roll || "",
    branch: profile.branch || "",
    regulation,
    admissionType: profile.admissionType === "Lateral Entry (LE)" || profile.admissionType === "Lateral Entry" || profile.admissionType === "LE"
      ? "Lateral Entry (LE)"
      : "Regular",
    joiningYear: profile.joiningYear ? String(profile.joiningYear) : "",
    phone: profile.phone || "",
    collegeName: profile.collegeName || "",
    gender: profile.gender || "",
    dob: profile.dob || ""
  };
}

function profileCompletion(profile) {
  const keys = ["fullName", "email", "hallTicket", "branch", "regulation", "admissionType", "joiningYear", "phone", "collegeName", "gender", "dob"];
  const complete = keys.filter(key => String(profile[key] || "").trim()).length;
  return Math.round((complete / keys.length) * 100);
}

function validateProfile(profile) {
  const errors = {};

  if (!profile.fullName.trim()) errors.fullName = "Full name is required.";
  if (!profile.branch.trim()) errors.branch = "Branch is required.";
  if (!profile.regulation.trim()) errors.regulation = "Regulation is required.";
  if (profile.regulation.trim() && !REGULATION_OPTIONS.includes(profile.regulation.trim().toUpperCase())) {
    errors.regulation = "Only R23 and R20 are supported.";
  }

  if (!profile.admissionType.trim()) {
    errors.admissionType = "Admission type is required.";
  }

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

function avatarLetter(fullName) {
  const trimmedName = String(fullName || "").trim();
  return trimmedName ? trimmedName.charAt(0).toUpperCase() : "S";
}

function badgeTone(completion) {
  if (completion >= 90) return "from-emerald-400/30 to-cyan-400/20 text-emerald-100 border-emerald-300/20";
  if (completion >= 70) return "from-sky-400/30 to-indigo-400/20 text-sky-100 border-sky-300/20";
  if (completion >= 50) return "from-amber-400/30 to-orange-400/20 text-amber-100 border-amber-300/20";
  return "from-rose-400/30 to-pink-400/20 text-rose-100 border-rose-300/20";
}

function LoadingSkeleton() {
  return html`
    <section className="w-full min-h-[70vh] rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),linear-gradient(180deg,rgba(6,12,24,0.94),rgba(11,23,45,0.96))] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-2xl md:p-8 animate-pulse">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="h-28 w-28 rounded-[28px] bg-slate-700/70"></div>
          <div className="space-y-3">
            <div className="h-7 w-56 rounded-full bg-slate-700/70"></div>
            <div className="h-3 w-72 rounded-full bg-slate-800/70"></div>
            <div className="h-3 w-48 rounded-full bg-slate-800/70"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          ${Array.from({ length: 4 }, (_, index) => html`<div key=${index} className="h-24 w-full rounded-[24px] bg-slate-800/60"></div>`)}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          ${Array.from({ length: 2 }, (_, groupIndex) => html`
            <div key=${groupIndex} className="rounded-[28px] border border-white/[0.08] bg-slate-950/30 p-5">
              <div className="mb-4 h-4 w-40 rounded-full bg-slate-700/70"></div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                ${Array.from({ length: groupIndex === 0 ? 4 : 3 }, (_, index) => html`
                  <div key=${index} className="space-y-3 rounded-[24px] border border-white/[0.08] bg-slate-950/30 p-4">
                    <div className="h-3 w-28 rounded-full bg-slate-700/70"></div>
                    <div className="h-12 rounded-2xl bg-slate-800/70"></div>
                  </div>
                `)}
              </div>
            </div>
          `)}
        </div>
        <div className="space-y-5">
          ${Array.from({ length: 2 }, (_, index) => html`
            <div key=${index} className="h-56 rounded-[28px] border border-white/[0.08] bg-slate-950/30"></div>
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

function MetricCard({ label, value, meta, accent }) {
  return html`
    <div className="rounded-[24px] border border-white/10 bg-gradient-to-br ${accent} p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">${label}</p>
      <strong className="mt-3 block text-3xl font-extrabold text-white">${value}</strong>
      <p className="mt-2 text-sm text-slate-300">${meta}</p>
    </div>
  `;
}

function SectionBlock({ title, description, children }) {
  return html`
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 border-b border-white/10 pb-4">
        <h4 className="text-lg font-bold text-white">${title}</h4>
        <p className="text-sm text-slate-300">${description}</p>
      </div>
      ${children}
    </section>
  `;
}

function ProfilePanel(props) {
  const {
    fetchProfile,
    saveProfile,
    refreshKey,
    summary,
    statusMessage
  } = props;

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(statusMessage || "Fetching your profile...");

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
        }
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [fetchProfile, refreshKey]);

  useEffect(() => {
    if (!loading && statusMessage) {
      setStatus(statusMessage);
    }
  }, [statusMessage, loading]);

  const completion = useMemo(() => profileCompletion(draft), [draft]);
  const avatar = avatarLetter(draft.fullName);
  const badgeClass = badgeTone(completion);
  const academicYearRange = getAcademicYearRange(draft);
  const summaryCards = [
    {
      label: "Current CGPA",
      value: (summary?.cgpa ?? 0).toFixed(2),
      meta: `${summary?.completedSemesters ?? 0} semesters recorded`,
      accent: "from-sky-500/20 to-blue-500/10"
    },
    {
      label: "Total Credits",
      value: String(summary?.totalCredits ?? 0),
      meta: "Credits earned across saved semesters",
      accent: "from-cyan-500/20 to-teal-500/10"
    },
    {
      label: "Backlogs",
      value: String(summary?.backlogs ?? 0),
      meta: "Subjects needing improvement",
      accent: "from-amber-500/20 to-orange-500/10"
    },
    {
      label: "Profile Score",
      value: `${completion}%`,
      meta: `Admission Type: ${draft.admissionType || "Regular"}${academicYearRange ? ` • Academic Year: ${academicYearRange.label}` : ""}`,
      accent: "from-indigo-500/20 to-violet-500/10"
    }
  ];

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
    setStatus("Changes discarded.");
  }

  async function handleSave() {
    const nextErrors = validateProfile(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstError = Object.values(nextErrors)[0];
      setStatus(firstError || "Please complete the required profile fields before saving.");
      return;
    }

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
      setStatus("Profile updated successfully.");
    } catch (error) {
      console.error("Profile panel save error:", error);
      setStatus("Unable to save profile changes right now.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return html`<${LoadingSkeleton} />`;
  }

  return html`
    <section className="w-full min-h-screen overflow-y-auto rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),linear-gradient(180deg,rgba(6,12,24,0.94),rgba(11,23,45,0.96))] p-4 shadow-[0_30px_90px_rgba(2,6,23,0.55)] backdrop-blur-2xl sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="border-b border-white/10 pb-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-sky-300/30 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-5xl font-black text-white shadow-[0_0_0_12px_rgba(59,130,246,0.08)] lg:mx-0" aria-label="Student profile avatar">
                ${avatar}
              </div>

              <div className="text-center lg:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-200/80">Student Profile Workspace</p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white">${placeholderFor(draft.fullName, "Student Name")}</h3>
                <p className="mt-2 text-sm text-slate-300">${placeholderFor(draft.email, "No email available")}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-sky-100">${placeholderFor(draft.branch, "Branch pending")}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-sky-100">${placeholderFor(draft.regulation, "Regulation pending")}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-slate-200">${placeholderFor(draft.hallTicket, "Hall ticket pending")}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 xl:justify-end">
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

          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Profile Completion</p>
                    <p className="mt-1 text-sm text-slate-300">Complete missing details to unlock a cleaner and fully personalized student dashboard.</p>
                  </div>
                  <span className=${`rounded-full border bg-gradient-to-r px-4 py-2 text-sm font-bold ${badgeClass}`}>${completion}% ready</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950/60">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 transition-all duration-500" style=${{ width: `${completion}%` }}></div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Joining Year</p>
                    <strong className="mt-2 block text-white">${placeholderFor(draft.joiningYear, "Pending")}</strong>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Phone</p>
                    <strong className="mt-2 block text-white">${placeholderFor(draft.phone, "Pending")}</strong>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">College</p>
                    <strong className="mt-2 block text-white">${placeholderFor(draft.collegeName, "Pending")}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              ${summaryCards.map(card => html`
                <${MetricCard}
                  key=${card.label}
                  label=${card.label}
                  value=${card.value}
                  meta=${card.meta}
                  accent=${card.accent}
                />
              `)}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            ${FIELD_GROUPS.map(group => html`
              <${SectionBlock}
                key=${group.title}
                title=${group.title}
                description=${group.description}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  ${group.fields.map(key => {
                    const field = FIELD_CONFIG.find(item => item.key === key);
                    return html`
                      <${FieldCard}
                        key=${field.key}
                        field=${field}
                        value=${draft[field.key] || ""}
                        error=${errors[field.key]}
                        isEditing=${editing}
                        onChange=${updateField}
                      />
                    `;
                  })}
                </div>
              </${SectionBlock}>
            `)}
          </div>

          <div className="space-y-5">
            <${SectionBlock}
              title="Academic Snapshot"
              description="A compact view of your academic standing inside the platform."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                ${[
                  { label: "Saved Semesters", value: String(summary?.completedSemesters ?? 0), meta: "Semesters currently tracked" },
                  { label: "Backlogs", value: String(summary?.backlogs ?? 0), meta: "Count of failed or absent subjects" },
                  { label: "Gender", value: placeholderFor(draft.gender, "Not set"), meta: "Profile identity detail" },
                  { label: "Date of Birth", value: placeholderFor(draft.dob, "Not set"), meta: "Personal record detail" }
                ].map(item => html`
                  <div key=${item.label} className="rounded-[22px] border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">${item.label}</p>
                    <strong className="mt-2 block text-xl font-bold text-white">${item.value}</strong>
                    <p className="mt-2 text-sm text-slate-300">${item.meta}</p>
                  </div>
                `)}
              </div>
            </${SectionBlock}>

            <${SectionBlock}
              title="Profile Guidance"
              description="A cleaner checklist so it is obvious what still needs attention."
            >
              <div className="space-y-3">
                ${FIELD_CONFIG.filter(field => field.required && !String(draft[field.key] || "").trim()).length
                  ? FIELD_CONFIG.filter(field => field.required && !String(draft[field.key] || "").trim()).map(field => html`
                      <div key=${field.key} className="rounded-[20px] border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                        <strong className="font-semibold">${field.label}</strong> still needs to be completed.
                      </div>
                    `)
                  : html`
                      <div className="rounded-[20px] border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                        All required profile fields are complete.
                      </div>
                    `}
                <div className="rounded-[20px] border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-300">
                  Read-only fields like email and hall ticket are synced from your account records.
                </div>
              </div>
            </${SectionBlock}>
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
