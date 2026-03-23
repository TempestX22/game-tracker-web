'use client';
import Image from 'next/image';
import { RawgGame } from '../types';
import { useRouter } from 'next/navigation';

export default function GameCard({ game }: { game: RawgGame }) {
  const router = useRouter();
  return (
    <article className="group relative transform rounded-2xl border border-white/15 bg-black/50 p-3 transition hover:-translate-y-1 hover:shadow-xl">
      <button onClick={() => router.push(`/game/${game.id}`)} className="absolute inset-0 z-10" aria-label={`Open ${game.name}`} />
      <div className="relative h-40 overflow-hidden rounded-xl bg-slate-800">
        {game.background_image ? (
          <Image src={game.background_image} alt={game.name} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-slate-700" />
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold text-white">{game.name}</h3>
      <p className="text-sm text-gray-300">{game.released || 'Unreleased'}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-blue-300">
        {game.genres?.slice(0, 3).map((g) => (
          <span key={g.id} className="rounded-full bg-blue-900/40 px-2 py-1">{g.name}</span>
        ))}
      </div>
    </article>
  );
}
