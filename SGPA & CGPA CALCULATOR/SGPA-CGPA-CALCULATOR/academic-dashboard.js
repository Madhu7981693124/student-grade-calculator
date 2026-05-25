import {
  requireAuth,
  logout as firebaseLogout,
  getUserProfile,
  getSemesterRecords,
  saveSemesterRecord,
  getUserSetting,
  saveUserSetting,
  saveUserProfile,
  updateUserProfile,
  uploadProfileImage
} from "./app.js";
import { mountProfilePanel } from "./profile-panel.js";

const THEME_KEY = "theme";
const SETTINGS_DOC_ID = "dashboard";
const SEMESTER_KEYS = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];
const GRADE_POINTS = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0, Ab: 0 };
const REGULATION_OPTIONS = ["R23", "R20", "R19", "R16"];

const defaultState = {
  profile: {
    name: "Student",
    hallTicket: "Not set",
    branch: "Department",
    regulation: "R23",
    email: "",
    joiningYear: "",
    phone: "",
    collegeName: "",
    gender: "",
    dob: "",
    avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=Student"
  },
  semesters: {},
  instantCalculator: {
    semester: "1-1",
    regulation: "R23",
    rows: [
      { name: "Mathematics", code: "MATH101", credits: "3", grade: "A" },
      { name: "Programming", code: "CS102", credits: "4", grade: "S" }
    ]
  }
};

let trendChart = null;
let currentUser = null;
let currentState = structuredClone(defaultState);
let pendingProfilePhotoFile = null;
let profilePanel = null;
let sharedActionsReady = false;
let profilePanelRefreshKey = 0;
let profileStatusMessage = "Profile synced with your account.";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initProfilePanel();
  syncProfilePanel();

  requireAuth(async user => {
    currentUser = user;
    currentState = await loadUserState(user);
    profileStatusMessage = "Profile synced with your account.";
    hydrateProfile(currentState);
    initSharedActions();
    profilePanelRefreshKey += 1;
    syncProfilePanel();

    if (document.body.dataset.page === "dashboard") {
      renderDashboard(currentState);
    }

    if (document.body.dataset.page === "semesters") {
      renderSemesterPage(currentState);
    }

    if (document.body.dataset.page === "instant-calculator") {
      renderInstantCalculatorPage(currentState);
    }
  });
});

async function loadUserState(user) {
  const base = structuredClone(defaultState);

  try {
    const [profile, semesters, settings] = await Promise.all([
      getUserProfile(user.uid),
      getSemesterRecords(user.uid),
      getUserSetting(user.uid, SETTINGS_DOC_ID)
    ]);

    const normalizedProfile = normalizeProfileData(profile, user, base.profile);

    if (!profile || hasIncompleteProfile(profile, user)) {
      backfillProfile(normalizedProfile).catch(error => {
        console.error("Profile backfill error:", error);
      });
    }

    return {
      profile: normalizedProfile,
      semesters: semesters || {},
      instantCalculator: normalizeInstantCalculatorSettings(settings?.instantCalculator, normalizedProfile.regulation)
    };
  } catch (error) {
    console.error("Dashboard user state load error:", error);
    return {
      ...base,
      profile: {
        ...normalizeProfileData(null, user, base.profile)
      }
    };
  }
}

