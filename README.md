# Public Data Explorer README

Public Data Explorer is a web-based application that allows users to explore real-world economic and development statistics using the World Bank Open Data API. The platform provides easy access to country lists and key development indicators, presented through a simple, clean, and interactive interface.

The backend is built using Node.js, and it fetches and caches external API data. The project also demonstrates deployment on two servers behind a Node.js-based load balancer.

## Features

1. Fetch Real-World Data from External API

   * Uses World Bank API (no key required).
   * Fetches country lists and specific indicator data.
   * Caches data to improve performance and reduce API calls.

2. Two Deployed Backend Servers

   * Backend runs on:

     * Server 1 → Port 3000
     * Server 2 → Port 3001
   * Both serve the same frontend and API routes.

3. Load Balancer (Node.js Reverse Proxy)

   * Located at the root of the project (lb.js)
   * Distributes traffic across the two backend servers.
   * Runs on port 4000
   * Allows verification using "Request served by PORT" logs.

4. User Interaction

   * Users can search countries, select an indicator, and display historical data from 2014–2024.

5. Error Handling

   * Detects API downtime, invalid API responses, and failed requests.
   * Provides user-friendly messages.

6. Simple HTML/CSS/JS Frontend

   * Clean user interface
   * Beginner-friendly
   * Easy to extend

## Project Structure

```
public-data-explorer/
│
├── lb.js                # Load balancer (runs on port 4000)
│
├── backend/
│   ├── server.js        # API server (3000 or 3001)
│   ├── package.json
│
├── frontend/
│   ├── index.html       # UI
│   ├── script.js        # Frontend logic
│   ├── style.css        # Styling
│
└── README.md
```

## Installation & Local Setup

### 1. Clone the repository

```
git clone https://github.com/charleswereangoye/public-data-explorer.git
cd public-data-explorer
```

## Backend Setup (Two Servers)

### Install dependencies

Inside the backend folder:

```
cd backend
npm install
npm start
```

### Start Server 1 (Port 3000)

```
PORT=3000 node server.js
```

### Start Server 2 (Port 3001)

Open a new terminal:

```
PORT=3001 node server.js
```

## Load Balancer Setup

From the project root:

```
node lb.js
```

Load balancer runs on:

```
http://localhost:4000
```

## How to Test the Load Balancer

Open your browser and keep refreshing:

```
http://localhost:4000/api/countries
```

You should see alternating logs in both server terminals:

```
Request served by PORT 3000
Request served by PORT 3001
Request served by PORT 3000
Request served by PORT 3001
```

## Usage (Frontend)

Open:

```
frontend/index.html
```

The frontend sends all API requests to:

```
http://localhost:4000/api/...
```

## API Documentation

### GET /api/countries

Returns list of all countries.

### GET /api/indicator/:code/:country

Fetches indicator data for a specific country.
Example:

```
/api/indicator/NY.GDP.PCAP.CD/KEN
```

## Error Handling

The backend detects and handles:

* API downtime
* Invalid API responses
* Network errors
* Invalid routes

User messages:

```
Failed to fetch countries. Try again later.
Failed to fetch indicator.
```

## Attribution

This project uses data from:
**World Bank Open Data API**
[https://api.worldbank.org](https://api.worldbank.org)

No API key required.
