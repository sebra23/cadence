// MedBridge Elite - Mock Database & Types Layer

export interface Organization {
  id: string;
  name: string;
  domain: string;
}

export interface Hospital {
  id: string;
  name: string;
  healthSystem: string;
  country: string;
  region: string;
  beds: number;
  teachingStatus: boolean;
  ownership: 'Public' | 'Private-Non-Profit' | 'Private-For-Profit' | 'Government';
  excellenceScore: number;
  rankings: { category: string; rank: number; year: number }[];
  accreditations: string[];
  techStack: string[];
  staffing: { role: string; count: number }[];
  trialActivity: { activeCount: number; sponsors: string[] };
  researchOutput: { publicationsCount: number; citationsCount: number; hIndex: number };
}

export interface Protocol {
  id: string;
  name: string;
  category: 'Emergency' | 'Cardiology' | 'Oncology' | 'Neurology' | 'Pediatrics' | 'ICU' | 'Surgery' | 'Operations' | 'Patient Flow' | 'Quality' | 'Research';
  description: string;
  evidenceSummary: string;
  workflow: string[];
  roles: string[];
  kpis: { name: string; target: string; type: string }[];
  checklist: string[];
  sources: { title: string; authors: string; confidence: number; url: string }[];
  transferabilityScore: number;
}

export interface Metric {
  category: 'Clinical' | 'Operational' | 'Financial' | 'Patient Experience' | 'Research' | 'Workforce';
  name: string;
  value: number;
  unit: string;
  nationalBenchmark: number;
  topDecileBenchmark: number;
  history: { date: string; value: number }[];
}

