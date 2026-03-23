const fetch = require('node-fetch');

exports.handler = async function (event) {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RAWG API key not set' }) };
  }

  const query = event?.queryStringParameters || {};
  const dates = query.dates || '2019-09-01,2019-09-30';
  const platforms = query.platforms || '18,1,7';
  const pageSize = query.page_size || '20';

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
    const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=${encodeURIComponent(dates)}&platforms=${encodeURIComponent(platforms)}&page_size=${pageSize}`;
    const data = await fetchJson(url);
    return {
      statusCode: 200,
      body: JSON.stringify({ games: data.results || [], dateRange: dates, platforms }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
