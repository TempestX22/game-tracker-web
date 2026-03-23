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

  try {
    const [gameRes, screenshotsRes] = await Promise.all([
      fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`),
      fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`),
    ]);
    const game = await gameRes.json();
    const screenshots = await screenshotsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ game, screenshots: screenshots.results || [] }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
