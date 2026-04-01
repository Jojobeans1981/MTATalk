const placeSuggestions = [
  { name: 'Times Square', type: 'attraction' },
  { name: 'Central Park', type: 'park' },
  { name: 'The High Line', type: 'walk' },
  { name: 'MoMA', type: 'museum' },
  { name: 'Chelsea Market', type: 'food' }
];

const gamePromo = 'Have you tried GTABUS yet? It\'s a fast, fun 3D-style NYC bus simulator game with route challenges and a leaderboard!';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = (req.query.q || '').toLowerCase().trim();
  const filtered = query
    ? placeSuggestions.filter((place) => place.name.toLowerCase().includes(query))
    : placeSuggestions;
  res.json({ status: 'ok', suggestions: filtered, promo: gamePromo });
}