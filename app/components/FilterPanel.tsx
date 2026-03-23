'use client';

export default function FilterPanel() {
  return (
    <aside className="rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-white">
      <h3 className="mb-3 text-base font-semibold">Filters</h3>
      <div className="grid gap-3">
        <label className="flex flex-col gap-1">Genre<select className="rounded-lg bg-black/70 p-2"></select></label>
        <label className="flex flex-col gap-1">Platform<select className="rounded-lg bg-black/70 p-2"></select></label>
        <label className="flex flex-col gap-1">Status<select className="rounded-lg bg-black/70 p-2"><option>All</option><option>Playing</option><option>Completed</option><option>Backlog</option><option>Dropped</option></select></label>
      </div>
    </aside>
  );
}
