'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DietSelector({ currentDiet }: { currentDiet: string | null }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDietChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDiet = e.target.value;
    setLoading(true);
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dietType: newDiet })
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 className="w-4 h-4 animate-spin text-orange-500" />}
      <select 
        value={currentDiet || 'Standard'} 
        onChange={handleDietChange}
        disabled={loading}
        className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
      >
        <option value="Non-Veg">Non-Veg</option>
        <option value="Veg">Veg</option>
        <option value="Eggetarian">Eggetarian</option>
        <option value="Non Veg + Veg">Non Veg + Veg</option>
      </select>
    </div>
  );
}
