'use client';

import { useState, useEffect } from 'react';
import { Check, X, CircleDashed } from 'lucide-react';

export default function TrackerWidget() {
  const [logs, setLogs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Calculate a rolling 28-day history window
  const today = new Date();
  const days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (27 - i));
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        if (res.ok) {
          const data = await res.json();
          const logMap: Record<string, string> = {};
          data.logs?.forEach((l: any) => {
            logMap[l.dateKey] = l.type;
          });
          setLogs(logMap);
        }
      } catch (err) {
        console.error("Failed to sync activity logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleUpdate = async (dateKey: string, newType: string) => {
    // Optimistic UI update
    setLogs(prev => ({ ...prev, [dateKey]: newType }));

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateKey, type: newType })
      });
    } catch (err) {
      console.error("Critical sync failure", err);
    }
  };

  const getNextStatus = (current: string | undefined) => {
    if (!current) return 'Gym';
    if (current === 'Gym') return 'Rest';
    if (current === 'Rest') return 'Skipped';
    return 'Gym';
  };

  const statusColors: any = {
    'Gym': 'bg-green-500/20 border-green-500/40 text-green-500 shadow-sm shadow-green-500/20',
    'Rest': 'bg-blue-500/20 border-blue-500/40 text-blue-500 shadow-sm shadow-blue-500/20',
    'Skipped': 'bg-red-500/20 border-red-500/40 text-red-500 shadow-sm shadow-red-500/20'
  };

  return (
    <div className="glass-panel">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white m-0 tracking-tight">Activity Log History</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Rolling 28-Day Performance Matrix</p>
        </div>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-tighter">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span> Gym</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></span> Rest</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span> Skip</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 animate-pulse">
          {days.map(d => <div key={d} className="aspect-square rounded-lg bg-slate-800 border border-slate-700"></div>)}
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap max-w-full">
          {days.map((dateKey) => {
            const status = logs[dateKey];
            const colorClass = statusColors[status] || 'bg-slate-900 border-slate-800 text-slate-700 hover:border-slate-700 hover:bg-slate-800 shadow-inner';
            
            return (
              <button
                key={dateKey}
                title={dateKey}
                onClick={() => handleUpdate(dateKey, getNextStatus(status))}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center transition-all duration-300 relative group active:scale-90 ${colorClass}`}
              >
                {!status && <CircleDashed className="w-4 h-4 opacity-10 group-hover:opacity-30" />}
                {status === 'Gym' && <Check className="w-5 h-5 stroke-[3]" />}
                {status === 'Skipped' && <X className="w-5 h-5 stroke-[3]" />}
                {status === 'Rest' && <span className="text-[10px] font-black">R</span>}
                
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold whitespace-nowrap border border-slate-700 z-50">
                  {dateKey}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
