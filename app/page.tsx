'use client';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSlideshow from './components/HeroSlideshow';
import ReviewCard from './components/ReviewCard';
import { RawgGame, Review } from './types';
import { getRecentReviews } from '../lib/supabaseClient';

export default function Home() {
  const [featured, setFeatured] = useState<RawgGame[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [upcomingError, setUpcomingError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/upcoming?dates=2019-09-01,2019-09-30&platforms=18,1,7&page_size=20');
        if (!res.ok) {
          const errText = await res.text();
          const cleanMsg = errText && errText.toLowerCase().includes('<html')
            ? 'Unable to load upcoming games (404: not found).'
            : `Upcoming API error ${res.status}: ${errText}`;
          setUpcomingError(cleanMsg);
          console.warn('Upcoming API raw error:', errText);
          return;
        }
        const payload = await res.json();
        setUpcomingError(null);
        setFeatured(payload.games || []);
      } catch (error) {
        setUpcomingError(`Upcoming fetch failed: ${error}`);
      }
    }
    fetchFeatured();

    async function fetchReviews() {
      const recent = await getRecentReviews(3);
      setReviews(recent as Review[]);
    }
    fetchReviews();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <HeroSlideshow games={featured} />
        {upcomingError ? (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {upcomingError}
          </div>
        ) : null}

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-white">Recent Reviews</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.length > 0 ? (
              reviews.map((review) => <ReviewCard key={review.id} review={review as any} />)
            ) : (
              <p className="text-gray-300">No reviews yet — add one from a game page.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
