'use client';
import HexNavButton from './HexNavButton';
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <nav className="flex gap-1">
          <HexNavButton href="/" label="Home" side="first" />
          <HexNavButton href="/all-games" label="All Games" />
          <HexNavButton href="/library" label="Library" />
          <HexNavButton href="/reviewed" label="Reviewed" side="last" />
        </nav>
        <div className="flex items-center gap-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
