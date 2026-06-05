$out = "c:\Users\KUSUMA\OneDrive\Documents\git\student-grade-calculator\SGPA & CGPA CALCULATOR\SGPA-CGPA-CALCULATOR\curriculum-data.js"

$content = @'
// JNTUGV Branch Syllabus Database — R23, R20, R24, R25
// Subject fields: name, code, type (Theory/Lab/Skill/Elective/Mandatory), credits

// ─── Shared first-year subjects ────────────────────────────────
const Y1S1_COMMON = [
  { name: "Linear Algebra & Calculus",            code: "MA101", type: "Theory",    credits: 3   },
  { name: "Engineering Physics",                  code: "PH101", type: "Theory",    credits: 3   },
  { name: "Communicative English",                code: "EN101", type: "Theory",    credits: 2   },
  { name: "Basic Civil & Mechanical Engineering", code: "CM101", type: "Theory",    credits: 3   },
  { name: "Introduction to Programming",          code: "CS101", type: "Theory",    credits: 3   },
  { name: "Communicative English Lab",            code: "EN111", type: "Lab",       credits: 1   },
  { name: "Engineering Physics Lab",              code: "PH111", type: "Lab",       credits: 1   },
  { name: "Engineering Workshop",                 code: "ME111", type: "Lab",       credits: 1.5 },
  { name: "IT Workshop",                          code: "CS111", type: "Lab",       credits: 1   },
  { name: "Computer Programming Lab",             code: "CS112", type: "Lab",       credits: 1.5 },
  { name: "Health and Wellness, Yoga and Sports", code: "MC101", type: "Mandatory", credits: 0.5 }
];

const Y1S2_COMMON = [
  { name: "Differential Equations & Vector Calculus",     code: "MA102", type: "Theory",    credits: 3   },
  { name: "Chemistry",                                     code: "CH101", type: "Theory",    credits: 3   },
  { name: "Engineering Graphics",                          code: "ME101", type: "Theory",    credits: 3   },
  { name: "Basic Electrical & Electronics Engineering",    code: "EE101", type: "Theory",    credits: 3   },
  { name: "Data Structures",                               code: "CS102", type: "Theory",    credits: 3   },
  { name: "Chemistry Lab",                                 code: "CH111", type: "Lab",       credits: 1   },
  { name: "Electrical & Electronics Engineering Workshop", code: "EE111", type: "Lab",       credits: 1.5 },
  { name: "Data Structures Lab",                           code: "CS113", type: "Lab",       credits: 1.5 },
  { name: "NSS/NCC/Community Service",                     code: "MC102", type: "Mandatory", credits: 0.5 }
];

