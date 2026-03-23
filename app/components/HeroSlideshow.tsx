'use client';
import Image from 'next/image';
import { useState } from 'react';
import { RawgGame } from '../types';
import { useRouter } from 'next/navigation';

type Props = { games: RawgGame[] };

export default function HeroSlideshow({ games }: Props) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-white">Upcoming Games</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {games.map((game, idx) => (
          <button
            key={game.id}
            onClick={() => router.push(`/game/${game.id}`)}
            className={`relative min-w-[240px] shrink-0 rounded-2xl border border-white/15 bg-black/40 p-2 transition hover:scale-[1.01] ${idx === activeIndex ? 'ring-2 ring-blue-500' : ''}`}
            onMouseEnter={() => setActiveIndex(idx)}
          >
            {game.background_image ? (
              <Image src={game.background_image} alt={game.name} width={380} height={210} className="h-40 w-full rounded-xl object-cover" />
            ) : (
              <div className="h-40 w-full rounded-xl bg-slate-700" />
            )}
            <div className="mt-2 space-y-1">
              <p className="font-bold text-white">{game.name}</p>
              <p className="text-xs text-gray-300">{game.released || 'TBA'}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
