import { useEffect, useState } from 'react';

type TrendSearch = {
  title: string;
  traffic: string;
  link: string;
};

type RegionTrends = {
  code: string;
  label: string;
  searches: TrendSearch[];
};

type TrendsData = {
  updatedAt: string | null;
  regions: RegionTrends[];
};

function Dashboard() {
  const [data, setData] = useState<TrendsData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrends() {
      try {
        setLoading(true);
        const res = await fetch('/trending.json');
        if (!res.ok) {
          throw new Error(`Failed to load trending.json: ${res.status}`);
        }
        const json = (await res.json()) as TrendsData;
        setData(json);

        if (json.regions.length > 0) {
          setSelectedRegion(json.regions[0].code);
        }
      } catch (err: unknown) {
        console.error(err);
        setError('Could not load trend data.');
      } finally {
        setLoading(false);
      }
    }

    loadTrends();
  }, []);

  const currentRegion = data?.regions.find((region) => region.code === selectedRegion) ?? null;

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Silhouette</h1>
        <p style={{ marginTop: '0.5rem' }}>A live snapshot of trending fashion-related searches.</p>
        {data?.updatedAt && (
          <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#888' }}>
            Last updated: {new Date(data.updatedAt).toLocaleString()}
          </p>
        )}
      </header>

      <main>
        {loading && <p>Loading trend data…</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && data && (
          <>
            <section style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="region-select"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              >
                Region
              </label>
              <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{ padding: '0.4rem 0.6rem' }}
              >
                {data.regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.label}
                  </option>
                ))}
              </select>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Trending Searches</h2>

              {currentRegion && currentRegion.searches.length === 0 && (
                <p>No trending searches found for this region.</p>
              )}

              {currentRegion && currentRegion.searches.length > 0 && (
                <ol style={{ paddingLeft: '1.25rem' }}>
                  {currentRegion.searches.map((item, index) => (
                    <li key={`${item.title}-${index}`} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 500 }}>{item.title}</div>
                      {item.traffic && (
                        <div style={{ fontSize: '0.85rem', color: '#777' }}>
                          Traffic: {item.traffic}
                        </div>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '0.85rem',
                            color: '#0066cc',
                            textDecoration: 'underline',
                          }}
                        >
                          View on Google Trends
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
