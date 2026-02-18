import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { VideoForm } from './components/VideoForm'; // Now acts as ScriptForm
import { VideoDisplay } from './components/VideoDisplay'; // Now acts as ScriptDisplay
import { DeepResearch } from './components/DeepResearch';
import { ScriptRequestData, GenerationState, ResearchResult } from './types';
import { generateScripts } from './services/geminiService';
import { LayoutGrid, Microscope, PenTool } from 'lucide-react';

type ViewMode = 'studio' | 'research';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('studio');
  const [generationState, setGenerationState] = useState<GenerationState>({ status: 'idle' });
  
  // State to pre-fill form from research
  const [prefilledSource, setPrefilledSource] = useState<string>('');
  const [prefilledInstructions, setPrefilledInstructions] = useState<string>('');

  const handleGenerate = useCallback(async (data: ScriptRequestData) => {
    setGenerationState({ status: 'generating' });

    try {
      const result = await generateScripts(data);
      
      setGenerationState({
        status: 'completed',
        result: result
      });

    } catch (error: any) {
      console.error("Generation error:", error);
      
      setGenerationState({
        status: 'error',
        message: error.message || "Something went wrong during script generation."
      });
    }
  }, []);

  const handleResearchToScript = (result: ResearchResult) => {
    setViewMode('studio');
    
    // Construct rich source text from the research for the script prompt
    const sourceText = `${result.query} (${result.contentType}). Insights: ${result.market_analysis}`;
    
    const instructions = `
Strategy based on ${result.contentType} analysis:
${result.strategy_suggestion}
Focus Techniques: ${(result.candidates || []).map(c => c.transferable_technique).join(', ')}
    `.trim();

    setPrefilledSource(sourceText);
    setPrefilledInstructions(instructions);
  };

  return (
    <div className="min-h-screen bg-marketing-dark font-sans text-slate-200">
      <Header />

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setViewMode('studio')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              viewMode === 'studio' 
                ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <PenTool className="w-5 h-5" />
            Script Studio
          </button>
          <button
            onClick={() => setViewMode('research')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              viewMode === 'research' 
                ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <Microscope className="w-5 h-5" />
            Deep Research
          </button>
        </div>
        
        {viewMode === 'studio' ? (
          /* STUDIO VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Left Column: Controls */}
            <div className="lg:col-span-4 space-y-6">
              <VideoForm 
                onSubmit={handleGenerate} 
                isGenerating={generationState.status === 'generating'}
                initialSourceText={prefilledSource}
                initialInstructions={prefilledInstructions}
              />
            </div>

            {/* Right Column: Preview & Result */}
            <div className="lg:col-span-8 h-[calc(100vh-140px)]">
              <VideoDisplay 
                state={generationState} 
              />
            </div>
          </div>
        ) : (
          /* DEEP RESEARCH VIEW */
          <div className="h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-300">
             <DeepResearch onGenerateScripts={handleResearchToScript} />
          </div>
        )}

      </main>
    </div>
  );
}
