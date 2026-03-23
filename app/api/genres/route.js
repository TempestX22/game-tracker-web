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

export async function GET() {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RAWG API key not set' }, { status: 500 });
  }

  try {
    const url = `https://api.rawg.io/api/genres?key=${apiKey}&page_size=50`;
    console.log('Genres URL:', url);
    const data = await fetchJson(url);
    return NextResponse.json({ 
      genres: data.results || []
    });
  } catch (error) {
    console.error('Genres error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}