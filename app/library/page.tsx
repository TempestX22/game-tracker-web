'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { getLibrary } from '../../lib/supabaseClient';

const statuses = ['all', 'playing', 'completed', 'dropped', 'backlog'];

export default function LibraryPage() {
  const [library, setLibrary] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getLibrary({ status: statusFilter !== 'all' ? statusFilter : undefined, platform: platformFilter || undefined });
      setLibrary(data || []);
      setLoading(false);
    }
    load();
  }, [statusFilter, platformFilter]);

  const platforms = useMemo(() => Array.from(new Set(library.map(item => item.platform_played).filter(Boolean))), [library]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">My Library</h1>
        <p className="mb-6 text-gray-300">All tracked games in one place.</p>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg bg-black/80 p-2 text-sm">
              {statuses.map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>
              ))}
            </select>
            <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="rounded-lg bg-black/80 p-2 text-sm">
              <option value="">All platforms</option>
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-400">Found {library.length} game(s)</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p>Loading...</p>
          ) : library.length === 0 ? (
            <p className="text-gray-400">No games in your library yet.</p>
          ) : (
            library.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <h2 className="font-semibold">{item.games?.title || 'Unknown'}</h2>
                <p className="text-sm text-gray-300">Status: {item.status}</p>
                <p className="text-sm text-gray-300">Platform: {item.platform_played || 'Not set'}</p>
                <p className="text-sm text-gray-300">Completed: {item.completion_date || 'N/A'}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
