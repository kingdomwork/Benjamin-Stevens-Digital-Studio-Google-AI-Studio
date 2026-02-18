import React, { useState } from 'react';
import { Sparkles, ExternalLink, Microscope, Copy, CheckCircle2, ChevronDown, Target, LayoutTemplate, Video, FileImage } from 'lucide-react';
import { performDeepResearch } from '../services/geminiService';
import { ResearchResult, ContentType } from '../types';

interface DeepResearchProps {
  onGenerateScripts: (researchResult: ResearchResult) => void;
}

const TRANSFERABLE_CONTENT_TOPICS = [
  { 
    label: "Viral 'Day in the Life' (Estate Agent Edition)", 
    query: "Day in the life of a real estate agent UK viral trends shorts",
    brandContext: "General Brand Awareness / Recruitment"
  },
  { 
    label: "UK Housing Market: Boom or Bust?", 
    query: "UK housing market predictions 2025 viral content analysis",
    brandContext: "Sales & Lettings Authority"
  },
  { 
    label: "Renovation Nightmares & Flipping Wins", 
    query: "Property renovation mistakes and flipping success stories viral",
    brandContext: "Auctions & Investments"
  },
  { 
    label: "Tenant Tips: Surviving the London Rental Market", 
    query: "London renting tips and hacks viral tiktok trends",
    brandContext: "Lettings"
  },
  { 
    label: "Luxury Property Tours (MTV Cribs Style)", 
    query: "Luxury property tour London viral video style",
    brandContext: "Prestige Sales"
  },
  { 
    label: "Estate Agent Secrets: How to Negotiate", 
    query: "Estate agent secrets negotiation tips viral",
    brandContext: "Sales / Vendor Education"
  },
  { 
    label: "Block Management: Behind the Scenes", 
    query: "Property management educational viral content UK",
    brandContext: "Block Management"
  },
  { 
    label: "Auction Room Drama & Bidding Wars", 
    query: "Property auction bidding war viral video trends",
    brandContext: "Auctions"
  }
];

const CONTENT_TYPES: ContentType[] = ["Video", "Carousel", "Static Post"];

export const DeepResearch: React.FC<DeepResearchProps> = ({ onGenerateScripts }) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>("Video");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const glassPanelClass = "bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl";
  const glassInputClass = "bg-slate-950/50 border border-slate-700 text-slate-200 focus:border-marketing-accent focus:ring-1 focus:ring-marketing-accent transition-all duration-200";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const topic = TRANSFERABLE_CONTENT_TOPICS[selectedTopicIndex];
    if (!topic) return;

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const data = await performDeepResearch(topic.query, selectedContentType);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Research prompt generation failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyPrompt = () => {
    if (result?.generated_prompt) {
      navigator.clipboard.writeText(result.generated_prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Search Header */}
      <div className={`${glassPanelClass} rounded-2xl p-8 text-center`}>
        <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-marketing-accent/30 shadow-lg shadow-marketing-accent/10">
          <Sparkles className="w-8 h-8 text-marketing-accent" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Deep Research Prompt Generator</h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          Use Cerebras to generate a sophisticated prompt that you can use with Gemini Advanced for deep market analysis.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative space-y-4 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Content Type Selector */}
             <div className="md:col-span-1">
               <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block pl-1">
                 Format
               </label>
               <div className="relative">
                 <select
                   value={selectedContentType}
                   onChange={(e) => setSelectedContentType(e.target.value as ContentType)}
                   className={`w-full py-4 pl-4 pr-8 rounded-xl text-base shadow-lg appearance-none cursor-pointer ${glassInputClass}`}
                   disabled={isSearching}
                 >
                   {CONTENT_TYPES.map(type => (
                     <option key={type} value={type} className="bg-slate-900">{type}</option>
                   ))}
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
               </div>
             </div>

             {/* Topic Selector */}
             <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block pl-1">
                  Topic Category
                </label>
                <div className="relative">
                  <select
                    value={selectedTopicIndex}
                    onChange={(e) => setSelectedTopicIndex(Number(e.target.value))}
                    className={`w-full py-4 pl-4 pr-12 rounded-xl text-base shadow-lg appearance-none cursor-pointer ${glassInputClass}`}
                    disabled={isSearching}
                  >
                    {TRANSFERABLE_CONTENT_TOPICS.map((topic, idx) => (
                      <option key={idx} value={idx} className="bg-slate-900 text-slate-200">
                        {topic.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none group-hover:text-marketing-accent transition-colors" />
                </div>
             </div>
          </div>
          
          {/* Context Badge */}
          <div className="flex items-center gap-2 pl-1 justify-center md:justify-start">
             <Target className="w-3 h-3 text-marketing-accent" />
             <span className="text-xs text-marketing-accent font-medium uppercase tracking-wide">
               Target: {TRANSFERABLE_CONTENT_TOPICS[selectedTopicIndex].brandContext}
             </span>
          </div>

          <button 
            type="submit"
            disabled={isSearching}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6 flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Drafting Prompt...
              </>
            ) : (
              <>
                <Microscope className="w-5 h-5" />
                Generate Research Prompt
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="flex-grow flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
          <div className="relative mb-8">
             <div className="absolute inset-0 bg-marketing-accent/20 blur-xl rounded-full"></div>
             <Sparkles className="w-16 h-16 text-marketing-accent relative animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Architecting Prompt...</h3>
          <p className="text-slate-400">Designing a high-performance query for Gemini Deep Research based on <span className="text-white font-medium">"{TRANSFERABLE_CONTENT_TOPICS[selectedTopicIndex].label}"</span>.</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-200">
          <p className="font-semibold">Generation Interrupted</p>
          <p className="text-sm opacity-80 mt-1">{error}</p>
        </div>
      )}

      {/* Results View */}
      {result && result.generated_prompt && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-8 duration-500 h-full">
          
          {/* Prompt Column */}
          <div className="lg:col-span-12 space-y-6 h-full flex flex-col">
            
            {/* Prompt Card */}
            <div className={`${glassPanelClass} rounded-xl p-0 border-marketing-accent/50 flex flex-col flex-grow overflow-hidden`}>
              <div className="p-4 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-marketing-accent/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-marketing-accent" />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-white">Gemini Research Prompt</h3>
                     <p className="text-xs text-slate-400">Copy this into Gemini Advanced</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
                    ${copied 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-900/20' 
                      : 'bg-white text-slate-900 hover:bg-slate-200'}
                  `}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </>
                  )}
                </button>
              </div>

              <div className="p-6 overflow-y-auto bg-slate-950/30 flex-grow custom-scrollbar">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                    {result.generated_prompt}
                  </pre>
                </div>
              </div>
              
              {result.strategy_suggestion && (
                <div className="p-4 border-t border-white/10 bg-blue-900/10 text-sm text-blue-200 flex gap-3 items-start">
                  <div className="mt-1 flex-shrink-0">
                    <Video className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="font-bold block mb-1 text-blue-300">Strategy Note</span>
                    {result.strategy_suggestion}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};