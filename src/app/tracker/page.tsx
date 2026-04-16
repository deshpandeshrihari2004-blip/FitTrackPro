'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Droplets, Moon, Brain, Save, List, CheckCircle, BarChart2 } from 'lucide-react';
import TrackerWidget from '@/components/TrackerWidget';
import { logDailyActivity, getTrackerStats } from '@/lib/actions/trackerActions';

export default function TrackerPage() {
  const [water, setWater] = useState(4);
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(5);
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<{ date: string, text: string }[]>([]);
  const [stats, setStats] = useState({ gymDays: 0, restDays: 0, totalWorkouts: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const past = localStorage.getItem('fittrack_notes');
    if (past) {
      setSavedNotes(JSON.parse(past));
    }
    
    // Load DB stats
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const dbStats = await getTrackerStats();
      setStats(dbStats);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const handleLogActivity = async (type: 'Gym' | 'Rest') => {
    setLoading(true);
    try {
      await logDailyActivity(type);
      await fetchStats();
      alert(`Success! Logged ${type} day for today.`);
    } catch (err: any) {
      alert(err.message || "Failed to log activity");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMetrics = () => {
    if (note.trim()) {
      const newEntry = { date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: note };
      const updated = [newEntry, ...savedNotes].slice(0, 5); // Keep last 5
      setSavedNotes(updated);
      localStorage.setItem('fittrack_notes', JSON.stringify(updated));
      setNote('');
    }
    alert('Metrics Saved Successfully!');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 text-slate-100">
        
        <header className="flex items-center justify-between glass-panel p-4 rounded-2xl">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-200 font-medium flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
          <div className="text-blue-400 font-bold bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Daily Tracker
          </div>
        </header>

        {/* Legacy Feature: Quick Log Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button 
            onClick={() => handleLogActivity('Gym')}
            disabled={loading}
            className="glass-panel flex flex-col items-center justify-center gap-4 py-10 hover:bg-green-500/10 transition-all group disabled:opacity-50"
            style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            <div className="bg-green-500/20 p-4 rounded-full group-hover:scale-110 transition-transform">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-white">Log Gym Day</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Consistency is key</span>
            </div>
          </button>
          
          <button 
            onClick={() => handleLogActivity('Rest')}
            disabled={loading}
            className="glass-panel flex flex-col items-center justify-center gap-4 py-10 hover:bg-blue-500/10 transition-all group disabled:opacity-50"
            style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
          >
            <div className="bg-blue-500/20 p-4 rounded-full group-hover:scale-110 transition-transform">
              <Moon className="w-10 h-10 text-blue-500" />
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-white">Log Rest Day</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Recovery matters</span>
            </div>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="flex items-center gap-3 mb-8">
            <BarChart2 className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white m-0">Performance Overview</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="text-4xl font-black text-green-500 mb-1">{stats.gymDays}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Days Attended</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="text-4xl font-black text-blue-500 mb-1">{stats.restDays}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rest Days</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="text-4xl font-black text-purple-500 mb-1">{stats.totalWorkouts}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Sprints</div>
            </div>
          </div>
        </div>

        <TrackerWidget />

        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Daily Biological Metrics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="glass-panel flex flex-col gap-4">
              <div className="flex justify-between items-center text-blue-400">
                <span className="font-bold flex items-center gap-2"><Droplets className="w-5 h-5" /> Hydration</span>
                <span className="text-xl font-bold">{water} L</span>
              </div>
              <input type="range" min="1" max="8" step="0.5" value={water} onChange={(e) => setWater(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>

            <div className="glass-panel flex flex-col gap-4">
              <div className="flex justify-between items-center text-indigo-400">
                <span className="font-bold flex items-center gap-2"><Moon className="w-5 h-5" /> Sleep</span>
                <span className="text-xl font-bold">{sleep} Hrs</span>
              </div>
              <input type="range" min="3" max="12" step="0.5" value={sleep} onChange={(e) => setSleep(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>

            <div className="glass-panel flex flex-col gap-4 sm:col-span-2">
              <div className="flex justify-between items-center text-rose-400">
                <span className="font-bold flex items-center gap-2"><Brain className="w-5 h-5" /> Stress Index</span>
                <span className="text-xl font-bold text-slate-100">{stress}/10</span>
              </div>
              <input type="range" min="1" max="10" step="1" value={stress} onChange={(e) => setStress(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
            </div>

            <div className="glass-panel sm:col-span-2">
              <label className="font-bold text-slate-400 block mb-3 uppercase text-xs tracking-widest">Performance Journal</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Log your mood, recovery nodes, or injury alerts..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 min-h-[100px]"
              />
              <div className="mt-4 flex justify-end">
                <button onClick={handleSaveMetrics} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                  <Save className="w-4 h-4" /> Commit Metrics
                </button>
              </div>

              {savedNotes.length > 0 && (
                <div className="mt-8 border-t border-slate-800 pt-6">
                  <h3 className="font-bold text-slate-400 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><List className="w-4 h-4"/> Archive</h3>
                  <div className="space-y-3">
                    {savedNotes.map((n: { date: string, text: string }, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:bg-slate-900/50 transition-colors">
                        <span className="text-[10px] font-bold text-blue-500 mb-1 block uppercase">{n.date}</span>
                        <p className="text-slate-300 text-sm italic">"{n.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
