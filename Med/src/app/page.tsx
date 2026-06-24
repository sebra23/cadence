// MedBridge Elite - Core Dashboard Container (Zenith Edition)
"use client";

import React, { useState, useEffect } from "react";
import { mockDb, Hospital } from "@/lib/mockDatabase";
import { 
  HomeView, IntelligenceView, DirectoryView, ProfileView, ExcellenceView, 
  BenchmarkingView, ProtocolsView, AcademyView, ImproveView, ReportsView 
} from "@/components/views";
import { Copilot } from "@/components/Copilot";
import { CommandBar } from "@/components/CommandBar";
import { 
  Building2, Activity, Award, Play, Plus, BookOpen, Clock, Calendar, 
  User, CheckCircle2, AlertTriangle, Search, Sparkles, HelpCircle, Lock, 
  Menu, Bell, Leaf, LogOut, LayoutDashboard, Clapperboard, Users, Briefcase, 
  RefreshCw, BarChart3
} from "lucide-react";

export default function DashboardShell() {
  const [activeView, setActiveView] = useState("home");
  const [activeHospitalId, setActiveHospitalId] = useState("hosp-mayo");
  const [activeHospital, setActiveHospital] = useState<Hospital>(mockDb.getActiveHospital());
  
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [externalQuery, setExternalQuery] = useState<string | null>(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(true);

  // Sync active hospital state
  useEffect(() => {
    mockDb.setActiveHospitalId(activeHospitalId);
    setActiveHospital(mockDb.getActiveHospital());
  }, [activeHospitalId]);

  const handleSelectHospital = (id: string) => {
    setActiveHospitalId(id);
  };

  const handleDeployProtocol = (projectName: string, protocolId: string, department: string) => {
    mockDb.addProject(projectName, protocolId, department);
    setActiveHospital(mockDb.getActiveHospital());
    setActiveView("improve");
  };

  const openCopilotWithQuery = (query: string) => {
    setExternalQuery(query);
    setCopilotOpen(true);
  };

  const clearExternalQuery = () => {
    setExternalQuery(null);
  };

  const mainNavItems = [
    { id: "home", label: "Dashboard", icon: LayoutDashboard },
    { id: "intelligence", label: "Intelligence Hub", icon: Activity },
    { id: "protocols", label: "Playbook Library", icon: BookOpen },
    { id: "learn", label: "Webinar Center", icon: Clapperboard },
    { id: "directory", label: "Expert Directory", icon: Users },
    { id: "profile", label: "Hospital Profile", icon: User },
    { id: "excellence", label: "Excellence Profiles", icon: Award },
    { id: "improve", label: "Staff Workspace", icon: Briefcase }
  ];

  const trackerNavItems = [
    { id: "benchmarking", label: "Implementation Tracker", icon: RefreshCw },
    { id: "reports", label: "Reports", icon: BarChart3 }
  ];

  const flaggedNavItems = [
    { id: "trialbridge", label: "TrialBridge", tooltip: "Requires Clinical Trial Sponsorship module authorization." },
    { id: "certifications", label: "Certifications", tooltip: "Requires Premium Learning Management upgrade." },
    { id: "integrations", label: "HL7/FHIR Integrations", tooltip: "Requires Enterprise EHR API configuration." }
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col antialiased text-brand-text-primary selection:bg-[#D5E2D5] selection:text-[#4D5E4D]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-brand-bg px-8 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden rounded-lg p-1.5 hover:bg-white/50 text-slate-700 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Search Trigger Capsule (EEF2EE) */}
          <div className="relative w-48 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input 
              type="text" 
              placeholder="Search resources or shortcuts..." 
              onClick={() => setCommandBarOpen(true)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#EEF2EE] rounded-full text-xs text-brand-text-primary placeholder:text-brand-text-secondary/60 focus:outline-none cursor-pointer"
            />
          </div>
          
          <span className="h-6 w-px bg-slate-200 hidden md:block mx-3" />
          
          {/* Hospital Scope Switcher */}
          <div className="hidden md:flex items-center gap-2 bg-[#EEF2EE] px-3.5 py-2 rounded-full border-none">
            <Building2 className="h-3.5 w-3.5 text-accent-primary" />
            <select
              value={activeHospitalId}
              onChange={(e) => handleSelectHospital(e.target.value)}
              className="bg-transparent text-xs text-brand-text-primary font-semibold outline-none cursor-pointer pr-1 border-none focus:ring-0"
            >
              {mockDb.getHospitals().map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-4">
          {/* Zenith Assistant */}
          <button 
            onClick={() => openCopilotWithQuery("Open clinical assistant recommendations")}
            className="bg-[#EEF2EE] text-[#4D5E4D] px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 hover:bg-[#D5E2D5]/50 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zenith Assistant</span>
          </button>

          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className={`p-2 rounded-full hover:bg-white/50 transition cursor-pointer ${
              copilotOpen ? "text-accent-primary bg-[#EEF2EE]" : "text-brand-text-secondary"
            }`}
            title="Toggle AI Copilot"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          <button className="p-2 text-brand-text-secondary hover:text-brand-text-primary rounded-full hover:bg-white/50 cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="w-9 h-9 rounded-full bg-cover bg-center border border-white shadow-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100')" }}></div>
        </div>
      </header>

      {/* Main Grid: Sidebar + View Content + Copilot */}
      <div className="flex-1 flex w-full relative min-h-0">
        {/* Left Side Navigation (F1F4F1) */}
        <aside className={`w-64 bg-brand-sidebar border-r border-brand-border flex flex-col justify-between shrink-0 p-4 z-20 ${
          isMobileMenuOpen ? "fixed inset-y-20 left-0 shadow-lg" : "hidden md:flex"
        }`}>
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-3 px-2 py-4 mb-4 cursor-pointer" onClick={() => setActiveView("home")}>
              <div className="bg-[#4D5E4D] text-white p-2 rounded-xl flex items-center justify-center shadow-sm">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-none tracking-tight text-brand-text-primary">Zenith</h1>
                <span className="text-[10px] uppercase tracking-wider text-brand-text-secondary font-bold block mt-0.5">Clinical Sanctuary</span>
              </div>
            </div>

            {/* Main Nav Links */}
            <nav className="space-y-1">
              {mainNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 cursor-pointer border-none ${
                      isActive 
                        ? "bg-[#D5E2D5] text-[#4D5E4D] font-bold" 
                        : "text-[#687069] hover:bg-white/50 hover:text-brand-text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Section Divider */}
            <hr className="my-6 border-brand-border" />

            {/* Tracker Utilities */}
            <nav className="space-y-1">
              {trackerNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 cursor-pointer border-none ${
                      isActive 
                        ? "bg-[#D5E2D5] text-[#4D5E4D] font-bold" 
                        : "text-[#687069] hover:bg-white/50 hover:text-brand-text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <hr className="my-6 border-brand-border" />

            {/* Feature Flags / Deferred Items */}
            <nav className="space-y-1">
              {flaggedNavItems.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 cursor-not-allowed group relative bg-[#EEF2EE]/40 border border-transparent rounded-lg"
                  title={item.tooltip}
                >
                  <span className="flex items-center gap-3 font-semibold text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-350" />
                    {item.label}
                  </span>
                  <span className="text-[8px] font-bold font-mono bg-white text-slate-400 px-1 py-0.5 rounded border border-slate-200">
                    FF
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Sidebar Actions */}
          <div className="space-y-4">
            <button 
              onClick={() => setCommandBarOpen(true)}
              className="w-full bg-[#4D5E4D] text-white font-medium py-3 px-4 rounded-xl shadow-sm hover:opacity-90 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Session</span>
            </button>
            
            <div className="space-y-1 pt-2 border-t border-brand-border">
              <button 
                onClick={() => openCopilotWithQuery("Display customer support guidelines")}
                className="w-full flex items-center gap-3 px-3 py-2 text-brand-text-secondary hover:text-brand-text-primary text-sm cursor-pointer text-left"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Support</span>
              </button>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-brand-text-secondary hover:text-brand-text-primary text-sm">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto bg-brand-bg">
          <div className="px-8 pb-8 pt-4 space-y-8">
            {activeView === "home" && (
              <HomeView 
                hospital={activeHospital} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
            {activeView === "intelligence" && (
              <IntelligenceView 
                hospital={activeHospital} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
            {activeView === "directory" && (
              <DirectoryView 
                onSelectHospital={handleSelectHospital} 
                activeHospitalId={activeHospitalId} 
              />
            )}
            {activeView === "profile" && (
              <ProfileView 
                hospital={activeHospital} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
            {activeView === "excellence" && (
              <ExcellenceView 
                hospital={activeHospital} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
            {activeView === "benchmarking" && (
              <BenchmarkingView 
                hospital={activeHospital} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
            {activeView === "protocols" && (
              <ProtocolsView 
                hospital={activeHospital} 
                onDeploy={handleDeployProtocol} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
            {activeView === "learn" && (
              <AcademyView 
                hospital={activeHospital} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
            {activeView === "improve" && (
              <ImproveView 
                hospital={activeHospital} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
            {activeView === "reports" && (
              <ReportsView 
                hospital={activeHospital} 
                onNavigate={setActiveView} 
                openCopilotWithQuery={openCopilotWithQuery} 
              />
            )}
          </div>
        </main>

        {/* Right Side AI Copilot (Sticky/Docked) */}
        {copilotOpen && (
          <aside className="w-80 lg:w-96 border-l border-brand-border bg-white flex flex-col shrink-0 z-10 shadow-sm">
            <Copilot 
              activeHospitalId={activeHospitalId} 
              externalQuery={externalQuery}
              clearExternalQuery={clearExternalQuery} 
            />
          </aside>
        )}
      </div>

      {/* Global Command Bar Dialog Modal */}
      <CommandBar 
        isOpen={commandBarOpen} 
        onClose={() => setCommandBarOpen(false)}
        onSelectHospital={handleSelectHospital} 
        onNavigate={setActiveView}
        openCopilotWithQuery={openCopilotWithQuery} 
      />
    </div>
  );
}


