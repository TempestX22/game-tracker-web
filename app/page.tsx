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

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/upcoming');
        if (!res.ok) {
          const errText = await res.text();
          console.error('Upcoming API error:', res.status, errText);
          return;
        }
        const payload = await res.json();
        setFeatured(payload.games || []);
      } catch (error) {
        console.error('Upcoming fetch failed:', error);
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