async function persistInstantCalculator() {
  if (!currentUser) return;
  try {
    await saveUserSetting(currentUser.uid, SETTINGS_DOC_ID, {
      instantCalculator: currentState.instantCalculator,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Instant calculator save error:", error);
  }
}

function initTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY) || "dark";
  document.documentElement.setAttribute("data-theme", storedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
}

function hydrateProfile(state) {
  const { name, hallTicket, branch, regulation, avatar } = state.profile;
  setText("sidebarName", name);
  setText("sidebarRegulation", regulation);
  setText("sidebarDepartment", branch);
  setText("headerStudentName", name);
  setText("headerDepartment", compressBranch(branch));
  setText("regBadge", regulation);
  setText("heroName", name);
  setText("heroHallTicket", hallTicket);
  setText("heroBranch", branch);
  setText("heroRegulation", regulation);

  ["sidebarAvatar", "headerAvatar"].forEach(id => {
    const image = document.getElementById(id);
    if (image) image.src = avatar;
  });
}

function initSharedActions() {
  if (sharedActionsReady) return;
  sharedActionsReady = true;

  const openProfileButtons = ["openProfileBtn", "headerProfileBtn"].map(id => document.getElementById(id)).filter(Boolean);
  const closeProfileBtn = document.getElementById("closeProfileModalBtn");
  const profileModal = document.getElementById("profileModal");
  const addInstantRowBtn = document.getElementById("addInstantRowBtn");
  const calculateInstantBtn = document.getElementById("calculateInstantBtn");
  const resetInstantBtn = document.getElementById("resetInstantBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const instantSemesterSelect = document.getElementById("instantSemesterSelect");
  const instantRegulationSelect = document.getElementById("instantRegulationSelect");

  openProfileButtons.forEach(button => button.addEventListener("click", async () => {
    profileModal?.classList.add("is-open");
    profileStatusMessage = "Fetching your profile...";
    profilePanelRefreshKey += 1;
    syncProfilePanel();
  }));

  closeProfileBtn?.addEventListener("click", () => profileModal?.classList.remove("is-open"));

  [profileModal].forEach(modal => {
    modal?.addEventListener("click", event => {
      if (event.target === modal) modal.classList.remove("is-open");
    });
  });

  addInstantRowBtn?.addEventListener("click", async () => {
    currentState.instantCalculator.rows.push(createEmptyInstantRow());
    renderInstantCalculator();
    await persistInstantCalculator();
  });

  calculateInstantBtn?.addEventListener("click", async () => {
    const workspace = document.getElementById("instantCalculatorSection");
    calculateInstantBtn.disabled = true;
    calculateInstantBtn.dataset.loading = "true";
    workspace?.classList.add("is-calculating");
    updateInstantSummary(currentState.instantCalculator, true);
    await persistInstantCalculator();
    window.setTimeout(() => {
      calculateInstantBtn.disabled = false;
      delete calculateInstantBtn.dataset.loading;
      workspace?.classList.remove("is-calculating");
    }, 380);
  });

  resetInstantBtn?.addEventListener("click", async () => {
    currentState.instantCalculator = {
      semester: currentState.instantCalculator.semester || "1-1",
      regulation: currentState.profile.regulation || "R23",
      rows: [createEmptyInstantRow()]
    };
    renderInstantCalculator();
    await persistInstantCalculator();
  });

  instantSemesterSelect?.addEventListener("change", async event => {
    currentState.instantCalculator.semester = event.target.value;
    updateInstantSummary(currentState.instantCalculator);
    await persistInstantCalculator();
  });

  instantRegulationSelect?.addEventListener("change", async event => {
    currentState.instantCalculator.regulation = event.target.value;
    updateInstantSummary(currentState.instantCalculator);
    await persistInstantCalculator();
  });

  themeToggleBtn?.addEventListener("click", () => {
    toggleTheme();
    syncThemeLabel();
    if (document.body.dataset.page === "dashboard") {
      renderDashboard(currentState);
    } else if (document.body.dataset.page === "instant-calculator") {
      renderInstantCalculatorPage(currentState);
    } else {
      renderSemesterPage(currentState);
    }
  });

  logoutBtn?.addEventListener("click", async event => {
    event.preventDefault();
    try {
      await firebaseLogout();
    } catch {
      window.location.href = "index.html";
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      profileModal?.classList.remove("is-open");
    }
  });

  syncThemeLabel();
}

function renderDashboard(state) {
  const summary = computeSummary(state);
  setText("sidebarSemesterCount", String(summary.completedSemesters));
  setText("heroCgpa", summary.cgpa.toFixed(2));
  setText("heroCgpaLabel", summary.completedSemesters ? `${summary.completedSemesters} semesters saved` : "Start adding semester grades");
  setText("statCgpa", summary.cgpa.toFixed(2));
  setText("statPercentage", `${summary.percentage.toFixed(1)}%`);
  setText("statCredits", String(summary.totalCredits));
  setText("statBacklogs", String(summary.backlogs));
  updateProfileSummaryStats(summary);
  renderRecentSemesters(summary.savedSemesters);
  renderTrend(summary.savedSemesters, summary);
}

function renderInstantCalculatorPage(state) {
  const summary = computeSummary(state);
  setText("sidebarSemesterCount", String(summary.completedSemesters));
  updateProfileSummaryStats(summary);
  renderInstantCalculator();
}

function syncThemeLabel() {
  const label = document.getElementById("themeToggleLabel");
  if (!label) return;
  label.textContent = (document.documentElement.getAttribute("data-theme") || "dark") === "dark" ? "Dark" : "Light";
}

function renderRecentSemesters(savedSemesters) {
  const host = document.getElementById("recentSemesters");
  const empty = document.getElementById("recentSemestersEmpty");
  if (!host || !empty) return;

  if (!savedSemesters.length) {
    host.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  host.innerHTML = savedSemesters
    .slice(-4)
    .reverse()
    .map(item => `
      <article class="recent-item">
        <div class="recent-item__meta">
          <strong>Semester ${item.key}</strong>
          <span>${item.subjects.length} subjects | ${item.credits} credits</span>
        </div>
        <div class="recent-item__sgpa">
          <span>SGPA</span>
          <strong>${item.sgpa.toFixed(2)}</strong>
        </div>
      </article>
    `)
    .join("");
}

function renderTrend(savedSemesters, summary) {
  const canvas = document.getElementById("trendChart");
  const summaryNode = document.getElementById("chartSummary");
  if (!canvas || !summaryNode) return;

  if (trendChart) {
    trendChart.destroy();
    trendChart = null;
  }

  if (!savedSemesters.length) {
    summaryNode.textContent = "Your academic graph will appear here once you save semesters.";
    return;
  }

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const tickColor = isLight ? "#475569" : "#94a3b8";
  const gridColor = isLight ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.12)";

  trendChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: savedSemesters.map(item => item.key),
      datasets: [{
        data: savedSemesters.map(item => item.sgpa),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.16)",
        borderWidth: 3,
        fill: true,
        tension: 0.34,
        pointRadius: 4,
        pointBackgroundColor: "#60a5fa"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: tickColor },
          grid: { color: gridColor }
        },
        y: {
          min: 0,
          max: 10,
          ticks: { color: tickColor, stepSize: 1 },
          grid: { color: gridColor }
        }
      }
    }
  });

  summaryNode.textContent = `You have completed ${summary.completedSemesters} semesters with an overall CGPA of ${summary.cgpa.toFixed(2)}, ${summary.totalCredits} credits, and ${summary.backlogs} backlog entries.`;
}

