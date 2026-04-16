'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: '',
    weight: '',
    height: '',
    bodyFat: '',
    goal: 'Weight Loss',
    dietType: 'Non-Veg',
  });
  const [result, setResult] = useState<{ fitnessLevel: string, dailyCalories: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: formData.gender,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: formData.height ? parseFloat(formData.height) : undefined,
          bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
          goal: formData.goal,
          dietType: formData.dietType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      const { profile } = await res.json();
      setResult({
        fitnessLevel: profile.fitnessLevel,
        dailyCalories: profile.dailyCalories
      });
      setStep(4); // Show ML results before redirecting
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-lg glass-card relative overflow-hidden bg-white border-slate-200 shadow-sm">
        
        {/* Step Indicator */}
        <div className="flex gap-2 justify-center mb-8">
          {[1, 2, 3, 4].map((i: number) => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition-colors ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Basic Info</h1>
            <p className="text-slate-500 mb-6">Let's calculate your personalized body metrics.</p>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <div className="flex gap-4">
                  {['Male', 'Female'].map((g: string) => (
                    <button
                      key={g}
                      onClick={() => setFormData({...formData, gender: g})}
                      className={`flex-1 py-3 rounded-xl border font-bold transition-all ${formData.gender === g ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Age (years)</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="glass-input bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl" 
                  placeholder="25" min="15" max="100" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                  className="glass-input bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl" 
                  placeholder="70" min="30" max="250" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Height (cm) <span className="text-slate-400 font-normal italic">- Optional</span></label>
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={e => setFormData({...formData, height: e.target.value})}
                  className="glass-input bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl" 
                  placeholder="175" min="100" max="250" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Body Fat % <span className="text-slate-400 font-normal italic">- Optional</span></label>
                <input 
                  type="number" 
                  value={formData.bodyFat}
                  onChange={e => setFormData({...formData, bodyFat: e.target.value})}
                  className="glass-input bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl" 
                  placeholder="15" min="3" max="60" step="0.1" 
                />
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!formData.age || !formData.weight}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Diet Preference</h1>
            <p className="text-slate-500 mb-6">This helps us curate your nutrition module.</p>
            
            <div className="flex flex-col gap-4">
              {['Non-Veg', 'Veg', 'Eggetarian', 'Non Veg + Veg'].map((diet: string) => (
                <button
                  key={diet}
                  onClick={() => setFormData({...formData, dietType: diet})}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.dietType === diet 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{diet}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex-1 flex justify-center items-center gap-2"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Goal</h1>
            <p className="text-slate-500 mb-6">What are you hoping to achieve?</p>
            
            <div className="flex flex-col gap-4">
              {['Weight Loss', 'Maintenance', 'Muscle Gain'].map((goal: string) => (
                <button
                  key={goal}
                  onClick={() => setFormData({...formData, goal})}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.goal === goal 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{goal}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex-1 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Generate Plan'}
                {!loading && <Activity className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6 text-green-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Generated!</h1>
            <p className="text-slate-500 mb-8 max-w-sm">Our AI logic has processed your body metrics and selected your parameters.</p>
            
            <div className="w-full grid gap-4 mb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Fitness Level</span>
                <span className="text-xl font-bold text-blue-600">{result.fitnessLevel}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Daily Calorie Target</span>
                <span className="text-xl font-bold text-green-600">{result.dailyCalories} kcal</span>
              </div>
            </div>

            <button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700 w-full text-white px-6 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
              Enter Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
