import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase env vars are missing; user data functionality will be disabled.');
}

function noopResponse() {
  return { data: [], error: null };
}

const noOp = {
  from: () => ({
    select: async () => noopResponse(),
    insert: async () => noopResponse(),
    upsert: async () => noopResponse(),
    order: () => noOp.from(),
    limit: () => noOp.from(),
  }),
};

export const supabaseClient = supabase || (noOp as unknown as SupabaseClient);

export async function getRecentReviews(limit = 3) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('*, games(title, cover_image)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Supabase recent reviews error', error);
    return [];
  }
  return data;
}

export async function getLibrary(filters = {}) {
  if (!supabase) return [];
  let query = supabase.from('user_games').select('*, games(*)');
  if ((filters as any).status) query = query.eq('status', (filters as any).status);
  if ((filters as any).platform) query = query.eq('platform_played', (filters as any).platform);

  const { data, error } = await query;
  if (error) {
    console.error('Supabase library error', error);
    return [];
  }
  return data;
}

export async function getReviews(filters = {}) {
  if (!supabase) return [];
  let query = supabase.from('reviews').select('*, games(title, cover_image)').order('created_at', { ascending: false });

  if ((filters as any).minScore !== undefined) query = query.gte('score', (filters as any).minScore);
  if ((filters as any).maxScore !== undefined) query = query.lte('score', (filters as any).maxScore);

  const { data, error } = await query;
  if (error) {
    console.error('Supabase reviews error', error);
    return [];
  }
  return data;
}

export async function getStats() {
  if (!supabase) return { averageScore: 0, totalCompleted: 0, mostUsedPlatform: 'N/A' };

  const [{ data: avgData }, { data: completedData }, { data: platformData }] = await Promise.all([
    supabase.from('reviews').select('score', { count: 'exact', head: false }),
    supabase.from('user_games').select('*', { count: 'exact', head: false }).eq('status', 'completed'),
    supabase.from('user_games').select('platform_played', { count: 'exact' }).neq('platform_played', '').not('platform_played', 'is', null),
  ]);

  let averageScore = 0;
  if (avgData?.length) {
    const sum = (avgData as any[]).reduce((acc, row) => acc + (row.score || 0), 0);
    averageScore = Math.round(sum / (avgData as any[]).length);
  }

  let mostUsedPlatform = 'N/A';
  if (platformData?.length) {
    const counts: Record<string, number> = {};
    (platformData as any[]).forEach((row) => {
      const p = row.platform_played || 'Unknown';
      counts[p] = (counts[p] || 0) + 1;
    });
    mostUsedPlatform = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }

  return {
    averageScore,
    totalCompleted: completedData?.length || 0,
    mostUsedPlatform,
  };
}
