const fetch = require('node-fetch');

exports.handler = async function () {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RAWG API key not set' }) };
  }
  const today = new Date().toISOString().slice(0, 10);
  const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10);

  try {
    const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&dates=${today},${nextYear}&ordering=-added&page_size=12`);
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
