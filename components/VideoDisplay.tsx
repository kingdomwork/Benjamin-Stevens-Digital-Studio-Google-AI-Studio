import React, { useState } from 'react';
import { GenerationState } from '../types';
import { Loader2, Copy, FileText, CheckCircle2, Youtube, AlignLeft, Sparkles } from 'lucide-react';

interface ScriptDisplayProps {
  state: GenerationState;
}

export const VideoDisplay: React.FC<ScriptDisplayProps> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'longform' | 'shorts'>('longform');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const glassPanelClass = "bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl";

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (state.status === 'idle') {
    return (
      <div className={`${glassPanelClass} h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[500px] border-dashed border-2 border-slate-800 bg-slate-900/20`}>
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-800">
          <FileText className="w-10 h-10 text-slate-700" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Script Engine Ready</h3>
        <p className="text-slate-400 max-w-md text-lg">
          Select a brand, input a topic, and generate comprehensive video scripts instantly.
        </p>
      </div>
    );
  }

  if (state.status === 'generating') {
    return (
      <div className={`${glassPanelClass} h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[500px]`}>
        <div className="relative mb-8">
          <div className="w-32 h-32 border-4 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-marketing-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-marketing-accent animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4 max-w-lg">
          <h3 className="text-2xl font-bold text-white animate-pulse">
            Writing Scripts...
          </h3>
          <p className="text-slate-300 text-lg">
            Analyzing topic, crafting hooks, and formatting for viral engagement.
          </p>
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className={`${glassPanelClass} h-full rounded-2xl p-8 border-red-500/20 flex flex-col items-center justify-center text-center min-h-[500px]`}>
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/30">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Generation Failed</h3>
        <p className="text-red-200/70 mb-8 max-w-md">{state.message || "An unknown error occurred."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-red-900/20"
        >
          Reset Engine
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {state.result && (
        <div className={`${glassPanelClass} rounded-xl p-0 h-full flex flex-col overflow-hidden`}>
          
          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-slate-900/50">
             <button 
               onClick={() => setActiveTab('strategy')}
               className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'strategy' ? 'border-marketing-accent text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
             >
               <div className="flex items-center justify-center gap-2">
                 <Sparkles className="w-4 h-4" /> Strategy
               </div>
             </button>
             <button 
               onClick={() => setActiveTab('longform')}
               className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'longform' ? 'border-marketing-accent text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
             >
               <div className="flex items-center justify-center gap-2">
                 <AlignLeft className="w-4 h-4" /> Long Form
               </div>
             </button>
             <button 
               onClick={() => setActiveTab('shorts')}
               className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'shorts' ? 'border-marketing-accent text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
             >
               <div className="flex items-center justify-center gap-2">
                 <Youtube className="w-4 h-4" /> Shorts (5)
               </div>
             </button>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6 bg-slate-950/30">
            
            {activeTab === 'strategy' && (
               <div className="prose prose-invert max-w-none">
                 <h3 className="text-xl font-bold text-white mb-4">Strategic Approach</h3>
                 <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-6 text-slate-300 leading-relaxed text-lg">
                   {state.result.strategy}
                 </div>
               </div>
            )}

            {activeTab === 'longform' && (
              <div className="relative group">
                 <div className="absolute top-0 right-0 z-10">
                   <button 
                     onClick={() => handleCopy(state.result!.longFormScript, 999)}
                     className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                   >
                     {copiedIndex === 999 ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                     {copiedIndex === 999 ? 'Copied' : 'Copy Text'}
                   </button>
                 </div>
                 <div className="prose prose-invert max-w-none mt-2">
                   <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300 bg-slate-900/50 p-6 rounded-xl border border-white/5">
                     {state.result.longFormScript}
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'shorts' && (
              <div className="space-y-8">
                {state.result.scripts.map((script, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-xl p-6 relative group hover:border-marketing-accent/30 transition-colors">
                     <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                       <span className="text-xs font-bold text-marketing-accent uppercase tracking-wider bg-orange-500/10 px-2 py-1 rounded">
                         Short #{idx + 1}
                       </span>
                       <button 
                         onClick={() => handleCopy(script, idx)}
                         className="text-slate-500 hover:text-white transition-colors"
                       >
                         {copiedIndex === idx ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                       </button>
                     </div>
                     <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                       {script}
                     </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
