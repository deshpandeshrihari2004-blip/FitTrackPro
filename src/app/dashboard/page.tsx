import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Dumbbell, Activity, Utensils, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import AIRecommendationBox from '@/components/AIRecommendationBox';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    redirect('/login');
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId as string },
    include: { user: true }
  });

  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Ribbon */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass-panel rounded-3xl p-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Welcome, {profile.user.name?.split(' ')[0] || 'Athlete'}!</h1>
            <p className="text-slate-400 text-lg">Goal Focus: <span className="text-blue-400 font-semibold">{profile.goal}</span> • Level: <span className="text-slate-400 font-medium">{profile.fitnessLevel}</span></p>
          </div>
          <LogoutButton />
        </header>

        {/* AI Insight Section */}
        <AIRecommendationBox profile={profile} />

        <h2 className="text-2xl font-bold text-slate-100 pt-4">Your Dashboard Hub</h2>
        
        {/* Main Hub Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Tracker Card */}
          <Link href="/tracker" className="glass-panel group flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <Activity className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Daily Tracker</h3>
              <p className="text-sm text-slate-400">Log hydration, sleep, stress, and your daily performance metrics.</p>
            </div>
            <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
              Launch Tracker <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Routine Card */}
          <Link href="/routine" className="glass-panel group flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <Dumbbell className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Workout Routine</h3>
              <p className="text-sm text-slate-400">Detailed plans, rest timers, and exercise modifications.</p>
            </div>
            <div className="mt-6 flex items-center text-orange-600 font-medium group-hover:gap-2 transition-all">
              View Routine <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Nutrition Card */}
          <Link href="/nutrition" className="glass-panel group flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <Utensils className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nutrition Plan</h3>
              <p className="text-sm text-slate-400">Your {profile.dailyCalories} kcal master diet with dynamic controls.</p>
            </div>
            <div className="mt-6 flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
              Manage Diet <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Features Card */}
          <Link href="/features" className="glass-panel group flex flex-col justify-between hover:-translate-y-1 transition-transform relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">NEW</div>
            <div>
              <Zap className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Pro Features</h3>
              <p className="text-sm text-slate-400">AI Form Check, Supplement Timing, 1RM Predictor & more.</p>
            </div>
            <div className="mt-6 flex items-center text-purple-600 font-medium group-hover:gap-2 transition-all">
              Explore Tools <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
