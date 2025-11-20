const express = require('express');
const NodeCache = require('node-cache');
const path = require('path');
const http = require('http');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

app.use(express.static(path.join(__dirname, '..', 'frontend')));

async function cachedFetch(key, url) {
    const cached = cache.get(key);
    if (cached) return cached;
    const res = await fetch(url); // Node 18+ has built-in fetch
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    cache.set(key, data);
    return data;
}

app.get('/api/countries', async (req, res) => {
    try {
        const url = 'https://api.worldbank.org/v2/country?format=json&per_page=300';
        const data = await cachedFetch('countries', url);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(502).json({ error: 'Failed to fetch countries. Try again later.' });
    }
});

app.get('/api/indicator/:code/:country', async (req, res) => {
    try {
        const { code, country } = req.params;
        const url = `https://api.worldbank.org/v2/country/${country}/indicator/${code}?format=json&date=2014:2024&per_page=100`;
        const key = `ind:${country}:${code}`;
        const data = await cachedFetch(key, url);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(502).json({ error: 'Failed to fetch indicator.' });
    }
});

http.createServer(app).listen(3000, () => {
    console.log("Server 1 running on port 3000");
});

http.createServer(app).listen(3001, () => {
    console.log("Server 2 running on port 3001");
});
