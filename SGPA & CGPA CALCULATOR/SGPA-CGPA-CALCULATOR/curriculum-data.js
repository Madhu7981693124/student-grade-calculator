// JNTUGV Branch Syllabus Database
// Supports: R25, R24, R23, R20
// All subjects include: name, code, type (Theory/Lab/Skill/Mandatory/Elective), credits

export const CURRICULUM = {
  R23: {
    CSE: {
      "1-1": [
        { name: "Linear Algebra & Calculus", code: "MA101", type: "Theory", credits: 3 },
        { name: "Engineering Physics", code: "PH101", type: "Theory", credits: 3 },
        { name: "Communicative English", code: "EN101", type: "Theory", credits: 2 },
        { name: "Basic Civil & Mechanical Engineering", code: "CM101", type: "Theory", credits: 3 },
        { name: "Introduction to Programming", code: "CS101", type: "Theory", credits: 3 },
        { name: "Communicative English Lab", code: "EN111", type: "Lab", credits: 1 },
        { name: "Engineering Physics Lab", code: "PH111", type: "Lab", credits: 1 },
        { name: "Engineering Workshop", code: "ME111", type: "Lab", credits: 1.5 },
        { name: "IT Workshop", code: "CS111", type: "Lab", credits: 1 },
        { name: "Computer Programming Lab", code: "CS112", type: "Lab", credits: 1.5 },
        { name: "Health and Wellness, Yoga and Sports", code: "MC101", type: "Mandatory", credits: 0.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "MA102", type: "Theory", credits: 3 },
        { name: "Chemistry", code: "CH101", type: "Theory", credits: 3 },
        { name: "Engineering Graphics", code: "ME101", type: "Theory", credits: 3 },
        { name: "Basic Electrical & Electronics Engineering", code: "EE101", type: "Theory", credits: 3 },
        { name: "Data Structures", code: "CS102", type: "Theory", credits: 3 },
        { name: "Chemistry Lab", code: "CH111", type: "Lab", credits: 1 },
        { name: "Electrical & Electronics Engineering Workshop", code: "EE111", type: "Lab", credits: 1.5 },
        { name: "Data Structures Lab", code: "CS113", type: "Lab", credits: 1.5 },
        { name: "NSS/NCC/Scouts & Guides/Community Service", code: "MC102", type: "Mandatory", credits: 0.5 }
      ],
      "2-1": [
        { name: "Mathematical Foundations of Computer Science", code: "CS201", type: "Theory", credits: 3 },
        { name: "Universal Human Values - Understanding Harmony", code: "MC201", type: "Mandatory", credits: 3 },
        { name: "Digital Logic & Computer Organization", code: "CS202", type: "Theory", credits: 3 },
        { name: "Software Engineering", code: "CS203", type: "Theory", credits: 3 },
        { name: "Object Oriented Programming Through Java", code: "CS204", type: "Theory", credits: 3 },
        { name: "CASE Tools Lab", code: "CS211", type: "Lab", credits: 1.5 },
        { name: "Object Oriented Programming Through Java Lab", code: "CS212", type: "Lab", credits: 1.5 },
        { name: "Python Programming", code: "CS221", type: "Skill", credits: 2 },
        { name: "Environmental Science", code: "MC202", type: "Mandatory", credits: 0 }
      ],
      "2-2": [
        { name: "Managerial Economics and Financial Analysis", code: "MB201", type: "Theory", credits: 2 },
        { name: "Probability & Statistics", code: "MA201", type: "Theory", credits: 3 },
        { name: "Operating Systems", code: "CS205", type: "Theory", credits: 3 },
        { name: "Database Management Systems", code: "CS206", type: "Theory", credits: 3 },
        { name: "Formal Languages and Automata Theory", code: "CS207", type: "Theory", credits: 3 }
      ]
    }
  }
};

// Branch options used by syllabus selects and instant calculator
export const BRANCH_OPTIONS = [
  { code: "CSE",   label: "Computer Science and Engineering" },
  { code: "CSM",   label: "CSE (AI & ML)" },
  { code: "CSD",   label: "CSE (Data Science)" },
  { code: "CSG",   label: "CSE (Cyber Security)" },
  { code: "CSI",   label: "CSE (IoT)" },
  { code: "IT",    label: "Information Technology" },
  { code: "ECE",   label: "Electronics and Communication Engineering" },
  { code: "EEE",   label: "Electrical and Electronics Engineering" },
  { code: "MECH",  label: "Mechanical Engineering" },
  { code: "CIVIL", label: "Civil Engineering" },
  { code: "AIDS",  label: "Artificial Intelligence and Data Science" },
  { code: "AIM",   label: "Artificial Intelligence and Machine Learning" },
];

// Maps a full branch name (from user profile) to its short code
const _branchNameToCode = {
  "computer science and engineering": "CSE",
  "cse (ai & ml)": "CSM",
  "computer science and engineering (ai & ml)": "CSM",
  "cse (data science)": "CSD",
  "computer science and engineering (data science)": "CSD",
  "cse (cyber security)": "CSG",
  "computer science and engineering (cyber security)": "CSG",
  "cse (iot)": "CSI",
  "computer science and engineering (iot)": "CSI",
  "information technology": "IT",
  "electronics and communication engineering": "ECE",
  "electrical and electronics engineering": "EEE",
  "mechanical engineering": "MECH",
  "civil engineering": "CIVIL",
  "artificial intelligence and data science": "AIDS",
  "artificial intelligence and machine learning": "AIM",
};

export function normalizeBranchCode(branchName) {
  if (!branchName) return "CSE";
  const key = String(branchName).trim().toLowerCase();
  // If it's already a short code (e.g. "CSE"), return it directly
  if (BRANCH_OPTIONS.some(opt => opt.code === branchName.toUpperCase())) {
    return branchName.toUpperCase();
  }
  return _branchNameToCode[key] || "CSE";
}
