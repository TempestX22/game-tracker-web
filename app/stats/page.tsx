'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getStats } from '../../lib/supabaseClient';

export default function StatsPage() {
  const [stats, setStats] = useState({ averageScore: 0, totalCompleted: 0, mostUsedPlatform: 'N/A' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = await getStats();
      setStats(s);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">Stats</h1>
        <p className="text-gray-300">Quick summary of your gaming stats.</p>
        {loading ? (
          <p className="mt-6 text-gray-400">Loading stats...</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
              <h2 className="text-sm uppercase text-gray-400">Average Score</h2>
              <p className="mt-2 text-3xl font-bold text-blue-300">{stats.averageScore}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
              <h2 className="text-sm uppercase text-gray-400">Completed Games</h2>
              <p className="mt-2 text-3xl font-bold text-red-300">{stats.totalCompleted}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
              <h2 className="text-sm uppercase text-gray-400">Top Platform</h2>
              <p className="mt-2 text-3xl font-bold text-green-300">{stats.mostUsedPlatform}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