function renderSemesterPage(state) {
  const host = document.getElementById("semesterCards");
  if (!host) return;
  const summary = computeSummary(state);
  setText("sidebarSemesterCount", String(summary.completedSemesters));
  updateProfileSummaryStats(summary);

  host.innerHTML = SEMESTER_KEYS.map(key => {
    const semester = state.semesters[key] || emptySemester();
    return `
      <article class="semester-card glass-panel${semester.isOpen ? " is-open" : ""}" data-semester="${key}">
        <button class="semester-card__toggle" type="button" data-toggle-semester="${key}">
          <div class="semester-card__head">
            <div class="semester-card__title">
              <span class="semester-badge">${key}</span>
              <div>
                <h3>Semester ${key}</h3>
                <p class="semester-card__subtitle">${semester.subjects.length ? "Edit grades and update credits" : "Click to add grades"}</p>
              </div>
            </div>
            <div class="semester-card__summary">
              <strong>${semester.sgpa ? semester.sgpa.toFixed(2) : "--"}</strong>
              <span>SGPA</span>
              <i class="fa-solid fa-angle-down semester-card__arrow"></i>
            </div>
          </div>
        </button>

        <div class="semester-card__body">
          <div class="subject-list" id="subjects-${key}">
            ${renderSubjectRows(semester.subjects)}
          </div>
          <p class="helper-text">Add subjects, select grades, enter credits, and save for instant dashboard updates.</p>
          <div class="semester-card__actions">
            <button class="subject-add-btn glow-action" type="button" data-add-row="${key}">
              <i class="fa-solid fa-plus"></i>
              Add Subject
            </button>
            <button class="save-action" type="button" data-save-semester="${key}">
              <i class="fa-solid fa-floppy-disk"></i>
              Save Semester
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  host.querySelectorAll("[data-toggle-semester]").forEach(button => {
    button.addEventListener("click", () => toggleSemesterCard(button.dataset.toggleSemester));
  });
  host.querySelectorAll("[data-add-row]").forEach(button => {
    button.addEventListener("click", () => addSemesterRow(button.dataset.addRow));
  });
  host.querySelectorAll("[data-save-semester]").forEach(button => {
    button.addEventListener("click", () => saveSemester(button.dataset.saveSemester));
  });
}

function updateProfileSummaryStats(summary) {
  syncProfilePanel(summary);
}

function renderSubjectRows(subjects) {
  const rows = subjects.length ? subjects : [{ name: "", credits: "", grade: "" }];
  return rows.map(subject => `
    <div class="subject-row">
      <input type="text" placeholder="Subject name" value="${escapeHtml(subject.name || "")}" />
      <input type="number" min="0.5" step="0.5" placeholder="Credits" value="${escapeHtml(String(subject.credits || ""))}" />
      <select>
        ${["", "S", "A", "B", "C", "D", "E", "F", "Ab"].map(grade => `<option value="${grade}"${subject.grade === grade ? " selected" : ""}>${grade || "Grade"}</option>`).join("")}
      </select>
    </div>
  `).join("");
}

function addSemesterRow(key) {
  const list = document.getElementById(`subjects-${key}`);
  if (!list) return;
  const row = document.createElement("div");
  row.className = "subject-row";
  row.innerHTML = `
    <input type="text" placeholder="Subject name" />
    <input type="number" min="0.5" step="0.5" placeholder="Credits" />
    <select>
      <option value="">Grade</option>
      <option value="S">S</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
      <option value="E">E</option>
      <option value="F">F</option>
      <option value="Ab">Ab</option>
    </select>
  `;
  list.appendChild(row);
}

function toggleSemesterCard(key) {
  const card = document.querySelector(`[data-semester="${key}"]`);
  if (!card) return;
  const shouldOpen = !card.classList.contains("is-open");
  document.querySelectorAll(".semester-card").forEach(node => node.classList.remove("is-open"));
  if (shouldOpen) card.classList.add("is-open");
  if (!currentState.semesters[key]) currentState.semesters[key] = emptySemester();
  currentState.semesters[key].isOpen = shouldOpen;
}

async function saveSemester(key) {
  if (!currentUser) return;
  const list = document.getElementById(`subjects-${key}`);
  if (!list) return;
  const rows = Array.from(list.querySelectorAll(".subject-row"));
  const subjects = [];

  for (const row of rows) {
    const [nameInput, creditInput, gradeSelect] = row.querySelectorAll("input, select");
    const name = nameInput.value.trim();
    const credits = parseFloat(creditInput.value);
    const grade = gradeSelect.value;

    if (!name && !creditInput.value && !grade) continue;
    if (!name || !credits || credits <= 0 || !grade) return;
    subjects.push({ name, credits, grade });
  }

  if (!subjects.length) return;

  const totals = subjects.reduce((acc, subject) => {
    acc.credits += subject.credits;
    acc.points += subject.credits * (GRADE_POINTS[subject.grade] ?? 0);
    if (subject.grade === "F" || subject.grade === "Ab") acc.backlogs += 1;
    return acc;
  }, { credits: 0, points: 0, backlogs: 0 });

  const payload = {
    sem: key,
    subjects,
    credits: Number(totals.credits.toFixed(1)),
    sgpa: Number((totals.points / totals.credits).toFixed(2)),
    backlogs: totals.backlogs,
    updatedAt: new Date().toISOString()
  };

  try {
    await saveSemesterRecord(currentUser.uid, key, payload);
    currentState.semesters[key] = { ...payload, isOpen: true };
    renderSemesterPage(currentState);
    if (document.body.dataset.page === "dashboard") renderDashboard(currentState);
  } catch (error) {
    console.error("Semester save error:", error);
  }
}

async function saveProfileChanges(draft) {
  if (!currentUser) return;

  const updatedProfile = {
    ...currentState.profile,
    name: draft.fullName?.trim() || currentState.profile.name,
    email: currentUser.email || currentState.profile.email || "",
    hallTicket: draft.hallTicket || currentState.profile.hallTicket,
    branch: draft.branch?.trim() || "",
    regulation: draft.regulation?.trim() || "",
    joiningYear: draft.joiningYear?.trim() || "",
    phone: draft.phone?.trim() || "",
    collegeName: draft.collegeName?.trim() || "",
    gender: draft.gender || "",
    dob: draft.dob || ""
  };

  try {
    if (pendingProfilePhotoFile) {
      updatedProfile.avatar = await uploadProfileImage(currentUser.uid, pendingProfilePhotoFile);
      pendingProfilePhotoFile = null;
    }

    await backfillProfile(updatedProfile);

    await updateUserProfile({
      displayName: updatedProfile.name,
      ...(updatedProfile.avatar ? { photoURL: updatedProfile.avatar } : {})
    });

    currentState.profile = updatedProfile;
    hydrateProfile(currentState);
    profileStatusMessage = "Profile updated successfully.";
    return updatedProfile;
  } catch (error) {
    console.error("Profile update error:", error);
    profileStatusMessage = "Unable to save profile changes right now.";
    return false;
  }
}

function renderInstantCalculator() {
  const host = document.getElementById("instantRows");
  if (!host) return;

  const semesterSelect = document.getElementById("instantSemesterSelect");
  const regulationSelect = document.getElementById("instantRegulationSelect");

  if (semesterSelect) {
    semesterSelect.innerHTML = SEMESTER_KEYS.map(key => `<option value="${key}">Semester ${key}</option>`).join("");
    semesterSelect.value = currentState.instantCalculator.semester;
  }

  if (regulationSelect) {
    regulationSelect.innerHTML = REGULATION_OPTIONS.map(option => `<option value="${option}">${option}</option>`).join("");
    regulationSelect.value = currentState.instantCalculator.regulation;
  }

  host.innerHTML = currentState.instantCalculator.rows.map((row, index) => `
    <div class="instant-row" data-instant-row="${index}">
      <label class="instant-field">
        <span class="instant-field__label">Subject Name</span>
        <input type="text" placeholder="Subject name" value="${escapeHtml(row.name || "")}" data-field="name" />
      </label>
      <label class="instant-field">
        <span class="instant-field__label">Subject Code</span>
        <input type="text" placeholder="Subject code" value="${escapeHtml(row.code || "")}" data-field="code" />
      </label>
      <label class="instant-field">
        <span class="instant-field__label">Credits</span>
        <input type="number" min="0.5" step="0.5" placeholder="Credits" value="${escapeHtml(String(row.credits || ""))}" data-field="credits" />
      </label>
      <label class="instant-field">
        <span class="instant-field__label">Grade</span>
        <select data-field="grade">
          ${["", "S", "A", "B", "C", "D", "E", "F", "Ab"].map(grade => `<option value="${grade}"${row.grade === grade ? " selected" : ""}>${grade || "Grade"}</option>`).join("")}
        </select>
      </label>
      <button class="instant-remove-btn" type="button" data-remove-row="${index}" aria-label="Remove subject">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join("");

  host.querySelectorAll("input, select").forEach(input => {
    const syncRow = async event => {
      const rowNode = event.target.closest("[data-instant-row]");
      if (!rowNode) return;
      const index = Number(rowNode.dataset.instantRow);
      const field = event.target.dataset.field;
      currentState.instantCalculator.rows[index][field] = event.target.value;
      updateInstantSummary(currentState.instantCalculator);
      await persistInstantCalculator();
    };

    input.addEventListener("input", syncRow);
    input.addEventListener("change", syncRow);
  });

  host.querySelectorAll("[data-remove-row]").forEach(button => {
    button.addEventListener("click", async () => {
      if (currentState.instantCalculator.rows.length === 1) {
        currentState.instantCalculator.rows = [createEmptyInstantRow()];
      } else {
        currentState.instantCalculator.rows.splice(Number(button.dataset.removeRow), 1);
      }
      renderInstantCalculator();
      await persistInstantCalculator();
    });
  });

  updateInstantSummary(currentState.instantCalculator);
}

function updateInstantSummary(calculatorState, forceValidation = false) {
  const valueNode = document.getElementById("instantSgpaValue");
  const metaNode = document.getElementById("instantSgpaMeta");
  if (!valueNode || !metaNode) return;

  const { rows, semester, regulation } = calculatorState;
  const nonEmptyRows = rows.filter(row => Object.values(row).some(value => String(value || "").trim()));
  const validRows = rows.filter(isInstantRowValid);
  const invalidRows = rows.filter(row => !isInstantRowBlank(row) && !isInstantRowValid(row));
  const weighted = validRows.reduce((acc, row) => acc + Number(row.credits) * (GRADE_POINTS[row.grade] ?? 0), 0);
  const credits = validRows.reduce((acc, row) => acc + Number(row.credits), 0);
  const sgpa = credits ? weighted / credits : 0;
  const averageCredits = validRows.length ? credits / validRows.length : 0;
  const backlogCount = validRows.filter(row => row.grade === "F" || row.grade === "Ab").length;
  const progressTotal = Math.max(rows.length * 4, 1);
  const completedFields = rows.reduce((acc, row) => acc
    + Number(Boolean(row.name?.trim()))
    + Number(Boolean(row.code?.trim()))
    + Number(Boolean(String(row.credits || "").trim()))
    + Number(Boolean(row.grade?.trim())), 0);
  const progress = Math.round((completedFields / progressTotal) * 100);
  const performance = getPerformanceLabel(sgpa, credits);

  valueNode.textContent = sgpa.toFixed(2);
  metaNode.textContent = validRows.length
    ? `${validRows.length} validated subjects | ${credits.toFixed(1)} credits | weighted live SGPA`
    : "Add your subjects, credits, and grades to calculate instantly.";

  setText("instantTotalCredits", credits.toFixed(1));
  setText("instantWeightedPoints", weighted.toFixed(1));
  setText("instantCompletedCount", `${validRows.length} / ${rows.length}`);
  setText("instantSubjectCount", validRows.length ? `${nonEmptyRows.length} active rows with ${invalidRows.length} pending validation` : "No validated subjects yet");
  setText("instantAverageCredits", averageCredits.toFixed(1));
  setText("instantSummarySemester", `Semester ${semester}`);
  setText("instantSummaryRegulation", regulation);
  setText("instantSummaryPerformance", performance.label);
  setText("instantSummaryBacklog", `${backlogCount} subjects`);
  setText("instantProgressLabel", `${progress}% complete`);

  const progressBar = document.getElementById("instantProgressBar");
  if (progressBar) progressBar.style.width = `${progress}%`;

  const badge = document.getElementById("instantPerformanceBadge");
  if (badge) {
    badge.textContent = performance.label;
    badge.className = `performance-badge performance-badge--${performance.tone}`;
  }

  const validationNode = document.getElementById("instantValidationMessage");
  if (validationNode) {
    if (!nonEmptyRows.length) {
      validationNode.textContent = "Fill in every subject row to unlock accurate live SGPA updates.";
    } else if (invalidRows.length) {
      validationNode.textContent = forceValidation
        ? "Complete subject name, code, credits, and grade for each active row before finalizing SGPA."
        : `${invalidRows.length} row${invalidRows.length > 1 ? "s are" : " is"} incomplete. Live SGPA uses only fully completed subjects.`;
    } else {
      validationNode.textContent = "All visible rows are valid. Your SGPA summary is fully up to date.";
    }
  }

  document.querySelectorAll("[data-instant-row]").forEach((rowNode, index) => {
    rowNode.classList.toggle("is-invalid", !isInstantRowBlank(rows[index]) && !isInstantRowValid(rows[index]));
  });

  renderGradeBreakdown(validRows);
}

function computeSummary(state) {
  const savedSemesters = SEMESTER_KEYS
    .filter(key => state.semesters[key]?.subjects?.length)
    .map(key => ({ key, ...state.semesters[key] }));

  const totals = savedSemesters.reduce((acc, sem) => {
    acc.weighted += sem.sgpa * sem.credits;
    acc.credits += sem.credits;
    acc.backlogs += sem.backlogs || 0;
    return acc;
  }, { weighted: 0, credits: 0, backlogs: 0 });

  const cgpa = totals.credits ? totals.weighted / totals.credits : 0;
  const percentage = cgpa > 0 ? Math.max((cgpa - 0.5) * 10, 0) : 0;

  return {
    savedSemesters,
    completedSemesters: savedSemesters.length,
    totalCredits: Number(totals.credits.toFixed(1)),
    cgpa: Number(cgpa.toFixed(2)),
    percentage: Number(percentage.toFixed(1)),
    backlogs: totals.backlogs
  };
}

function emptySemester() {
  return {
    subjects: [],
    credits: 0,
    sgpa: 0,
    backlogs: 0,
    isOpen: false
  };
}

function normalizeInstantCalculatorSettings(settings, fallbackRegulation = "R23") {
  if (Array.isArray(settings)) {
    return {
      semester: "1-1",
      regulation: fallbackRegulation || "R23",
      rows: settings.length
        ? settings.map(row => ({
          name: row?.name || "",
          code: row?.code || "",
          credits: String(row?.credits || ""),
          grade: row?.grade || ""
        }))
        : [createEmptyInstantRow()]
    };
  }

  return {
    semester: settings?.semester || "1-1",
    regulation: settings?.regulation || fallbackRegulation || "R23",
    rows: Array.isArray(settings?.rows) && settings.rows.length
      ? settings.rows.map(row => ({
        name: row?.name || "",
        code: row?.code || "",
        credits: String(row?.credits || ""),
        grade: row?.grade || ""
      }))
      : [createEmptyInstantRow()]
  };
}

function createEmptyInstantRow() {
  return { name: "", code: "", credits: "", grade: "" };
}

function isInstantRowBlank(row) {
  return !row.name?.trim() && !row.code?.trim() && !String(row.credits || "").trim() && !row.grade?.trim();
}

function isInstantRowValid(row) {
  return Boolean(row.name?.trim())
    && Boolean(row.code?.trim())
    && Number(row.credits) > 0
    && Boolean(row.grade?.trim());
}

function getPerformanceLabel(sgpa, credits) {
  if (!credits) return { label: "Awaiting data", tone: "idle" };
  if (sgpa >= 9) return { label: "Excellent", tone: "excellent" };
  if (sgpa >= 7.5) return { label: "Good", tone: "good" };
  if (sgpa >= 6) return { label: "Average", tone: "average" };
  return { label: "Needs Improvement", tone: "needs-improvement" };
}

function renderGradeBreakdown(validRows) {
  const host = document.getElementById("instantGradeBreakdown");
  if (!host) return;

  const counts = ["S", "A", "B", "C", "D", "E", "F", "Ab"].map(grade => ({
    grade,
    count: validRows.filter(row => row.grade === grade).length
  }));

  host.innerHTML = counts.map(({ grade, count }) => `
    <div class="grade-pill">
      <div class="grade-pill__left">
        <span class="grade-pill__badge">${grade}</span>
        <div>
          <strong>${GRADE_POINTS[grade]} pts</strong>
          <div class="grade-pill__count">${count} subject${count === 1 ? "" : "s"}</div>
        </div>
      </div>
      <span>${count}</span>
    </div>
  `).join("");
}

function compressBranch(branch) {
  return branch
    .replace("Computer Science and Engineering", "CSE")
    .replace("Electronics and Communication Engineering", "ECE")
    .replace("Electrical and Electronics Engineering", "EEE");
}

function hasIncompleteProfile(profile, user) {
  return !profile?.name
    || !(profile?.hallTicket || profile?.roll)
    || !profile?.branch
    || !profile?.regulation
    || !profile?.email
    || (!profile?.photoURL && !profile?.avatar && !user?.photoURL);
}

function normalizeProfileData(profile, user, baseProfile = defaultState.profile) {
  const fallbackName = user.displayName || user.email?.split("@")[0] || "Student";
  return {
    ...baseProfile,
    name: profile?.name || fallbackName,
    hallTicket: profile?.hallTicket || profile?.roll || "Not set",
    branch: profile?.branch || "Department",
    regulation: profile?.regulation || "R23",
    email: profile?.email || user.email || "",
    joiningYear: profile?.joiningYear ? String(profile.joiningYear) : "",
    phone: profile?.phone || "",
    collegeName: profile?.collegeName || "",
    gender: profile?.gender || "",
    dob: profile?.dob || "",
    avatar: profile?.photoURL || profile?.avatar || user.photoURL || `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(user.email || fallbackName)}`
  };
}

async function backfillProfile(profile) {
  if (!currentUser) return;
  await saveUserProfile(currentUser.uid, {
    name: profile.name,
    email: profile.email,
    hallTicket: profile.hallTicket,
    roll: profile.hallTicket,
    branch: profile.branch,
    regulation: profile.regulation,
    joiningYear: profile.joiningYear,
    phone: profile.phone,
    collegeName: profile.collegeName,
    gender: profile.gender,
    dob: profile.dob,
    photoURL: profile.avatar
  });
}

function initProfilePanel() {
  const root = document.getElementById("profileReactRoot");
  if (!root || profilePanel) return;
  profilePanel = mountProfilePanel(root);
}

function syncProfilePanel(summary = computeSummary(currentState)) {
  initProfilePanel();
  profilePanel?.render({
    refreshKey: profilePanelRefreshKey,
    summary,
    statusMessage: profileStatusMessage,
    fetchProfile: refreshProfileState,
    saveProfile: saveProfileChanges,
    onPhotoSelect: file => {
      pendingProfilePhotoFile = file || null;
      profileStatusMessage = file
        ? "Photo selected. Save changes to sync it."
        : "Profile changes discarded.";
    },
    onCancelEdit: () => {
      pendingProfilePhotoFile = null;
      profileStatusMessage = "Profile changes discarded.";
    }
  });
}

async function refreshProfileState() {
  if (!currentUser) return currentState.profile;

  try {
    const profile = await getUserProfile(currentUser.uid);
    const normalizedProfile = normalizeProfileData(profile, currentUser);

    if (!profile || hasIncompleteProfile(profile, currentUser)) {
      await backfillProfile(normalizedProfile);
    }

    currentState.profile = normalizedProfile;
    hydrateProfile(currentState);
    profileStatusMessage = "Profile synced with your account.";
    return normalizedProfile;
  } catch (error) {
    console.error("Profile refresh error:", error);
    profileStatusMessage = "Unable to fetch the latest profile right now.";
    return currentState.profile;
  }
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
