import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { generateWorkoutPlan } from '@/lib/content';
import { ArrowLeft, Dumbbell, PlayCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RoutinePage({ searchParams }: { searchParams: Promise<{ type?: string }> | { type?: string } }) {
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

  const parsedParams = await Promise.resolve(searchParams);
  const workoutType = parsedParams?.type || 'Gym';
  const plan = await generateWorkoutPlan(profile, workoutType);
  const types = ['Gym', 'Home Workout', 'Cardio Only', 'Calisthenics'];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass-panel p-4 rounded-2xl gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-200 font-medium flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
          
          <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl overflow-x-auto max-w-full border border-slate-800">
            {types.map((t: string) => (
              <Link 
                key={t}
                href={`/routine?type=${encodeURIComponent(t)}`} 
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${workoutType === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
              >
                {t}
              </Link>
            ))}
          </div>
        </header>

        <div className="glass-panel rounded-3xl p-8 text-center">
          <Dumbbell className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">{workoutType} Masterplan</h1>
          <p className="text-slate-500 text-lg">Goal Focus: <span className="text-orange-600 font-bold">{profile.goal}</span> • Frequency: <span className="text-slate-800 font-medium">{plan.frequency}</span></p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {plan.exercises.map((ex: any, idx: number) => (
            <div key={idx} className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row gap-8">
              {/* Media Section */}
              <div className="w-full md:w-1/3 flex flex-col gap-2">
                <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner">
                  <iframe 
                    src={ex.videoUrls && ex.videoUrls.length > 0 ? ex.videoUrls[0] : ex.videoUrl} 
                    title={`Video for ${ex.name}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {ex.videoUrls && ex.videoUrls.length > 1 && (
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 w-full">Alternate variations:</span>
                    {ex.videoUrls.slice(1).map((v: string, i: number) => (
                      <a key={i} href={v} target="_blank" rel="noreferrer" className="text-xs bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg font-bold transition-colors">
                        Link {i + 2}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Data Section */}
              <div className="w-full md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-orange-500/20 text-orange-500 font-black px-3 py-1 text-sm rounded-lg">0{idx + 1}</span>
                  <h3 className="text-2xl font-bold text-white">{ex.name}</h3>
                </div>
                <p className="text-slate-500 mb-6">{ex.instructions}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Duration</span>
                    <span className="text-lg font-bold text-slate-200">{ex.duration}</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Sets</span>
                    <span className="text-lg font-bold text-slate-200">{ex.sets}</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Reps</span>
                    <span className="text-lg font-bold text-slate-200">{ex.reps}</span>
                  </div>
                  <div className="bg-orange-950/30 border border-orange-900/30 p-4 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-orange-500 block mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Rest</span>
                    <span className="text-lg font-bold text-orange-500">{ex.restDuration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
