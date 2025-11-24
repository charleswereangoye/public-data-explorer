const express = require('express');
const NodeCache = require('node-cache');
const path = require('path');

// Node <18 fallback for fetch
if (!global.fetch) {
    global.fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

const app = express();
const cache = new NodeCache({ stdTTL: 3600 });
const PORT = process.env.PORT || 3000;

// serve frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Helper: cached fetch
async function cachedFetch(key, url) {
    const cached = cache.get(key);
    if (cached) return cached;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    cache.set(key, data);
    return data;
}

// Countries endpoint
app.get('/api/countries', async (req, res) => {
    console.log(`Request served by BACKEND on PORT ${PORT}`);

    try {
        const url = 'https://api.worldbank.org/v2/country?format=json&per_page=300';
        const data = await cachedFetch('countries', url);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(502).json({ error: "Failed to fetch countries" });
    }
});

// Indicator endpoint
app.get('/api/indicator/:code/:country', async (req, res) => {
    console.log(`Request served by BACKEND on PORT ${PORT}`);

    try {
        const { code, country } = req.params;
        const url = `https://api.worldbank.org/v2/country/${country}/indicator/${code}?format=json&date=2014:2024&per_page=100`;
        const key = `ind:${country}:${code}`;
        const data = await cachedFetch(key, url);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(502).json({ error: "Failed to fetch indicator" });
    }
});

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
