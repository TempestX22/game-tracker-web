import { NextResponse } from 'next/server';

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`RAWG API failed (${res.status} ${res.statusText}): ${text}`);
  }
  if (!text) {
    throw new Error(`Empty response from RAWG API at ${url}`);
  }
  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error(`Invalid JSON from RAWG API at ${url}: ${parseError.message}`);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const genres = searchParams.get('genres') || '';
  
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RAWG API key not set' }, { status: 500 });
  }

  try {
    let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=40&ordering=-rating`;
    if (genres) {
      url += `&genres=${encodeURIComponent(genres)}`;
    }
    console.log('Games URL:', url);
    const data = await fetchJson(url);
    return NextResponse.json({ 
      games: data.results || [], 
      count: data.count || 0,
      next: data.next || null,
      previous: data.previous || null
    });
  } catch (error) {
    console.error('Games error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}