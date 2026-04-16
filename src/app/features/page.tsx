'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Clock, Droplets, ArrowRightLeft, Target, Calculator } from 'lucide-react';

const macroDB = {
  'Chicken Breast': { protein: 31, fat: 3.6, carbs: 0 },
  'Paneer': { protein: 18, fat: 20, carbs: 1.2 },
  'Tofu': { protein: 15, fat: 8.7, carbs: 1.9 },
  'Salmon': { protein: 20, fat: 13, carbs: 0 },
  'Lentils (Cooked)': { protein: 9, fat: 0.4, carbs: 20 },
  'Whey Protein': { protein: 75, fat: 3, carbs: 5 }
};

type FoodItem = keyof typeof macroDB;

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('macroswap');

  // 1RM Predictor State
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(5);
  const [rpe, setRpe] = useState(8);
  const [predicted1rm, setPredicted1rm] = useState<number | null>(null);

  const calculate1RM = () => {
    const repsInReserve = 10 - rpe;
    const estimatedTotalReps = Number(reps) + repsInReserve;
    const epley1RM = Number(weight) * (1 + (estimatedTotalReps / 30));
    setPredicted1rm(Math.round(epley1RM * 10) / 10);
  };

  // Macro Swapper State
  const [swapFrom, setSwapFrom] = useState<FoodItem>('Chicken Breast');
  const [swapTo, setSwapTo] = useState<FoodItem>('Paneer');
  const [swapWeight, setSwapWeight] = useState(200);

  // Macro Calculations
  const targetProtein = (swapWeight / 100) * macroDB[swapFrom].protein;
  const newWeight = Math.round((targetProtein / macroDB[swapTo].protein) * 100);
  
  const fatDiff = Math.round(((newWeight / 100) * macroDB[swapTo].fat) - ((swapWeight / 100) * macroDB[swapFrom].fat));
  const carbDiff = Math.round(((newWeight / 100) * macroDB[swapTo].carbs) - ((swapWeight / 100) * macroDB[swapFrom].carbs));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
          <div className="text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Pro Features Suite
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-1/3 flex flex-col gap-3">
            {[
              { id: 'macroswap', name: 'Macro Swapper', icon: <ArrowRightLeft className="w-5 h-5"/>, desc: 'Isocaloric exchange.' },
              { id: '1rm', name: 'True 1RM Predictor', icon: <Target className="w-5 h-5"/>, desc: 'Advanced velocity metrics.' },
              { id: 'supplement', name: 'Supplement Timer', icon: <Clock className="w-5 h-5"/>, desc: 'Optimize absorption.' },
              { id: 'hydration', name: 'Sweat Rate Lab', icon: <Droplets className="w-5 h-5"/>, desc: 'Precise hydration calc.' },
            ].map((tab: any) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white border-purple-200 shadow-md transform scale-105 z-10' 
                  : 'bg-slate-100 border-slate-200 shadow-sm text-slate-500 hover:bg-white'
                }`}
              >
                <div className={`flex items-center gap-3 mb-1 ${activeTab === tab.id ? 'text-purple-600' : 'text-slate-700'}`}>
                  {tab.icon} <span className="font-bold">{tab.name}</span>
                </div>
                <p className="text-sm pl-8">{tab.desc}</p>
              </button>
            ))}
          </div>

          {/* Main Display Area */}
          <div className="w-full md:w-2/3 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[500px] flex flex-col">
            
            {activeTab === 'supplement' && (
              <div className="flex-1 animate-in fade-in">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Cellular Absorption Schedule</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bottom-0 w-2 bg-yellow-400"></div>
                    <h3 className="font-bold text-slate-800">Pre-Workout (08:00 AM)</h3>
                    <p className="text-sm text-slate-500">Citrulline Malate (6g), Caffeine (200mg) - Take 45 mins before training for peak vasodilation.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bottom-0 w-2 bg-blue-500"></div>
                    <h3 className="font-bold text-slate-800">Intra-Workout (09:15 AM)</h3>
                    <p className="text-sm text-slate-500">EAAs (10g), Highly Branched Cyclic Dextrin (25g) - Maintain plasma amino levels.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bottom-0 w-2 bg-green-500"></div>
                    <h3 className="font-bold text-slate-800">Post-Workout (10:00 AM)</h3>
                    <p className="text-sm text-slate-500">Whey Isolate (30g), Creatine Monohydrate (5g) - Immediate cellular replenishment.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hydration' && (
              <div className="flex-1 animate-in fade-in flex flex-col justify-center gap-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Sweat Rate Lab</h2>
                <p className="text-slate-500 mb-4">Input pre and post-workout weights (naked) to calculate your exact fluid loss per hour.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-2">Pre-Workout Weight (kg)</label>
                    <input type="number" defaultValue="75.0" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-2">Post-Workout Weight (kg)</label>
                    <input type="number" defaultValue="74.2" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex items-center justify-between mt-4">
                  <div>
                    <h4 className="font-bold text-blue-900">Fluid required per hour:</h4>
                    <p className="text-sm text-blue-700">+1.2 Liters + 500mg Sodium</p>
                  </div>
                  <Droplets className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            )}

            {activeTab === 'macroswap' && (
              <div className="flex-1 animate-in fade-in">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Macro Swapper</h2>
                <p className="text-slate-500 mb-6">Select your foods to calculate the precise ratio for matching protein targets, and watch out for fat/carb spillover.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 items-end">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Swap From (Weight in g)</label>
                    <input 
                      type="number" 
                      value={swapWeight} 
                      onChange={(e) => setSwapWeight(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <select 
                      value={swapFrom} 
                      onChange={(e) => setSwapFrom(e.target.value as FoodItem)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      {Object.keys(macroDB).map((item: string) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="bg-slate-100 p-2 rounded-full text-slate-400">
                    <ArrowRightLeft className="w-6 h-6 transform rotate-90 sm:rotate-0" />
                  </div>
                </div>

                <div className="mb-8">
                   <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Swap To (Matches Protein)</label>
                   <select 
                      value={swapTo} 
                      onChange={(e) => setSwapTo(e.target.value as FoodItem)}
                      className="w-full p-3 bg-purple-50 border border-purple-200 rounded-xl font-bold text-purple-800"
                    >
                      {Object.keys(macroDB).map((item: string) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <div className="bg-purple-600 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between mb-4 shadow-lg shadow-purple-500/20">
                  <div>
                    <h4 className="text-purple-200 font-bold text-sm uppercase tracking-wider mb-1">Required Amount</h4>
                    <p className="text-sm">To hit exactly {Math.round(targetProtein)}g of protein</p>
                  </div>
                  <div className="text-4xl font-black">{newWeight} g</div>
                </div>

                {(fatDiff !== 0 || carbDiff !== 0) && (
                  <div className={`p-4 rounded-xl text-sm ${fatDiff > 0 || carbDiff > 0 ? 'bg-orange-50 border border-orange-200 text-orange-800' : 'bg-green-50 border border-green-200 text-green-800'}`}>
                    <strong>Macro Shift Analysis:</strong> This trade will result in 
                    {fatDiff > 0 ? ` +${fatDiff}g Fat` : fatDiff < 0 ? ` ${fatDiff}g Fat` : ''} 
                    {carbDiff > 0 ? ` +${carbDiff}g Carbs` : carbDiff < 0 ? ` ${carbDiff}g Carbs` : ''}.
                    Please adjust the rest of your daily intake accordingly.
                  </div>
                )}
              </div>
            )}

            {activeTab === '1rm' && (
              <div className="flex-1 animate-in fade-in flex flex-col justify-center text-center">
                <Target className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-slate-900 mb-2">True 1RM Predictor</h2>
                <p className="text-slate-500 max-w-lg mx-auto mb-8 text-sm">Input the weight, reps performed, and RPE (Rate of Perceived Exertion) to calculate your absolute neuromuscular peak.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto w-full">
                  <div className="text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                    />
                  </div>
                  <div className="text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Reps</label>
                    <input 
                      type="number" 
                      value={reps} 
                      onChange={(e) => setReps(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                    />
                  </div>
                  <div className="text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">RPE (1-10)</label>
                    <input 
                      type="number" 
                      min="1" max="10" 
                      value={rpe} 
                      onChange={(e) => setRpe(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                    />
                  </div>
                </div>

                {predicted1rm && (
                  <div className="mb-6 animate-in zoom-in duration-300">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Predicted 1 Rep Max</h3>
                    <div className="text-5xl font-black text-rose-600 mt-2">{predicted1rm} kg</div>
                  </div>
                )}

                <div className="inline-block mx-auto">
                  <button 
                    onClick={calculate1RM}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 w-full"
                  >
                    <Calculator className="w-5 h-5"/> Calculate 1RM Limit
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