export interface Project {
  id: string;
  name: string;
  protocolId: string | null;
  hospitalId: string;
  status: 'Planning' | 'Active' | 'Completed' | 'On-Hold';
  startDate: string;
  dueDate: string;
  progress: number;
  department: string;
  tasks: Task[];
  risks: { id: string; description: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; mitigation: string; status: 'Active' | 'Mitigated' }[];
  milestones: { name: string; dueDate: string; completed: boolean }[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'Todo' | 'In-Progress' | 'Done' | 'Blocked';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  dueDate: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  enrolled: boolean;
  progress: number;
  lessons: { title: string; duration: number; content: string }[];
}

export interface Webinar {
  id: string;
  title: string;
  speaker: string;
  scheduledAt: string;
  registered: boolean;
  link: string;
}

export interface AIResponse {
  content: string;
  confidenceScore: number;
  sources: { title: string; url: string; confidence: number }[];
  timestamp: string;
  evidenceTrace: string[];
}

// -------------------------------------------------------------
// Core Seed Data
// -------------------------------------------------------------

export const initialHospitals: Hospital[] = [
  {
    id: "hosp-mayo",
    name: "Mayo Clinic - Rochester",
    healthSystem: "Mayo Clinic Health System",
    country: "USA",
    region: "Midwest",
    beds: 1265,
    teachingStatus: true,
    ownership: "Private-Non-Profit",
    excellenceScore: 98,
    rankings: [
      { category: "Overall Quality", rank: 1, year: 2026 },
      { category: "Cardiology", rank: 2, year: 2026 },
      { category: "Neurology", rank: 1, year: 2026 }
    ],
    accreditations: ["Joint Commission Gold Seal", "Magnet Recognition", "ACGME Accredited"],
    techStack: ["Epic EHR Systems", "Philips Clinical Informatics", "MedBridge AI Orchestrator", "Sectra PACS"],
    staffing: [
      { role: "Physicians", count: 2300 },
      { role: "Nurses", count: 4800 },
      { role: "Researchers", count: 850 }
    ],
    trialActivity: { activeCount: 142, sponsors: ["Pfizer", "Novartis", "NIH", "Roche"] },
    researchOutput: { publicationsCount: 4500, citationsCount: 98000, hIndex: 112 }
  },
  {
    id: "hosp-cleveland",
    name: "Cleveland Clinic",
    healthSystem: "Cleveland Clinic Health System",
    country: "USA",
    region: "East",
    beds: 1400,
    teachingStatus: true,
    ownership: "Private-Non-Profit",
    excellenceScore: 96,
    rankings: [
      { category: "Overall Quality", rank: 2, year: 2026 },
      { category: "Cardiology", rank: 1, year: 2026 },
      { category: "Gastroenterology", rank: 2, year: 2026 }
    ],
    accreditations: ["Joint Commission Gold Seal", "Magnet Recognition", "ISO 9001"],
    techStack: ["Epic EHR Systems", "GE Healthcare Command Center", "Siemens Syngo PACS"],
    staffing: [
      { role: "Physicians", count: 2100 },
      { role: "Nurses", count: 4500 },
      { role: "Researchers", count: 720 }
    ],
    trialActivity: { activeCount: 128, sponsors: ["AstraZeneca", "Merck", "NIH"] },
    researchOutput: { publicationsCount: 3800, citationsCount: 81000, hIndex: 98 }
  },
  {
    id: "hosp-st-jude",
    name: "St. Jude Children's Research Hospital",
    healthSystem: "St. Jude Network",
    country: "USA",
    region: "South",
    beds: 78,
    teachingStatus: true,
    ownership: "Private-Non-Profit",
    excellenceScore: 94,
    rankings: [
      { category: "Pediatrics", rank: 1, year: 2026 },
      { category: "Oncology", rank: 1, year: 2026 }
    ],
    accreditations: ["Joint Commission", "AABB Accreditation", "CAP Accredited"],
    techStack: ["Cerner Millennium", "Flywheel Imaging Data", "Custom Bioinformatics Cloud"],
    staffing: [
      { role: "Physicians", count: 320 },
      { role: "Nurses", count: 850 },
      { role: "Researchers", count: 1200 }
    ],
    trialActivity: { activeCount: 210, sponsors: ["St. Jude Labs", "National Cancer Institute", "PharmaSponsors"] },
    researchOutput: { publicationsCount: 5200, citationsCount: 124000, hIndex: 135 }
  },
  {
    id: "hosp-toronto",
    name: "Toronto General Hospital",
    healthSystem: "University Health Network (UHN)",
    country: "Canada",
    region: "Ontario",
    beds: 471,
    teachingStatus: true,
    ownership: "Public",
    excellenceScore: 91,
    rankings: [
      { category: "Overall Quality", rank: 4, year: 2026 },
      { category: "Transplant Excellence", rank: 1, year: 2026 }
    ],
    accreditations: ["Accreditation Canada Exemplary Standing"],
    techStack: ["Epic EHR Systems", "Agfa Enterprise Imaging", "BD Pyxis MedStations"],
    staffing: [
      { role: "Physicians", count: 950 },
      { role: "Nurses", count: 2400 },
      { role: "Researchers", count: 610 }
    ],
    trialActivity: { activeCount: 95, sponsors: ["Roche", "GlaxoSmithKline", "CIHR"] },
    researchOutput: { publicationsCount: 2900, citationsCount: 65000, hIndex: 82 }
  },
  {
    id: "hosp-charite",
    name: "Charité – Universitätsmedizin Berlin",
    healthSystem: "Charité Group",
    country: "Germany",
    region: "Berlin",
    beds: 3001,
    teachingStatus: true,
    ownership: "Public",
    excellenceScore: 89,
    rankings: [
      { category: "Overall Quality", rank: 5, year: 2026 },
      { category: "Infectious Diseases", rank: 2, year: 2026 }
    ],
    accreditations: ["KTQ-Zertifikat Germany", "JCI Accreditation"],
    techStack: ["SAP i.s.h.med EHR", "Sectra PACS", "MedBridge AI Platform"],
    staffing: [
      { role: "Physicians", count: 4200 },
      { role: "Nurses", count: 9800 },
      { role: "Researchers", count: 1800 }
    ],
    trialActivity: { activeCount: 165, sponsors: ["Bayer", "Boehringer Ingelheim", "EU Horizon"] },
    researchOutput: { publicationsCount: 4800, citationsCount: 92000, hIndex: 104 }
  }
];

export const initialProtocols: Protocol[] = [
  {
    id: "prot-stemi",
    name: "STEMI Acceleration & Door-to-Balloon Standard",
    category: "Cardiology",
    description: "Standardized clinical pathway designed to optimize timelines and coordination from emergency entry to cardiac catheterization balloon inflation for STEMI patients.",
    evidenceSummary: "Aggressive reduction of Door-to-Balloon (D2B) time under 60 minutes yields an 18% reduction in 30-day mortality for ST-elevation myocardial infarction.",
    workflow: [
      "Field ECG transmission by EMS directly to ED Physician.",
      "Instant activation of Cath Lab by ED Physician prior to patient arrival.",
      "Direct transit: patient bypassing emergency beds straight to Cath Lab table.",
      "Parallel registration and medication delivery (Heparin + Dual Antiplatelet)."
    ],
    roles: [
      "ED Physician (Activator)",
      "EMS Cardiac Paramedics",
      "Interventional Cardiologist (Lead)",
      "Circulating Cath Lab Nurse"
    ],
    kpis: [
      { name: "Door-to-Balloon Time", target: "< 55 mins", type: "Minutes" },
      { name: "First Medical Contact to ECG", target: "< 10 mins", type: "Minutes" },
      { name: "30-Day Re-admission Rate", target: "< 4.5%", type: "Percentage" }
    ],
    checklist: [
      "Ensure field ECG transmitted.",
      "Verify STEMI pager alert dispatched to Cardiology.",
      "Prep Cath lab team (radial artery access kit ready).",
      "Confirm aspirin 324mg and ticagrelor 180mg administered.",
      "Record clock time on key checkpoints (Arrival, Pager, Lab Entry, Balloon)."
    ],
    sources: [
      { title: "AHA/ACC STEMI Guidelines 2024 Update", authors: "O'Gara et al.", confidence: 99, url: "https://ahajournals.org" },
      { title: "Door-to-Balloon Alliance National Outcomes Study", authors: "Krumholz et al.", confidence: 97, url: "https://nejm.org" }
    ],
    transferabilityScore: 94
  },
  {
    id: "prot-sepsis",
    name: "3-Hour Sepsis Bundle Compliance Protocol",
    category: "Quality",
    description: "Multi-disciplinary emergency protocol aiming at early identification and aggressive fluid/antibiotic management of patients showing signs of severe sepsis or septic shock.",
    evidenceSummary: "Completing lactate measures, blood cultures, and broad-spectrum antibiotics within 3 hours reduces the odds of in-hospital mortality by 26%.",
    workflow: [
      "Calculate qSOFA / SIRS score automatically upon triage entry.",
      "Order Stat serum lactate and draw blood cultures in parallel.",
      "Initiate broad-spectrum IV antibiotics (e.g. Piperacillin/Tazobactam) within 60 mins.",
      "Administer 30 mL/kg crystalloid fluid for hypotension or lactate >= 4.0 mmol/L."
    ],
    roles: [
      "Triage Nurse (Screening)",
      "ED Resident / Practitioner",
      "ED Pharmacist (Rapid Dispense)",
      "Phlebotomist / ICU liaison"
    ],
    kpis: [
      { name: "Time to Antibiotics", target: "< 45 mins", type: "Minutes" },
      { name: "Fluid Resuscitation Compliance", target: "> 95%", type: "Percentage" },
      { name: "Sepsis-related Mortality", target: "< 12%", type: "Percentage" }
    ],
    checklist: [
      "Screen patient with SIRS/qSOFA triggers.",
      "Draw blood cultures BEFORE initiating antibiotics.",
      "Deliver broad spectrum antibiotic load.",
      "Measure initial lactate levels (repeat within 4h if elevated > 2.0).",
      "Start saline push if mean arterial pressure < 65 mmHg."
    ],
    sources: [
      { title: "Surviving Sepsis Campaign: International Guidelines 2021", authors: "Evans et al.", confidence: 98, url: "https://journals.lww.com" },
      { title: "Lactate-Guided Resuscitation in Sepsis Trial", authors: "Jansen et al.", confidence: 93, url: "https://jama.com" }
    ],
    transferabilityScore: 91
  },
  {
    id: "prot-discharge",
    name: "RED (Re-Engineered Discharge) Protocol",
    category: "Patient Flow",
    description: "Standardized discharge roadmap structured to clarify medication instruction, arrange follow-ups, and coordinate nurse post-discharge check-in calls.",
    evidenceSummary: "Structured discharge instructions accompanied by a nurse telephone follow-up call within 72 hours yields a 30% drop in emergency readmissions and clinic revisits.",
    workflow: [
      "Compile patient-friendly discharge brochure 24 hours prior to discharge.",
      "Review medication plan with dedicated clinical pharmacist.",
      "Book primary care physician follow-up appointment within 7 days.",
      "Perform telephone follow-up 48 hours post-discharge by Unit Nurse."
    ],
    roles: [
      "Discharge Nurse Coordinator",
      "Ward Clinical Pharmacist",
      "Primary Care Physician (PCP)",
      "Social Work / Care Coordinator"
    ],
    kpis: [
      { name: "30-Day Readmissions", target: "< 8.0%", type: "Percentage" },
      { name: "Patient Understanding (HCAHPS)", target: "> 92%", type: "Percentage" },
      { name: "Follow-up Appointment Booked", target: "100%", type: "Percentage" }
    ],
    checklist: [
      "Reconcile pre-admission and discharge medications.",
      "Schedule clinic follow-up and print time/location card.",
      "Educate patient using teach-back method for warning signs.",
      "Transmit discharge summary to Primary Care Provider.",
      "Add patient to Nurse follow-up call sheet."
    ],
    sources: [
      { title: "Project RED: Re-Engineered Discharge Toolkit", authors: "Jack et al.", confidence: 96, url: "https://ahrq.gov" },
      { title: "Pharmacist-Led Medication Reconciliation Impact", authors: "Kaboli et al.", confidence: 94, url: "https://archinte.jamanetwork.com" }
    ],
    transferabilityScore: 98
  }
];

export const initialMetrics: Metric[] = [
  {
    category: "Clinical",
    name: "Door-to-Balloon Time (Mean)",
    value: 64.2,
    unit: "mins",
    nationalBenchmark: 75.0,
    topDecileBenchmark: 55.0,
    history: [
      { date: "Jan 2026", value: 68.5 },
      { date: "Feb 2026", value: 67.0 },
      { date: "Mar 2026", value: 66.1 },
      { date: "Apr 2026", value: 65.4 },
      { date: "May 2026", value: 64.2 }
    ]
  },
  {
    category: "Operational",
    name: "Emergency Department Length of Stay (Admitted)",
    value: 295,
    unit: "mins",
    nationalBenchmark: 270,
    topDecileBenchmark: 210,
    history: [
      { date: "Jan 2026", value: 310 },
      { date: "Feb 2026", value: 305 },
      { date: "Mar 2026", value: 298 },
      { date: "Apr 2026", value: 292 },
      { date: "May 2026", value: 295 }
    ]
  },
  {
    category: "Financial",
    name: "Average Cost per Sepsis Admission",
    value: 19800,
    unit: "$",
    nationalBenchmark: 18500,
    topDecileBenchmark: 14200,
    history: [
      { date: "Jan 2026", value: 21200 },
      { date: "Feb 2026", value: 20800 },
      { date: "Mar 2026", value: 20400 },
      { date: "Apr 2026", value: 19950 },
      { date: "May 2026", value: 19800 }
    ]
  },
  {
    category: "Patient Experience",
    name: "HCAHPS Discharge Communication Score",
    value: 84.5,
    unit: "%",
    nationalBenchmark: 86.0,
    topDecileBenchmark: 93.0,
    history: [
      { date: "Jan 2026", value: 81.2 },
      { date: "Feb 2026", value: 82.5 },
      { date: "Mar 2026", value: 83.1 },
      { date: "Apr 2026", value: 84.0 },
      { date: "May 2026", value: 84.5 }
    ]
  }
];

export const initialProjects: Project[] = [
  {
    id: "proj-neuro",
    name: "Neuro-Recovery Protocol",
    protocolId: "prot-stemi", // fallback map to stemi
    hospitalId: "hosp-mayo",
    status: "Active",
    startDate: "2026-04-10",
    dueDate: "2026-09-15",
    progress: 66,
    department: "Neurology",
    tasks: [
      { id: "t-n1", projectId: "proj-neuro", title: "Establish sensory-aware recovery pathways", description: "Design low-stimulus environments in ward B.", status: "Done", priority: "High", assignee: "Dr. Sarah Jenkins", dueDate: "2026-05-01" },
      { id: "t-n2", projectId: "proj-neuro", title: "Conduct nurse training on neuro sensory triggers", description: "Train ward B floor nurses on patient stimuli control.", status: "Done", priority: "Medium", assignee: "Dr. Sarah Jenkins", dueDate: "2026-05-15" },
      { id: "t-n3", projectId: "proj-neuro", title: "Configure patient-controlled ambient lighting", description: "Install dimmer systems in rooms 10-24.", status: "Done", priority: "Medium", assignee: "David Miller", dueDate: "2026-05-20" },
      { id: "t-n4", projectId: "proj-neuro", title: "Acoustic insulation audit for recovery suites", description: "Measure decibel thresholds during shift changes.", status: "Done", priority: "Low", assignee: "Marcus Vance", dueDate: "2026-05-28" },
      { id: "t-n5", projectId: "proj-neuro", title: "Standardize cognitive assessment checksheets", description: "Deploy digitised scoring sheets on nurse tablets.", status: "Done", priority: "High", assignee: "Dr. Sarah Jenkins", dueDate: "2026-06-01" },
      { id: "t-n6", projectId: "proj-neuro", title: "Formulate family orientation guides", description: "Publish bedside pamphlets explaining recovery protocols.", status: "Done", priority: "Low", assignee: "Marcus Vance", dueDate: "2026-06-05" },
      { id: "t-n7", projectId: "proj-neuro", title: "Launch daily micro-mobility checks", description: "Integrate sensory checks with early mobility testing.", status: "Done", priority: "Medium", assignee: "Dr. Sarah Jenkins", dueDate: "2026-06-10" },
      { id: "t-n8", projectId: "proj-neuro", title: "Audit ward B medication sync intervals", description: "Perform pharmacist reconciliation for neuro pathways.", status: "Done", priority: "High", assignee: "David Miller", dueDate: "2026-06-12" },
      { id: "t-n9", projectId: "proj-neuro", title: "Mid-phase patient outcomes reporting", description: "Draft compliance metrics for neurology department board.", status: "In-Progress", priority: "Medium", assignee: "Marcus Vance", dueDate: "2026-06-25" },
      { id: "t-n10", projectId: "proj-neuro", title: "Coordinate post-discharge wellness call logs", description: "Configure automatic reminder queues for nurses.", status: "In-Progress", priority: "High", assignee: "Dr. Sarah Jenkins", dueDate: "2026-06-28" },
      { id: "t-n11", projectId: "proj-neuro", title: "Finalize specialist neurology sign-offs", description: "Secure executive signature for ward B pathway activation.", status: "Todo", priority: "High", assignee: "Dr. Sarah Jenkins", dueDate: "2026-07-05" },
      { id: "t-n12", projectId: "proj-neuro", title: "Perform sensory suite final verification", description: "Simulate emergency response under dimmed lighting.", status: "Todo", priority: "Low", assignee: "David Miller", dueDate: "2026-07-15" }
    ],
    risks: [
      { id: "r-n1", description: "Dimmed lighting may slow nurse check charting.", severity: "Medium", mitigation: "Deploy high-contrast backlit tablets for all ward B staff.", status: "Active" }
    ],
    milestones: [
      { name: "Design Draft Complete", dueDate: "2026-05-01", completed: true },
      { name: "Staff Training Complete", dueDate: "2026-06-01", completed: true },
      { name: "Ward B Full Activation", dueDate: "2026-08-01", completed: false }
    ]
  },
  {
    id: "proj-cardiac",
    name: "Cardiac Triage Optimization",
    protocolId: "prot-stemi",
    hospitalId: "hosp-mayo",
    status: "Active",
    startDate: "2026-05-01",
    dueDate: "2026-10-15",
    progress: 30,
    department: "Cardiology & Emergency",
    tasks: [
      { id: "t-c1", projectId: "proj-cardiac", title: "Map current ED-to-Cath-Lab arrival bottlenecks", description: "Record transfer timestamps for 50 cardiac admissions.", status: "Done", priority: "High", assignee: "Marcus Vance", dueDate: "2026-05-10" },
      { id: "t-c2", projectId: "proj-cardiac", title: "Establish EMS field ECG direct transmission", description: "Configure telemetry routing from local ambulances.", status: "Done", priority: "Critical", assignee: "David Miller", dueDate: "2026-05-20" },
      { id: "t-c3", projectId: "proj-cardiac", title: "Deploy cardiac paging smart-routing rules", description: "Set up instant alerts to cardiology staff on shift.", status: "Done", priority: "High", assignee: "David Miller", dueDate: "2026-06-01" },
      { id: "t-c4", projectId: "proj-cardiac", title: "Schedule radial artery access drill simulations", description: "Run speed drills with emergency room practitioners.", status: "In-Progress", priority: "Medium", assignee: "Dr. Sarah Jenkins", dueDate: "2026-06-25" },
      { id: "t-c5", projectId: "proj-cardiac", title: "Audit patient registration bypass policies", description: "Authorize post-procedure bedside insurance registration.", status: "In-Progress", priority: "High", assignee: "Marcus Vance", dueDate: "2026-06-29" },
      { id: "t-c6", projectId: "proj-cardiac", title: "Secure emergency room physician consensus", description: "Align clinical leads on pre-arrival paging triggers.", status: "Blocked", priority: "Critical", assignee: "Dr. Sarah Jenkins", dueDate: "2026-07-02" },
      { id: "t-c7", projectId: "proj-cardiac", title: "Implement parallel antiplatelet loading checklists", description: "Pre-stage medication packs in emergency triage carts.", status: "Todo", priority: "High", assignee: "Dr. Sarah Jenkins", dueDate: "2026-07-10" },
      { id: "t-c8", projectId: "proj-cardiac", title: "Optimize ICU bed transfer queues", description: "Create automatic discharge notifications for ICU beds.", status: "Todo", priority: "Medium", assignee: "David Miller", dueDate: "2026-07-15" },
      { id: "t-c9", projectId: "proj-cardiac", title: "Formulate door-to-balloon public metrics dashboard", description: "Build real-time TV panel displays for emergency lounge.", status: "Todo", priority: "Low", assignee: "David Miller", dueDate: "2026-07-22" },
      { id: "t-c10", projectId: "proj-cardiac", title: "Conduct post-go-live clinical outcomes audit", description: "Analyze 30-day readmissions and mortality rates.", status: "Todo", priority: "High", assignee: "Marcus Vance", dueDate: "2026-08-05" }
    ],
    risks: [
      { id: "r-c1", description: "Missing specialist sign-off from Emergency Medical Director.", severity: "High", mitigation: "Escalate bottleneck issue to Chief Medical Officer for expedited approval.", status: "Active" }
    ],
    milestones: [
      { name: "EMS Integration Setup", dueDate: "2026-05-20", completed: true },
      { name: "Physician Alignment Confirmed", dueDate: "2026-07-01", completed: false },
      { name: "Full System Deployment", dueDate: "2026-09-01", completed: false }
    ]
  },
  {
    id: "proj-wellness",
    name: "Staff Wellness Initiative",
    protocolId: "prot-discharge",
    hospitalId: "hosp-mayo",
    status: "Planning",
    startDate: "2026-06-01",
    dueDate: "2026-12-01",
    progress: 90,
    department: "Operations & HR",
    tasks: [
      { id: "t-w1", projectId: "proj-wellness", title: "Designate restorative lounge zones", description: "Identify quiet spaces on floors 2, 3, and 5.", status: "Done", priority: "Medium", assignee: "Marcus Vance", dueDate: "2026-06-05" },
      { id: "t-w2", projectId: "proj-wellness", title: "Procure ergonomic reclining furniture", description: "Order 8 sound-isolated restorative pods.", status: "Done", priority: "Low", assignee: "David Miller", dueDate: "2026-06-10" },
      { id: "t-w3", projectId: "proj-wellness", title: "Draft mandatory deep-breath intervals policy", description: "Incorporate 5-minute restorative breaks per shift.", status: "Done", priority: "High", assignee: "Dr. Sarah Jenkins", dueDate: "2026-06-12" },
      { id: "t-w4", projectId: "proj-wellness", title: "Incorporate meditation feeds in staff app", description: "Deliver daily micro-sessions directly to clinician tablets.", status: "Done", priority: "Low", assignee: "David Miller", dueDate: "2026-06-14" },
      { id: "t-w5", projectId: "proj-wellness", title: "Approve healthy catering supply partners", description: "Establish contract for fresh organic refreshments.", status: "Done", priority: "Medium", assignee: "Marcus Vance", dueDate: "2026-06-15" },
      { id: "t-w6", projectId: "proj-wellness", title: "Formulate wellness ambassador networks", description: "Nominate floor leaders to encourage break compliance.", status: "Done", priority: "Low", assignee: "Dr. Sarah Jenkins", dueDate: "2026-06-16" },
      { id: "t-w7", projectId: "proj-wellness", title: "Conduct baseline clinician burnout survey", description: "Deploy anonymous digital questionnaire to all nurses.", status: "Done", priority: "High", assignee: "Marcus Vance", dueDate: "2026-06-18" },
      { id: "t-w8", projectId: "proj-wellness", title: "Confirm budget allocations for restorative pods", description: "Obtain administrative clearance for capital expenditure.", status: "Done", priority: "High", assignee: "Marcus Vance", dueDate: "2026-06-19" },
      { id: "t-w9", projectId: "proj-wellness", title: "Design shift handover relaxation guidelines", description: "Create structured quiet transition moments between shifts.", status: "Done", priority: "Medium", assignee: "Dr. Sarah Jenkins", dueDate: "2026-06-20" },
      { id: "t-w10", projectId: "proj-wellness", title: "Present full proposal to executive committee", description: "Draft slides and final budget projection for board approval.", status: "In-Progress", priority: "Critical", assignee: "Dr. Sarah Jenkins", dueDate: "2026-06-25" }
    ],
    risks: [
      { id: "r-w1", description: "Understaffing might prevent scheduled shift break compliance.", severity: "Medium", mitigation: "Establish a floating nurse pool to cover break relief rotations.", status: "Active" }
    ],
    milestones: [
      { name: "Burnout Survey Completed", dueDate: "2026-06-18", completed: true },
      { name: "Executive Proposal Submitted", dueDate: "2026-06-25", completed: false },
      { name: "Lounge Construction Start", dueDate: "2026-08-15", completed: false }
    ]
  }
];

export const initialCourses: Course[] = [
  {
    id: "course-stemi",
    title: "Fast-Track Cardiology Pathways: STEMI & Beyond",
    description: "Deep dive course for emergency and cardiology professionals covering direct-to-balloon workflows and multi-disciplinary telemetry coordination.",
    category: "Clinical Care Pathways",
    durationMinutes: 180,
    enrolled: true,
    progress: 45,
    lessons: [
      { title: "ECG Telemetry in Transit: Protocols and Pitfalls", duration: 40, content: "Learn the mechanisms of field ECG capture, noise suppression, and secure transmission." },
      { title: "Bypassing Triage: Logistical Coordination", duration: 60, content: "Step by step outline of why and how emergency rooms must clear lanes and bypass standard triage lines." },
      { title: "Cath Lab Team Coordination and Clock Metrics", duration: 80, content: "Detailing the dual antiplatelet dosage timings and radial artery incision speed drills." }
    ]
  },
  {
    id: "course-sepsis",
    title: "Sepsis Early Identification & Fluid Resuscitation",
    description: "Evidence-based training on Surviving Sepsis protocols, lactate triggers, and rapid response team handshakes.",
    category: "Quality and Safety",
    durationMinutes: 120,
    enrolled: false,
    progress: 0,
    lessons: [
      { title: "qSOFA vs. SIRS: Screening Triggers", duration: 40, content: "Comparing criteria to flag risk states accurately and avoid clinical notification fatigue." },
      { title: "The 3-Hour Bundle Execution Checklist", duration: 80, content: "Review of blood culture drawings, rapid broad spectrum infusion, and fluid volume calibrations." }
    ]
  }
];

export const initialWebinars: Webinar[] = [
  {
    id: "web-1",
    title: "Leading-Edge D2B Reduction: Case Study of Cleveland Clinic",
    speaker: "Dr. Roberto Silva (Chief of Cardiology)",
    scheduledAt: "2026-06-25T15:00:00Z",
    registered: false,
    link: "https://medbridge-elite.com/webinar/cleveland-d2b"
  },
  {
    id: "web-2",
    title: "Building Clinical Trial-Readiness: A Guide for Community Networks",
    speaker: "Helen Vance, PhD (Sponsorship Lead, Merck)",
    scheduledAt: "2026-07-02T16:30:00Z",
    registered: true,
    link: "https://medbridge-elite.com/webinar/trial-readiness"
  }
];

// -------------------------------------------------------------
// AI Agent Orchestrator & Knowledge Graph Simulation Engine
// -------------------------------------------------------------

const AGENTS = [
  { name: "Intelligence Agent", role: "RAG & Latest Medical Guidelines Analysis" },
  { name: "Research Agent", role: "Medical Publication Summarization" },
  { name: "Benchmark Agent", role: "Performance Gap & Priority Analytics" },
  { name: "Protocol Agent", role: "Evidence-based Workflow Structuring" },
  { name: "Implementation Agent", role: "Project Task Breakdown & Risk Mitigations" },
  { name: "Executive Agent", role: "Board Reports Drafting & ROI Projections" }
];

export const simulateAICopilotResponse = (query: string, activeContext: { hospitalName: string, activeTab: string }): AIResponse => {
  const normalized = query.toLowerCase();
  let content = "";
  let confidenceScore = 92;
  const sources = [
    { title: "New England Journal of Medicine - D2B Study 2025", url: "https://nejm.org/d2b", confidence: 98 },
    { title: "American College of Cardiology Clinical Practice Guidelines", url: "https://acc.org/guidelines", confidence: 96 }
  ];
  const evidenceTrace = [
    "Retrieved protocol_sections matching D2B optimization (Score: 0.941)",
    "Matched clinical_metrics for Door-to-Balloon in hospital_id: 'hosp-mayo' (Score: 0.892)",
    "Cross-referenced knowledge_graph: Protocol('prot-stemi') -> Outcome('Door-to-Balloon') -> Study('Krumholz')"
  ];

  if (normalized.includes("stemi") || normalized.includes("balloon") || normalized.includes("door")) {
    content = `### STEMI Acceleration Analysis for **${activeContext.hospitalName}**

Your current door-to-balloon mean is **64.2 minutes**, which is under the national benchmark (75.0 mins) but exceeds the **top decile benchmark (55.0 mins)**. 

To bridge this **9.2-minute gap**, I recommend deploying the following two actions from the **STEMI Acceleration Protocol**:
1. **EMS Pager Activation**: Allow paramedics to trigger the Cath Lab alert directly via EMS telemetry before the patient arrives. This saves an average of **6.2 minutes** in the activation loop.
2. **Radial Access Pre-Prep**: Standardize the sterile prep table setup in Cath Lab 3 for radial rather than femoral access, shaving **2.5 minutes** from patient preparation.

**Estimated ROI (Clinical & Financial)**:
* Red admission duration: -1.2 days
* Annual savings: **$142,000**
* Estimated 30-day mortality reduction: **-0.8%**`;
    confidenceScore = 95;
  } else if (normalized.includes("sepsis") || normalized.includes("fluid")) {
    content = `### Sepsis Protocol Compliance Optimization

Based on the **3-Hour Sepsis Bundle Compliance Protocol**, the most effective way to address the cost disparity (currently **$19,800** per admission vs. the **$14,200** top-decile target) is early triage alarms:

1. **Automate qSOFA Score Alert**: Configure your EHR system to trigger a high-priority alert for any patient displaying >=2 qSOFA criteria.
2. **Pre-approved Fluid Protocols**: Authorize triage nurses to order blood cultures and initial lactate measurements immediately upon warning triggers before formal physician review.

**Evidence Traceability**:
* Surviving Sepsis Campaign guidelines cite a **26% reduction in in-hospital mortality** when fluids and antibiotics are delivered under 3 hours.`;
    confidenceScore = 91;
    sources.push({ title: "Surviving Sepsis Campaign International Guidelines 2021", url: "https://journals.lww.com/sepsis", confidence: 94 });
  } else if (normalized.includes("trial") || normalized.includes("sponsor") || normalized.includes("readiness")) {
    content = `### Clinical Trial-Readiness Appraisal

**${activeContext.hospitalName}** holds **3 critical accreditations** (Joint Commission, Magnet Recognition, ACGME) and shows high research output (**h-index: 112**), making it highly competitive for trials.

**Top trial opportunities from TrialBridge**:
* **Phase III Multicenter Study on Dual Antiplatelet Efficacy (Sponsor: Merck)**: Hospital meets all bed requirements (>500 beds) and has an active patient pool from cardiology protocols.
* **Emergency Sepsis Resuscitation Trial (Sponsor: NIH)**: Recommended actions include finalizing the Sepsis Bundle project to qualify as a top-decile trial site.

**Suggested next step**: Complete the Active STEMI Project to demonstrate protocol adherence to potential sponsors.`;
    confidenceScore = 94;
    sources.push({ title: "ClinicalTrials.gov Protocol Registry", url: "https://clinicaltrials.gov", confidence: 97 });
  } else {
    content = `Hello! I am the **MedBridge Enterprise AI Copilot**. I have compiled information from the 6 specialized clinical intelligence agents:

* **Intelligence Agent**: Ready to fetch guidelines.
* **Benchmark Agent**: Analyzed your metrics (Clinical, Operational, Financial).
* **Protocol Agent**: STEMI and Sepsis bundle compliance are available for deployment.
* **Implementation Agent**: Ready to translate adapted protocols into your Kanban board.

How can I help you optimize clinical outcomes or generate executive board briefings today?`;
    confidenceScore = 90;
  }

  return {
    content,
    confidenceScore,
    sources,
    timestamp: new Date().toISOString(),
    evidenceTrace
  };
};

// -------------------------------------------------------------
// Stateful Database Store (LocalStorage Mock Engine)
// -------------------------------------------------------------

class MockDatabase {
  private hospitals: Hospital[] = [];
  private protocols: Protocol[] = [];
  private metrics: Metric[] = [];
  private projects: Project[] = [];
  private courses: Course[] = [];
  private webinars: Webinar[] = [];
  private chatConversations: { id: string; title: string; messages: { id: string; role: 'user' | 'assistant'; content: string; confidenceScore?: number; sources?: { title: string; url: string; confidence: number }[]; timestamp: string; evidenceTrace?: string[] }[] }[] = [];
  private activeHospitalId: string = "hosp-mayo";

