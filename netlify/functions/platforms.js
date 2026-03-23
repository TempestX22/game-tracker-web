const fetch = require('node-fetch');

exports.handler = async function () {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RAWG API key not set' }) };
  }

  const url = `https://api.rawg.io/api/platforms?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: text }) };
    }
    const data = JSON.parse(text);
    return {
      statusCode: 200,
      body: JSON.stringify({ platforms: data.results || [] }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};