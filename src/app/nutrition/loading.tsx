import { Loader2 } from 'lucide-react';

export default function LoadingNutrition() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm text-center max-w-md w-full">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Synthesizing Meal Plan</h2>
        <p className="text-slate-500 font-medium">Please wait while our AI model perfectly balances your macros and calibrates diet-specific recipes...</p>
      </div>
    </div>
  );
}