  constructor() {
    this.reset();
  }

  public reset() {
    if (typeof window !== "undefined") {
      const storedHosp = localStorage.getItem("mb_hospitals");
      const storedProt = localStorage.getItem("mb_protocols");
      const storedMetrics = localStorage.getItem("mb_metrics");
      const storedProjects = localStorage.getItem("mb_projects");
      const storedCourses = localStorage.getItem("mb_courses");
      const storedWebinars = localStorage.getItem("mb_webinars");
      const storedChats = localStorage.getItem("mb_chats");

      this.hospitals = storedHosp ? JSON.parse(storedHosp) : initialHospitals;
      this.protocols = storedProt ? JSON.parse(storedProt) : initialProtocols;
      this.metrics = storedMetrics ? JSON.parse(storedMetrics) : initialMetrics;
      this.projects = storedProjects ? JSON.parse(storedProjects) : initialProjects;
      this.courses = storedCourses ? JSON.parse(storedCourses) : initialCourses;
      this.webinars = storedWebinars ? JSON.parse(storedWebinars) : initialWebinars;
      this.chatConversations = storedChats ? JSON.parse(storedChats) : [
        {
          id: "default-chat",
          title: "Sepsis Outcomes Inquiry",
          messages: [
            { id: "msg-1", role: "user", content: "How do we reduce costs for Sepsis admissions?", timestamp: new Date(Date.now() - 3600000).toISOString() },
            { 
              id: "msg-2", 
              role: "assistant", 
              content: "I recommend automating the qSOFA triggers and implementing pre-approved fluid protocols. This reduces average admission costs by up to $5,600 per patient by mitigating shock earlier.", 
              confidenceScore: 93, 
              sources: [{ title: "Surviving Sepsis Guidelines 2021", url: "https://journals.lww.com/sepsis", confidence: 95 }], 
              timestamp: new Date(Date.now() - 3550000).toISOString(),
              evidenceTrace: ["Matched clinical_metrics (Cost per Sepsis)", "Evaluated Surviving Sepsis guidelines"]
            }
          ]
        }
      ];
      this.activeHospitalId = localStorage.getItem("mb_active_hosp") || "hosp-mayo";
    } else {
      this.hospitals = initialHospitals;
      this.protocols = initialProtocols;
      this.metrics = initialMetrics;
      this.projects = initialProjects;
      this.courses = initialCourses;
      this.webinars = initialWebinars;
      this.chatConversations = [];
    }
  }

