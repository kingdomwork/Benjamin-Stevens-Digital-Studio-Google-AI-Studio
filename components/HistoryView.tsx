
import React, { useEffect, useState } from 'react';
import { getHistory, toggleUsedStatus } from '../services/historyService';
import { ScriptHistoryItem, ScriptResult } from '../types';
import { Calendar, CheckCircle2, Circle, ArrowRight, Loader2, Video, Trash2 } from 'lucide-react';

interface HistoryViewProps {
  onLoadResult: (result: ScriptResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onLoadResult }) => {
  const [items, setItems] = useState<ScriptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUsed = async (e: React.MouseEvent, item: ScriptHistoryItem) => {
    e.stopPropagation();
    try {
      // Optimistic update
      const newStatus = !item.is_used;
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_used: newStatus } : i));
      
      await toggleUsedStatus(item.id, item.is_used);
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on error
      loadHistory();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-marketing-accent" />
        <p>Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-400 bg-slate-900/50 rounded-xl border border-red-500/20">
        <p>Error loading history: {error}</p>
        <button onClick={loadHistory} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Generated Video History</h2>
        <span className="text-sm text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {items.length} Records
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700">
            <p className="text-slate-500 text-lg">No history found. Generate your first video!</p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className={`
                group relative bg-slate-900/60 backdrop-blur-md border rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] cursor-pointer
                ${item.is_used ? 'border-green-500/20 hover:border-green-500/40' : 'border-white/5 hover:border-marketing-accent/50'}
              `}
              onClick={() => onLoadResult(item.result)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Info Section */}
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`
                      text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                      ${item.is_used ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}
                    `}>
                      {item.brand.length > 30 ? item.brand.substring(0, 30) + '...' : item.brand}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium text-lg leading-snug">
                        Generated Video
                      </h4>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2 pr-8">
                        {item.source_text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <button
                    onClick={(e) => handleToggleUsed(e, item)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${item.is_used 
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}
                    `}
                  >
                    {item.is_used ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Used
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        Mark Used
                      </>
                    )}
                  </button>

                  <div className="w-px h-8 bg-white/10 hidden md:block"></div>

                  <button 
                    className="flex items-center gap-2 text-marketing-accent font-semibold text-sm group-hover:underline"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
