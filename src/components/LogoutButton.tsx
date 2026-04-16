'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-sm font-bold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2 active:scale-95"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
      Logout
    </button>
  );
}
