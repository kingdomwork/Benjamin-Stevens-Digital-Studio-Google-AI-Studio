import React, { useState, useEffect } from 'react';
import { Brand, ScriptPreset, CreativeDirection, ScriptRequestData, BrandKnowledge } from '../types';
import { Layers, ChevronDown, Sparkles, Database, Info, Plus, Trash2, FileText, BookOpen, Briefcase, PenTool, List, X } from 'lucide-react';
import { getBrandKnowledge, addBrandKnowledge, deleteBrandKnowledge } from '../services/databaseService';

interface ScriptFormProps {
  onSubmit: (data: ScriptRequestData) => void;
  isGenerating: boolean;
  initialSourceText?: string;
  initialInstructions?: string;
}

const STATIC_BRANDS: Brand[] = [
  { id: 1, name: "Benjamin Stevens (Hub Model - Admin Supported)" },
  { id: 2, name: "eXp (Self Employed - Fully Independent)" },
  { id: 3, name: "Benjamin Stevens Lettings" },
  { id: 4, name: "Benjamin Stevens Block Management" },
  { id: 5, name: "Benjamin Stevens Auction and Investments" }
];

const PRESET_OPTIONS: ScriptPreset[] = [
  "Educational",
  "Controversial / Hot Take",
  "Storytelling",
  "Listicle",
  "Behind the Scenes",
  "Q&A",
  "Direct Sales"
];

const CREATIVE_DIRECTION_OPTIONS: CreativeDirection[] = [
  "Professional & Corporate",
  "Viral & High Energy",
  "Warm & Community Focused",
  "Witty & Edgy",
  "Minimalist"
];

const TOPIC_PRESETS = [
  "North West London Market Update",
  "Why Choose Benjamin Stevens?",
  "Landlord Legislation Update",
  "Investment Hotspots",
  "Community Work Highlights",
  "Tenant Guide",
  "Custom Topic"
];

const PAIN_POINT_PRESETS = [
  { label: "Select a pain point...", value: "" },
  { label: "Sales: No Offers / Slow Market", value: "Target vendors frustrated that their property is sitting on the market with no offers. Address the 'price vs. marketing' dilemma." },
  { label: "Sales: Fees vs. Value", value: "Address the objection that 'fees are too high'. Explain why a cheap agent costs you more in the final sale price." },
  { label: "Sales: Communication Black Hole", value: "Target vendors who feel ignored by their current agent. Promise weekly updates and personal WhatsApp groups." },
  { label: "Lettings: The Nightmare Tenant", value: "Focus on landlord anxiety about rent arrears and property damage. Pitch the comprehensive vetting process." },
  { label: "Lettings: Accidental Landlord", value: "Speak to people who inherited a property or moved in with a partner and don't know where to start with renting." },
  { label: "Lettings: Compliance Fatigue", value: "Target landlords overwhelmed by the 170+ pieces of legislation. Position the agency as the compliance expert shield." },
  { label: "Block Mgmt: Invisible Service", value: "Target leaseholders paying high service charges but seeing no maintenance or cleaning being done." },
  { label: "Block Mgmt: Absent Managers", value: "Focus on the frustration of never being able to reach a property manager during a crisis (e.g., leaks)." },
  { label: "Auctions: Need Cash Fast", value: "Target sellers facing financial pressure, divorce, or probate who need a guaranteed sale in 28 days." },
  { label: "Auctions: Problem Properties", value: "Focus on unmortgageable properties (Japanese Knotweed, structural issues, short leases) that traditional agents can't sell." },
  { label: "Recruitment: Stuck in Corporate", value: "Target estate agents tired of corporate KPIs and low commission splits. Pitch the 'Partner' model freedom." },
  { label: "General: Why use a Local Agent?", value: "Highlight the specific benefits of a local expert over a faceless online/hybrid agent." },
  { label: "Custom / Other...", value: "CUSTOM" }
];

