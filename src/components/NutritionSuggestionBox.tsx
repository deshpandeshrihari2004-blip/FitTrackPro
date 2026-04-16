'use client';

import { useState } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';

export default function NutritionSuggestionBox({ dietType }: { dietType: string }) {
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/nutrition/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, dietType }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('Failed to fetch suggestion', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card mt-8 !border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="text-blue-600 w-6 h-6" />
        <h3 className="text-xl font-bold text-slate-900">Ask AI Nutritionist</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. I want a sweet snack"
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>

      {suggestion && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed font-medium">
          {suggestion}
        </div>
      )}
    </div>
  );
}
