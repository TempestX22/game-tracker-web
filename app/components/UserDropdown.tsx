'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function UserDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 rounded-full bg-gradient-to-br from-red-900 via-black to-blue-900 text-white shadow-lg"
        aria-label="User menu"
      >
        <span className="block h-full w-full rounded-full bg-black/40" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-black/90 p-2 text-sm text-white shadow-xl backdrop-blur">
          <Link href="/library" className="block rounded-lg px-3 py-2 hover:bg-white/10">My Library</Link>
          <Link href="/reviewed" className="block rounded-lg px-3 py-2 hover:bg-white/10">Reviewed</Link>
        </div>
      )}
    </div>
  );
}
