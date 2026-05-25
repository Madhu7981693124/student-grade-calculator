const STORAGE_KEY = "gradeStudioState.v1";
const THEME_KEY = "theme";
const SEMESTER_KEYS = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];
const GRADE_POINTS = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0, Ab: 0 };

const defaultState = {
  profile: {
    name: "Madhu Student",
    hallTicket: "23A91A05N2",
    branch: "Computer Science and Engineering",
    regulation: "R23",
    avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=Madhu"
  },
  semesters: {},
  meta: {
    firebaseReady: true
  }
};

let chartInstance = null;
let toastTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  const state = loadState();
  applyTheme();
  initShell(state);

  const page = document.body.dataset.page;
  if (page === "dashboard") {
    initDashboardPage(state);
  }
  if (page === "semesters") {
    initSemestersPage(state);
  }
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      profile: { ...structuredClone(defaultState).profile, ...(parsed.profile || {}) },
      semesters: parsed.semesters || {}
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function persistState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  const themeLabel = document.getElementById("themeLabel");
  if (themeLabel) themeLabel.textContent = next === "dark" ? "Dark" : "Light";
}

function initShell(state) {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("sidebarCloseBtn");
  const themeCard = document.getElementById("themeToggleCard");

  const openSidebar = () => {
    if (!sidebar || !overlay || !menuBtn) return;
    sidebar.classList.add("is-open");
    overlay.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
  };

  const closeSidebar = () => {
    if (!sidebar || !overlay || !menuBtn) return;
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSidebar();
  });

  themeCard?.addEventListener("click", () => {
    toggleTheme();
    if (document.body.dataset.page === "dashboard") renderDashboard(loadState());
    if (document.body.dataset.page === "semesters") renderSemesterCards(loadState());
  });

  const themeLabel = document.getElementById("themeLabel");
  if (themeLabel) {
    themeLabel.textContent = (document.documentElement.getAttribute("data-theme") || "light") === "dark" ? "Dark" : "Light";
  }

  hydrateSharedProfile(state);
}

function hydrateSharedProfile(state) {
  const { name, branch, regulation, hallTicket, avatar } = state.profile;
  setText("sidebarName", name);
  setText("sidebarBranch", branch);
  setText("sidebarRegulation", regulation);
  setText("regBadge", regulation);
  setText("heroName", name);
  setText("heroBranch", branch);
  setText("heroRegulation", regulation);
  setText("heroHallTicket", hallTicket);
  const avatarImg = document.getElementById("sidebarAvatar");
  if (avatarImg) avatarImg.src = avatar;
}

function initDashboardPage(state) {
  renderDashboard(state);
}

function renderDashboard(state) {
  hydrateSharedProfile(state);
  const summary = computeSummary(state);

  setText("sidebarSemesterCount", String(summary.completedSemesters));
  setText("heroCgpa", summary.cgpa.toFixed(2));
  setText("heroCgpaLabel", summary.completedSemesters ? `${summary.completedSemesters} semester${summary.completedSemesters > 1 ? "s" : ""} saved` : "Start adding semester grades");
  setText("statCgpa", summary.cgpa.toFixed(2));
  setText("statPercentage", `${summary.percentage.toFixed(1)}%`);
  setText("statCredits", String(summary.totalCredits));
  setText("statBacklogs", String(summary.backlogs));

  renderRecentSemesters(state, summary.savedSemesters);
  renderTrendChart(summary.savedSemesters, summary);
}

function renderRecentSemesters(state, savedSemesters) {
  const host = document.getElementById("recentSemesters");
  const empty = document.getElementById("recentSemestersEmpty");
  if (!host || !empty) return;

  if (!savedSemesters.length) {
    host.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  host.className = "recent-list";
  host.innerHTML = savedSemesters
    .slice(-4)
    .reverse()
    .map(item => `
      <div class="recent-item">
        <div class="recent-item__meta">
          <strong>Semester ${item.key}</strong>
          <span>${item.subjects.length} subjects | ${item.credits} credits</span>
        </div>
        <div class="recent-item__sgpa">
          <span>SGPA</span>
          <strong>${item.sgpa.toFixed(2)}</strong>
        </div>
      </div>
    `)
    .join("");
}

function renderTrendChart(savedSemesters, summary) {
  const canvas = document.getElementById("trendChart");
  const summaryText = document.getElementById("chartSummary");
  if (!canvas || !summaryText) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (!savedSemesters.length) {
    summaryText.textContent = "Your academic graph will appear here once you save semesters.";
    return;
  }

  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const labelColor = dark ? "#cbd5e1" : "#475569";
  const gridColor = dark ? "rgba(148, 163, 184, 0.16)" : "rgba(148, 163, 184, 0.2)";

  chartInstance = new Chart(canvas, {
    type: "line",
    data: {
      labels: savedSemesters.map(item => item.key),
      datasets: [
        {
          data: savedSemesters.map(item => item.sgpa),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.14)",
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#2563eb",
          borderWidth: 3,
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { color: labelColor, stepSize: 1 },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: labelColor },
          grid: { color: gridColor }
        }
      }
    }
  });

  summaryText.textContent = `You have completed ${summary.completedSemesters} semesters with an overall CGPA of ${summary.cgpa.toFixed(2)} and ${summary.totalCredits} total credits.`;
}

