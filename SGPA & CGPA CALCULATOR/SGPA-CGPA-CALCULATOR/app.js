import { auth, db, storage } from "./firebase-config.js";
import {
  onAuthStateChanged, signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, doc, setDoc, getDocs, deleteDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ── Grade points R23 ────────────────────────────────────────────
export const GRADE_POINTS = { S:10, A:9, B:8, C:7, D:6, E:5, F:0, Ab:0 };

export function gradePerformance(sgpa) {
  const v = parseFloat(sgpa);
  if (v >= 9.0) return "Superior";
  if (v >= 8.0) return "Excellent";
  if (v >= 7.0) return "Very Good";
  if (v >= 6.0) return "Good";
  if (v >= 5.0) return "Average";
  if (v >= 4.0) return "Pass";
  return "Fail";
}

// (SGPA - 0.5) * 10  — JNTUGV conversion
export function toPercent(sgpa) {
  const p = (parseFloat(sgpa) - 0.5) * 10;
  return p > 0 ? p.toFixed(1) : "0.0";
}

// ── Auth helpers ────────────────────────────────────────────────
export function requireAuth(cb) {
  onAuthStateChanged(auth, user => {
    if (!user) { window.location.href = "index.html"; return; }
    cb(user);
  });
}

export function redirectIfLoggedIn() {
  onAuthStateChanged(auth, user => {
    if (user) window.location.href = "dashboard.html";
  });
}

export async function signUp(name, email, password, roll, branch, extraProfile = {}) {
  const c = await createUserWithEmailAndPassword(auth, email, password);
  const photoURL = extraProfile.photoURL || "";
  await updateProfile(c.user, { displayName: name, ...(photoURL ? { photoURL } : {}) });
  await saveUserProfile(c.user.uid, {
    name,
    email,
    roll,
    branch,
    ...extraProfile,
    ...(photoURL ? { photoURL } : {}),
    createdAt: new Date().toISOString()
  });
  return c.user;
}

export async function saveUserProfile(uid, profile) {
  await Promise.all([
    setDoc(doc(db, "users", uid), profile, { merge: true }),
    setDoc(doc(db, "users", uid, "profile", "main"), profile, { merge: true })
  ]);
}

export async function getUserProfile(uid) {
  const profileSnap = await getDoc(doc(db, "users", uid, "profile", "main"));
  if (profileSnap.exists()) return profileSnap.data();
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(data) {
  if (!auth.currentUser) return;
  await updateProfile(auth.currentUser, data);
}

export async function signIn(email, password) {
  const c = await signInWithEmailAndPassword(auth, email, password);
  return c.user;
}

export async function googleSignIn() {
  const c = await signInWithPopup(auth, new GoogleAuthProvider());
  return c.user;
}

export async function uploadProfileImage(uid, file) {
  if (!file) return "";
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const imageRef = ref(storage, `profile-images/${uid}/${Date.now()}.${ext}`);
  try {
    await uploadBytes(imageRef, file, { contentType: file.type || "image/jpeg" });
    return await getDownloadURL(imageRef);
  } catch (error) {
    const code = error?.code || "";
    if (code.includes("storage/unauthorized")) {
      throw new Error("Storage permission denied. Deploy the Storage rules and verify the signed-in user can write profile images.");
    }
    if (code.includes("storage/bucket-not-found")) {
      throw new Error("Storage bucket not found. Check the Firebase storage bucket name in firebase-config.js.");
    }
    if (code.includes("storage/unknown")) {
      throw new Error("Storage upload failed with an unknown error. Check Firebase Storage is enabled for this project.");
    }
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

export function friendlyError(code) {
  return ({
    "auth/user-not-found":        "No account found with this email.",
    "auth/wrong-password":        "Incorrect password.",
    "auth/invalid-credential":    "Invalid email or password.",
    "auth/email-already-in-use":  "Email already in use.",
    "auth/invalid-email":         "Invalid email address.",
    "auth/weak-password":         "Password must be at least 6 characters.",
    "auth/popup-closed-by-user":  "Google sign-in was cancelled.",
    "auth/too-many-requests":     "Too many attempts. Try again later.",
    "auth/network-request-failed":"Network error. Check your connection.",
  })[code] || "Something went wrong. Please try again.";
}

// ── Firestore helpers ───────────────────────────────────────────
function semKey(sem) { return sem.replace(/\s+/g, "_"); }

export async function saveSemester(uid, data) {
  await setDoc(doc(db, "users", uid, "semesters", semKey(data.sem)), data);
}

export async function getSemesters(uid) {
  const snap = await getDocs(collection(db, "users", uid, "semesters"));
  return snap.docs
    .map(d => d.data())
    .sort((a, b) => (parseInt(a.sem.replace(/\D/g,""))||0) - (parseInt(b.sem.replace(/\D/g,""))||0));
}

export async function saveSemesterRecord(uid, semesterId, data) {
  await setDoc(doc(db, "users", uid, "semesters", semesterId), data, { merge: true });
}

export async function getSemesterRecords(uid) {
  const snap = await getDocs(collection(db, "users", uid, "semesters"));
  const records = {};
  snap.forEach(entry => {
    records[entry.id] = { id: entry.id, ...entry.data() };
  });
  return records;
}

export async function getSemester(uid, sem) {
  const docRef = doc(db, "users", uid, "semesters", semKey(sem));
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

export async function deleteSemester(uid, sem) {
  await deleteDoc(doc(db, "users", uid, "semesters", semKey(sem)));
}

export async function getUserSetting(uid, settingId) {
  const snap = await getDoc(doc(db, "users", uid, "settings", settingId));
  return snap.exists() ? snap.data() : null;
}

export async function saveUserSetting(uid, settingId, data) {
  await setDoc(doc(db, "users", uid, "settings", settingId), data, { merge: true });
}

// ── Dark mode ───────────────────────────────────────────────────
export function initDarkMode() {
  const t = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", t);
  _updateLabel(t);
}

export function toggleDark() {
  const cur  = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  _updateLabel(next);
}

function _updateLabel(t) {
  document.querySelectorAll(".dark-toggle")
    .forEach(b => b.textContent = t === "dark" ? "☀️ Light" : "🌙 Dark");
}

// ── Nav active ──────────────────────────────────────────────────
export function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a")
    .forEach(a => a.classList.toggle("active", a.getAttribute("href") === page));
}

// ── CGPA computation ────────────────────────────────────────────
export function computeCurrentCGPA(semesters) {
  if (!semesters || semesters.length === 0) {
    return { cgpa: 0, weightedSum: 0, totalCredits: 0 };
  }
  const weightedSum = semesters.reduce((sum, s) => sum + s.sgpa * s.credits, 0);
  const totalCredits = semesters.reduce((sum, s) => sum + s.credits, 0);
  const cgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;
  return { cgpa, weightedSum, totalCredits };
}

export function computeRequiredSGPA(weightedSum, totalCredits, targetCGPA, remainingSems, creditsPerSem) {
  return (targetCGPA * (totalCredits + remainingSems * creditsPerSem) - weightedSum) / (remainingSems * creditsPerSem);
}

export function getClassAward(cgpa) {
  const v = parseFloat(cgpa);
  if (Number.isNaN(v)) return "";
  if (v >= 7.5) return "First Class with Distinction";
  if (v >= 6.5) return "First Class";
  if (v >= 5.5) return "Second Class";
  if (v >= 5.0) return "Pass Class";
  return "Not Eligible";
}

export function classifyFeasibility(requiredSGPA, currentCGPA) {
  if (requiredSGPA <= 0) return "already-achieved";
  if (requiredSGPA <= currentCGPA) return "easy";
  if (requiredSGPA <= 9.0) return "hard";
  if (requiredSGPA <= 10.0) return "very-hard";
  return "impossible";
}

export function validateGoalInputs(targetCGPA, remainingSems, creditsPerSem, totalCredits) {
  if (targetCGPA < 0 || targetCGPA > 10) return "Target CGPA must be between 0 and 10.";
  if (remainingSems < 1) return "Remaining semesters must be at least 1.";
  if (creditsPerSem < 1) return "Credits per semester must be at least 1.";
  if (totalCredits <= 0) return "No semester data found. Please add at least one semester.";
  return null;
}

// ── PDF util ────────────────────────────────────────────────────
export function pdfNewPageIfNeeded(doc, y) {
  if (y > 270) { doc.addPage(); return 20; }
  return y;
}

export function stripEmoji(s) {
  return s.replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
          .replace(/[\u2600-\u27FF]/g, "").trim();
}
