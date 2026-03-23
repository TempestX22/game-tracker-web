const fetch = require('node-fetch');

exports.handler = async function (event) {
  const { q } = event.queryStringParameters || {};
  if (!q) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query param q' }) };
  }
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RAWG API key not set' }) };
  }

  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(q)}&page_size=20`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ games: data.results || [] }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