export const CURRICULUM = {
  // ═══════════════════════════════════════════════════════════════
  //  R23
  // ═══════════════════════════════════════════════════════════════
  R23: {
    // ── Computer Science and Engineering ──────────────────────
    CSE: {
      "1-1": Y1S1_COMMON,
      "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Mathematical Foundations of Computer Science", code: "CS201", type: "Theory",    credits: 3 },
        { name: "Universal Human Values",                       code: "MC201", type: "Mandatory", credits: 3 },
        { name: "Digital Logic & Computer Organization",        code: "CS202", type: "Theory",    credits: 3 },
        { name: "Software Engineering",                         code: "CS203", type: "Theory",    credits: 3 },
        { name: "Object Oriented Programming Through Java",     code: "CS204", type: "Theory",    credits: 3 },
        { name: "CASE Tools Lab",                               code: "CS211", type: "Lab",       credits: 1.5 },
        { name: "OOP Through Java Lab",                         code: "CS212", type: "Lab",       credits: 1.5 },
        { name: "Python Programming",                           code: "CS221", type: "Skill",     credits: 2 },
        { name: "Environmental Science",                        code: "MC202", type: "Mandatory", credits: 0 }
      ],
      "2-2": [
        { name: "Managerial Economics and Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Probability & Statistics",                    code: "MA201", type: "Theory",    credits: 3   },
        { name: "Operating Systems",                           code: "CS205", type: "Theory",    credits: 3   },
        { name: "Database Management Systems",                 code: "CS206", type: "Theory",    credits: 3   },
        { name: "Formal Languages and Automata Theory",        code: "CS207", type: "Theory",    credits: 3   },
        { name: "Operating Systems Lab",                       code: "CS213", type: "Lab",       credits: 1.5 },
        { name: "Database Management Systems Lab",             code: "CS214", type: "Lab",       credits: 1.5 },
        { name: "Full Stack Development-I",                    code: "CS222", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",                code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Data Warehousing and Data Mining",      code: "CS301", type: "Theory",    credits: 3   },
        { name: "Compiler Design",                       code: "CS302", type: "Theory",    credits: 3   },
        { name: "Design and Analysis of Algorithms",     code: "CS303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",               code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                       code: "OE301", type: "Elective",  credits: 3   },
        { name: "Data Mining Lab",                       code: "CS311", type: "Lab",       credits: 1.5 },
        { name: "Compiler Design Lab",                   code: "CS312", type: "Lab",       credits: 1.5 },
        { name: "Full Stack Development-II",             code: "CS321", type: "Skill",     credits: 2   },
        { name: "Android App Development with Flutter",  code: "CS322", type: "Skill",     credits: 1   },
        { name: "Evaluation of Community Service",       code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "Computer Networks",             code: "CS304", type: "Theory",    credits: 3   },
        { name: "Artificial Intelligence",       code: "CS305", type: "Theory",    credits: 3   },
        { name: "Cryptography & Network Security",code:"CS306", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",      code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",     code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",              code: "OE302", type: "Elective",  credits: 3   },
        { name: "AI Tools Lab",                  code: "CS313", type: "Lab",       credits: 1.5 },
        { name: "Computer Network Lab",          code: "CS314", type: "Lab",       credits: 1.5 },
        { name: "21st Century Employability Skills", code: "CS323", type: "Skill", credits: 2  },
        { name: "Technical Paper Writing & IPR", code: "MC302", type: "Mandatory", credits: 0  }
      ],
      "4-1": [
        { name: "Machine Learning",                      code: "CS401", type: "Theory",    credits: 3 },
        { name: "Human Resources & Project Management",  code: "MB401", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",              code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",               code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                     code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                      code: "OE402", type: "Elective",  credits: 3 },
        { name: "Prompt Engineering / ChatGPT Program",  code: "CS421", type: "Skill",     credits: 2 },
        { name: "Constitution of India",                 code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",     code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "CS491", type: "Theory", credits: 12 }
      ]
    },

    // ── CSE (AI & ML) ─────────────────────────────────────────
    "CSE-AIML": {
      "1-1": Y1S1_COMMON,
      "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Mathematical Foundations of Computer Science", code: "CS201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",                       code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Introduction to AI & Machine Learning",        code: "AI201", type: "Theory",    credits: 3   },
        { name: "OOP Through Python",                           code: "AI202", type: "Theory",    credits: 3   },
        { name: "Digital Logic & Computer Organization",        code: "CS202", type: "Theory",    credits: 3   },
        { name: "AI & ML Lab",                                  code: "AI211", type: "Lab",       credits: 1.5 },
        { name: "Python Programming Lab",                       code: "AI212", type: "Lab",       credits: 1.5 },
        { name: "Data Science Foundations",                     code: "AI221", type: "Skill",     credits: 2   },
        { name: "Environmental Science",                        code: "MC202", type: "Mandatory", credits: 0   }
      ],
      "2-2": [
        { name: "Managerial Economics and Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Probability & Statistics for AI",             code: "MA201", type: "Theory",    credits: 3   },
        { name: "Machine Learning",                            code: "AI203", type: "Theory",    credits: 3   },
        { name: "Database Management Systems",                 code: "CS206", type: "Theory",    credits: 3   },
        { name: "Computer Vision",                             code: "AI204", type: "Theory",    credits: 3   },
        { name: "Machine Learning Lab",                        code: "AI213", type: "Lab",       credits: 1.5 },
        { name: "Database Management Systems Lab",             code: "CS214", type: "Lab",       credits: 1.5 },
        { name: "Deep Learning Applications",                  code: "AI222", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",                code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Deep Learning",                       code: "AI301", type: "Theory",    credits: 3   },
        { name: "Natural Language Processing",         code: "AI302", type: "Theory",    credits: 3   },
        { name: "Reinforcement Learning",              code: "AI303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Deep Learning Lab",                   code: "AI311", type: "Lab",       credits: 1.5 },
        { name: "NLP Lab",                             code: "AI312", type: "Lab",       credits: 1.5 },
        { name: "AI Tools & Frameworks",               code: "AI321", type: "Skill",     credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "Computer Networks",                   code: "CS304", type: "Theory",    credits: 3   },
        { name: "Big Data Analytics",                  code: "AI304", type: "Theory",    credits: 3   },
        { name: "AI Ethics & Responsible AI",          code: "AI305", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "Big Data Lab",                        code: "AI313", type: "Lab",       credits: 1.5 },
        { name: "AI Cloud Lab",                        code: "AI314", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "Generative AI & LLMs",                code: "AI401", type: "Theory",    credits: 3 },
        { name: "Human Resources & Project Management",code: "MB401", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Prompt Engineering",                  code: "AI421", type: "Skill",     credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "AI491", type: "Theory", credits: 12 }
      ]
    },

    // ── CSE (Data Science) ────────────────────────────────────
    "CSE-DS": {
      "1-1": Y1S1_COMMON,
      "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Mathematical Foundations of Computer Science", code: "CS201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",                       code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Introduction to Data Science",                 code: "DS201", type: "Theory",    credits: 3   },
        { name: "OOP Through Python",                           code: "DS202", type: "Theory",    credits: 3   },
        { name: "Digital Logic & Computer Organization",        code: "CS202", type: "Theory",    credits: 3   },
        { name: "Data Science Lab",                             code: "DS211", type: "Lab",       credits: 1.5 },
        { name: "Python Lab",                                   code: "DS212", type: "Lab",       credits: 1.5 },
        { name: "Data Analysis using Excel & Tableau",          code: "DS221", type: "Skill",     credits: 2   },
        { name: "Environmental Science",                        code: "MC202", type: "Mandatory", credits: 0   }
      ],
      "2-2": [
        { name: "Managerial Economics and Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Statistical Methods for Data Science",        code: "MA201", type: "Theory",    credits: 3   },
        { name: "Machine Learning",                            code: "DS203", type: "Theory",    credits: 3   },
        { name: "Database Management Systems",                 code: "CS206", type: "Theory",    credits: 3   },
        { name: "Data Visualization",                          code: "DS204", type: "Theory",    credits: 3   },
        { name: "Machine Learning Lab",                        code: "DS213", type: "Lab",       credits: 1.5 },
        { name: "Data Visualization Lab",                      code: "DS214", type: "Lab",       credits: 1.5 },
        { name: "Big Data Fundamentals",                       code: "DS222", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",                code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Big Data Analytics",                  code: "DS301", type: "Theory",    credits: 3   },
        { name: "Deep Learning",                       code: "DS302", type: "Theory",    credits: 3   },
        { name: "Data Engineering & Pipelines",        code: "DS303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Big Data Lab",                        code: "DS311", type: "Lab",       credits: 1.5 },
        { name: "Deep Learning Lab",                   code: "DS312", type: "Lab",       credits: 1.5 },
        { name: "Cloud Data Platforms",                code: "DS321", type: "Skill",     credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "Natural Language Processing",         code: "DS304", type: "Theory",    credits: 3   },
        { name: "Business Intelligence",               code: "DS305", type: "Theory",    credits: 3   },
        { name: "Real-Time Data Processing",           code: "DS306", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "NLP Lab",                             code: "DS313", type: "Lab",       credits: 1.5 },
        { name: "BI Tools Lab",                        code: "DS314", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "MLOps & Model Deployment",            code: "DS401", type: "Theory",    credits: 3 },
        { name: "Human Resources & Project Management",code: "MB401", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Prompt Engineering",                  code: "DS421", type: "Skill",     credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "DS491", type: "Theory", credits: 12 }
      ]
    },

    // ── CSE (Cyber Security) ──────────────────────────────────
    "CSE-CS": {
      "1-1": Y1S1_COMMON,
      "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Mathematical Foundations of Computer Science", code: "CS201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",                       code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Introduction to Cyber Security",               code: "CY201", type: "Theory",    credits: 3   },
        { name: "OOP Through Java",                             code: "CS204", type: "Theory",    credits: 3   },
        { name: "Digital Logic & Computer Organization",        code: "CS202", type: "Theory",    credits: 3   },
        { name: "Cyber Security Lab",                           code: "CY211", type: "Lab",       credits: 1.5 },
        { name: "OOP Lab",                                      code: "CS212", type: "Lab",       credits: 1.5 },
        { name: "Python Programming",                           code: "CS221", type: "Skill",     credits: 2   },
        { name: "Environmental Science",                        code: "MC202", type: "Mandatory", credits: 0   }
      ],
      "2-2": [
        { name: "Managerial Economics and Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Probability & Statistics",                    code: "MA201", type: "Theory",    credits: 3   },
        { name: "Operating Systems",                           code: "CS205", type: "Theory",    credits: 3   },
        { name: "Database Management Systems",                 code: "CS206", type: "Theory",    credits: 3   },
        { name: "Network Security",                            code: "CY202", type: "Theory",    credits: 3   },
        { name: "Operating Systems Lab",                       code: "CS213", type: "Lab",       credits: 1.5 },
        { name: "Network Security Lab",                        code: "CY212", type: "Lab",       credits: 1.5 },
        { name: "Ethical Hacking Fundamentals",               code: "CY221", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",                code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Cryptography",                        code: "CY301", type: "Theory",    credits: 3   },
        { name: "Malware Analysis",                    code: "CY302", type: "Theory",    credits: 3   },
        { name: "Cloud Security",                      code: "CY303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Cryptography Lab",                    code: "CY311", type: "Lab",       credits: 1.5 },
        { name: "Malware Analysis Lab",                code: "CY312", type: "Lab",       credits: 1.5 },
        { name: "Penetration Testing",                 code: "CY321", type: "Skill",     credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "Digital Forensics",                   code: "CY304", type: "Theory",    credits: 3   },
        { name: "Security Operations Center",          code: "CY305", type: "Theory",    credits: 3   },
        { name: "IoT Security",                        code: "CY306", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "Digital Forensics Lab",               code: "CY313", type: "Lab",       credits: 1.5 },
        { name: "SOC Tools Lab",                       code: "CY314", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "Blockchain & Security",               code: "CY401", type: "Theory",    credits: 3 },
        { name: "Human Resources & Project Management",code: "MB401", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Prompt Engineering",                  code: "CY421", type: "Skill",     credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "CY491", type: "Theory", credits: 12 }
      ]
    },

    // ── CSE (IoT) ─────────────────────────────────────────────
    "CSE-IOT": {
      "1-1": Y1S1_COMMON,
      "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Mathematical Foundations of Computer Science", code: "CS201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",                       code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Introduction to IoT",                          code: "IO201", type: "Theory",    credits: 3   },
        { name: "Embedded Systems",                             code: "IO202", type: "Theory",    credits: 3   },
        { name: "Digital Logic & Computer Organization",        code: "CS202", type: "Theory",    credits: 3   },
        { name: "IoT Lab",                                      code: "IO211", type: "Lab",       credits: 1.5 },
        { name: "Embedded Systems Lab",                         code: "IO212", type: "Lab",       credits: 1.5 },
        { name: "Python Programming",                           code: "CS221", type: "Skill",     credits: 2   },
        { name: "Environmental Science",                        code: "MC202", type: "Mandatory", credits: 0   }
      ],
      "2-2": [
        { name: "Managerial Economics and Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Probability & Statistics",                    code: "MA201", type: "Theory",    credits: 3   },
        { name: "IoT Communication Protocols",                 code: "IO203", type: "Theory",    credits: 3   },
        { name: "Database Management Systems",                 code: "CS206", type: "Theory",    credits: 3   },
        { name: "Sensor Networks",                             code: "IO204", type: "Theory",    credits: 3   },
        { name: "IoT Protocols Lab",                           code: "IO213", type: "Lab",       credits: 1.5 },
        { name: "Sensor Networks Lab",                         code: "IO214", type: "Lab",       credits: 1.5 },
        { name: "Smart Home Applications",                     code: "IO221", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",                code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Cloud Computing for IoT",             code: "IO301", type: "Theory",    credits: 3   },
        { name: "Machine Learning for IoT",            code: "IO302", type: "Theory",    credits: 3   },
        { name: "Industrial IoT",                      code: "IO303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Cloud IoT Lab",                       code: "IO311", type: "Lab",       credits: 1.5 },
        { name: "ML for IoT Lab",                      code: "IO312", type: "Lab",       credits: 1.5 },
        { name: "IoT Edge Computing",                  code: "IO321", type: "Skill",     credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "IoT Security",                        code: "IO304", type: "Theory",    credits: 3   },
        { name: "Big Data Analytics for IoT",          code: "IO305", type: "Theory",    credits: 3   },
        { name: "Autonomous Systems",                  code: "IO306", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "IoT Security Lab",                    code: "IO313", type: "Lab",       credits: 1.5 },
        { name: "Autonomous Systems Lab",              code: "IO314", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "Digital Twin & Smart Cities",         code: "IO401", type: "Theory",    credits: 3 },
        { name: "Human Resources & Project Management",code: "MB401", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Prompt Engineering",                  code: "IO421", type: "Skill",     credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "IO491", type: "Theory", credits: 12 }
      ]
    },

    // ── AI & ML ───────────────────────────────────────────────
    AIML: {
      "1-1": Y1S1_COMMON,
      "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Probability & Statistics",                     code: "MA201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",                       code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Introduction to AI & ML",                      code: "AI201", type: "Theory",    credits: 3   },
        { name: "OOP Through Python",                           code: "AI202", type: "Theory",    credits: 3   },
        { name: "Digital Logic Design",                         code: "CS202", type: "Theory",    credits: 3   },
        { name: "AI & ML Lab",                                  code: "AI211", type: "Lab",       credits: 1.5 },
        { name: "Python Lab",                                   code: "AI212", type: "Lab",       credits: 1.5 },
        { name: "Data Analytics Basics",                        code: "AI221", type: "Skill",     credits: 2   },
        { name: "Environmental Science",                        code: "MC202", type: "Mandatory", credits: 0   }
      ],
      "2-2": [
        { name: "Managerial Economics and Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Machine Learning",                            code: "AI203", type: "Theory",    credits: 3   },
        { name: "Database Management Systems",                 code: "CS206", type: "Theory",    credits: 3   },
        { name: "Computer Vision",                             code: "AI204", type: "Theory",    credits: 3   },
        { name: "Linear Algebra for AI",                       code: "MA202", type: "Theory",    credits: 3   },
        { name: "Machine Learning Lab",                        code: "AI213", type: "Lab",       credits: 1.5 },
        { name: "Computer Vision Lab",                         code: "AI214", type: "Lab",       credits: 1.5 },
        { name: "Deep Learning Fundamentals",                  code: "AI222", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",                code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Deep Learning",                       code: "AI301", type: "Theory",    credits: 3   },
        { name: "NLP",                                 code: "AI302", type: "Theory",    credits: 3   },
        { name: "Reinforcement Learning",              code: "AI303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Deep Learning Lab",                   code: "AI311", type: "Lab",       credits: 1.5 },
        { name: "NLP Lab",                             code: "AI312", type: "Lab",       credits: 1.5 },
        { name: "MLOps",                               code: "AI321", type: "Skill",     credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "Generative AI",                       code: "AI304", type: "Theory",    credits: 3   },
        { name: "Big Data Analytics",                  code: "AI305", type: "Theory",    credits: 3   },
        { name: "AI in Healthcare",                    code: "AI306", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "Generative AI Lab",                   code: "AI313", type: "Lab",       credits: 1.5 },
        { name: "Big Data Lab",                        code: "AI314", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "AI Product Development",              code: "AI401", type: "Theory",    credits: 3 },
        { name: "Human Resources & Project Management",code: "MB401", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Prompt Engineering",                  code: "AI421", type: "Skill",     credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "AI491", type: "Theory", credits: 12 }
      ]
    },

    // ── IT ────────────────────────────────────────────────────
    IT: {
      "1-1": Y1S1_COMMON,
      "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Mathematical Foundations of Computer Science", code: "CS201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",                       code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Digital Logic & Computer Organization",        code: "CS202", type: "Theory",    credits: 3   },
        { name: "Software Engineering",                         code: "CS203", type: "Theory",    credits: 3   },
        { name: "OOP Through Java",                             code: "CS204", type: "Theory",    credits: 3   },
        { name: "CASE Tools Lab",                               code: "CS211", type: "Lab",       credits: 1.5 },
        { name: "OOP Lab",                                      code: "CS212", type: "Lab",       credits: 1.5 },
        { name: "Python Programming",                           code: "CS221", type: "Skill",     credits: 2   },
        { name: "Environmental Science",                        code: "MC202", type: "Mandatory", credits: 0   }
      ],
      "2-2": [
        { name: "Managerial Economics and Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Probability & Statistics",                    code: "MA201", type: "Theory",    credits: 3   },
        { name: "Operating Systems",                           code: "CS205", type: "Theory",    credits: 3   },
        { name: "Database Management Systems",                 code: "CS206", type: "Theory",    credits: 3   },
        { name: "Formal Languages and Automata Theory",        code: "CS207", type: "Theory",    credits: 3   },
        { name: "Operating Systems Lab",                       code: "CS213", type: "Lab",       credits: 1.5 },
        { name: "DBMS Lab",                                    code: "CS214", type: "Lab",       credits: 1.5 },
        { name: "Full Stack Development-I",                    code: "CS222", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",                code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Data Warehousing and Data Mining",    code: "CS301", type: "Theory",    credits: 3   },
        { name: "Compiler Design",                     code: "CS302", type: "Theory",    credits: 3   },
        { name: "Design and Analysis of Algorithms",   code: "CS303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Data Mining Lab",                     code: "CS311", type: "Lab",       credits: 1.5 },
        { name: "Compiler Design Lab",                 code: "CS312", type: "Lab",       credits: 1.5 },
        { name: "Full Stack Development-II",           code: "CS321", type: "Skill",     credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "Computer Networks",                   code: "CS304", type: "Theory",    credits: 3   },
        { name: "Artificial Intelligence",             code: "CS305", type: "Theory",    credits: 3   },
        { name: "Cryptography & Network Security",     code: "CS306", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "AI Tools Lab",                        code: "CS313", type: "Lab",       credits: 1.5 },
        { name: "Computer Network Lab",                code: "CS314", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "Machine Learning",                    code: "CS401", type: "Theory",    credits: 3 },
        { name: "Human Resources & Project Management",code: "MB401", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Prompt Engineering",                  code: "CS421", type: "Skill",     credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "IT491", type: "Theory", credits: 12 }
      ]
    },

    // ── ECE ───────────────────────────────────────────────────
    ECE: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "MA101", type: "Theory",    credits: 3   },
        { name: "Chemistry",                            code: "CH101", type: "Theory",    credits: 3   },
        { name: "Introduction to Programming",          code: "CS101", type: "Theory",    credits: 3   },
        { name: "Engineering Graphics",                 code: "ME101", type: "Theory",    credits: 3   },
        { name: "Basic Electrical & Electronics Engg",  code: "EE101", type: "Theory",    credits: 3   },
        { name: "Chemistry Lab",                        code: "CH111", type: "Lab",       credits: 1   },
        { name: "Computer Programming Lab",             code: "CS112", type: "Lab",       credits: 1.5 },
        { name: "Electrical & Electronics Workshop",    code: "EE111", type: "Lab",       credits: 1.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus",  code: "MA102", type: "Theory",    credits: 3   },
        { name: "Engineering Physics",                        code: "PH101", type: "Theory",    credits: 3   },
        { name: "Communicative English",                      code: "EN101", type: "Theory",    credits: 2   },
        { name: "Basic Civil & Mechanical Engineering",       code: "CM101", type: "Theory",    credits: 3   },
        { name: "Network Analysis",                           code: "EC102", type: "Theory",    credits: 3   },
        { name: "Communicative English Lab",                  code: "EN111", type: "Lab",       credits: 1   },
        { name: "Engineering Physics Lab",                    code: "PH111", type: "Lab",       credits: 1   },
        { name: "IT Workshop",                                code: "CS111", type: "Lab",       credits: 1   },
        { name: "Engineering Workshop",                       code: "ME111", type: "Lab",       credits: 1.5 },
        { name: "Network Analysis Lab",                       code: "EC113", type: "Lab",       credits: 1.5 }
      ],
      "2-1": [
        { name: "Random Variables & Stochastic Processes", code: "MA201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",                  code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Signals & Systems",                       code: "EC201", type: "Theory",    credits: 3   },
        { name: "Electronic Devices & Circuits",           code: "EC202", type: "Theory",    credits: 3   },
        { name: "Digital Circuits Design",                 code: "EC203", type: "Theory",    credits: 3   },
        { name: "Electronic Devices Lab",                  code: "EC211", type: "Lab",       credits: 1.5 },
        { name: "Digital Design & Signal Simulation Lab",  code: "EC212", type: "Lab",       credits: 1.5 },
        { name: "Python Programming",                      code: "CS221", type: "Skill",     credits: 2   }
      ],
      "2-2": [
        { name: "Managerial Economics & Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Linear Control Systems",                    code: "EC204", type: "Theory",    credits: 3   },
        { name: "EM Waves & Transmission Lines",             code: "EC205", type: "Theory",    credits: 3   },
        { name: "Analog Circuits Design",                    code: "EC206", type: "Theory",    credits: 3   },
        { name: "Analog & Digital Communications",           code: "EC207", type: "Theory",    credits: 3   },
        { name: "Analog Circuits Lab",                       code: "EC213", type: "Lab",       credits: 1.5 },
        { name: "Analog & Digital Communications Lab",       code: "EC214", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                               code: "CS323", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",              code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Microprocessors & Microcontrollers",  code: "EC301", type: "Theory",    credits: 3   },
        { name: "Digital Signal Processing",           code: "EC302", type: "Theory",    credits: 3   },
        { name: "Antenna Analysis & Design",           code: "EC303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "DSP Lab",                             code: "EC311", type: "Lab",       credits: 1.5 },
        { name: "Microprocessors Lab",                 code: "EC312", type: "Lab",       credits: 1.5 },
        { name: "Data Structures with Python",         code: "CS321", type: "Skill",     credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "VLSI Design",                         code: "EC304", type: "Theory",    credits: 3   },
        { name: "Advanced Digital Communications",     code: "EC305", type: "Theory",    credits: 3   },
        { name: "Communication Networks",              code: "EC306", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "VLSI Design Lab",                     code: "EC313", type: "Lab",       credits: 1.5 },
        { name: "Advanced Communications Lab",         code: "EC314", type: "Lab",       credits: 1.5 },
        { name: "Hardware Modelling with HDLs",        code: "EC321", type: "Skill",     credits: 1.5 },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "Microwave Engineering & Optical Comm", code: "EC401", type: "Theory",    credits: 3 },
        { name: "Digital Image & Video Processing",     code: "EC402", type: "Theory",    credits: 3 },
        { name: "E-Waste Management",                   code: "MB401", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",             code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",              code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                    code: "OE401", type: "Elective",  credits: 3 },
        { name: "Microwave Engineering Lab",            code: "EC411", type: "Lab",       credits: 1.5 },
        { name: "Digital Image Processing Lab",         code: "EC412", type: "Lab",       credits: 1.5 },
        { name: "Machine Learning Lab",                 code: "AI421", type: "Skill",     credits: 2 },
        { name: "Constitution of India",                code: "MC401", type: "Mandatory", credits: 0 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "EC491", type: "Theory", credits: 12 }
      ]
    },

    // ── EEE ───────────────────────────────────────────────────
    EEE: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "MA101", type: "Theory",    credits: 3   },
        { name: "Chemistry",                            code: "CH101", type: "Theory",    credits: 3   },
        { name: "Introduction to Programming",          code: "CS101", type: "Theory",    credits: 3   },
        { name: "Engineering Graphics",                 code: "ME101", type: "Theory",    credits: 3   },
        { name: "Basic Electrical & Electronics Engg",  code: "EE101", type: "Theory",    credits: 3   },
        { name: "Chemistry Lab",                        code: "CH111", type: "Lab",       credits: 1   },
        { name: "Computer Programming Lab",             code: "CS112", type: "Lab",       credits: 1.5 },
        { name: "Electrical & Electronics Workshop",    code: "EE111", type: "Lab",       credits: 1.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "MA102", type: "Theory",    credits: 3   },
        { name: "Engineering Physics",                      code: "PH101", type: "Theory",    credits: 3   },
        { name: "Communicative English",                    code: "EN101", type: "Theory",    credits: 2   },
        { name: "Basic Civil & Mechanical Engineering",     code: "CM101", type: "Theory",    credits: 3   },
        { name: "Electrical Circuit Analysis-I",            code: "EE102", type: "Theory",    credits: 3   },
        { name: "Communicative English Lab",                code: "EN111", type: "Lab",       credits: 1   },
        { name: "Engineering Physics Lab",                  code: "PH111", type: "Lab",       credits: 1   },
        { name: "IT Workshop",                              code: "CS111", type: "Lab",       credits: 1   },
        { name: "Engineering Workshop",                     code: "ME111", type: "Lab",       credits: 1.5 },
        { name: "Electrical Circuits Lab",                  code: "EE113", type: "Lab",       credits: 1.5 }
      ],
      "2-1": [
        { name: "Complex Variables & Numerical Methods", code: "MA201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",                code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Electromagnetic Field Theory",          code: "EE201", type: "Theory",    credits: 3   },
        { name: "Electrical Circuit Analysis-II",        code: "EE202", type: "Theory",    credits: 3   },
        { name: "DC Machines & Transformers",            code: "EE203", type: "Theory",    credits: 3   },
        { name: "Electrical Circuit Analysis-II Lab",    code: "EE211", type: "Lab",       credits: 1.5 },
        { name: "DC Machines & Transformers Lab",        code: "EE212", type: "Lab",       credits: 1.5 },
        { name: "Data Structures Lab",                   code: "CS211", type: "Skill",     credits: 2   }
      ],
      "2-2": [
        { name: "Managerial Economics & Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Analog Circuits",                           code: "EE204", type: "Theory",    credits: 3   },
        { name: "Power Systems-I",                           code: "EE205", type: "Theory",    credits: 3   },
        { name: "Induction & Synchronous Machines",          code: "EE206", type: "Theory",    credits: 3   },
        { name: "Control Systems",                           code: "EE207", type: "Theory",    credits: 3   },
        { name: "Induction & Synchronous Machines Lab",      code: "EE213", type: "Lab",       credits: 1.5 },
        { name: "Control Systems Lab",                       code: "EE214", type: "Lab",       credits: 1.5 },
        { name: "Python Programming Lab",                    code: "CS221", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",              code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Power Electronics",                   code: "EE301", type: "Theory",    credits: 3   },
        { name: "Digital Circuits",                    code: "EE302", type: "Theory",    credits: 3   },
        { name: "Power Systems-II",                    code: "EE303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Power Electronics Lab",               code: "EE311", type: "Lab",       credits: 1.5 },
        { name: "Analog & Digital Circuits Lab",       code: "EE312", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "3-2": [
        { name: "Electrical Measurements & Instrumentation", code: "EE304", type: "Theory",    credits: 3   },
        { name: "Microprocessors & Microcontrollers",         code: "EC301", type: "Theory",    credits: 3   },
        { name: "Power System Analysis",                     code: "EE305", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",                  code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",                 code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                          code: "OE302", type: "Elective",  credits: 3   },
        { name: "Electrical Measurements Lab",               code: "EE313", type: "Lab",       credits: 1.5 },
        { name: "Microprocessors Lab",                       code: "EC312", type: "Lab",       credits: 1.5 },
        { name: "IoT Applications Lab",                      code: "IO321", type: "Skill",     credits: 2   }
      ],
      "4-1": [
        { name: "Power System Operation & Control",    code: "EE401", type: "Theory",    credits: 3 },
        { name: "Energy Management & Auditing",        code: "EE402", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Power Systems Simulation Lab",        code: "EE411", type: "Lab",       credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "EE491", type: "Theory", credits: 12 }
      ]
    },

    // ── MECHANICAL ────────────────────────────────────────────
    MECHANICAL: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "MA101", type: "Theory",    credits: 3   },
        { name: "Engineering Chemistry",                code: "CH101", type: "Theory",    credits: 3   },
        { name: "Introduction to Programming",          code: "CS101", type: "Theory",    credits: 3   },
        { name: "Engineering Graphics",                 code: "ME101", type: "Theory",    credits: 3   },
        { name: "Basic Electrical & Electronics Engg",  code: "EE101", type: "Theory",    credits: 3   },
        { name: "Engineering Chemistry Lab",            code: "CH111", type: "Lab",       credits: 1   },
        { name: "Computer Programming Lab",             code: "CS112", type: "Lab",       credits: 1.5 },
        { name: "Electrical & Electronics Workshop",    code: "EE111", type: "Lab",       credits: 1.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "MA102", type: "Theory",    credits: 3   },
        { name: "Engineering Physics",                      code: "PH101", type: "Theory",    credits: 3   },
        { name: "Communicative English",                    code: "EN101", type: "Theory",    credits: 2   },
        { name: "Basic Civil & Mechanical Engineering",     code: "CM101", type: "Theory",    credits: 3   },
        { name: "Engineering Mechanics",                    code: "ME102", type: "Theory",    credits: 3   },
        { name: "Communicative English Lab",                code: "EN111", type: "Lab",       credits: 1   },
        { name: "Engineering Physics Lab",                  code: "PH111", type: "Lab",       credits: 1   },
        { name: "IT Workshop",                              code: "CS111", type: "Lab",       credits: 1   },
        { name: "Engineering Workshop",                     code: "ME111", type: "Lab",       credits: 1.5 },
        { name: "Engineering Mechanics Lab",                code: "ME113", type: "Lab",       credits: 1.5 }
      ],
      "2-1": [
        { name: "Numerical & Statistical Methods",     code: "MA201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",              code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Thermodynamics",                      code: "ME201", type: "Theory",    credits: 2   },
        { name: "Mechanics of Solids",                 code: "ME202", type: "Theory",    credits: 3   },
        { name: "Material Science & Metallurgy",       code: "ME203", type: "Theory",    credits: 3   },
        { name: "Mechanics of Solids & Materials Lab", code: "ME211", type: "Lab",       credits: 1.5 },
        { name: "CAD Lab",                             code: "ME212", type: "Lab",       credits: 1.5 },
        { name: "Python Programming Lab",              code: "CS221", type: "Skill",     credits: 1   },
        { name: "Embedded Systems & IoT",              code: "IO201", type: "Skill",     credits: 2   }
      ],
      "2-2": [
        { name: "Industrial Management",               code: "MB201", type: "Theory",    credits: 2   },
        { name: "Probability & Complex Variables",     code: "MA202", type: "Theory",    credits: 3   },
        { name: "Manufacturing Processes",             code: "ME204", type: "Theory",    credits: 3   },
        { name: "Fluid Mechanics & Hydraulic Machines",code: "ME205", type: "Theory",    credits: 3   },
        { name: "Design of Machine Members",           code: "ME206", type: "Theory",    credits: 3   },
        { name: "Fluid Mechanics Lab",                 code: "ME213", type: "Lab",       credits: 1.5 },
        { name: "Manufacturing Processes Lab",         code: "ME214", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",        code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Machine Tools & Metrology",           code: "ME301", type: "Theory",    credits: 3   },
        { name: "Thermal Engineering",                 code: "ME302", type: "Theory",    credits: 3   },
        { name: "Theory of Machines",                  code: "ME303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Thermal Engineering Lab",             code: "ME311", type: "Lab",       credits: 1.5 },
        { name: "Theory of Machines Lab",              code: "ME312", type: "Lab",       credits: 1.5 },
        { name: "Machine Tools & Metrology Lab",       code: "ME313", type: "Lab",       credits: 2   },
        { name: "Mechatronics Lab",                    code: "ME314", type: "Lab",       credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "Heat Transfer",                       code: "ME304", type: "Theory",    credits: 3   },
        { name: "AI & Machine Learning",               code: "AI305", type: "Theory",    credits: 3   },
        { name: "Finite Element Methods",              code: "ME305", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "AI & ML Lab",                         code: "AI313", type: "Lab",       credits: 1.5 },
        { name: "CAD Manufacturing Lab",               code: "ME313", type: "Lab",       credits: 2   },
        { name: "Robotics & Drone Technology",         code: "ME321", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "CAD/CAM",                             code: "ME401", type: "Theory",    credits: 3 },
        { name: "Operations Research",                 code: "ME402", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Renewable Energy Simulation Lab",     code: "ME411", type: "Lab",       credits: 2 },
        { name: "Instrumentation & Control Systems Lab",code:"ME412", type: "Lab",       credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "ME491", type: "Theory", credits: 12 }
      ]
    },

    // ── CIVIL ─────────────────────────────────────────────────
    CIVIL: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "MA101", type: "Theory",    credits: 3   },
        { name: "Chemistry",                            code: "CH101", type: "Theory",    credits: 3   },
        { name: "Introduction to Programming",          code: "CS101", type: "Theory",    credits: 3   },
        { name: "Engineering Graphics",                 code: "ME101", type: "Theory",    credits: 3   },
        { name: "Basic Electrical & Electronics Engg",  code: "EE101", type: "Theory",    credits: 3   },
        { name: "Engineering Chemistry Lab",            code: "CH111", type: "Lab",       credits: 1   },
        { name: "Computer Programming Lab",             code: "CS112", type: "Lab",       credits: 1.5 },
        { name: "Electrical & Electronics Workshop",    code: "EE111", type: "Lab",       credits: 1.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "MA102", type: "Theory",    credits: 3   },
        { name: "Engineering Physics",                      code: "PH101", type: "Theory",    credits: 3   },
        { name: "Communicative English",                    code: "EN101", type: "Theory",    credits: 2   },
        { name: "Basic Civil & Mechanical Engineering",     code: "CM101", type: "Theory",    credits: 3   },
        { name: "Engineering Mechanics",                    code: "CE102", type: "Theory",    credits: 3   },
        { name: "Communicative English Lab",                code: "EN111", type: "Lab",       credits: 1   },
        { name: "Engineering Physics Lab",                  code: "PH111", type: "Lab",       credits: 1   },
        { name: "IT Workshop",                              code: "CS111", type: "Lab",       credits: 1   },
        { name: "Engineering Workshop",                     code: "ME111", type: "Lab",       credits: 1.5 },
        { name: "Engineering Mechanics & Building Practices Lab", code: "CE113", type: "Lab", credits: 1.5 }
      ],
      "2-1": [
        { name: "Numerical & Statistical Methods",     code: "MA201", type: "Theory",    credits: 3   },
        { name: "Universal Human Values",              code: "MC201", type: "Mandatory", credits: 3   },
        { name: "Surveying",                           code: "CE201", type: "Theory",    credits: 3   },
        { name: "Strength of Materials",               code: "CE202", type: "Theory",    credits: 3   },
        { name: "Fluid Mechanics",                     code: "CE203", type: "Theory",    credits: 3   },
        { name: "Surveying Lab",                       code: "CE211", type: "Lab",       credits: 1.5 },
        { name: "Strength of Materials Lab",           code: "CE212", type: "Lab",       credits: 1.5 },
        { name: "Building Planning & Drawing",         code: "CE221", type: "Skill",     credits: 2   },
        { name: "Environmental Science",               code: "MC202", type: "Mandatory", credits: 0   }
      ],
      "2-2": [
        { name: "Managerial Economics & Financial Analysis", code: "MB201", type: "Theory",    credits: 2   },
        { name: "Engineering Geology",                       code: "CE204", type: "Theory",    credits: 3   },
        { name: "Building Materials & Concrete Technology",  code: "CE205", type: "Theory",    credits: 3   },
        { name: "Structural Analysis",                       code: "CE206", type: "Theory",    credits: 3   },
        { name: "Hydraulics & Hydraulic Machinery",          code: "CE207", type: "Theory",    credits: 3   },
        { name: "Concrete Technology Lab",                   code: "CE213", type: "Lab",       credits: 1.5 },
        { name: "Engineering Geology Lab",                   code: "CE214", type: "Lab",       credits: 1.5 },
        { name: "Remote Sensing & GIS",                      code: "CE221", type: "Skill",     credits: 2   },
        { name: "Design Thinking & Innovation",              code: "MC203", type: "Mandatory", credits: 2   }
      ],
      "3-1": [
        { name: "Reinforced Concrete Structures",      code: "CE301", type: "Theory",    credits: 3   },
        { name: "Geotechnical Engineering",            code: "CE302", type: "Theory",    credits: 3   },
        { name: "Water Resources Engineering",         code: "CE303", type: "Theory",    credits: 3   },
        { name: "Professional Elective-I",             code: "PE301", type: "Elective",  credits: 3   },
        { name: "Open Elective-I",                     code: "OE301", type: "Elective",  credits: 3   },
        { name: "Geotechnical Engineering Lab",        code: "CE311", type: "Lab",       credits: 1.5 },
        { name: "Fluid Mechanics Lab",                 code: "CE312", type: "Lab",       credits: 1.5 },
        { name: "AutoCAD",                             code: "CE321", type: "Skill",     credits: 2   },
        { name: "Evaluation of Community Service",     code: "MC301", type: "Mandatory", credits: 2   }
      ],
      "3-2": [
        { name: "Steel Structures",                    code: "CE304", type: "Theory",    credits: 3   },
        { name: "Transportation Engineering",          code: "CE305", type: "Theory",    credits: 3   },
        { name: "Environmental Engineering",           code: "CE306", type: "Theory",    credits: 3   },
        { name: "Professional Elective-II",            code: "PE302", type: "Elective",  credits: 3   },
        { name: "Professional Elective-III",           code: "PE303", type: "Elective",  credits: 3   },
        { name: "Open Elective-II",                    code: "OE302", type: "Elective",  credits: 3   },
        { name: "Structural Analysis Lab",             code: "CE313", type: "Lab",       credits: 1.5 },
        { name: "Transportation Engineering Lab",      code: "CE314", type: "Lab",       credits: 1.5 },
        { name: "Soft Skills",                         code: "CS323", type: "Skill",     credits: 2   },
        { name: "Technical Paper Writing & IPR",       code: "MC302", type: "Mandatory", credits: 0   }
      ],
      "4-1": [
        { name: "Foundation Engineering",              code: "CE401", type: "Theory",    credits: 3 },
        { name: "Construction Project Management",     code: "CE402", type: "Theory",    credits: 2 },
        { name: "Professional Elective-IV",            code: "PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",             code: "PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                   code: "OE401", type: "Elective",  credits: 3 },
        { name: "Open Elective-IV",                    code: "OE402", type: "Elective",  credits: 3 },
        { name: "Structural Design Lab",               code: "CE411", type: "Lab",       credits: 2 },
        { name: "Constitution of India",               code: "MC401", type: "Mandatory", credits: 0 },
        { name: "Evaluation of Industry Internship",   code: "MC402", type: "Mandatory", credits: 2 }
      ],
      "4-2": [
        { name: "Full Semester Internship & Project Work", code: "CE491", type: "Theory", credits: 12 }
      ]
    },

    // ── Other branches (generic structure) ───────────────────
    CHEM: {
      "1-1": Y1S1_COMMON, "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Chemical Engineering Thermodynamics", code: "CH201", type: "Theory", credits: 3 },
        { name: "Universal Human Values",              code: "MC201", type: "Mandatory", credits: 3 },
        { name: "Fluid Mechanics",                     code: "CH202", type: "Theory", credits: 3 },
        { name: "Organic Chemistry",                   code: "CH203", type: "Theory", credits: 3 },
        { name: "Mass Transfer",                       code: "CH204", type: "Theory", credits: 3 },
        { name: "Chemical Technology Lab",             code: "CH211", type: "Lab", credits: 1.5 },
        { name: "Fluid Mechanics Lab",                 code: "CH212", type: "Lab", credits: 1.5 },
        { name: "Python Programming",                  code: "CS221", type: "Skill", credits: 2 },
        { name: "Environmental Science",               code: "MC202", type: "Mandatory", credits: 0 }
      ],
      "2-2": [
        { name: "Managerial Economics",                code: "MB201", type: "Theory", credits: 2 },
        { name: "Heat Transfer",                       code: "CH205", type: "Theory", credits: 3 },
        { name: "Chemical Reaction Engineering",       code: "CH206", type: "Theory", credits: 3 },
        { name: "Process Dynamics & Control",          code: "CH207", type: "Theory", credits: 3 },
        { name: "Separation Processes",                code: "CH208", type: "Theory", credits: 3 },
        { name: "Heat Transfer Lab",                   code: "CH213", type: "Lab", credits: 1.5 },
        { name: "Reaction Engineering Lab",            code: "CH214", type: "Lab", credits: 1.5 },
        { name: "Design Thinking & Innovation",        code: "MC203", type: "Mandatory", credits: 2 }
      ]
    },
    BT: {
      "1-1": Y1S1_COMMON, "1-2": Y1S2_COMMON,
      "2-1": [
        { name: "Biochemistry",                        code: "BT201", type: "Theory", credits: 3 },
        { name: "Universal Human Values",              code: "MC201", type: "Mandatory", credits: 3 },
        { name: "Microbiology",                        code: "BT202", type: "Theory", credits: 3 },
        { name: "Genetics",                            code: "BT203", type: "Theory", credits: 3 },
        { name: "Cell Biology",                        code: "BT204", type: "Theory", credits: 3 },
        { name: "Biochemistry Lab",                    code: "BT211", type: "Lab", credits: 1.5 },
        { name: "Microbiology Lab",                    code: "BT212", type: "Lab", credits: 1.5 },
        { name: "Python Programming",                  code: "CS221", type: "Skill", credits: 2 },
        { name: "Environmental Science",               code: "MC202", type: "Mandatory", credits: 0 }
      ],
      "2-2": [
        { name: "Managerial Economics",                code: "MB201", type: "Theory", credits: 2 },
        { name: "Bioprocess Engineering",              code: "BT205", type: "Theory", credits: 3 },
        { name: "Immunology",                          code: "BT206", type: "Theory", credits: 3 },
        { name: "Molecular Biology",                   code: "BT207", type: "Theory", credits: 3 },
        { name: "Downstream Processing",               code: "BT208", type: "Theory", credits: 3 },
        { name: "Bioprocess Lab",                      code: "BT213", type: "Lab", credits: 1.5 },
        { name: "Molecular Biology Lab",               code: "BT214", type: "Lab", credits: 1.5 },
        { name: "Design Thinking & Innovation",        code: "MC203", type: "Mandatory", credits: 2 }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  //  R20 — same branches, same structure (codes differ slightly)
  // ═══════════════════════════════════════════════════════════════
  R20: {
    CSE: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "20MA101", type: "Theory",    credits: 4 },
        { name: "Engineering Physics",                  code: "20PH101", type: "Theory",    credits: 3 },
        { name: "English for Communication",            code: "20EN101", type: "Theory",    credits: 2 },
        { name: "Problem Solving & C Programming",      code: "20CS101", type: "Theory",    credits: 3 },
        { name: "Engineering Drawing",                  code: "20ME101", type: "Theory",    credits: 3 },
        { name: "IT Workshop",                          code: "20CS111", type: "Lab",       credits: 1.5 },
        { name: "English Language Communication Lab",   code: "20EN111", type: "Lab",       credits: 1 },
        { name: "Engineering Physics Lab",              code: "20PH111", type: "Lab",       credits: 1 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "20MA102", type: "Theory",    credits: 4 },
        { name: "Chemistry",                                code: "20CH101", type: "Theory",    credits: 3 },
        { name: "Basic Electrical & Electronics Engineering", code: "20EE101", type: "Theory",  credits: 3 },
        { name: "Data Structures",                          code: "20CS102", type: "Theory",    credits: 3 },
        { name: "Discrete Mathematics",                     code: "20CS103", type: "Theory",    credits: 3 },
        { name: "Chemistry Lab",                            code: "20CH111", type: "Lab",       credits: 1 },
        { name: "Data Structures Lab",                      code: "20CS113", type: "Lab",       credits: 1.5 },
        { name: "Engineering Workshop",                     code: "20ME111", type: "Lab",       credits: 1.5 }
      ],
      "2-1": [
        { name: "Probability & Statistics",               code: "20MA201", type: "Theory",    credits: 3 },
        { name: "Digital Logic Design",                   code: "20CS201", type: "Theory",    credits: 3 },
        { name: "Computer Organization & Architecture",   code: "20CS202", type: "Theory",    credits: 3 },
        { name: "OOP Through Java",                       code: "20CS203", type: "Theory",    credits: 3 },
        { name: "Operating Systems",                      code: "20CS204", type: "Theory",    credits: 3 },
        { name: "OOP Lab",                                code: "20CS211", type: "Lab",       credits: 1.5 },
        { name: "Operating Systems Lab",                  code: "20CS212", type: "Lab",       credits: 1.5 }
      ],
      "2-2": [
        { name: "Managerial Economics",                   code: "20MB201", type: "Theory",    credits: 2 },
        { name: "Software Engineering",                   code: "20CS205", type: "Theory",    credits: 3 },
        { name: "Database Management Systems",            code: "20CS206", type: "Theory",    credits: 3 },
        { name: "Computer Networks",                      code: "20CS207", type: "Theory",    credits: 3 },
        { name: "Automata Theory",                        code: "20CS208", type: "Theory",    credits: 3 },
        { name: "DBMS Lab",                               code: "20CS213", type: "Lab",       credits: 1.5 },
        { name: "Computer Networks Lab",                  code: "20CS214", type: "Lab",       credits: 1.5 }
      ],
      "3-1": [
        { name: "Web Technologies",                       code: "20CS301", type: "Theory",    credits: 3 },
        { name: "Compiler Design",                        code: "20CS302", type: "Theory",    credits: 3 },
        { name: "Design & Analysis of Algorithms",        code: "20CS303", type: "Theory",    credits: 3 },
        { name: "Professional Elective-I",                code: "20PE301", type: "Elective",  credits: 3 },
        { name: "Open Elective-I",                        code: "20OE301", type: "Elective",  credits: 3 },
        { name: "Web Technologies Lab",                   code: "20CS311", type: "Lab",       credits: 1.5 },
        { name: "Compiler Design Lab",                    code: "20CS312", type: "Lab",       credits: 1.5 }
      ],
      "3-2": [
        { name: "Machine Learning",                       code: "20CS304", type: "Theory",    credits: 3 },
        { name: "Artificial Intelligence",                code: "20CS305", type: "Theory",    credits: 3 },
        { name: "Cryptography & Network Security",        code: "20CS306", type: "Theory",    credits: 3 },
        { name: "Professional Elective-II",               code: "20PE302", type: "Elective",  credits: 3 },
        { name: "Professional Elective-III",              code: "20PE303", type: "Elective",  credits: 3 },
        { name: "Open Elective-II",                       code: "20OE302", type: "Elective",  credits: 3 },
        { name: "ML Lab",                                 code: "20CS313", type: "Lab",       credits: 1.5 },
        { name: "AI Lab",                                 code: "20CS314", type: "Lab",       credits: 1.5 }
      ],
      "4-1": [
        { name: "Cloud Computing",                        code: "20CS401", type: "Theory",    credits: 3 },
        { name: "Big Data Analytics",                     code: "20CS402", type: "Theory",    credits: 3 },
        { name: "Professional Elective-IV",               code: "20PE401", type: "Elective",  credits: 3 },
        { name: "Professional Elective-V",                code: "20PE402", type: "Elective",  credits: 3 },
        { name: "Open Elective-III",                      code: "20OE401", type: "Elective",  credits: 3 },
        { name: "Project Work / Internship",              code: "20CS491", type: "Theory",    credits: 6 }
      ],
      "4-2": [
        { name: "Full Semester Project Work",             code: "20CS492", type: "Theory",    credits: 12 }
      ]
    },
    ECE: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "20MA101", type: "Theory", credits: 4 },
        { name: "Engineering Chemistry",                code: "20CH101", type: "Theory", credits: 3 },
        { name: "Problem Solving & C Programming",      code: "20CS101", type: "Theory", credits: 3 },
        { name: "Engineering Drawing",                  code: "20ME101", type: "Theory", credits: 3 },
        { name: "Basic Electrical & Electronics Engg",  code: "20EE101", type: "Theory", credits: 3 },
        { name: "Engineering Chemistry Lab",            code: "20CH111", type: "Lab",    credits: 1 },
        { name: "Computer Programming Lab",             code: "20CS112", type: "Lab",    credits: 1.5 },
        { name: "Electrical Workshop",                  code: "20EE111", type: "Lab",    credits: 1.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "20MA102", type: "Theory", credits: 4 },
        { name: "Engineering Physics",                  code: "20PH101", type: "Theory", credits: 3 },
        { name: "English for Communication",            code: "20EN101", type: "Theory", credits: 2 },
        { name: "Network Theory",                       code: "20EC102", type: "Theory", credits: 3 },
        { name: "Electronic Devices",                   code: "20EC103", type: "Theory", credits: 3 },
        { name: "Engineering Physics Lab",              code: "20PH111", type: "Lab",    credits: 1 },
        { name: "IT Workshop",                          code: "20CS111", type: "Lab",    credits: 1.5 },
        { name: "Network Theory Lab",                   code: "20EC113", type: "Lab",    credits: 1.5 }
      ],
      "2-1": [
        { name: "Probability & Statistics",             code: "20MA201", type: "Theory", credits: 3 },
        { name: "Signals & Systems",                    code: "20EC201", type: "Theory", credits: 3 },
        { name: "Analog Circuits",                      code: "20EC202", type: "Theory", credits: 3 },
        { name: "Digital System Design",                code: "20EC203", type: "Theory", credits: 3 },
        { name: "EM Waves & Transmission Lines",        code: "20EC204", type: "Theory", credits: 3 },
        { name: "Analog Circuits Lab",                  code: "20EC211", type: "Lab",    credits: 1.5 },
        { name: "Digital System Design Lab",            code: "20EC212", type: "Lab",    credits: 1.5 }
      ],
      "2-2": [
        { name: "Managerial Economics",                 code: "20MB201", type: "Theory", credits: 2 },
        { name: "Digital Communications",               code: "20EC205", type: "Theory", credits: 3 },
        { name: "Linear Control Systems",               code: "20EC206", type: "Theory", credits: 3 },
        { name: "DSP",                                  code: "20EC207", type: "Theory", credits: 3 },
        { name: "Microprocessors & Microcontrollers",   code: "20EC208", type: "Theory", credits: 3 },
        { name: "DSP Lab",                              code: "20EC213", type: "Lab",    credits: 1.5 },
        { name: "Microprocessors Lab",                  code: "20EC214", type: "Lab",    credits: 1.5 }
      ]
    },
    EEE: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "20MA101", type: "Theory", credits: 4 },
        { name: "Engineering Chemistry",                code: "20CH101", type: "Theory", credits: 3 },
        { name: "Problem Solving & C Programming",      code: "20CS101", type: "Theory", credits: 3 },
        { name: "Engineering Drawing",                  code: "20ME101", type: "Theory", credits: 3 },
        { name: "Basic Electrical & Electronics Engg",  code: "20EE101", type: "Theory", credits: 3 },
        { name: "Chemistry Lab",                        code: "20CH111", type: "Lab",    credits: 1 },
        { name: "Computer Programming Lab",             code: "20CS112", type: "Lab",    credits: 1.5 },
        { name: "Electrical Workshop",                  code: "20EE111", type: "Lab",    credits: 1.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "20MA102", type: "Theory", credits: 4 },
        { name: "Engineering Physics",                  code: "20PH101", type: "Theory", credits: 3 },
        { name: "English for Communication",            code: "20EN101", type: "Theory", credits: 2 },
        { name: "Circuit Theory",                       code: "20EE102", type: "Theory", credits: 3 },
        { name: "Electronic Devices & Circuits",        code: "20EE103", type: "Theory", credits: 3 },
        { name: "Engineering Physics Lab",              code: "20PH111", type: "Lab",    credits: 1 },
        { name: "Circuit Theory Lab",                   code: "20EE113", type: "Lab",    credits: 1.5 },
        { name: "IT Workshop",                          code: "20CS111", type: "Lab",    credits: 1.5 }
      ],
      "2-1": [
        { name: "Probability & Statistics",             code: "20MA201", type: "Theory", credits: 3 },
        { name: "Electrical Machines-I",                code: "20EE201", type: "Theory", credits: 3 },
        { name: "Electromagnetic Fields",               code: "20EE202", type: "Theory", credits: 3 },
        { name: "Digital Systems",                      code: "20EE203", type: "Theory", credits: 3 },
        { name: "Electrical Machines-I Lab",            code: "20EE211", type: "Lab",    credits: 1.5 },
        { name: "Digital Systems Lab",                  code: "20EE212", type: "Lab",    credits: 1.5 }
      ],
      "2-2": [
        { name: "Managerial Economics",                 code: "20MB201", type: "Theory", credits: 2 },
        { name: "Power Systems-I",                      code: "20EE204", type: "Theory", credits: 3 },
        { name: "Electrical Machines-II",               code: "20EE205", type: "Theory", credits: 3 },
        { name: "Control Systems",                      code: "20EE206", type: "Theory", credits: 3 },
        { name: "Power Electronics",                    code: "20EE207", type: "Theory", credits: 3 },
        { name: "Electrical Machines-II Lab",           code: "20EE213", type: "Lab",    credits: 1.5 },
        { name: "Power Electronics Lab",                code: "20EE214", type: "Lab",    credits: 1.5 }
      ]
    },
    MECHANICAL: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "20MA101", type: "Theory", credits: 4 },
        { name: "Engineering Chemistry",                code: "20CH101", type: "Theory", credits: 3 },
        { name: "Problem Solving & C Programming",      code: "20CS101", type: "Theory", credits: 3 },
        { name: "Engineering Drawing",                  code: "20ME101", type: "Theory", credits: 3 },
        { name: "Engineering Mechanics",                code: "20ME102", type: "Theory", credits: 3 },
        { name: "Chemistry Lab",                        code: "20CH111", type: "Lab",    credits: 1 },
        { name: "Computer Programming Lab",             code: "20CS112", type: "Lab",    credits: 1.5 },
        { name: "Workshop",                             code: "20ME111", type: "Lab",    credits: 1.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "20MA102", type: "Theory", credits: 4 },
        { name: "Engineering Physics",                  code: "20PH101", type: "Theory", credits: 3 },
        { name: "English for Communication",            code: "20EN101", type: "Theory", credits: 2 },
        { name: "Thermodynamics",                       code: "20ME103", type: "Theory", credits: 3 },
        { name: "Strength of Materials",                code: "20ME104", type: "Theory", credits: 3 },
        { name: "Engineering Physics Lab",              code: "20PH111", type: "Lab",    credits: 1 },
        { name: "IT Workshop",                          code: "20CS111", type: "Lab",    credits: 1.5 },
        { name: "Manufacturing Processes Lab",          code: "20ME113", type: "Lab",    credits: 1.5 }
      ],
      "2-1": [
        { name: "Probability & Statistics",             code: "20MA201", type: "Theory", credits: 3 },
        { name: "Material Science & Metallurgy",        code: "20ME201", type: "Theory", credits: 3 },
        { name: "Fluid Mechanics",                      code: "20ME202", type: "Theory", credits: 3 },
        { name: "Kinematics of Machinery",              code: "20ME203", type: "Theory", credits: 3 },
        { name: "Machine Drawing",                      code: "20ME204", type: "Theory", credits: 3 },
        { name: "Fluid Mechanics Lab",                  code: "20ME211", type: "Lab",    credits: 1.5 },
        { name: "Kinematics Lab",                       code: "20ME212", type: "Lab",    credits: 1.5 }
      ],
      "2-2": [
        { name: "Managerial Economics",                 code: "20MB201", type: "Theory", credits: 2 },
        { name: "Heat Transfer",                        code: "20ME205", type: "Theory", credits: 3 },
        { name: "Machine Design",                       code: "20ME206", type: "Theory", credits: 3 },
        { name: "Manufacturing Technology",             code: "20ME207", type: "Theory", credits: 3 },
        { name: "Dynamics of Machinery",                code: "20ME208", type: "Theory", credits: 3 },
        { name: "Heat Transfer Lab",                    code: "20ME213", type: "Lab",    credits: 1.5 },
        { name: "Machine Design Lab",                   code: "20ME214", type: "Lab",    credits: 1.5 }
      ]
    },
    CIVIL: {
      "1-1": [
        { name: "Linear Algebra & Calculus",            code: "20MA101", type: "Theory", credits: 4 },
        { name: "Engineering Chemistry",                code: "20CH101", type: "Theory", credits: 3 },
        { name: "Problem Solving & C Programming",      code: "20CS101", type: "Theory", credits: 3 },
        { name: "Engineering Drawing",                  code: "20ME101", type: "Theory", credits: 3 },
        { name: "Engineering Mechanics",                code: "20CE101", type: "Theory", credits: 3 },
        { name: "Chemistry Lab",                        code: "20CH111", type: "Lab",    credits: 1 },
        { name: "Computer Programming Lab",             code: "20CS112", type: "Lab",    credits: 1.5 },
        { name: "Workshop",                             code: "20ME111", type: "Lab",    credits: 1.5 }
      ],
      "1-2": [
        { name: "Differential Equations & Vector Calculus", code: "20MA102", type: "Theory", credits: 4 },
        { name: "Engineering Physics",                  code: "20PH101", type: "Theory", credits: 3 },
        { name: "English for Communication",            code: "20EN101", type: "Theory", credits: 2 },
        { name: "Strength of Materials",                code: "20CE102", type: "Theory", credits: 3 },
        { name: "Fluid Mechanics",                      code: "20CE103", type: "Theory", credits: 3 },
        { name: "Engineering Physics Lab",              code: "20PH111", type: "Lab",    credits: 1 },
        { name: "IT Workshop",                          code: "20CS111", type: "Lab",    credits: 1.5 },
        { name: "Building Materials Lab",               code: "20CE113", type: "Lab",    credits: 1.5 }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  //  R24 — mirror of R23 with R24 subject codes
  // ═══════════════════════════════════════════════════════════════
  R24: {},

  // ═══════════════════════════════════════════════════════════════
  //  R25 — mirror of R23 with R25 subject codes
  // ═══════════════════════════════════════════════════════════════
  R25: {}
};

// Copy R23 branches into R24 and R25 with updated codes
["R24", "R25"].forEach(reg => {
  const prefix = reg.slice(1); // "24" or "25"
  Object.keys(CURRICULUM.R23).forEach(branch => {
    CURRICULUM[reg][branch] = {};
    Object.keys(CURRICULUM.R23[branch]).forEach(sem => {
      CURRICULUM[reg][branch][sem] = CURRICULUM.R23[branch][sem].map(sub => ({
        ...sub,
        code: sub.code.replace(/^(\d{2}|[A-Z]{2})/, prefix)
      }));
    });
  });
});

// ─────────────────────────────────────────────────────────────────
export const BRANCH_OPTIONS = [
  { code: "CSE",      label: "Computer Science and Engineering" },
  { code: "CSE-AIML",label: "CSE (Artificial Intelligence & Machine Learning)" },
  { code: "CSE-DS",   label: "CSE (Data Science)" },
  { code: "CSE-CS",   label: "CSE (Cyber Security)" },
  { code: "CSE-IOT",  label: "CSE (Internet of Things)" },
  { code: "AIML",     label: "Artificial Intelligence and Machine Learning" },
  { code: "IT",       label: "Information Technology" },
  { code: "ECE",      label: "Electronics and Communication Engineering" },
  { code: "EEE",      label: "Electrical and Electronics Engineering" },
  { code: "MECHANICAL",label:"Mechanical Engineering" },
  { code: "CIVIL",    label: "Civil Engineering" },
  { code: "CHEM",     label: "Chemical Engineering" },
  { code: "BT",       label: "Biotechnology" },
  { code: "OTHER",    label: "Other" }
];

export const REGULATION_OPTIONS = ["R25", "R24", "R23", "R20"];

export function normalizeBranchCode(branch = "") {
  const raw = String(branch).trim().toUpperCase();
  if (!raw) return "";

  // Exact code matches
  const exactCodes = ["CSE","CSE-AIML","CSE-DS","CSE-CS","CSE-IOT","AIML","IT","ECE","EEE","MECHANICAL","CIVIL","CHEM","BT"];
  if (exactCodes.includes(raw)) return raw;

  // Label-based fuzzy matching
  if (raw.includes("CYBER") || raw.includes("CYBER SECURITY")) return "CSE-CS";
  if ((raw.includes("COMPUTER") || raw.includes("CSE")) && raw.includes("AI") && raw.includes("ML")) return "CSE-AIML";
  if ((raw.includes("COMPUTER") || raw.includes("CSE")) && raw.includes("DATA")) return "CSE-DS";
  if ((raw.includes("COMPUTER") || raw.includes("CSE")) && raw.includes("IOT")) return "CSE-IOT";
  if (raw.includes("COMPUTER") || raw === "CSE") return "CSE";
  if (raw.includes("ARTIFICIAL") && raw.includes("MACHINE")) return "AIML";
  if (raw.includes("ARTIFICIAL") || raw.includes("AIML")) return "AIML";
  if (raw.includes("INFORMATION TECHNOLOGY") || raw === "IT") return "IT";
  if (raw.includes("ELECTRONICS AND COMMUNICATION") || raw === "ECE") return "ECE";
  if (raw.includes("ELECTRICAL AND ELECTRONICS") || raw === "EEE") return "EEE";
  if (raw.includes("MECHANICAL") || raw === "MECH") return "MECHANICAL";
  if (raw.includes("CIVIL")) return "CIVIL";
  if (raw.includes("CHEMICAL") || raw === "CHEM") return "CHEM";
  if (raw.includes("BIOTECH") || raw.includes("BIOTECHNOLOGY") || raw === "BT") return "BT";
  return raw;
}
'@

[System.IO.File]::WriteAllText($out, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done. Lines: $((Get-Content $out).Count)"
