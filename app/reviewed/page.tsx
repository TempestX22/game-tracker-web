'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getReviews } from '../../lib/supabaseClient';

export default function ReviewedPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreMin, setScoreMin] = useState(0);
  const [scoreMax, setScoreMax] = useState(100);

  useEffect(() => {
    async function load() {
      const data = await getReviews({ minScore: scoreMin, maxScore: scoreMax });
      setReviews(data || []);
      setLoading(false);
    }
    load();
  }, [scoreMin, scoreMax]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">Reviewed</h1>
        <p className="mb-6 text-gray-300">Score and review record.</p>

        <div className="mb-6 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm">
            Min score
            <input type="number" min={0} max={scoreMax} value={scoreMin} onChange={(e) => setScoreMin(Number(e.target.value))} className="w-20 rounded-lg bg-black/80 p-2" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            Max score
            <input type="number" min={scoreMin} max={100} value={scoreMax} onChange={(e) => setScoreMax(Number(e.target.value))} className="w-20 rounded-lg bg-black/80 p-2" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p>Loading...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <h2 className="font-semibold">{review.games?.title || 'Unknown'}</h2>
                <p className="text-sm text-gray-300">Score: {review.score}/100</p>
                <p className="mt-2 text-sm text-gray-200">{review.review_text}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
