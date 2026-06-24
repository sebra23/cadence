// MedBridge Elite - AI Copilot Panel (Zenith Edition)
"use client";

import React, { useState, useEffect, useRef } from "react";
import { mockDb } from "@/lib/mockDatabase";
import { 
  Send, Sparkles, Plus, MessageSquare, ShieldCheck, ChevronRight, 
  Database, Link2, BookOpen, Clock, Bot, User 
} from "lucide-react";

interface CopilotProps {
  activeHospitalId: string;
  externalQuery?: string | null;
  clearExternalQuery?: () => void;
}

export const Copilot: React.FC<CopilotProps> = ({ activeHospitalId, externalQuery, clearExternalQuery }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [showTraceId, setShowTraceId] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chats on mount / database updates
  const refreshChats = () => {
    const list = mockDb.getConversations();
    setConversations(list);
    if (list.length > 0 && !activeConvId) {
      setActiveConvId(list[0].id);
    }
  };

  useEffect(() => {
    refreshChats();
  }, []);

  // Handle external query injections from other components
  useEffect(() => {
    if (externalQuery && externalQuery.trim() !== "") {
      let convId = activeConvId;
      if (!convId) {
        const newConv = mockDb.createConversation(`Query: ${externalQuery.slice(0, 20)}`);
        convId = newConv.id;
        setActiveConvId(convId);
      }
      
      mockDb.addChatMessage(convId, 'user', externalQuery);
      refreshChats();
      if (clearExternalQuery) clearExternalQuery();
    }
  }, [externalQuery]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConvId]);

  const activeChat = conversations.find(c => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConvId) return;

    mockDb.addChatMessage(activeConvId, 'user', inputValue);
    setInputValue("");
    refreshChats();
  };

  const handleNewChat = () => {
    const activeHosp = mockDb.getActiveHospital();
    const newConv = mockDb.createConversation(`Analysis: ${activeHosp.name}`);
    setActiveConvId(newConv.id);
    refreshChats();
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-brand-border text-brand-text-primary">
      {/* Copilot Header */}
      <div className="p-4 border-b border-brand-border flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#d9e7cd] border border-[#bdcbb2]/40 p-1 text-primary animate-pulse">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-tight text-slate-900 uppercase font-mono">AI Copilot</h2>
            <p className="text-[10px] text-slate-400 font-medium">6 Clinical Agents Active</p>
          </div>
        </div>
        <button 
          onClick={handleNewChat}
          className="rounded-lg border border-brand-border bg-white hover:bg-slate-50 p-2 text-xs text-slate-700 shadow-sm transition-all cursor-pointer"
          title="New Conversation"
        >
          <Plus className="h-4 w-4 text-slate-600" />
        </button>
      </div>

      {/* Main Chat Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0 bg-brand-bg/25">
        {activeChat && activeChat.messages.length > 0 ? (
          activeChat.messages.map((msg: any) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[92%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar Icon */}
              <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs border shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#d9e7cd] border-[#bdcbb2] text-[#3e4a37]' 
                  : 'bg-[#f2f4ed] border-slate-200 text-primary'
              }`}>
                {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              {/* Message Bubble */}
              <div 
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm transition-all ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white border border-slate-100 text-brand-text-primary rounded-tl-none'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="font-semibold">{msg.content}</p>
                ) : (
                  // Rich Markdown simulation parser
                  <div className="space-y-3">
                    <div className="prose prose-xs prose-slate text-brand-text-primary max-w-none">
                      {msg.content.split("\n\n").map((para: string, pIdx: number) => {
                        if (para.startsWith("### ")) {
                          return (
                            <h4 key={pIdx} className="text-xs font-bold text-slate-900 mt-2 mb-1.5 flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {para.replace("### ", "")}
                            </h4>
                          );
                        }
                        if (para.startsWith("* ") || para.startsWith("1. ")) {
                          return (
                            <ul key={pIdx} className="list-disc list-inside space-y-1 pl-1">
                              {para.split("\n").map((li, lIdx) => (
                                <li key={lIdx} className="text-slate-600 text-[11px] leading-relaxed">
                                  {li.replace(/^\* |^\d+\.\s/, "")}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={pIdx} className="text-slate-600 text-[11px] leading-relaxed">{para}</p>;
                      })}
                    </div>

                    {/* AI Meta Metadata (Confidence, Sources, Evidence Traceability) */}
                    <div className="pt-2.5 border-t border-slate-200/60 space-y-2">
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 font-bold text-[#3e4a37] bg-[#d9e7cd]/60 border border-[#bdcbb2]/40 rounded-full px-2.5 py-0.5 font-mono">
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> {msg.confidenceScore}% confidence
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3" /> {msg.timestamp.substring(11, 16)} UTC
                        </span>
                      </div>

                      {/* Reference Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider">Citations</span>
                          <div className="space-y-1">
                            {msg.sources.map((src: any, sIdx: number) => (
                              <a 
                                key={sIdx} 
                                href={src.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center justify-between bg-white border border-brand-border p-1.5 rounded-lg hover:border-slate-300 transition-colors shadow-sm"
                              >
                                <span className="text-[9px] font-bold text-primary truncate max-w-[170px] flex items-center gap-1">
                                  <Link2 className="h-3 w-3 shrink-0" /> {src.title}
                                </span>
                                <span className="text-[8px] font-mono text-slate-400 font-bold bg-[#f2f4ed] border border-slate-200/40 px-1 rounded">{src.confidence}% Match</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence Trace Logs */}
                      {msg.evidenceTrace && msg.evidenceTrace.length > 0 && (
                        <div className="pt-1">
                          <button 
                            onClick={() => setShowTraceId(showTraceId === msg.id ? null : msg.id)}
                            className="text-[9px] font-bold text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
                          >
                            <Database className="h-3 w-3 shrink-0" /> 
                            {showTraceId === msg.id ? "Hide Trace" : "Audit RAG Trace Log"}
                            <ChevronRight className={`h-3 w-3 transform transition-transform ${showTraceId === msg.id ? "rotate-90" : ""}`} />
                          </button>
                          
                          {showTraceId === msg.id && (
                            <div className="mt-1.5 bg-[#f2f4ed] border border-[#bdcbb2]/40 rounded-lg p-2 space-y-1 font-mono text-[8px] text-[#3e4a37]/75 shadow-inner">
                              {msg.evidenceTrace.map((tr: string, tIdx: number) => (
                                <div key={tIdx} className="flex items-start gap-1">
                                  <span className="text-primary font-bold">➔</span>
                                  <span>{tr}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Copilot Panel Ready</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
              Select a thread or type below to inquire about clinical outcomes, trial matching, or guidelines.
            </p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-brand-border bg-slate-50 flex gap-2">
        <input
          type="text"
          placeholder="Ask clinical queries..."
          className="flex-1 rounded-xl border border-brand-border bg-white px-3 py-2 text-xs text-brand-text-primary placeholder-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-[#d9e7cd] shadow-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button 
          type="submit"
          className="rounded-xl bg-primary text-white p-2.5 hover:bg-[#3e4a37] shadow transition-all cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
