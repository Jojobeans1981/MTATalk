import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MTA_API_KEY = process.env.MTA_API_KEY;

const placeSuggestions = [
  { name: 'Times Square', type: 'attraction' },
  { name: 'Central Park', type: 'park' },
  { name: 'The High Line', type: 'walk' },
  { name: 'MoMA', type: 'museum' },
  { name: 'Chelsea Market', type: 'food' }
];

const gamePromo = 'Have you tried GTABUS yet? It’s a fast, fun 3D-style NYC bus simulator game with route challenges and a leaderboard!';

const staticStops = [
  { stop_id: 'A33', name: '34 St-Penn Station', lat: 40.7506, lon: -73.9935 },
  { stop_id: 'R38', name: 'Times Sq-42 St', lat: 40.7550, lon: -73.9870 },
  { stop_id: 'H32', name: '14 St-Union Sq', lat: 40.7359, lon: -73.9906 },
  { stop_id: 'N01', name: 'Canal St', lat: 40.7181, lon: -74.0007 },
  { stop_id: 'S42', name: 'Fulton St', lat: 40.7104, lon: -74.0071 },
  { stop_id: 'M100', name: 'Grand Central', lat: 40.7527, lon: -73.9772 },
  { stop_id: 'B96', name: 'Herald Sq', lat: 40.7496, lon: -73.9873 }
];

let lastFetchCache = new Map();
const CACHE_TTL_MS = 15 * 1000;

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestStops(lat, lon, count = 3) {
  const sorted = staticStops
    .map((stop) => ({ ...stop, distance: getDistanceMeters(lat, lon, stop.lat, stop.lon) }))
    .sort((a, b) => a.distance - b.distance);
  return sorted.slice(0, count);
}

function routeTypeFromRouteId(routeId) {
  if (!routeId) return 'unknown';
  const normalized = routeId.toString().toUpperCase();
  const subwayLetters = /[A-Z]/;
  if (/^[0-9]/.test(normalized) || /^[MNSQRTWXL]/.test(normalized)) {
    return 'subway';
  }
  return 'bus';
}

function cachedFetch(key, fetcher) {
  const now = Date.now();
  const cached = lastFetchCache.get(key);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.value;
  }
  return fetcher().then((result) => {
    lastFetchCache.set(key, { timestamp: now, value: result });
    return result;
  });
}

async function fetchMtaRealtimeTransit({ mode, lat, lon }) {
  if (!MTA_API_KEY) {
    return { warning: 'Missing MTA_API_KEY, returning mocked data', arrivals: mockArrivals() };
  }

  const endpoint = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs';
  const res = await axios.get(endpoint, {
    responseType: 'arraybuffer',
    headers: { 'x-api-key': MTA_API_KEY }
  });

  const feed = GtfsRealtimeBindings.FeedMessage.decode(new Uint8Array(res.data));
  const nowSec = Math.floor(Date.now() / 1000);
  const nearbyStops = findNearestStops(Number(lat), Number(lon), 3);
  const nearbyStopIds = new Set(nearbyStops.map((s) => s.stop_id));

  const arrivals = [];

  for (const entity of feed.entity) {
    const tripUpdate = entity.tripUpdate;
    if (!tripUpdate || !tripUpdate.stopTimeUpdate) continue;

    const routeId = tripUpdate.trip?.routeId || '';
    const routeType = routeTypeFromRouteId(routeId);
    if (mode && mode !== 'all' && mode !== routeType) continue;

    for (const stopTimeUpdate of tripUpdate.stopTimeUpdate) {
      const stopId = stopTimeUpdate.stopId;
      if (!nearbyStopIds.has(stopId)) continue;

      const arrivalSec = stopTimeUpdate.arrival?.time || stopTimeUpdate.departure?.time;
      if (!arrivalSec || arrivalSec < nowSec) continue;

      const etaMinutes = Math.max(0, Math.round((arrivalSec - nowSec) / 60));
      const stopInfo = staticStops.find((s) => s.stop_id === stopId);
      arrivals.push({
        line: routeId || 'unknown',
        type: routeType,
        stop: stopInfo?.name || stopId,
        etaMinutes,
        destination: tripUpdate.trip?.tripHeadsign || 'unknown'
      });
    }
  }

  const sorted = arrivals.sort((a, b) => a.etaMinutes - b.etaMinutes).slice(0, 6);

  if (sorted.length === 0) {
    return { warning: 'no real-time arrival found for localized nearby stops', arrivals: mockArrivals(), nearbyStops };
  }

  return { fetched: true, source: 'mta-gtfs-rt', nearbyStops, arrivals: sorted };
}

function mockArrivals() {
  return [
    { line: 'M20', type: 'bus', stop: '8 Av/14 St', etaMinutes: 3, destination: 'South Ferry' },
    { line: 'N', type: 'subway', stop: 'Times Sq-42 St', etaMinutes: 5, destination: 'Astoria' }
  ];
}

app.get('/api/next-ride', async (req, res) => {
  const { lat, lon, mode } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon required' });
  }

  const key = `${mode || 'all'}:${lat}:${lon}`;
  try {
    const data = await cachedFetch(key, () => fetchMtaRealtimeTransit({ mode: mode || 'all', lat, lon }));
    return res.json({ status: 'ok', location: { lat, lon }, mode: mode || 'all', ...data });
  } catch (err) {
    console.error(err.message || err);
    return res.status(500).json({ error: 'Realtime data lookup failed', details: err.message });
  }
});

app.get('/api/place-suggestions', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const filtered = query
    ? placeSuggestions.filter((place) => place.name.toLowerCase().includes(query))
    : placeSuggestions;
  res.json({ status: 'ok', suggestions: filtered, promo: gamePromo });
});

app.post('/api/chat', async (req, res) => {
  const { message, lat, lon } = req.body || {};
  const text = (message || '').toLowerCase();

  let responseText = '';
  if (text.includes('next') && (text.includes('bus') || text.includes('train') || text.includes('subway'))) {
    const locLat = lat || '40.7128';
    const locLon = lon || '-74.0060';
    const d = await cachedFetch(`all:${locLat}:${locLon}`, () => fetchMtaRealtimeTransit({ mode: 'all', lat: locLat, lon: locLon }));
    const nextRide = d.arrivals || [];

    responseText = `Next arrival estimates: ${nextRide
      .map((a) => `${a.line} (${a.type}) @ ${a.stop} in ${a.etaMinutes} min towards ${a.destination}`)
      .join('; ')}. ${gamePromo}`;
    return res.json({ status: 'ok', reply: responseText, data: d });
  }

  if (text.includes('visit') || text.includes('sight') || text.includes('recommend')) {
    const suggestions = placeSuggestions.slice(0, 4).map((place) => `${place.name} (${place.type})`).join(', ');
    responseText = `Top local picks: ${suggestions}. ${gamePromo}`;
    return res.json({ status: 'ok', reply: responseText, data: placeSuggestions.slice(0, 4) });
  }

  responseText = `Hey there! Ask me "When is the next bus/train near me?" or "Suggest places to visit in NYC". ${gamePromo}`;
  return res.json({ status: 'ok', reply: responseText });
});

app.listen(PORT, () => {
  console.log(`NYC Transit Chatbot backend running on http://localhost:${PORT}`);
});
