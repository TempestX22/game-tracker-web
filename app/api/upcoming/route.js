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

export async function GET() {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RAWG API key not set' }, { status: 500 });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10);
    const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=${today},${nextYear}&ordering=-added&page_size=20`;
    console.log('Upcoming URL:', url);
    const data = await fetchJson(url);
    return NextResponse.json({ games: data.results || [], dateRange: `${today},${nextYear}`, ordering: '-added' });
  } catch (error) {
    console.error('Upcoming error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}