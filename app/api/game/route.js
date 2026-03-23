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
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing game id' }, { status: 400 });
  }
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RAWG API key not set' }, { status: 500 });
  }

  try {
    const [game, screenshots] = await Promise.all([
      fetchJson(`https://api.rawg.io/api/games/${id}?key=${apiKey}`),
      fetchJson(`https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`),
    ]);

    return NextResponse.json({ game, screenshots: screenshots.results || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}