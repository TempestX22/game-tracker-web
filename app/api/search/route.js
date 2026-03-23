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
    throw new Error(`Invalid JSON from RAWG API at ${url}: ${parseError.message} - body: ${text.slice(0, 400)}`);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ error: 'Missing query param q' }, { status: 400 });
  }
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RAWG API key not set' }, { status: 500 });
  }

  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(q)}&page_size=20`;

  try {
    console.log('Search URL:', url);
    const data = await fetchJson(url);
    return NextResponse.json({ games: data.results || [] });
  } catch (error) {
    console.error('Search error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}