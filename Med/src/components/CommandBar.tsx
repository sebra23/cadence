// MedBridge Elite - Global Command Bar Dialog (Zenith Edition)
"use client";

import React, { useState, useEffect } from "react";
import { mockDb } from "@/lib/mockDatabase";
import { Search, Sparkles, Building, Play, Navigation, AlertTriangle } from "lucide-react";

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHospital: (id: string) => void;
  onNavigate: (view: string) => void;
  openCopilotWithQuery: (query: string) => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  isOpen,
  onClose,
  onSelectHospital,
  onNavigate,
  openCopilotWithQuery
}) => {
  const [query, setQuery] = useState("");
  const hospitals = mockDb.getHospitals();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      setQuery("");
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(query.toLowerCase())
  );

  const navigationCommands = [
    { label: "Go to Home Dashboard", view: "home" },
    { label: "Go to Intelligence Hub", view: "intelligence" },
    { label: "Go to Hospital Directory", view: "directory" },
    { label: "Go to Benchmarking & ROI", view: "benchmarking" },
    { label: "Go to Protocol Library", view: "protocols" },
    { label: "Go to Academy (Learn)", view: "learn" },
    { label: "Go to Project Workspace (Improve)", view: "improve" },
    { label: "Go to Outcomes & Reports", view: "reports" }
  ].filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

  const aiCommands = [
    { label: "Run STEMI ROI Calculation", query: "Analyze STEMI door-to-balloon gap ROI" },
    { label: "Review Sepsis Fluid Guidelines", query: "Show sepsis bundle guidelines and fluids" },
    { label: "Appraise Clinical Trial Eligibility", query: "Appraise trial readiness eligibility criteria" }
  ].filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-slate-900/30 backdrop-blur-sm">
      {/* Backdrop click closer */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Main Bar Dialog */}
      <div className="w-full max-w-lg rounded-3xl border border-brand-border bg-white shadow-2xl overflow-hidden flex flex-col max-h-[450px]">
        {/* Search Input bar */}
        <div className="flex items-center border-b border-brand-border px-4 py-3.5 bg-slate-50">
          <Search className="h-4.5 w-4.5 text-slate-400 shrink-0 mr-2.5" />
          <input
            type="text"
            className="w-full bg-transparent text-xs text-brand-text-primary placeholder-slate-400 outline-none font-semibold"
            placeholder="Type a command, swap focus, or search navigation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">ESC</span>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 min-h-0 bg-brand-bg/10">
          {/* 1. Navigation Shortcuts */}
          {navigationCommands.length > 0 && (
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 px-3 font-mono block mb-1.5 tracking-wider">Navigation Navigation</span>
              <div className="space-y-0.5">
                {navigationCommands.map(cmd => (
                  <button
                    key={cmd.view}
                    onClick={() => {
                      onNavigate(cmd.view);
                      onClose();
                    }}
                    className="w-full text-left rounded-xl hover:bg-[#d9e7cd]/30 px-3 py-2 text-xs text-slate-700 font-bold flex items-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Navigation className="h-3.5 w-3.5 text-primary" />
                    <span>{cmd.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Switch Hospital Context */}
          {filteredHospitals.length > 0 && (
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 px-3 font-mono block mb-1.5 tracking-wider">Select Hospital Focus</span>
              <div className="space-y-0.5">
                {filteredHospitals.map(h => (
                  <button
                    key={h.id}
                    onClick={() => {
                      onSelectHospital(h.id);
                      onClose();
                    }}
                    className="w-full text-left rounded-xl hover:bg-[#d9e7cd]/30 px-3 py-2 text-xs text-slate-700 font-bold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building className="h-3.5 w-3.5 text-accent-success" />
                      <span>{h.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono bg-[#ecefe8] px-2 py-0.5 rounded-full border border-slate-200/20 font-bold">Score: {h.excellenceScore}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Quick AI Prompt Triggers */}
          {aiCommands.length > 0 && (
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 px-3 font-mono block mb-1.5 tracking-wider">AI Copilot Audits</span>
              <div className="space-y-0.5">
                {aiCommands.map(cmd => (
                  <button
                    key={cmd.query}
                    onClick={() => {
                      openCopilotWithQuery(cmd.query);
                      onClose();
                    }}
                    className="w-full text-left rounded-xl hover:bg-[#d9e7cd]/30 px-3 py-2 text-xs text-slate-700 font-bold flex items-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-accent-warning animate-pulse" />
                    <span>{cmd.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {navigationCommands.length === 0 && filteredHospitals.length === 0 && aiCommands.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">No matching actions. Try typing 'home', 'sepsis', or 'mayo'.</p>
          )}
        </div>
      </div>
    </div>
  );
};
