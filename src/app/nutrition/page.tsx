import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { generateNutritionPlan } from '@/lib/content';
import { ArrowLeft, Flame, Scale, CheckCircle2, Ban } from 'lucide-react';
import Link from 'next/link';
import NutritionSuggestionBox from '@/components/NutritionSuggestionBox';
import DietSelector from '@/components/DietSelector';

export default async function NutritionPage() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    redirect('/login');
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId as string },
  });

  if (!profile) {
    redirect('/onboarding');
  }

  const plan = await generateNutritionPlan(profile);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Nav Header */}
        <header className="flex items-center justify-between glass-panel p-4 rounded-2xl">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-200 font-medium flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
          <DietSelector currentDiet={profile.dietType} />
        </header>

        {/* Title Block */}
        <div className="glass-panel rounded-3xl p-8 text-center">
          <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Master Nutrition Plan</h1>
          <p className="text-slate-400 text-lg">Precisely targeted for <span className="font-bold text-white">{profile.dailyCalories} kcal</span> daily.</p>
          
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
            <div className="bg-blue-950/30 border border-blue-900/30 rounded-xl p-4">
              <span className="text-xs font-bold text-blue-500 block tracking-widest mb-1">PROTEIN</span>
              <span className="text-2xl font-black text-white">{plan.macros.protein}</span>
            </div>
            <div className="bg-orange-950/30 border border-orange-900/30 rounded-xl p-4">
              <span className="text-xs font-bold text-orange-500 block tracking-widest mb-1">CARBS</span>
              <span className="text-2xl font-black text-white">{plan.macros.carbs}</span>
            </div>
            <div className="bg-yellow-950/30 border border-yellow-900/30 rounded-xl p-4">
              <span className="text-xs font-bold text-yellow-500 block tracking-widest mb-1">FATS</span>
              <span className="text-2xl font-black text-white">{plan.macros.fats}</span>
            </div>
          </div>
        </div>

        {/* Recipe Structure */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Scale className="text-blue-500" /> Daily Meal Structure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.meals.map((meal: { name: string, recipe: string, approx: number }, idx: number) => (
              <div key={idx} className="glass-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-white font-bold text-6xl italic group-hover:scale-110 transition-transform">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-black text-blue-500 uppercase tracking-widest mb-1">{meal.name}</h3>
                <h4 className="text-xl font-medium text-slate-200 mb-4 pr-12">{meal.recipe}</h4>
                <div className="flex justify-between items-center bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-800">
                  <span className="text-sm font-medium text-slate-500">Approximate Load:</span>
                  <span className="text-lg font-bold text-orange-500">{meal.approx} kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Do's and Dont's */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="glass-panel border-green-900/30 bg-green-900/5">
            <h3 className="text-lg font-bold text-green-500 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Approved Staples
            </h3>
            <ul className="space-y-3">
              {plan.toEat.map((item: string) => (
                <li key={item} className="flex items-center gap-2 text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm shadow-green-500/50" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel border-red-900/30 bg-red-900/5">
            <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5" /> Strictly Disallowed
            </h3>
            <ul className="space-y-3">
              {plan.toAvoid.map((item: string) => (
                <li key={item} className="flex items-center gap-2 text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-sm shadow-red-500/50" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Suggestion Box */}
        <NutritionSuggestionBox dietType={profile.dietType ?? 'Standard'} />

      </div>
    </div>
  );
}
