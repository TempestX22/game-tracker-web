'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import { RawgGameDetails, UserGameStatus } from '../../types';
import { supabaseClient } from '../../../lib/supabaseClient';

export default function GameDetailPage () {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [game, setGame] = useState<RawgGameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<UserGameStatus>('backlog');
  const [platform, setPlatform] = useState('');
  const [score, setScore] = useState(80);
  const [review, setReview] = useState('');
  const [completion, setCompletion] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/game?id=${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Game API ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        const apiGame = data.game;
        setGame({
          ...apiGame,
          screenshots: data.screenshots,
          description: apiGame.description || apiGame.description_raw || '',
        });
      })
      .catch((error) => {
        setErrorMessage(`Game fetch failed: ${error}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const statusBadge = useMemo(() => ({ playing: 'text-emerald-200', completed: 'text-blue-200', dropped: 'text-rose-200', backlog: 'text-gray-300' }[status]), [status]);

  async function saveProgress() {
    if (!game) return;
    const { error } = await supabaseClient.from('games').upsert({ id: game.id, title: game.name, cover_image: game.background_image || '' }).select();
    if (error) {
      console.error(error);
      setSavedMessage('Failed to save game metadata.');
      return;
    }
    const { error: gameError } = await supabaseClient.from('user_games').upsert({ game_id: game.id, status, platform_played: platform, completion_date: completion }).select();
    if (gameError) {
      console.error(gameError);
      setSavedMessage('Failed to save game status.');
      return;
    }

    if (review) {
      await supabaseClient.from('reviews').insert([{ game_id: game.id, score, review_text: review }]);
    }

    setSavedMessage('Saved to library!');
  }

  if (loading) {
    return <div className="h-screen bg-black text-white">Loading…</div>;
  }

  if (errorMessage) {
    return <div className="h-screen bg-black text-white">Error: {errorMessage}</div>;
  }

  if (!game) {
    return <div className="h-screen bg-black text-white">Game not found.</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <button onClick={() => router.back()} className="mb-4 text-sm text-blue-300 hover:text-blue-100">← Back</button>
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div>
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <p className="text-sm opacity-75">Released: {game.released || 'TBD'}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-4">
              {game.background_image && <Image src={game.background_image} alt={game.name} width={900} height={500} className="w-full rounded-xl object-cover" />}
              {game.screenshots?.length ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {game.screenshots.slice(0, 4).map((ss) => (
                    <Image key={ss.id} src={ss.image} alt={`Screenshot ${ss.id}`} width={300} height={180} className="h-36 w-full rounded-lg object-cover" />
                  ))}
                </div>
              ) : null}
            </div>
            <div className="prose prose-invert mt-6 max-w-none text-sm leading-relaxed">{game.description || 'No description available'}</div>
            <div className="mt-4 text-sm text-gray-300">
              Platforms: {game.platforms?.map((p) => p.platform.name).join(', ') || 'Unknown'}
            </div>
            <div className="mt-1 text-sm text-gray-300">Genres: {game.genres?.map((g) => g.name).join(', ') || 'Unknown'}</div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <h2 className="text-xl font-bold">Track this game</h2>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <label>Status</label>
                <select className="rounded-lg bg-black/80 p-2" value={status} onChange={(e) => setStatus(e.target.value as UserGameStatus)}>
                  <option value="playing">Playing</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                  <option value="backlog">Backlog</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-2">
                <label>Platform</label>
                <input value={platform} placeholder="e.g. PC" onChange={(e) => setPlatform(e.target.value)} className="w-32 rounded-lg bg-black/80 p-2" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <label>Completion Date</label>
                <input type="date" value={completion} onChange={(e) => setCompletion(e.target.value)} className="w-40 rounded-lg bg-black/80 p-2" />
              </div>
              <div className="space-y-1">
                <label>Score: {score}</label>
                <input type="range" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label>Review</label>
                <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={4} className="mt-1 w-full rounded-lg bg-black/80 p-2 text-sm" placeholder="Share your thoughts..."></textarea>
              </div>
              <button onClick={saveProgress} className="w-full rounded-xl bg-red-900 px-4 py-2 font-bold hover:bg-red-700">Save</button>
              {savedMessage && <p className="text-xs text-green-300">{savedMessage}</p>}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
