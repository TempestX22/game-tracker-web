'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Suggestion = {
  id: number;
  name: string;
  released?: string;
};

export default function SearchBar() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const debounce = setTimeout(async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const data = await resp.json();
        setSuggestions((data.games || []).slice(0, 6).map((game: any) => ({ id: game.id, name: game.name, released: game.released })));
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounce);
  }, [value]);

  return (
    <div className="relative text-sm">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search games..."
        className="w-64 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-white outline-none transition-all focus:w-80 focus:border-blue-400"
      />
      {loading && <div className="absolute right-2 top-2 text-xs text-blue-300">Loading…</div>}
      {suggestions.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-black/90 p-1 shadow-lg">
          {suggestions.map((game) => (
            <li
              key={game.id}
              className="cursor-pointer rounded-lg px-2 py-2 hover:bg-white/10"
              onClick={() => {
                router.push(`/game/${game.id}`);
                setValue('');
                setSuggestions([]);
              }}
            >
              <span className="font-semibold">{game.name}</span>
              <span className="ml-2 text-xs text-gray-300">{game.released || 'TBD'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
