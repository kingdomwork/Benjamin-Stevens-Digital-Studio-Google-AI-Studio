
import React from 'react';
import { Share2, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-orange-900/20">
            <Share2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              Benjamin Stevens <span className="text-orange-500">Digital Studio</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
              POWERED BY CEREBRAS
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 ml-4 rounded-full bg-slate-800/50 border border-white/5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">v1.1</span>
          </div>
        </div>
      </div>
    </header>
  );
};
