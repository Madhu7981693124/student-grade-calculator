import {
  requireAuth,
  logout as firebaseLogout,
  getUserProfile,
  getSemesterRecords,
  saveSemesterRecord,
  getUserSetting,
  saveUserSetting,
  saveUserProfile,
  updateUserProfile
} from "./app.js";
import { mountProfilePanel } from "./profile-panel.js";
import { CURRICULUM, BRANCH_OPTIONS, normalizeBranchCode } from "./curriculum-data.js";

const THEME_KEY = "theme";
const SETTINGS_DOC_ID = "dashboard";
const SEMESTER_KEYS = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];
const GRADE_POINTS = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0, Ab: 0 };
const REGULATION_OPTIONS = ["R23", "R20"];

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
    dob: ""
  },
  semesters: {},
  instantCalculator: {
    branch: "CSE",
    semester: "1-1",
    regulation: "R23",
    rows: [
      { name: "Mathematics", credits: "3", grade: "A" },
      { name: "Programming", credits: "4", grade: "S" }
    ]
  }
};

let trendChart = null;
let currentUser = null;
let currentState = structuredClone(defaultState);
let profilePanel = null;
let sharedActionsReady = false;
let profilePanelRefreshKey = 0;
let profileStatusMessage = "Profile synced with your account.";
let syllabusControlsReady = false;
let syllabusLoadArmed = false;
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

function getAvatarLetter(name) {
  const trimmedName = String(name || "").trim();
  return trimmedName ? trimmedName.charAt(0).toUpperCase() : "S";
}

function normalizeRegulation(regulation, fallback = "R23") {
  const candidate = String(regulation || "").trim().toUpperCase();
  if (REGULATION_OPTIONS.includes(candidate)) return candidate;
  return REGULATION_OPTIONS.includes(fallback) ? fallback : "R23";
}

function getCurrentRegulation() {
  return normalizeRegulation(currentState.profile.regulation, "R23");
}

