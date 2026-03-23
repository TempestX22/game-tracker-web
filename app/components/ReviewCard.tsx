'use client';
import { Review } from '../types';

export default function ReviewCard({ review }: { review: Review & { games?: { title: string; cover_image?: string } } }) {
  return (
    <article className="rounded-2xl border border-white/15 bg-black/60 p-4 text-white shadow-lg transition hover:shadow-2xl">
      <div className="flex items-start gap-3">
        {review.games?.cover_image ? (
          <img src={review.games.cover_image} alt={review.games.title} className="h-16 w-16 rounded-xl object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-slate-700" />
        )}
        <div>
          <h4 className="text-base font-semibold">{review.games?.title || 'Unknown Game'}</h4>
          <p className="text-sm text-gray-300">Score: {review.score}/100</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-200">{review.review_text.slice(0, 120)}{review.review_text.length > 120 ? '...' : ''}</p>
      <p className="mt-2 text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
    </article>
  );
}
