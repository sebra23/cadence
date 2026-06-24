// MedBridge Elite - Core Dashboard Views (Zenith Edition)
"use client";

import React, { useState, useEffect } from "react";
import { 
  mockDb, Hospital, Protocol, Metric, Project, Course, Webinar, Task 
} from "@/lib/mockDatabase";
import { 
  Building2, Activity, ShieldAlert, Award, GraduationCap, ClipboardList, 
  TrendingUp, Download, Play, Plus, BookOpen, Clock, Calendar, CheckSquare, 
  User, CheckCircle2, AlertTriangle, ArrowUpRight, DollarSign, Search, Filter,
  ArrowRight, Shield, Sparkles, Star, Target, Check, AlertCircle,
  Brain, Sprout, Pin, Rss, SlidersHorizontal, History, PartyPopper, Briefcase,
  LayoutDashboard, Clapperboard, Users, RefreshCw, BarChart3, HelpCircle, LogOut, FileText, FolderHeart, Book
} from "lucide-react";

interface ViewProps {
  hospital: Hospital;
  onNavigate: (view: string) => void;
  openCopilotWithQuery: (query: string) => void;
}

// -----------------------------------------------------------------
// 1. HOME VIEW (ZENITH VISUAL REPLICA)
// -----------------------------------------------------------------
export const HomeView: React.FC<ViewProps> = ({ hospital, onNavigate, openCopilotWithQuery }) => {
  const [copilotInput, setCopilotInput] = useState("");
  const [acknowledgedChen, setAcknowledgedChen] = useState(false);
  const projects = mockDb.getProjects().filter(p => p.hospitalId === hospital.id);

  const handleCopilotQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    openCopilotWithQuery(copilotInput);
    setCopilotInput("");
  };

  return (
    <div className="space-y-8">
      {/* WELCOME HERO BANNER */}
      <section className="bg-white rounded-3xl p-8 border border-zenith-border flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm">
        <div className="max-w-xl space-y-4 z-10">
          <h2 className="text-4xl font-bold tracking-tight text-zenith-text">Good morning, Dr. Aris.</h2>
          <p className="text-zenith-muted leading-relaxed text-sm">
            Your sanctuary of focus for today. Currently monitoring <span className="font-bold text-slate-800">{hospital.name}</span>. {projects.length} clinical workspaces require your attention, and 2 team updates are waiting.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={() => onNavigate("improve")}
              className="bg-zenith-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition flex items-center gap-2 shadow-sm cursor-pointer border-none"
            >
              <Play className="w-4 h-4 fill-current" /> Begin Daily Rounds
            </button>
            <button 
              onClick={() => onNavigate("benchmarking")}
              className="bg-white border border-zenith-border text-zenith-text text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-zenith-bg transition flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-zenith-muted" /> View Schedule
            </button>
          </div>
        </div>

        {/* Progress Metric */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0 mt-6 md:mt-0 select-none">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#E2E6E2" strokeWidth="8" fill="transparent" />
            <circle cx="50" cy="50" r="40" stroke="#798A79" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (hospital.excellenceScore / 100) * 251.2} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute text-center">
            <span className="text-3xl font-bold block text-zenith-text leading-none">{hospital.excellenceScore}%</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-zenith-muted block mt-1">Readiness</span>
          </div>
        </div>
      </section>

      {/* AI COMMAND INPUT BAR */}
      <div className="bg-white rounded-3xl p-4 border border-zenith-border shadow-sm">
        <span className="text-[10px] uppercase font-bold text-zenith-muted font-mono tracking-widest block mb-2 px-1">AI Agent Console</span>
        <form onSubmit={handleCopilotQuerySubmit} className="flex gap-2 rounded-xl border border-zenith-border bg-[#F6F8F6] p-1.5 focus-within:border-zenith-primary/45 focus-within:ring-1 focus-within:ring-zenith-primary/30 transition-all">
          <input
            type="text"
            placeholder="Ask AI Copilot to adapt STEMI protocol, audit sepsis indicators, or run gap calculations..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-zenith-text placeholder-zenith-muted/60 outline-none border-none focus:ring-0"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
          />
          <button type="submit" className="rounded-lg bg-zenith-primary px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 shadow transition-all flex items-center gap-1.5 cursor-pointer border-none">
            <Sparkles className="h-3.5 w-3.5" />
            Query Copilot
          </button>
        </form>
      </div>

      {/* ACTIVE WORKSPACES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zenith-text">Active Workspaces</h3>
            <p className="text-xs text-zenith-muted">Live collaborative clinical environments</p>
          </div>
          <button 
            onClick={() => onNavigate("improve")}
            className="text-xs font-semibold text-zenith-primary hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
          >
            Explore all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Workspaces Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map(proj => {
            const isNeuro = proj.name.includes("Neuro");
            const isCardiac = proj.name.includes("Cardiac");
            const isWellness = proj.name.includes("Wellness");

            let iconBg = "bg-red-50 text-red-500";
            let Icon = Brain;
            let badgeBg = "bg-green-50 text-green-700";
            let badgeText = "On Track";
            let progressColor = "bg-zenith-primary";
            
            if (isNeuro) {
              iconBg = "bg-red-50 text-red-500";
              Icon = Brain;
              badgeBg = "bg-green-50 text-green-700";
              badgeText = "On Track";
              progressColor = "bg-zenith-primary";
            } else if (isCardiac) {
              iconBg = "bg-slate-100 text-slate-500";
              Icon = Activity;
              badgeBg = "bg-red-50 text-red-700";
              badgeText = "Action Needed";
              progressColor = "bg-red-800/60";
            } else if (isWellness) {
              iconBg = "bg-green-50 text-green-600";
              Icon = Sprout;
              badgeBg = "bg-gray-100 text-gray-500";
              badgeText = "Draft";
              progressColor = "bg-emerald-700/50";
            } else {
              if (proj.status === "Planning") {
                iconBg = "bg-green-50 text-green-600";
                Icon = Sprout;
                badgeBg = "bg-gray-100 text-gray-500";
                badgeText = "Draft";
                progressColor = "bg-emerald-700/50";
              } else if (proj.progress < 50) {
                iconBg = "bg-slate-100 text-slate-500";
                Icon = Activity;
                badgeBg = "bg-red-50 text-red-700";
                badgeText = "Action Needed";
                progressColor = "bg-red-850/60";
              } else {
                iconBg = "bg-red-50 text-red-500";
                Icon = Brain;
                badgeBg = "bg-green-50 text-green-700";
                badgeText = "On Track";
                progressColor = "bg-zenith-primary";
              }
            }

            const totalTasks = proj.tasks.length;
            const completedTasks = proj.tasks.filter(t => t.status === "Done").length;

            return (
              <div key={proj.id} className="bg-white rounded-2xl p-5 border border-zenith-border flex flex-col justify-between min-h-[250px] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${iconBg} w-9 h-9 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`${badgeBg} font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full`}>
                      {badgeText}
                    </span>
                  </div>
                  <h4 className="font-bold text-base leading-snug mb-2 text-zenith-text">{proj.name}</h4>
                  <p className="text-xs text-zenith-muted line-clamp-2">
                    {proj.tasks.find(t => t.status === "In-Progress")?.description || proj.tasks[0]?.description || `Clinical workflow implementation for ${proj.department}.`}
                  </p>
                </div>
                
                <div className="space-y-3 pt-4">
                  {badgeText === "Draft" ? (
                    <>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zenith-muted">Planning Phase</span>
                        <span className="text-zenith-text font-bold">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-zenith-bg h-2 rounded-full overflow-hidden">
                        <div className={`${progressColor} h-full rounded-full`} style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <button 
                        onClick={() => onNavigate("improve")}
                        className="w-full bg-[#E2ECE2] text-zenith-primary font-bold text-xs py-2 rounded-xl hover:opacity-90 transition mt-1 cursor-pointer border-none"
                      >
                        Review Proposal
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zenith-muted">Milestones</span>
                        <span className="text-zenith-text font-bold">{completedTasks} / {totalTasks}</span>
                      </div>
                      <div className="w-full bg-zenith-bg h-2 rounded-full overflow-hidden">
                        <div className={`${progressColor} h-full rounded-full`} style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      {badgeText === "Action Needed" ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-800/80 pt-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{proj.risks[0]?.description || "Missing specialist sign-off"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center -space-x-1.5 pt-1">
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=50')" }}></div>
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-300 bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=50')" }}></div>
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-zenith-sidebar flex items-center justify-center text-[10px] font-bold text-zenith-muted">+3</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TWO-COLUMN FOOTER METRICS AND FEEDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Access */}
        <section className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-1.5 text-zenith-text font-bold text-base tracking-tight">
            <Pin className="w-4 h-4 rotate-45 text-zenith-muted" /> Quick Access
          </div>
          <div className="space-y-2">
            {/* Access Item 1 */}
            <div 
              onClick={() => onNavigate("protocols")}
              className="flex items-center gap-3 p-3 bg-[#EEF2EE]/60 rounded-xl border border-transparent hover:border-zenith-border transition cursor-pointer"
            >
              <div className="bg-white p-2 rounded-lg text-zenith-muted border border-zenith-border">
                <Book className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-zenith-text">Emergency Code Protocol</h5>
                <span className="text-[10px] text-zenith-muted block mt-0.5">Last updated 2d ago</span>
              </div>
            </div>
            {/* Access Item 2 */}
            <div 
              onClick={() => onNavigate("improve")}
              className="flex items-center gap-3 p-3 bg-[#EEF2EE]/60 rounded-xl border border-transparent hover:border-zenith-border transition cursor-pointer"
            >
              <div className="bg-white p-2 rounded-lg text-zenith-muted border border-zenith-border">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-zenith-text">Ward B Transfer Sheet</h5>
                <span className="text-[10px] text-zenith-muted block mt-0.5">Personal Pin</span>
              </div>
            </div>
            {/* Access Item 3 */}
            <div 
              onClick={() => onNavigate("directory")}
              className="flex items-center gap-3 p-3 bg-[#EEF2EE]/60 rounded-xl border border-transparent hover:border-zenith-border transition cursor-pointer"
            >
              <div className="bg-white p-2 rounded-lg text-zenith-muted border border-zenith-border">
                <FolderHeart className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-zenith-text">Department Directory</h5>
                <span className="text-[10px] text-zenith-muted block mt-0.5">Global resource</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Real-time Feed */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zenith-text font-bold text-base tracking-tight">
              <Rss className="w-4 h-4 text-zenith-muted" /> Real-time Feed
            </div>
            <button className="bg-[#EEF2EE] p-1.5 rounded-lg text-zenith-muted hover:text-zenith-text cursor-pointer border-none">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 bg-[#EEF2EE]/40 border border-zenith-border rounded-2xl p-4">
            
            {/* Feed Item 1: Urgent Alert */}
            <div className="bg-white rounded-xl p-4 border border-zenith-border flex gap-3 items-start shadow-sm">
              <div className="bg-red-50 text-red-500 p-2 rounded-xl shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
                  <span className="text-red-600">Urgent Alert</span>
                  <span className="text-zenith-muted font-normal lowercase">2 mins ago</span>
                </div>
                <h6 className="font-bold text-xs text-zenith-text">Supply Chain Delay: ICU Consumables</h6>
                <p className="text-xs text-zenith-muted">Surgical gloves shipment delayed by 24h. Logistics is re-routing surplus from Ward C.</p>
              </div>
            </div>

            {/* Feed Item 2: Team Update */}
            <div className="bg-white rounded-xl p-4 border border-zenith-border flex gap-3 items-start shadow-sm">
              <div className="bg-green-50 text-green-600 p-2 rounded-xl shrink-0">
                <History className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
                  <span className="text-zenith-muted">Team Update</span>
                  <span className="text-zenith-muted font-normal lowercase">45 mins ago</span>
                </div>
                <h6 className="font-bold text-xs text-zenith-text">Dr. Chen published a new Case Study</h6>
                <p className="text-xs text-zenith-muted">"Innovative Pain Management in Geriatrics" is now available in the Playbook Library.</p>
                <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={() => onNavigate("learn")}
                    className="bg-zenith-bg hover:bg-zenith-accent text-zenith-text text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer border-none"
                  >
                    Read Now
                  </button>
                  {acknowledgedChen ? (
                    <span className="text-green-600 text-[11px] font-bold">✓ Acknowledged</span>
                  ) : (
                    <button 
                      onClick={() => setAcknowledgedChen(true)}
                      className="text-zenith-muted hover:text-zenith-text text-[11px] font-semibold transition cursor-pointer bg-transparent border-none"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Feed Item 3: Zenith Moment */}
            <div className="bg-white rounded-xl p-4 border border-zenith-border flex gap-3 items-start shadow-sm">
              <div className="bg-rose-50 text-rose-400 p-2 rounded-xl shrink-0">
                <PartyPopper className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
                  <span className="text-rose-500">Zenith Moment</span>
                  <span className="text-zenith-muted font-normal lowercase">2h ago</span>
                </div>
                <h6 className="font-bold text-xs text-zenith-text">Ward B reached a 30-day "Safe Shift" milestone!</h6>
                <p className="text-xs text-zenith-muted">Join us for a small recognition ceremony in the restorative lounge at 4 PM.</p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};


// -----------------------------------------------------------------
// 2. INTELLIGENCE HUB
// -----------------------------------------------------------------
export const IntelligenceView: React.FC<ViewProps> = ({ hospital, openCopilotWithQuery }) => {
  const [activeSubTab, setActiveSubTab] = useState("feed");
  const [searchTerm, setSearchTerm] = useState("");

  const articles = [
    {
      id: "art-1",
      title: "ACC Door-to-Balloon Target Shunted to 55 Minutes for Top Decile Hospitals",
      category: "Guideline",
      source: "American College of Cardiology",
      confidence: 99,
      impact: 9.6,
      summary: "Newly validated data confirms that reducing primary PCI pathway duration to under 55 minutes further drops 30-day readmission and mortality rates. Standardizing direct ED-to-Cath-Lab transit is essential.",
      published: "2026-06-18",
      relevance: `High ( ${hospital.name} has 64.2m current mean )`
    },
    {
      id: "art-2",
      title: "Automating Lactate Measures & qSOFA Triggers: Multi-center ICU Review",
      category: "Research",
      source: "NEJM Outcomes",
      confidence: 95,
      impact: 8.8,
      summary: "Early automated EHR screening flags early organ dysfunction up to 2.4 hours faster than physician triage checks, leading to earlier fluid delivery and lower ICU costs.",
      published: "2026-06-14",
      relevance: `High ( ${hospital.name} sepsis average admission cost is $19.8k )`
    },
    {
      id: "art-3",
      title: "Magnet Status Accreditations: Operational Best Practices 2026",
      category: "Report",
      source: "Gartner Health",
      confidence: 92,
      impact: 7.2,
      summary: "Analysis of nursing staff ratios and scheduling flexibility. Outlines organizational structures required to achieve and maintain Magnet status, optimizing nurse satisfaction and patient safety metrics.",
      published: "2026-05-30",
      relevance: "Medium"
    }
  ];

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Intelligence Hub</h1>
          <p className="text-xs text-brand-text-secondary">Bloomberg Terminal for global clinical guidelines, trials, and research digests.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search intelligence feed..."
              className="w-full rounded-lg border border-brand-border bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-accent-primary focus:ring-1 focus:ring-indigo-100 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex border-b border-brand-border text-xs">
        {["feed", "guidelines", "reports", "trials"].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 border-b-2 font-bold capitalize -mb-px transition-all ${
              activeSubTab === tab ? "border-accent-primary text-accent-primary" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab === "feed" ? "Real-time Feed" : tab}
          </button>
        ))}
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {filteredArticles.map(art => (
          <div key={art.id} className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 hover:shadow-md transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold bg-[#d9e7cd] text-[#3e4a37] px-2.5 py-0.5 rounded-full border border-[#bdcbb2]/40 uppercase">
                  {art.category}
                </span>
                <span className="text-xs font-bold text-slate-500">{art.source}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
                <span>Impact: <span className="text-accent-success font-bold">{art.impact}/10</span></span>
                <span>Confidence: <span className="text-slate-800 font-bold">{art.confidence}%</span></span>
                <span>{art.published}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 hover:text-accent-primary cursor-pointer transition-colors" onClick={() => openCopilotWithQuery(`Explain summary of: ${art.title}`)}>
              {art.title}
            </h3>
            <p className="mt-2 text-xs text-brand-text-secondary leading-relaxed">{art.summary}</p>
            
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-slate-100 text-[10px]">
              <span className="text-slate-500">
                Hospital Relevance: <span className="text-accent-warning font-bold">{art.relevance}</span>
              </span>
              <div className="flex gap-3 text-accent-primary font-bold">
                <button onClick={() => openCopilotWithQuery(`Synthesize ${art.title} for ${hospital.name}`)} className="hover:underline">AI Summarize</button>
                <span>•</span>
                <button onClick={() => openCopilotWithQuery(`Show evidence trace for: ${art.title}`)} className="hover:underline">Evidence Trace</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 3. HOSPITAL DIRECTORY VIEW
// -------------------------------------------------------------
export const DirectoryView: React.FC<{ onSelectHospital: (id: string) => void, activeHospitalId: string }> = ({ onSelectHospital, activeHospitalId }) => {
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("All");
  
  const hospitals = mockDb.getHospitals();

  const filtered = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.country.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = filterRegion === "All" || h.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Hospital Directory</h1>
          <p className="text-xs text-brand-text-secondary">Compare global systems, teaching statuses, and excellence scores.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search hospitals..."
            className="rounded-full border border-brand-border bg-white px-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-accent-primary w-full sm:w-48 shadow-sm focus:ring-1 focus:ring-indigo-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-accent-primary cursor-pointer shadow-sm focus:ring-1 focus:ring-indigo-100 font-semibold"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="All">All Regions</option>
            <option value="Midwest">Midwest</option>
            <option value="East">East</option>
            <option value="South">South</option>
            <option value="Ontario">Ontario</option>
            <option value="Berlin">Berlin</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm shadow-slate-100">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-brand-border bg-slate-50 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
              <th className="p-4">Hospital Name</th>
              <th className="p-4">Region</th>
              <th className="p-4">Beds</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-center">Excellence Score</th>
              <th className="p-4 text-center">Trials</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(h => (
              <tr key={h.id} className={`hover:bg-slate-50/50 transition-colors ${h.id === activeHospitalId ? "bg-indigo-50/20 font-medium" : ""}`}>
                <td className="p-4">
                  <div>
                    <div className="text-slate-900 font-bold flex items-center gap-1.5">
                      {h.name}
                      {h.id === activeHospitalId && (
                        <span className="h-2 w-2 rounded-full bg-accent-success glow-dot-emerald" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">{h.healthSystem}</div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 font-medium">{h.region}, {h.country}</td>
                <td className="p-4 text-slate-600 font-mono font-bold">{h.beds.toLocaleString()}</td>
                <td className="p-4 text-slate-600 font-medium">{h.teachingStatus ? "Teaching" : "Community"} ({h.ownership})</td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    h.excellenceScore >= 92 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                    {h.excellenceScore}
                  </span>
                </td>
                <td className="p-4 text-center text-slate-600 font-mono font-bold">{h.trialActivity.activeCount}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => onSelectHospital(h.id)}
                    className="rounded-xl bg-[#d9e7cd] border border-[#bdcbb2]/40 text-[#3e4a37] hover:bg-primary hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Select Focus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 4. HOSPITAL PROFILE VIEW
// -------------------------------------------------------------
export const ProfileView: React.FC<ViewProps> = ({ hospital, onNavigate }) => {
  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{hospital.name}</h1>
          <p className="text-xs text-brand-text-secondary">Health system profiles, accreditations, and specialty statistics.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate("benchmarking")} 
            className="rounded-lg border border-brand-border bg-white hover:bg-slate-50 px-3.5 py-2 text-xs text-slate-700 font-bold shadow-sm transition-all cursor-pointer"
          >
            Run Benchmarking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Core Metrics Summary */}
        <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-slate-100 pb-2">Institutional Profile</span>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">Total Beds</p>
              <p className="text-lg font-extrabold text-slate-900 font-mono">{hospital.beds}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">Excellence Rating</p>
              <p className="text-lg font-extrabold text-accent-success font-mono">{hospital.excellenceScore}/100</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">Ownership</p>
              <p className="text-xs font-bold text-slate-800">{hospital.ownership}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">Academic Status</p>
              <p className="text-xs font-bold text-slate-800">{hospital.teachingStatus ? "Teaching Hospital" : "Community Network"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-mono mb-2">Accreditations</p>
            <div className="flex flex-wrap gap-1.5">
              {hospital.accreditations.map(acc => (
                <span key={acc} className="text-[10px] bg-slate-50 text-slate-600 border border-brand-border px-2 py-0.5 rounded-full font-bold">
                  {acc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Research Outputs */}
        <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-slate-100 pb-2">Research Output</span>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Total Publications</span>
              <span className="font-mono text-slate-900 font-bold">{hospital.researchOutput.publicationsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Total Citations</span>
              <span className="font-mono text-slate-900 font-bold">{hospital.researchOutput.citationsCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Institutional h-index</span>
              <span className="font-mono text-accent-primary font-bold">{hospital.researchOutput.hIndex}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Active Trials</span>
              <span className="font-mono text-accent-success font-bold">{hospital.trialActivity.activeCount}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-brand-text-secondary">
            Primary sponsors: <span className="text-slate-900 font-bold">{hospital.trialActivity.sponsors.join(', ')}</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-slate-100 pb-2">Enterprise Tech Stack</span>
          <div className="space-y-2">
            {hospital.techStack.map(tech => (
              <div key={tech} className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2 text-xs text-slate-700 shadow-sm">
                <Building2 className="h-3.5 w-3.5 text-accent-primary shrink-0" />
                <span className="truncate font-semibold">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staffing Statistics */}
      <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">Staffing Breakdown</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {hospital.staffing.map(staff => (
            <div key={staff.role} className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-mono">{staff.role}</p>
                <p className="text-xl font-black text-slate-900 font-mono mt-1">{staff.count.toLocaleString()}</p>
              </div>
              <User className="h-5 w-5 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 5. EXCELLENCE VIEW
// -------------------------------------------------------------
export const ExcellenceView: React.FC<ViewProps> = ({ openCopilotWithQuery }) => {
  const excellenceProfiles = [
    {
      id: "ep-1",
      title: "Interventional Cardiology Excellence - Mayo Model",
      outcomes: "30-day STEMI readmissions under 4.5%, door-to-balloon top-decile compliance at 55 minutes.",
      workflows: "Pre-arrival Cath Lab activation via cloud ECG, parallel antiplatelet loading at triage.",
      techStack: "Epic EHR, Cardiac Telemetry Hubs, MedBridge AI Copilot.",
      evidence: "Grade A Clinical Proof. Supported by multi-year NEJM trials showing 18% mortality reduction."
    },
    {
      id: "ep-2",
      title: "ICU Sepsis Care Excellence - Surviving Sepsis Bundle",
      outcomes: "Sepsis mortality reduction to 11.2% (against 22.0% national mean), fluid compliance over 96%.",
      workflows: "EHR-driven automated qSOFA score triggers, nurse-led blood cultures and lactate pre-orders.",
      techStack: "Automated Clinical Logic Engines, Rapid Care Alerts.",
      evidence: "Grade A Clinical Proof. Supporting data across 48 institutions via SSC Guidelines."
    }
  ];

  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Excellence Profiles</h1>
        <p className="text-xs text-brand-text-secondary">Explore operational structures and outcome proofs of leading institutions.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {excellenceProfiles.map(profile => (
          <div key={profile.id} className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm shadow-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">{profile.title}</h3>
              <button 
                onClick={() => openCopilotWithQuery(`Explain implementation requirements for: ${profile.title}`)}
                className="text-xs bg-accent-primary hover:bg-opacity-90 text-white rounded-lg px-3.5 py-1.5 font-bold shadow-sm transition-all cursor-pointer"
              >
                Inspect Implementation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-accent-success font-bold">Target Outcomes</span>
                <p className="text-brand-text-secondary leading-relaxed">{profile.outcomes}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-accent-primary font-bold">Workflow Structure</span>
                <p className="text-brand-text-secondary leading-relaxed">{profile.workflows}</p>
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-100 md:border-transparent">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Required Technology</span>
                <p className="text-brand-text-secondary">{profile.techStack}</p>
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-100 md:border-transparent">
                <span className="text-[10px] uppercase font-mono text-accent-warning font-bold">Clinical Evidence</span>
                <p className="text-brand-text-secondary">{profile.evidence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 6. BENCHMARKING & ROI VIEW
// -------------------------------------------------------------
export const BenchmarkingView: React.FC<ViewProps> = ({ hospital, onNavigate }) => {
  const [balloonTime, setBalloonTime] = useState(64.2);
  const [sepsisCost, setSepsisCost] = useState(19800);
  const [fileAttached, setFileAttached] = useState(false);

  // ROI Calculations
  const targetD2B = 55.0;
  const d2bGap = Math.max(0, balloonTime - targetD2B);
  const d2bAnnualSavings = Math.round(d2bGap * 15000 * 300 / 100) * 100;

  const targetSepsis = 14200;
  const sepsisGap = Math.max(0, sepsisCost - targetSepsis);
  const sepsisAnnualSavings = Math.round(sepsisGap * 400);

  const totalAnnualSavings = d2bAnnualSavings + sepsisAnnualSavings;

  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Gap Analysis & ROI</h1>
          <p className="text-xs text-brand-text-secondary">Simulate outcomes, upload clinical data feeds, and project financial savings.</p>
        </div>
        <div>
          {/* File Upload Simulator */}
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-white border border-brand-border px-3 py-2 text-xs text-slate-700 font-bold shadow-sm hover:bg-slate-50 transition-all">
            <Plus className="h-4 w-4 text-accent-primary" />
            {fileAttached ? "Feed Connected (CSV)" : "Upload Benchmark File"}
            <input 
              type="file" 
              className="hidden" 
              onChange={() => setFileAttached(true)} 
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sliders Configuration */}
        <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2.5">Institutional Gaps Simulator</h3>

          {/* Metric 1 */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">Mean Door-to-Balloon Time (STEMI)</span>
              <span className="font-mono text-accent-primary font-bold text-sm bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{balloonTime.toFixed(1)} mins</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="90" 
              step="0.5"
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
              value={balloonTime}
              onChange={(e) => setBalloonTime(parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>55.0 (Top Decile Target)</span>
              <span>75.0 (National Mean)</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">Average Cost per Sepsis Admission</span>
              <span className="font-mono text-accent-primary font-bold text-sm bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">${sepsisCost.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="13000" 
              max="24000" 
              step="100"
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
              value={sepsisCost}
              onChange={(e) => setSepsisCost(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$14,200 (Top Decile Target)</span>
              <span>$18,500 (National Mean)</span>
            </div>
          </div>
        </div>

        {/* ROI Outputs Dashboard */}
        <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Projected Annual Savings</span>
            <div className="mt-4 flex items-baseline gap-1 text-accent-success">
              <DollarSign className="h-6 w-6 shrink-0" />
              <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-900">{totalAnnualSavings.toLocaleString()}</span>
            </div>
            <p className="mt-2 text-xs text-brand-text-secondary leading-relaxed">
              Calculations based on target clinical adjustments vs. {hospital.name}'s average case load metrics.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Cardiology Savings:</span>
              <span className="font-mono text-slate-900 font-bold">${d2bAnnualSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Sepsis Bundle Savings:</span>
              <span className="font-mono text-slate-900 font-bold">${sepsisAnnualSavings.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={() => onNavigate("protocols")}
              className="w-full mt-4 bg-accent-primary hover:bg-opacity-95 text-white rounded-lg py-2 font-bold text-xs text-center block transition-all shadow-sm cursor-pointer"
            >
              Deploy Remedial Protocols
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 7. PROTOCOL LIBRARY VIEW
// -------------------------------------------------------------
export const ProtocolsView: React.FC<ViewProps & { onDeploy: (name: string, protocolId: string, department: string) => void }> = ({ onDeploy, onNavigate }) => {
  const protocols = mockDb.getProtocols();
  const [selectedProt, setSelectedProt] = useState<Protocol | null>(protocols[0]);

  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Protocol Library</h1>
        <p className="text-xs text-brand-text-secondary">Adapt clinical and operational pathways into active project workspaces.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Protocol List */}
        <div className="space-y-3 lg:col-span-1">
          {protocols.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedProt(p)}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                selectedProt?.id === p.id 
                  ? "border-accent-primary bg-indigo-50/30 shadow-sm shadow-indigo-50/50" 
                  : "border-brand-border bg-white hover:bg-slate-50 shadow-sm shadow-slate-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold bg-[#d9e7cd] text-[#3e4a37] px-2.5 py-0.5 rounded border border-[#bdcbb2]/40 uppercase tracking-wide">
                  {p.category}
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">Transferability: {p.transferabilityScore}%</span>
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-slate-955">{p.name}</h3>
            </div>
          ))}
        </div>

        {/* Right Side: Protocol Detail & Adaptation */}
        <div className="lg:col-span-2">
          {selectedProt ? (
            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm shadow-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedProt.name}</h2>
                  <p className="text-xs text-brand-text-secondary mt-1">{selectedProt.description}</p>
                </div>
                <button 
                  onClick={() => {
                    onDeploy(selectedProt.name, selectedProt.id, selectedProt.category);
                    onNavigate("improve");
                  }}
                  className="rounded-lg bg-accent-success hover:bg-opacity-90 text-white px-4 py-2 text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
                >
                  Adapt & Launch Project
                </button>
              </div>

              {/* KPIs & Target metrics */}
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-3 font-mono">Protocol Target KPIs</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedProt.kpis.map(k => (
                    <div key={k.name} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs shadow-inner">
                      <p className="text-[9px] text-slate-400 font-mono uppercase">{k.name}</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">{k.target}</p>
                      <p className="text-[8px] text-slate-400 font-mono mt-0.5">{k.type}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Steps */}
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-3 font-mono">Clinical/Operational Workflow</span>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700">
                  {selectedProt.workflow.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      <span className="text-slate-800 font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Checklist */}
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-3 font-mono">Pre-Deployment Task Checklist</span>
                <div className="space-y-2">
                  {selectedProt.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckSquare className="h-4 w-4 text-accent-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Literature Sources */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 font-mono">Evidence Citations</span>
                <div className="space-y-2">
                  {selectedProt.sources.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-600 font-semibold">{s.title} <span className="text-slate-400">({s.authors})</span></span>
                      </div>
                      <span className="text-[10px] font-mono text-accent-success font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Confidence: {s.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">Select a protocol from the list to view specifications.</p>
          )}
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 8. ACADEMY (LEARN) VIEW
// -------------------------------------------------------------
export const AcademyView: React.FC<ViewProps> = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);

  useEffect(() => {
    setCourses(mockDb.getCourses());
    setWebinars(mockDb.getWebinars());
  }, []);

  const handleEnroll = (id: string) => {
    mockDb.enrollInCourse(id);
    setCourses(mockDb.getCourses());
  };

  const handleWebinarRegister = (id: string) => {
    mockDb.registerForWebinar(id);
    setWebinars(mockDb.getWebinars());
  };

  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Academy & Workshops</h1>
        <p className="text-xs text-brand-text-secondary">Train clinical teams on evidence-based operational guidelines.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Course Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Course Curriculum</h3>
          
          <div className="space-y-4">
            {courses.map(c => (
              <div key={c.id} className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold bg-[#d9e7cd] text-[#3e4a37] px-2.5 py-0.5 rounded border border-[#bdcbb2]/40 uppercase tracking-wide">
                      {c.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {c.durationMinutes} mins
                    </span>
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-slate-900">{c.title}</h4>
                  <p className="mt-1 text-xs text-brand-text-secondary leading-relaxed">{c.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {c.enrolled ? (
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Enrollment Active</span>
                        <span className="font-bold text-slate-800 font-mono">{c.progress}% Complete</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-accent-success rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEnroll(c.id)}
                      className="rounded-lg bg-accent-primary hover:bg-opacity-95 text-white px-4 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Enroll in Course
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Webinars Schedule */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Webinars & Masterclasses</h3>
          
          <div className="space-y-3">
            {webinars.map(w => (
              <div key={w.id} className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm shadow-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                  <Calendar className="h-3.5 w-3.5 text-accent-primary shrink-0" />
                  <span className="font-mono">{w.scheduledAt.split('T')[0]} {w.scheduledAt.split('T')[1].substring(0, 5)} UTC</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{w.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{w.speaker}</p>
                </div>
                {w.registered ? (
                  <div className="flex items-center gap-1.5 text-xs text-accent-success font-bold bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Registered
                  </div>
                ) : (
                  <button 
                    onClick={() => handleWebinarRegister(w.id)}
                    className="w-full text-center text-xs bg-white border border-brand-border hover:bg-slate-50 text-slate-700 rounded-lg py-2 font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Register Seat
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 9. IMPROVE
// -------------------------------------------------------------
export const ImproveView: React.FC<ViewProps> = ({ hospital }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjId, setActiveProjId] = useState<string | null>(null);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    const list = mockDb.getProjects().filter(p => p.hospitalId === hospital.id);
    setProjects(list);
    if (list.length > 0) {
      if (list.length > prevCount) {
        // Sort by id descending (which contains timestamp) to find newest
        const sorted = [...list].sort((a, b) => b.id.localeCompare(a.id));
        setActiveProjId(sorted[0].id);
        setPrevCount(list.length);
      } else {
        const exists = list.some(p => p.id === activeProjId);
        if (!activeProjId || !exists) {
          setActiveProjId(list[0].id);
        }
      }
    } else {
      setPrevCount(0);
    }
  }, [hospital, activeProjId, prevCount]);

  const activeProject = projects.find(p => p.id === activeProjId);

  const handleMoveTask = (taskId: string, newStatus: Task['status']) => {
    if (!activeProjId) return;
    mockDb.updateProjectTask(activeProjId, taskId, newStatus);
    setProjects(mockDb.getProjects().filter(p => p.hospitalId === hospital.id));
  };

  const columns: { label: string; status: Task['status']; color: string }[] = [
    { label: "Todo", status: "Todo", color: "bg-slate-350" },
    { label: "In Progress", status: "In-Progress", color: "bg-primary" },
    { label: "Done", status: "Done", color: "bg-accent-success" },
    { label: "Blocked", status: "Blocked", color: "bg-accent-danger" }
  ];

  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Project Workspace</h1>
          <p className="text-xs text-brand-text-secondary">Execute adapted protocols, manage staff tasks, track milestones and risks.</p>
        </div>
        <div>
          {projects.length > 0 && (
            <select 
              className="rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-accent-primary cursor-pointer shadow-sm font-semibold"
              value={activeProjId || ""}
              onChange={(e) => setActiveProjId(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {activeProject ? (
        <div className="space-y-6">
          {/* Overview Header */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm shadow-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Project Timeline</span>
              <p className="text-xs font-semibold text-slate-800 mt-1">Start: {activeProject.startDate}</p>
              <p className="text-xs font-semibold text-slate-800">Target: {activeProject.dueDate}</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm shadow-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Department Focus</span>
              <p className="text-xs font-semibold text-slate-800 mt-1">{activeProject.department}</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm shadow-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Protocol Progress</span>
              <div className="mt-1 flex items-center justify-between text-xs font-mono font-bold text-slate-900">
                <span>{activeProject.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-accent-primary rounded-full transition-all" style={{ width: `${activeProject.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map(col => {
              const colTasks = activeProject.tasks.filter(t => t.status === col.status);
              return (
                <div key={col.status} className="rounded-2xl border border-slate-100 bg-[#f2f4ed]/60 p-4 space-y-3 min-h-[350px] shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {colTasks.map(t => (
                      <div key={t.id} className="rounded-xl border border-slate-100 bg-white p-3 space-y-3 hover:border-slate-350 shadow-sm transition-all">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{t.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">{t.description}</p>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-semibold">
                          <span className="text-slate-500 font-bold">Assignee: {t.assignee.split(" ")[0]}</span>
                          <span className={`px-2 py-0.5 rounded font-mono ${
                            t.priority === 'Critical' ? "bg-rose-50 text-accent-danger border border-rose-100" : "bg-slate-50 text-slate-600 border border-slate-100"
                          }`}>{t.priority}</span>
                        </div>

                        {/* Status Mover Quick Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex justify-end gap-1">
                          {columns.filter(c => c.status !== t.status).map(c => (
                            <button
                              key={c.status}
                              onClick={() => handleMoveTask(t.id, c.status)}
                              className="text-[9px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-semibold px-2 py-1 rounded shadow-sm transition-all cursor-pointer"
                            >
                              {c.label.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-8">No tasks in this lane</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risks & Mitigation Table */}
          {activeProject.risks.length > 0 && (
            <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2.5 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-accent-warning animate-pulse" /> Risk Log & Mitigations
              </h3>
              <div className="space-y-3">
                {activeProject.risks.map(r => (
                  <div key={r.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-slate-100 pb-3 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">Risk Factor</span>
                      <p className="text-slate-800 font-semibold mt-1">{r.description}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">Mitigation Strategy</span>
                      <p className="text-slate-500 font-medium mt-1">{r.mitigation}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">Severity</span>
                        <p className="text-accent-danger font-bold mt-1">{r.severity}</p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-[#3e4a37] border border-[#bdcbb2]/40 px-2.5 py-0.5 rounded-full uppercase font-bold font-mono">
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-8">No active projects configured. Navigate to Protocol Library to launch one.</p>
      )}
    </div>
  );
};


// -------------------------------------------------------------
// 10. REPORTS & OUTCOMES
// -------------------------------------------------------------
export const ReportsView: React.FC<ViewProps> = ({ hospital }) => {
  const [reportType, setReportType] = useState("Board Report");
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const metrics = mockDb.getMetrics();

  const handleGenerate = () => {
    setGenerating(true);
    setGeneratedLink(null);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedLink(`/reports/download/medbridge_${reportType.toLowerCase().replace(/ /g, '_')}_${Date.now()}.pdf`);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-brand-text-primary">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Outcomes & Reports</h1>
        <p className="text-xs text-brand-text-secondary">Review audited statistics and export board-ready performance summaries.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Custom SVG Metrics Graphs (Bloomberg Style) */}
        <div className="lg:col-span-2 rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2.5">Audited Clinical Trend Analysis</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {metrics.map(m => (
              <div key={m.name} className="rounded-xl bg-slate-50/50 border border-slate-100 p-4 space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">{m.category}</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[155px]">{m.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 font-mono">{m.value}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-0.5">{m.unit}</span>
                  </div>
                </div>

                {/* Custom Sparkline SVG */}
                <div className="h-16 w-full pt-2">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`grad-${m.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#55624d" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#55624d" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 30 
                          L 0 ${30 - (m.history[0]?.value / 250 * 30 || 15)} 
                          L 25 ${30 - (m.history[1]?.value / 250 * 30 || 15)} 
                          L 50 ${30 - (m.history[2]?.value / 250 * 30 || 15)} 
                          L 75 ${30 - (m.history[3]?.value / 250 * 30 || 15)} 
                          L 100 ${30 - (m.value / 250 * 30 || 15)} 
                          L 100 30 Z`}
                      fill={`url(#grad-${m.name})`}
                    />
                    <path
                      d={`M 0 ${30 - (m.history[0]?.value / 250 * 30 || 15)} 
                          L 25 ${30 - (m.history[1]?.value / 250 * 30 || 15)} 
                          L 50 ${30 - (m.history[2]?.value / 250 * 30 || 15)} 
                          L 75 ${30 - (m.history[3]?.value / 250 * 30 || 15)} 
                          L 100 ${30 - (m.value / 250 * 30 || 15)}`}
                      fill="none"
                      stroke="#55624d"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1">
                  <span>Bench: {m.nationalBenchmark} {m.unit}</span>
                  <span className="text-accent-success font-bold">Top Decile: {m.topDecileBenchmark} {m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Executive Report Exporter */}
        <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm shadow-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2.5">Report Generator</h3>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-500 font-semibold">Select Report Type</label>
              <select 
                className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-slate-700 outline-none focus:border-accent-primary cursor-pointer shadow-sm font-semibold"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="Board Report">Hospital Executive Board Briefing</option>
                <option value="Gap Report">Clinical Quality Gap Analysis</option>
                <option value="ROI Report">Pathways Financial ROI Audit</option>
              </select>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 mt-4 text-[11px] text-slate-500 leading-relaxed">
                Generates a HIPAA-ready structured outcome digest summarizing {hospital.name}'s benchmarking scores, adapted protocols progress, and projected cost savings.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-[#d9e7cd] border border-[#bdcbb2]/40 text-[#3e4a37] hover:bg-primary hover:text-white rounded-lg py-2.5 font-bold text-xs text-center block transition-all shadow-sm cursor-pointer"
            >
              {generating ? "Compiling Audits..." : "Compile Report PDF"}
            </button>

            {generatedLink && (
              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Mock Download Started: " + reportType + " compiled successfully!"); }}
                className="flex items-center justify-center gap-2 text-xs text-accent-success bg-emerald-50 border border-emerald-100 rounded-lg py-2 text-center font-bold transition-all shadow-sm cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download Compiled File
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