function hydrateProfile(state) {
  const { name, hallTicket, branch, regulation } = state.profile;
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
    const avatarNode = document.getElementById(id);
    if (avatarNode) {
      avatarNode.textContent = getAvatarLetter(name);
      avatarNode.setAttribute("aria-label", `${name || "Student"} avatar`);
    }
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
  const applyInstantSyllabusBtn = document.getElementById("applyInstantSyllabusBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const instantBranchSelect = document.getElementById("instantBranchSelect");
  const instantSemesterSelect = document.getElementById("instantSemesterSelect");
  const instantRegulationSelect = document.getElementById("instantRegulationSelect");
  const resultExportModal = document.getElementById("resultExportModal");
  const openResultExportBtn = document.getElementById("openResultExportBtn");
  const closeResultExportBtn = document.getElementById("closeResultExportBtn");
  const downloadResultPdfBtn = document.getElementById("downloadResultPdfBtn");
  const printResultBtn = document.getElementById("printResultBtn");
  const shareResultBtn = document.getElementById("shareResultBtn");

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

  [resultExportModal].forEach(modal => {
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
      branch: currentState.instantCalculator.branch || normalizeBranchCode(currentState.profile.branch) || "CSE",
      semester: currentState.instantCalculator.semester || "1-1",
      regulation: getCurrentRegulation(),
      rows: [createEmptyInstantRow()]
    };
    renderInstantCalculator();
    await persistInstantCalculator();
  });

  instantBranchSelect?.addEventListener("change", async event => {
    currentState.instantCalculator.branch = event.target.value;
    syncInstantSyllabusStatus();
    updateInstantSummary(currentState.instantCalculator);
    await persistInstantCalculator();
  });

  instantSemesterSelect?.addEventListener("change", async event => {
    currentState.instantCalculator.semester = event.target.value;
    syncInstantSyllabusStatus();
    updateInstantSummary(currentState.instantCalculator);
    await persistInstantCalculator();
  });

  applyInstantSyllabusBtn?.addEventListener("click", async () => {
    applyInstantSyllabus();
    await persistInstantCalculator();
  });

  openResultExportBtn?.addEventListener("click", () => {
    const exportData = buildSemesterExportData();
    resultExportModal?.classList.add("is-open");

    if (!exportData.ok) {
      setResultExportStatus(exportData.message, true);
      renderResultSheetPreview(null);
      return;
    }

    renderResultSheetPreview(exportData.data);
    setResultExportStatus(`Preview ready for Semester ${exportData.data.semesterKey}. You can now download, print, or share the result sheet.`);
  });

  closeResultExportBtn?.addEventListener("click", () => resultExportModal?.classList.remove("is-open"));

  downloadResultPdfBtn?.addEventListener("click", async () => {
    const exportData = buildSemesterExportData();
    if (!exportData.ok) {
      setResultExportStatus(exportData.message, true);
      return;
    }

    renderResultSheetPreview(exportData.data);
    await downloadResultSheetPdf(exportData.data);
  });

  printResultBtn?.addEventListener("click", () => {
    const exportData = buildSemesterExportData();
    if (!exportData.ok) {
      setResultExportStatus(exportData.message, true);
      return;
    }

    renderResultSheetPreview(exportData.data);
    printResultSheet(exportData.data);
  });

  shareResultBtn?.addEventListener("click", async () => {
    const exportData = buildSemesterExportData();
    if (!exportData.ok) {
      setResultExportStatus(exportData.message, true);
      return;
    }

    renderResultSheetPreview(exportData.data);
    await shareResultSheet(exportData.data);
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
      resultExportModal?.classList.remove("is-open");
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
  initSyllabusControls();

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
      <input type="number" min="0" step="0.5" placeholder="Credits" value="${escapeHtml(String(subject.credits || ""))}" />
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
    <input type="number" min="0" step="0.5" placeholder="Credits" />
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
  syncSelectedSemester(key, shouldOpen);
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
    if (!name || !Number.isFinite(credits) || credits < 0 || !grade) return;
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

function buildSemesterExportData() {
  const semesterKey = getSelectedSemesterKey();
  if (!semesterKey) {
    return { ok: false, message: "Choose a semester first so the result sheet knows which semester to export." };
  }

  const subjects = readSemesterRows(semesterKey);
  if (!subjects.length) {
    return { ok: false, message: `Semester ${semesterKey} has no subjects yet. Load subjects or add rows before exporting.` };
  }

  const invalidSubject = subjects.find(subject => !subject.name || !Number.isFinite(subject.credits) || subject.credits < 0 || !subject.grade);
  if (invalidSubject) {
    return { ok: false, message: "Complete subject name, credits, and grade for every visible row before exporting the result sheet." };
  }

  const totalCredits = Number(subjects.reduce((sum, subject) => sum + subject.credits, 0).toFixed(1));
  const weightedPoints = subjects.reduce((sum, subject) => sum + (subject.credits * (GRADE_POINTS[subject.grade] ?? 0)), 0);
  const passedSubjects = subjects.filter(subject => subject.grade !== "F" && subject.grade !== "Ab").length;
  const sgpa = totalCredits ? Number((weightedPoints / totalCredits).toFixed(2)) : 0;
  const regulation = document.getElementById("syllabusRegulationSelect")?.value
    || currentState.profile.regulation
    || "R23";
  const profile = currentState.profile || defaultState.profile;

  return {
    ok: true,
    data: {
      semesterKey,
      regulation,
      branch: document.getElementById("syllabusBranchSelect")?.value || normalizeBranchCode(profile.branch) || "CSE",
      examTitle: formatSemesterExamTitle(semesterKey, regulation),
      studentName: profile.name || "Student",
      hallTicket: profile.hallTicket || "Not set",
      collegeName: profile.collegeName || "College Name Not Available",
      totalCredits,
      passedSubjects,
      appearedSubjects: subjects.length,
      sgpa,
      subjects: subjects.map((subject, index) => ({
        ...subject,
        serialNumber: index + 1,
        gradePoint: GRADE_POINTS[subject.grade] ?? 0,
        status: subject.grade === "F" || subject.grade === "Ab" ? "Fail" : "Pass"
      }))
    }
  };
}

function getSelectedSemesterKey() {
  return document.getElementById("syllabusSemesterSelect")?.value || getOpenSemesterKey() || "";
}

function readSemesterRows(key) {
  const list = document.getElementById(`subjects-${key}`);
  if (list) {
    const rows = Array.from(list.querySelectorAll(".subject-row"));
    const subjects = rows.map(row => {
      const [nameInput, creditInput, gradeSelect] = row.querySelectorAll("input, select");
      return {
        name: nameInput?.value.trim() || "",
        credits: parseFloat(creditInput?.value),
        grade: gradeSelect?.value || ""
      };
    }).filter(subject => subject.name || Number.isFinite(subject.credits) || subject.grade);

    if (subjects.length) return subjects;
  }

  return Array.isArray(currentState.semesters[key]?.subjects)
    ? currentState.semesters[key].subjects.map(subject => ({
      name: subject.name || "",
      credits: Number(subject.credits),
      grade: subject.grade || ""
    }))
    : [];
}

function formatSemesterExamTitle(semesterKey, regulation) {
  const [year, part] = String(semesterKey).split("-");
  const yearMap = {
    1: "I B. TECH",
    2: "II B. TECH",
    3: "III B. TECH",
    4: "IV B. TECH"
  };
  const semesterMap = {
    1: "I SEMESTER",
    2: "II SEMESTER"
  };

  return `${yearMap[year] || `Semester ${semesterKey}`} ${semesterMap[part] || ""} REGULAR EXAMINATIONS (${regulation})`.trim();
}

function renderResultSheetPreview(data) {
  const host = document.getElementById("resultSheetPreview");
  if (!host) return;

  if (!data) {
    host.innerHTML = `
      <div class="result-sheet-placeholder">
        <i class="fa-solid fa-file-circle-plus"></i>
        <strong>Result sheet preview will appear here.</strong>
        <span>Load or edit a semester, add grades, then use Export Result.</span>
      </div>
    `;
    return;
  }

  host.innerHTML = `
    <article class="result-sheet" id="resultSheetCard">
      <header class="result-sheet__header">
        <p class="result-sheet__brand">Jawaharlal Nehru Technological University Style Result Sheet</p>
        <h2>${escapeHtml(data.examTitle)}</h2>
        <div class="result-sheet__meta">
          <span><strong>Branch:</strong> ${escapeHtml(data.branch)}</span>
          <span><strong>Regulation:</strong> ${escapeHtml(data.regulation)}</span>
        </div>
      </header>

      <section class="result-sheet__details">
        <div class="result-detail"><span>Student Name</span><strong>${escapeHtml(data.studentName)}</strong></div>
        <div class="result-detail"><span>Hall Ticket Number</span><strong>${escapeHtml(data.hallTicket)}</strong></div>
        <div class="result-detail"><span>College Name</span><strong>${escapeHtml(data.collegeName)}</strong></div>
        <div class="result-detail"><span>SGPA</span><strong>${data.sgpa.toFixed(2)}</strong></div>
        <div class="result-detail"><span>Total Credits</span><strong>${data.totalCredits.toFixed(1)}</strong></div>
        <div class="result-detail"><span>Total Subjects Appeared</span><strong>${data.appearedSubjects}</strong></div>
        <div class="result-detail"><span>Total Subjects Passed</span><strong>${data.passedSubjects}</strong></div>
      </section>

      <table class="result-sheet__table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Course Name</th>
            <th>Grade</th>
            <th>Grade Point</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data.subjects.map(subject => `
            <tr>
              <td>${subject.serialNumber}</td>
              <td>${escapeHtml(subject.name)}</td>
              <td>${escapeHtml(subject.grade)}</td>
              <td>${subject.gradePoint}</td>
              <td>${subject.credits.toFixed(1)}</td>
              <td>${subject.status}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <footer class="result-sheet__footer">
        <div><strong>Result:</strong> ${data.passedSubjects === data.appearedSubjects ? "PASS" : "PASS WITH BACKLOGS"}</div>
        <div><strong>Generated:</strong> ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
      </footer>
    </article>
  `;
}

function setResultExportStatus(message, isError = false) {
  const node = document.getElementById("resultExportStatus");
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("is-error", Boolean(isError));
}

async function downloadResultSheetPdf(data) {
  try {
    const canvas = await renderResultSheetCanvas();
    const pdf = buildPdfFromCanvas(canvas);
    pdf.save(buildResultExportFilename(data, "pdf"));
    setResultExportStatus(`PDF downloaded for Semester ${data.semesterKey}.`);
  } catch (error) {
    console.error("Result PDF export error:", error);
    setResultExportStatus("Unable to generate the PDF right now. Please try again.", true);
  }
}

async function shareResultSheet(data) {
  try {
    const shareText = [
      data.examTitle,
      `Student: ${data.studentName}`,
      `Hall Ticket: ${data.hallTicket}`,
      `SGPA: ${data.sgpa.toFixed(2)}`,
      `Credits: ${data.totalCredits.toFixed(1)}`,
      `Passed: ${data.passedSubjects}/${data.appearedSubjects}`
    ].join("\n");

    const canvas = await renderResultSheetCanvas();
    const pdf = buildPdfFromCanvas(canvas);
    const blob = pdf.output("blob");
    const file = new File([blob], buildResultExportFilename(data, "pdf"), { type: "application/pdf" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: `Semester ${data.semesterKey} Result`,
        text: shareText,
        files: [file]
      });
      setResultExportStatus(`Result shared for Semester ${data.semesterKey}.`);
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: `Semester ${data.semesterKey} Result`,
        text: shareText
      });
      setResultExportStatus(`Result shared for Semester ${data.semesterKey}.`);
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText);
      setResultExportStatus("Sharing is not supported on this device. Result details were copied to the clipboard instead.");
      return;
    }

    setResultExportStatus("Sharing is not supported in this browser.", true);
  } catch (error) {
    if (error?.name === "AbortError") {
      setResultExportStatus("Share cancelled.");
      return;
    }
    console.error("Result share error:", error);
    setResultExportStatus("Unable to share the result sheet right now.", true);
  }
}

function printResultSheet(data) {
  const preview = document.getElementById("resultSheetPreview");
  if (!preview) return;

  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=960,height=1200");
  if (!printWindow) {
    setResultExportStatus("Pop-up was blocked. Please allow pop-ups to print the result sheet.", true);
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Semester ${escapeHtml(data.semesterKey)} Result</title>
      <style>
        body { margin: 0; padding: 24px; background: #eef2f7; font-family: "Times New Roman", Georgia, serif; }
        .result-sheet { max-width: 794px; margin: 0 auto; background: #fff; color: #111827; border: 1px solid #d1d5db; padding: 28px; }
        .result-sheet__header { text-align: center; border-bottom: 1px solid #d1d5db; padding-bottom: 18px; }
        .result-sheet__header h2 { margin: 10px 0 0; font-size: 22px; line-height: 1.5; }
        .result-sheet__brand { margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em; color: #4b5563; }
        .result-sheet__meta { display: flex; justify-content: center; gap: 18px; flex-wrap: wrap; margin-top: 12px; font-size: 14px; }
        .result-sheet__details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 22px 0; }
        .result-detail { border: 1px solid #d1d5db; padding: 12px 14px; }
        .result-detail span { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #6b7280; margin-bottom: 6px; }
        .result-detail strong { font-size: 15px; }
        .result-sheet__table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .result-sheet__table th, .result-sheet__table td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
        .result-sheet__table th { background: #f8fafc; }
        .result-sheet__footer { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; border-top: 1px solid #d1d5db; padding-top: 18px; margin-top: 20px; font-size: 14px; }
        @media print {
          body { background: #fff; padding: 0; }
          .result-sheet { border: none; margin: 0; max-width: none; }
        }
      </style>
    </head>
    <body>${preview.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  setResultExportStatus(`Print view opened for Semester ${data.semesterKey}.`);
}

async function renderResultSheetCanvas() {
  const target = document.getElementById("resultSheetCard");
  if (!target) throw new Error("Result sheet preview is not available.");
  if (!window.html2canvas) throw new Error("html2canvas is unavailable.");

  return window.html2canvas(target, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  });
}

function buildPdfFromCanvas(canvas) {
  const JsPdfCtor = window.jspdf?.jsPDF;
  if (!JsPdfCtor) throw new Error("jsPDF is unavailable.");

  const pdf = new JsPdfCtor({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const usableWidth = pageWidth - (margin * 2);
  const usableHeight = pageHeight - (margin * 2);
  const imageWidth = usableWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;
  const finalHeight = Math.min(imageHeight, usableHeight);
  const imageData = canvas.toDataURL("image/png");

  pdf.addImage(imageData, "PNG", margin, margin, imageWidth, finalHeight, undefined, "FAST");
  return pdf;
}

function buildResultExportFilename(data, extension) {
  const safeHallTicket = String(data.hallTicket || "student").replace(/[^a-z0-9-_]/gi, "_");
  return `semester-${data.semesterKey}-result-${safeHallTicket}.${extension}`;
}

async function saveProfileChanges(draft) {
  if (!currentUser) return;

  const normalizedRegulation = getCurrentRegulation();
  const updatedProfile = {
    ...currentState.profile,
    name: draft.fullName?.trim() || currentState.profile.name,
    email: currentUser.email || currentState.profile.email || "",
    hallTicket: draft.hallTicket || currentState.profile.hallTicket,
    branch: draft.branch?.trim() || "",
    regulation: normalizedRegulation,
    joiningYear: draft.joiningYear?.trim() || "",
    phone: draft.phone?.trim() || "",
    collegeName: draft.collegeName?.trim() || "",
    gender: draft.gender || "",
    dob: draft.dob || ""
  };

  try {
    await backfillProfile(updatedProfile);

    await updateUserProfile({
      displayName: updatedProfile.name
    });

    currentState.profile = updatedProfile;
    currentState.instantCalculator.regulation = normalizedRegulation;
    hydrateProfile(currentState);
    if (document.body.dataset.page === "instant-calculator") {
      renderInstantCalculator();
    }
    if (document.body.dataset.page === "semesters") {
      initSyllabusControls();
      syncSyllabusStatus();
    }
    profileStatusMessage = "Profile updated successfully.";
    return updatedProfile;
  } catch (error) {
    console.error("Profile update error:", error);
    profileStatusMessage = error?.message
      ? `Unable to save profile changes right now: ${error.message}`
      : "Unable to save profile changes right now.";
    return false;
  }
}

function renderInstantCalculator() {
  const host = document.getElementById("instantRows");
  if (!host) return;

  const branchSelect = document.getElementById("instantBranchSelect");
  const semesterSelect = document.getElementById("instantSemesterSelect");
  const regulationSelect = document.getElementById("instantRegulationSelect");

  if (branchSelect) {
    branchSelect.innerHTML = BRANCH_OPTIONS.map(option => `<option value="${option.code}">${option.code} - ${option.label}</option>`).join("");
    branchSelect.value = BRANCH_OPTIONS.some(option => option.code === currentState.instantCalculator.branch)
      ? currentState.instantCalculator.branch
      : normalizeBranchCode(currentState.profile.branch) || "CSE";
    currentState.instantCalculator.branch = branchSelect.value;
  }

  if (semesterSelect) {
    semesterSelect.innerHTML = SEMESTER_KEYS.map(key => `<option value="${key}">Semester ${key}</option>`).join("");
    semesterSelect.value = currentState.instantCalculator.semester;
  }

  if (regulationSelect) {
    const regulation = getCurrentRegulation();
    regulationSelect.innerHTML = `<option value="${regulation}">${regulation}</option>`;
    regulationSelect.value = regulation;
    regulationSelect.disabled = true;
    currentState.instantCalculator.regulation = regulation;
  }

  syncInstantSyllabusStatus();

  host.innerHTML = currentState.instantCalculator.rows.map((row, index) => `
    <div class="instant-row" data-instant-row="${index}">
      <label class="instant-field">
        <span class="instant-field__label">Subject Name</span>
        <input type="text" placeholder="Subject name" value="${escapeHtml(row.name || "")}" data-field="name" />
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
  const progressTotal = Math.max(rows.length * 3, 1);
  const completedFields = rows.reduce((acc, row) => acc
    + Number(Boolean(row.name?.trim()))
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
        ? "Complete subject name, credits, and grade for each active row before finalizing SGPA."
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
  const regulation = normalizeRegulation(fallbackRegulation, "R23");
  if (Array.isArray(settings)) {
    return {
      branch: "CSE",
      semester: "1-1",
      regulation,
      rows: settings.length
        ? settings.map(row => ({
          name: row?.name || "",
          credits: String(row?.credits || ""),
          grade: row?.grade || ""
        }))
        : [createEmptyInstantRow()]
    };
  }

  return {
    branch: settings?.branch || "CSE",
    semester: settings?.semester || "1-1",
    regulation,
    rows: Array.isArray(settings?.rows) && settings.rows.length
      ? settings.rows.map(row => ({
        name: row?.name || "",
        credits: String(row?.credits || ""),
        grade: row?.grade || ""
      }))
      : [createEmptyInstantRow()]
  };
}

function syncInstantSyllabusStatus() {
  const statusNode = document.getElementById("instantSyllabusStatus");
  if (!statusNode) return;

  const regulation = getCurrentRegulation();
  const branch = document.getElementById("instantBranchSelect")?.value || currentState.instantCalculator.branch || "";
  const semester = document.getElementById("instantSemesterSelect")?.value || currentState.instantCalculator.semester || "";
  const subjects = CURRICULUM[regulation]?.[branch]?.[semester];

  if (!branch || !semester) {
    statusNode.textContent = `Choose branch and semester to load subjects for your ${regulation} regulation.`;
    return;
  }

  if (!subjects?.length) {
    statusNode.textContent = `No syllabus data is available for ${branch} ${semester} under ${regulation} yet.`;
    return;
  }

  const totalCredits = subjects.reduce((sum, subject) => sum + Number(subject.credits || 0), 0);
  statusNode.textContent = `${subjects.length} official subjects are available for ${branch} ${semester} under ${regulation}, totaling ${totalCredits.toFixed(1)} credits. Loading will replace the current calculator rows.`;
}

function applyInstantSyllabus() {
  const statusNode = document.getElementById("instantSyllabusStatus");
  const branch = document.getElementById("instantBranchSelect")?.value || currentState.instantCalculator.branch || "";
  const semester = document.getElementById("instantSemesterSelect")?.value || currentState.instantCalculator.semester || "";
  const regulation = getCurrentRegulation();
  const subjects = CURRICULUM[regulation]?.[branch]?.[semester];

  if (!subjects?.length) {
    if (statusNode) statusNode.textContent = `No syllabus data is available for ${branch} ${semester} under ${regulation} yet.`;
    return;
  }

  currentState.instantCalculator.branch = branch;
  currentState.instantCalculator.semester = semester;
  currentState.instantCalculator.regulation = regulation;
  currentState.instantCalculator.rows = subjects.map((subject, index) => ({
    name: subject.name,
    credits: String(subject.credits),
    grade: ""
  }));

  renderInstantCalculator();

  if (statusNode) {
    statusNode.textContent = `Loaded ${subjects.length} official subjects into the Instant SGPA Calculator for ${branch} ${semester}. Add grades to calculate immediately.`;
  }
}

function initSyllabusControls() {
  const regulationSelect = document.getElementById("syllabusRegulationSelect");
  const branchSelect = document.getElementById("syllabusBranchSelect");
  const semesterSelect = document.getElementById("syllabusSemesterSelect");
  const applyButton = document.getElementById("applySyllabusBtn");
  if (!regulationSelect || !branchSelect || !semesterSelect || !applyButton) return;

  if (!syllabusControlsReady) {
    branchSelect.addEventListener("change", syncSyllabusStatus);
    semesterSelect.addEventListener("change", () => {
      syllabusLoadArmed = Boolean(semesterSelect.value);
      syncSyllabusStatus();
    });
    applyButton.addEventListener("click", applySelectedSyllabus);
    syllabusControlsReady = true;
  }

  const regulation = getCurrentRegulation();
  regulationSelect.innerHTML = `<option value="${regulation}">${regulation}</option>`;
  branchSelect.innerHTML = BRANCH_OPTIONS.map(option => `<option value="${option.code}">${option.code} - ${option.label}</option>`).join("");
  semesterSelect.innerHTML = [`<option value="">Select semester</option>`, ...SEMESTER_KEYS.map(key => `<option value="${key}">Semester ${key}</option>`)].join("");

  regulationSelect.value = regulation;
  regulationSelect.disabled = true;
  branchSelect.value = BRANCH_OPTIONS.some(option => option.code === normalizeBranchCode(currentState.profile.branch))
    ? normalizeBranchCode(currentState.profile.branch)
    : "CSE";
  semesterSelect.value = getOpenSemesterKey() || "";
  syllabusLoadArmed = false;
  syncLoadSubjectsButton(Boolean(semesterSelect.value) && syllabusLoadArmed);
  syncSyllabusStatus();
}

function syncSyllabusStatus() {
  const regulation = getCurrentRegulation();
  const branch = document.getElementById("syllabusBranchSelect")?.value || "";
  const semester = document.getElementById("syllabusSemesterSelect")?.value || "";
  const statusNode = document.getElementById("syllabusStatus");
  if (!statusNode) return;
  syncLoadSubjectsButton(Boolean(semester) && syllabusLoadArmed);

  const subjects = CURRICULUM[regulation]?.[branch]?.[semester];
  if (!branch || !semester) {
    statusNode.textContent = "Select or click a semester card to enable subject loading.";
    return;
  }

  if (!subjects?.length) {
    statusNode.textContent = `No syllabus data is available for ${branch} ${semester} under ${regulation} yet.`;
    return;
  }

  const totalCredits = subjects.reduce((sum, subject) => sum + Number(subject.credits || 0), 0);
  statusNode.textContent = `${subjects.length} subjects available for ${branch} ${semester} under ${regulation} with ${totalCredits.toFixed(1)} credits. Loading replaces the visible editor rows for that semester until you save.`;
}

function applySelectedSyllabus() {
  const regulation = getCurrentRegulation();
  const branch = document.getElementById("syllabusBranchSelect")?.value || "";
  const semester = document.getElementById("syllabusSemesterSelect")?.value || "";
  const statusNode = document.getElementById("syllabusStatus");
  const subjects = CURRICULUM[regulation]?.[branch]?.[semester];

  if (!subjects?.length) {
    if (statusNode) statusNode.textContent = `No syllabus data is available for ${branch} ${semester} under ${regulation} yet.`;
    return;
  }

  currentState.semesters[semester] = {
    ...(currentState.semesters[semester] || emptySemester()),
    subjects: subjects.map(subject => ({
      name: subject.name,
      credits: subject.credits,
      grade: ""
    })),
    sgpa: 0,
    credits: 0,
    backlogs: 0,
    isOpen: true
  };

  Object.keys(currentState.semesters).forEach(key => {
    currentState.semesters[key].isOpen = key === semester;
  });

  syllabusLoadArmed = false;
  renderSemesterPage(currentState);
  if (statusNode) statusNode.textContent = `Loaded ${subjects.length} official subjects into Semester ${semester} for ${branch}. Review grades and click Save Semester when you're ready.`;
}

function syncSelectedSemester(key, isSelected) {
  const semesterSelect = document.getElementById("syllabusSemesterSelect");
  if (!semesterSelect) return;
  semesterSelect.value = isSelected ? key : "";
  syllabusLoadArmed = Boolean(semesterSelect.value);
  syncSyllabusStatus();
}

function syncLoadSubjectsButton(isVisible) {
  const applyButton = document.getElementById("applySyllabusBtn");
  if (!applyButton) return;
  applyButton.classList.toggle("syllabus-action--hidden", !isVisible);
  applyButton.setAttribute("aria-hidden", String(!isVisible));
  applyButton.disabled = !isVisible;
}

function getOpenSemesterKey() {
  return Object.entries(currentState.semesters).find(([, semester]) => semester?.isOpen)?.[0] || "";
}

function createEmptyInstantRow() {
  return { name: "", credits: "", grade: "" };
}

function isInstantRowBlank(row) {
  return !row.name?.trim() && !String(row.credits || "").trim() && !row.grade?.trim();
}

function isInstantRowValid(row) {
  return Boolean(row.name?.trim())
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
    .replace("Electrical and Electronics Engineering", "EEE")
    .replace("Mechanical Engineering", "MECHANICAL")
    .replace("Civil Engineering", "CIVIL");
}

function hasIncompleteProfile(profile, user) {
  return !profile?.name
    || !(profile?.hallTicket || profile?.roll)
    || !profile?.branch
    || !REGULATION_OPTIONS.includes(String(profile?.regulation || "").trim().toUpperCase())
    || !profile?.email;
}

function normalizeProfileData(profile, user, baseProfile = defaultState.profile) {
  const fallbackName = user.displayName || user.email?.split("@")[0] || "Student";
  const regulation = normalizeRegulation(profile?.regulation, baseProfile.regulation || "R23");
  return {
    ...baseProfile,
    name: profile?.name || fallbackName,
    hallTicket: profile?.hallTicket || profile?.roll || "Not set",
    branch: profile?.branch || "Department",
    regulation,
    email: profile?.email || user.email || "",
    joiningYear: profile?.joiningYear ? String(profile.joiningYear) : "",
    phone: profile?.phone || "",
    collegeName: profile?.collegeName || "",
    gender: profile?.gender || "",
    dob: profile?.dob || ""
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
    dob: profile.dob
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
    saveProfile: saveProfileChanges
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
    currentState.instantCalculator.regulation = normalizedProfile.regulation;
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
