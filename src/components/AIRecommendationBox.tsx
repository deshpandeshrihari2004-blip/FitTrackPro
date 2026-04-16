'use client';

import React, { useEffect, useState } from 'react';
import { getAIRecommendation } from '@/utils/aiModel';
import { BrainCircuit, Sparkles } from 'lucide-react';

interface AIRecommendationBoxProps {
  profile: any;
}

export default function AIRecommendationBox({ profile }: AIRecommendationBoxProps) {
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      const rec = getAIRecommendation(profile);
      setRecommendation(rec);
    }
  }, [profile]);

  if (!recommendation) return null;

  return (
    <div className="glass-panel relative overflow-hidden group animate-fade-in" style={{ border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.03)' }}>
      {/* Decorative pulse effect */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
      
      <div className="flex items-start gap-4">
        <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-500/20 text-blue-500">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gradient m-0">AI/ML Health Insight</h3>
            <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-tighter">Powered by brain.js</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} className="text-blue-500" /> Workout Focus
              </p>
              <p className="text-slate-200 leading-relaxed font-medium">
                {recommendation.workout}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} className="text-blue-500" /> Nutrition Strategy
              </p>
              <p className="text-slate-200 leading-relaxed font-medium">
                {recommendation.diet}
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-800/50">
            <div className="text-xs">
              <span className="text-slate-500">Suggested Protein: </span>
              <span className="text-blue-400 font-bold">{recommendation.protein}</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-500">Recommended Stacks: </span>
              <span className="text-blue-400 font-bold">{recommendation.vitamins}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