function initSemestersPage(state) {
  setText("sidebarSemesterCount", String(computeSummary(state).completedSemesters));
  renderSemesterCards(state);

  const fabBtn = document.getElementById("fabBtn");
  fabBtn?.addEventListener("click", () => {
    const targetKey = SEMESTER_KEYS.find(key => !state.semesters[key]) || SEMESTER_KEYS[0];
    const card = document.querySelector(`[data-semester-card="${targetKey}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpenCard(targetKey, true);
  });
}

function renderSemesterCards(state) {
  hydrateSharedProfile(state);
  setText("sidebarSemesterCount", String(computeSummary(state).completedSemesters));
  const host = document.getElementById("semesterCards");
  if (!host) return;

  host.innerHTML = SEMESTER_KEYS.map(key => {
    const sem = state.semesters[key] || createEmptySemester();
    return `
      <article class="semester-card glass${sem.isOpen ? " is-open" : ""}" data-semester-card="${key}">
        <button class="semester-card__toggle" type="button" data-toggle-semester="${key}">
          <div class="semester-card__title">
            <span class="semester-badge">${key}</span>
            <div>
              <h3>Semester ${key}</h3>
              <p class="semester-card__subtitle">${sem.subjects.length ? "Edit grades and update credits" : "Click to add grades"}</p>
            </div>
          </div>
          <div class="semester-card__stats">
            <div class="semester-card__stat">
              <strong>${sem.sgpa ? sem.sgpa.toFixed(2) : "--"}</strong>
              <span>SGPA</span>
            </div>
            <i class="fa-solid fa-angle-down semester-card__arrow"></i>
          </div>
        </button>

        <div class="semester-card__body">
          <div class="subjects-list" id="subjects-${key}">
            ${renderSubjectRows(sem.subjects)}
          </div>
          <p class="helper-text">Enter subject name, credit, and grade. Saved semesters update the dashboard instantly.</p>
          <div class="semester-card__actions">
            <button class="add-row-btn" type="button" data-add-row="${key}">
              <i class="fa-solid fa-plus"></i>
              Add Subject
            </button>
            <button class="save-btn" type="button" data-save-semester="${key}">
              <i class="fa-solid fa-floppy-disk"></i>
              Save Semester
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  host.querySelectorAll("[data-toggle-semester]").forEach(button => {
    button.addEventListener("click", () => {
      setOpenCard(button.dataset.toggleSemester, undefined, state);
    });
  });

  host.querySelectorAll("[data-add-row]").forEach(button => {
    button.addEventListener("click", () => {
      addSubjectRow(button.dataset.addRow);
    });
  });

  host.querySelectorAll("[data-save-semester]").forEach(button => {
    button.addEventListener("click", () => {
      saveSemester(button.dataset.saveSemester, state);
    });
  });
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

function addSubjectRow(key) {
  const list = document.getElementById(`subjects-${key}`);
  if (!list) return;
  const wrapper = document.createElement("div");
  wrapper.className = "subject-row";
  wrapper.innerHTML = `
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
  list.appendChild(wrapper);
}

function saveSemester(key, state) {
  const list = document.getElementById(`subjects-${key}`);
  if (!list) return;
  const rows = Array.from(list.querySelectorAll(".subject-row"));
  const subjects = [];

  for (const row of rows) {
    const [nameInput, creditInput, gradeSelect] = row.querySelectorAll("input, select");
    const name = nameInput.value.trim();
    const credits = parseFloat(creditInput.value);
    const grade = gradeSelect.value;

    if (!name && !creditInput.value && !grade) {
      continue;
    }

    if (!name || !credits || credits <= 0 || !grade) {
      showToast("Please complete every visible subject row before saving.");
      return;
    }

    subjects.push({ name, credits, grade });
  }

  if (!subjects.length) {
    showToast("Add at least one subject to save this semester.");
    return;
  }

  const totals = subjects.reduce((acc, subject) => {
    acc.credits += subject.credits;
    acc.points += subject.credits * GRADE_POINTS[subject.grade];
    if (subject.grade === "F" || subject.grade === "Ab") acc.backlogs += 1;
    return acc;
  }, { credits: 0, points: 0, backlogs: 0 });

  state.semesters[key] = {
    subjects,
    credits: Number(totals.credits.toFixed(1)),
    sgpa: Number((totals.points / totals.credits).toFixed(2)),
    backlogs: totals.backlogs,
    updatedAt: new Date().toISOString()
  };
  persistState(state);
  renderSemesterCards(state);
  showToast(`Semester ${key} saved successfully.`);
}

function setOpenCard(key, forceOpen, state = loadState()) {
  const card = document.querySelector(`[data-semester-card="${key}"]`);
  if (!card) return;
  const willOpen = typeof forceOpen === "boolean" ? forceOpen : !card.classList.contains("is-open");
  document.querySelectorAll(".semester-card").forEach(item => item.classList.remove("is-open"));
  if (willOpen) card.classList.add("is-open");
  if (state.semesters[key]) state.semesters[key].isOpen = willOpen;
}

function computeSummary(state) {
  const savedSemesters = SEMESTER_KEYS
    .filter(key => state.semesters[key]?.subjects?.length)
    .map(key => ({ key, ...state.semesters[key] }));

  const totals = savedSemesters.reduce((acc, semester) => {
    acc.weighted += semester.sgpa * semester.credits;
    acc.credits += semester.credits;
    acc.backlogs += semester.backlogs || 0;
    return acc;
  }, { weighted: 0, credits: 0, backlogs: 0 });

  const cgpa = totals.credits ? totals.weighted / totals.credits : 0;
  const percentage = cgpa > 0 ? (cgpa - 0.5) * 10 : 0;

  return {
    savedSemesters,
    completedSemesters: savedSemesters.length,
    totalCredits: Number(totals.credits.toFixed(1)),
    cgpa: Number(cgpa.toFixed(2)),
    percentage: Number(Math.max(percentage, 0).toFixed(1)),
    backlogs: totals.backlogs
  };
}

function createEmptySemester() {
  return {
    subjects: [],
    credits: 0,
    sgpa: 0,
    backlogs: 0
  };
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
