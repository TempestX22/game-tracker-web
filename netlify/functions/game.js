const fetch = require('node-fetch');

exports.handler = async function (event) {
  const { id } = event.queryStringParameters || {};
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing game id' }) };
  }
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RAWG API key not set' }) };
  }

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

  try {
    const [game, screenshots] = await Promise.all([
      fetchJson(`https://api.rawg.io/api/games/${id}?key=${apiKey}`),
      fetchJson(`https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ game, screenshots: screenshots.results || [] }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
