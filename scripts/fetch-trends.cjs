// scripts/fetch-trends.cjs

/* 
  Fetch trending Google searches for multiple regions using SerpAPI
  and save them as public/trending.json for the Silhouette dashboard.
*/

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.SERPAPI_KEY;

if (!API_KEY) {
  console.error('⚠️ SERPAPI_KEY is not set in .env');
  process.exit(1);
}

// You can add more regions later!
const REGIONS = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  // { code: 'FR', label: 'France' },
  // { code: 'JP', label: 'Japan' },
];

async function fetchTrendingForRegion(regionCode) {
  const url =
    `https://serpapi.com/search?` +
    `engine=google_trends_trending_now&` +
    `hl=en&` +
    `geo=${encodeURIComponent(regionCode)}&` +
    `api_key=${API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch trends for ${regionCode}: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // SerpAPI returns an array under `trending_searches`
  const rawSearches = data.trending_searches || [];

 const searches = rawSearches.map((item) => ({
  title: item.query || '',

  // make search volume human-readable if present
  traffic: typeof item.search_volume === 'number'
    ? `${item.search_volume.toLocaleString()}+ searches`
    : '',

  // link to a trends view (SerpAPI's own link)
  link: item.serpapi_google_trends_link || '',
}));

  return searches;
}

async function main() {
  const regions = [];

  for (const region of REGIONS) {
    console.log(`🌍 Fetching trending searches for ${region.label} (${region.code})...`);
    try {
      const searches = await fetchTrendingForRegion(region.code);
      regions.push({
        code: region.code,
        label: region.label,
        searches,
      });
    } catch (err) {
      console.error(`Error fetching ${region.code}:`, err.message);
    }
  }

  const output = {
    updatedAt: new Date().toISOString(),
    regions,
  };

  const outputPath = path.join(__dirname, '..', 'public', 'trending.json');

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`✅ Wrote ${regions.length} regions to ${outputPath}`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
