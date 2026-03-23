'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import AddGameModal from '../components/AddGameModal';

type Genre = {
  id: number;
  name: string;
};

type Game = {
  id: number;
  name: string;
  background_image: string;
  rating: number;
};

export default function AllGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGenres();
    fetchGames(1, []);
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await fetch('/api/genres');
      if (!res.ok) throw new Error('Failed to fetch genres');
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchGames = async (pageNum: number, genreIds: number[]) => {
    setLoading(true);
    try {
      let url = `/api/games?page=${pageNum}`;
      if (genreIds.length > 0) {
        url += `&genres=${genreIds.join(',')}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch games');
      const data = await res.json();
      
      if (pageNum === 1) {
        setGames(data.games || []);
      } else {
        setGames((prev) => [...prev, ...(data.games || [])]);
      }
      
      setHasMore(data.next !== null);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genreId: number) => {
    const updated = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(updated);
    fetchGames(1, updated);
  };

  const handleLoadMore = () => {
    fetchGames(page + 1, selectedGenres);
  };

  const handleAddGame = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">All Games</h1>

        {/* Genre Filter */}
        <div className="mb-8 rounded-lg border border-white/10 bg-black/50 p-4">
          <h2 className="mb-4 font-semibold">Filter by Genres</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {genres.map((genre) => (
              <label key={genre.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  className="rounded bg-black/80 border border-white/20"
                />
                <span className="text-sm">{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {games.map((game) => (
            <div key={game.id} className="group relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
              {game.background_image && (
                <Image
                  src={game.background_image}
                  alt={game.name}
                  width={300}
                  height={200}
                  className="h-40 w-full object-cover"
                />
              )}
              {!game.background_image && <div className="h-40 w-full bg-slate-700" />}

              {/* Overlay with + button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/60">
                <button
                  onClick={() => handleAddGame(game)}
                  className="opacity-0 transition group-hover:opacity-100 flex items-center justify-center w-12 h-12 rounded-full bg-red-900 text-white text-2xl font-bold hover:bg-red-700"
                >
                  +
                </button>
              </div>

              {/* Game Info */}
              <div className="p-2">
                <p className="text-sm font-semibold truncate">{game.name}</p>
                <p className="text-xs text-gray-400">⭐ {game.rating.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="rounded-lg bg-red-900 px-8 py-3 font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {games.length === 0 && !loading && (
          <div className="text-center text-gray-400">No games found with the selected filters.</div>
        )}
      </div>

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={isModalOpen}
        game={selectedGame}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}