  private save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("mb_hospitals", JSON.stringify(this.hospitals));
      localStorage.setItem("mb_protocols", JSON.stringify(this.protocols));
      localStorage.setItem("mb_metrics", JSON.stringify(this.metrics));
      localStorage.setItem("mb_projects", JSON.stringify(this.projects));
      localStorage.setItem("mb_courses", JSON.stringify(this.courses));
      localStorage.setItem("mb_webinars", JSON.stringify(this.webinars));
      localStorage.setItem("mb_chats", JSON.stringify(this.chatConversations));
      localStorage.setItem("mb_active_hosp", this.activeHospitalId);
    }
  }

  // Active Hospital
  public getActiveHospitalId() {
    return this.activeHospitalId;
  }
  public setActiveHospitalId(id: string) {
    this.activeHospitalId = id;
    this.save();
  }
  public getActiveHospital(): Hospital {
    return this.hospitals.find(h => h.id === this.activeHospitalId) || this.hospitals[0];
  }

  // Hospitals
  public getHospitals() { return this.hospitals; }
  public updateHospital(hospital: Hospital) {
    this.hospitals = this.hospitals.map(h => h.id === hospital.id ? hospital : h);
    this.save();
  }

  // Protocols
  public getProtocols() { return this.protocols; }

  // Metrics
  public getMetrics() { return this.metrics; }
  public updateMetricValue(name: string, newValue: number) {
    this.metrics = this.metrics.map(m => {
      if (m.name === name) {
        const updatedHistory = [...m.history, { date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), value: newValue }];
        return { ...m, value: newValue, history: updatedHistory };
      }
      return m;
    });
    this.save();
  }

  // Projects & Tasks
  public getProjects() { return this.projects; }
  public addProject(name: string, protocolId: string | null, department: string) {
    const protocolObj = this.protocols.find(p => p.id === protocolId);
    const mockTasks: Task[] = protocolObj ? protocolObj.checklist.map((c, i) => ({
      id: `task-gen-${Date.now()}-${i}`,
      projectId: `proj-${Date.now()}`,
      title: c,
      description: `Implementation task from the standard checklist.`,
      status: i === 0 ? 'In-Progress' : 'Todo',
      priority: i < 2 ? 'High' : 'Medium',
      assignee: "Sarah Jenkins (Nurse Manager)",
      dueDate: new Date(Date.now() + (i + 1) * 86400000 * 7).toISOString().split('T')[0]
    })) : [];

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      protocolId,
      hospitalId: this.activeHospitalId,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      progress: 10,
      department,
      tasks: mockTasks,
      risks: protocolObj ? [
        {
          id: `risk-gen-${Date.now()}`,
          description: `Staff training compliance and operational transition delay for ${protocolObj.name}.`,
          severity: 'Medium',
          mitigation: 'Incorporate protocol review sessions in standard shift huddles.',
          status: 'Active'
        }
      ] : [],
      milestones: [
        { name: "Staff Training Complete", dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], completed: false },
        { name: "Clinical Go-Live Trial", dueDate: new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0], completed: false }
      ]
    };
    this.projects.push(newProject);
    this.save();
    return newProject;
  }

  public updateProjectTask(projectId: string, taskId: string, status: Task['status']) {
    this.projects = this.projects.map(p => {
      if (p.id === projectId) {
        const updatedTasks = p.tasks.map(t => t.id === taskId ? { ...t, status } : t);
        const completedCount = updatedTasks.filter(t => t.status === 'Done').length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        return { ...p, tasks: updatedTasks, progress };
      }
      return p;
    });
    this.save();
  }

  // Academy Courses
  public getCourses() { return this.courses; }
  public enrollInCourse(id: string) {
    this.courses = this.courses.map(c => c.id === id ? { ...c, enrolled: true, progress: 10 } : c);
    this.save();
  }
  public advanceCourseProgress(id: string, progress: number) {
    this.courses = this.courses.map(c => c.id === id ? { ...c, progress } : c);
    this.save();
  }

  // Webinars
  public getWebinars() { return this.webinars; }
  public registerForWebinar(id: string) {
    this.webinars = this.webinars.map(w => w.id === id ? { ...w, registered: true } : w);
    this.save();
  }

  // Chat Conversations
  public getConversations() { return this.chatConversations; }
  public createConversation(title: string) {
    const newChat = {
      id: `chat-${Date.now()}`,
      title,
      messages: []
    };
    this.chatConversations.unshift(newChat);
    this.save();
    return newChat;
  }
  public addChatMessage(convId: string, role: 'user' | 'assistant', content: string) {
    const chat = this.chatConversations.find(c => c.id === convId);
    if (!chat) return;

    if (role === 'user') {
      chat.messages.push({
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      });
      
      // Auto-trigger assistant reply simulation
      const activeHospName = this.getActiveHospital().name;
      const simulatedRes = simulateAICopilotResponse(content, { hospitalName: activeHospName, activeTab: "copilot" });
      
      chat.messages.push({
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: simulatedRes.content,
        confidenceScore: simulatedRes.confidenceScore,
        sources: simulatedRes.sources,
        timestamp: simulatedRes.timestamp,
        evidenceTrace: simulatedRes.evidenceTrace
      });
      
      // Update chat title if it is default
      if (chat.title.startsWith("New Conversation") || chat.title.length < 5) {
        chat.title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
      }
    } else {
      chat.messages.push({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: new Date().toISOString()
      });
    }
    
    this.save();
  }
}

export const mockDb = new MockDatabase();