export const VideoForm: React.FC<ScriptFormProps> = ({ onSubmit, isGenerating, initialSourceText, initialInstructions }) => {
  const [selectedBrandId, setSelectedBrandId] = useState<string>(STATIC_BRANDS[0].id.toString());
  const [preset, setPreset] = useState<ScriptPreset>("Educational");
  const [creativeDirection, setCreativeDirection] = useState<CreativeDirection>("Professional & Corporate");
  const [topicPreset, setTopicPreset] = useState<string>(TOPIC_PRESETS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [instructions, setInstructions] = useState("");
  const [instructionMode, setInstructionMode] = useState<'preset' | 'custom'>('preset');
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<BrandKnowledge[]>([]);
  const [newKnowledge, setNewKnowledge] = useState("");
  const [isLoadingKB, setIsLoadingKB] = useState(false);
  
  const glassPanelClass = "bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl";
  const glassInputClass = "bg-slate-950/50 border border-slate-700 text-slate-200 focus:border-marketing-accent focus:ring-1 focus:ring-marketing-accent transition-all duration-200 placeholder:text-slate-600";

  useEffect(() => {
    if (initialSourceText) {
      setTopicPreset("Custom Topic");
      setCustomTopic(initialSourceText);
    }
    if (initialInstructions) {
      setInstructions(initialInstructions);
      setInstructionMode('custom');
    }
  }, [initialSourceText, initialInstructions]);

  useEffect(() => {
    if (selectedBrandId && showKnowledge) {
      loadKnowledge(parseInt(selectedBrandId));
    }
  }, [selectedBrandId, showKnowledge]);

  const loadKnowledge = async (id: number) => {
    setIsLoadingKB(true);
    try {
      const items = await getBrandKnowledge(id);
      setKnowledgeItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingKB(false);
    }
  };

  const handleAddKnowledge = async () => {
    if (!newKnowledge.trim() || !selectedBrandId) return;
    try {
      const item = await addBrandKnowledge(parseInt(selectedBrandId), newKnowledge);
      setKnowledgeItems([item, ...knowledgeItems]);
      setNewKnowledge("");
    } catch (e) {
      // Ignore DB errors in demo
    }
  };

  const handleDeleteKnowledge = async (id: number) => {
    try {
      await deleteBrandKnowledge(id);
      setKnowledgeItems(knowledgeItems.filter(i => i.id !== id));
    } catch (e) {
      // Ignore DB errors
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSourceText = topicPreset === "Custom Topic" ? customTopic : topicPreset;
    const selectedBrandName = STATIC_BRANDS.find(b => b.id.toString() === selectedBrandId)?.name || "Unknown Brand";
    
    if (!finalSourceText.trim()) {
      alert("Please provide a topic.");
      return;
    }

    onSubmit({
      brand: selectedBrandName,
      preset,
      creativeDirection,
      sourceText: finalSourceText,
      instructions
    });
  };

  return (
    <div className={`${glassPanelClass} rounded-2xl p-6 lg:p-8 h-full flex flex-col`}>
      <div className="mb-6 pb-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="text-marketing-accent w-5 h-5" />
            Script Strategy
          </h2>
          <p className="text-sm text-slate-400 mt-1">Configure your content strategy.</p>
        </div>
        <button 
          onClick={() => setShowKnowledge(!showKnowledge)}
          className={`p-2 rounded-lg transition-colors ${showKnowledge ? 'bg-marketing-accent text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          title="Brand Knowledge Base"
        >
          <Database className="w-5 h-5" />
        </button>
      </div>

      {showKnowledge ? (
        <div className="flex-grow flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-marketing-accent" />
              {STATIC_BRANDS.find(b => b.id.toString() === selectedBrandId)?.name} Library
            </h3>
            <button onClick={() => setShowKnowledge(false)} className="text-xs text-slate-500 hover:text-white">Close</button>
          </div>
          <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20 text-xs text-blue-200">
            Paste past posts or style guides. The AI will use this context.
          </div>
          <div className="flex gap-2">
            <input 
              value={newKnowledge}
              onChange={(e) => setNewKnowledge(e.target.value)}
              placeholder="Paste inspiration or data..."
              className={`flex-grow ${glassInputClass} rounded-lg px-3 py-2 text-sm`}
            />
            <button onClick={handleAddKnowledge} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {isLoadingKB ? (
              <div className="text-center text-slate-500 py-4">Loading...</div>
            ) : knowledgeItems.length === 0 ? (
              <div className="text-center text-slate-500 py-4 italic text-sm">No knowledge stored yet.</div>
            ) : (
              knowledgeItems.map(item => (
                <div key={item.id} className="bg-slate-900/40 p-3 rounded-lg border border-white/5 group relative text-sm text-slate-300">
                  <p className="pr-6 line-clamp-3">{item.content}</p>
                  <button onClick={() => handleDeleteKnowledge(item.id)} className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-left-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Briefcase className="w-3 h-3" />
              Brand Identity
            </label>
            <div className="relative group flex-grow">
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className={`w-full ${glassInputClass} rounded-xl p-3 pr-10 appearance-none outline-none cursor-pointer text-sm`}
              >
                {STATIC_BRANDS.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900">{b.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Topic
            </label>
            <div className="relative group">
              <select
                value={topicPreset}
                onChange={(e) => setTopicPreset(e.target.value)}
                className={`w-full ${glassInputClass} rounded-xl p-3 pr-10 appearance-none outline-none cursor-pointer text-sm`}
              >
                {TOPIC_PRESETS.map((topic, idx) => (
                  <option key={idx} value={topic} className="bg-slate-900">{topic}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            {topicPreset === "Custom Topic" && (
              <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                <textarea
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Paste article, URL, or notes..."
                  className={`w-full ${glassInputClass} rounded-xl p-4 min-h-[120px] outline-none resize-none font-mono text-sm leading-relaxed`}
                  required={topicPreset === "Custom Topic"}
                  disabled={isGenerating}
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tone</label>
              <div className="relative">
                <select
                  value={creativeDirection}
                  onChange={(e) => setCreativeDirection(e.target.value as CreativeDirection)}
                  className={`w-full ${glassInputClass} rounded-xl p-3 pr-8 appearance-none text-sm`}
                >
                  {CREATIVE_DIRECTION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Format</label>
              <div className="relative">
                <select
                  value={preset}
                  onChange={(e) => setPreset(e.target.value as ScriptPreset)}
                  className={`w-full ${glassInputClass} rounded-xl p-3 pr-8 appearance-none text-sm`}
                >
                  {PRESET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Info className="w-3 h-3" />
              Special Instructions
            </label>
            
            {instructionMode === 'preset' ? (
              <div className="relative group animate-in fade-in slide-in-from-left-2">
                <select
                  value={PAIN_POINT_PRESETS.some(p => p.value === instructions) ? instructions : ""}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setInstructionMode('custom');
                      setInstructions('');
                    } else {
                      setInstructions(e.target.value);
                    }
                  }}
                  className={`w-full ${glassInputClass} rounded-xl p-3 pr-10 appearance-none outline-none cursor-pointer text-sm`}
                >
                  {PAIN_POINT_PRESETS.map((opt, idx) => (
                    <option key={idx} value={opt.value} className="bg-slate-900">{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            ) : (
              <div className="relative animate-in fade-in slide-in-from-right-2">
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter specific instructions..."
                  className={`w-full ${glassInputClass} rounded-xl p-4 min-h-[80px] outline-none resize-none pr-10`}
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setInstructionMode('preset');
                    if (!instructions) setInstructions('');
                  }}
                  className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Back to list"
                >
                  <List className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-base tracking-wide shadow-lg transform transition-all duration-300
              flex items-center justify-center gap-3
              ${isGenerating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white hover:shadow-orange-900/20 hover:-translate-y-0.5 active:scale-[0.98]'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Writing Scripts...</span>
              </>
            ) : (
              <>
                <PenTool className="w-5 h-5" />
                <span>Generate Scripts</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};