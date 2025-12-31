/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml with all public pages and POI details
 */
export default async function handler(req, res) {
  try {
    // Import Amplify solo quando necessario
    const { API } = await import('aws-amplify');
    const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api');
    const { queryLastPoiForHome } = await import('../../src/graphql/publicQueries');

    // Fetch all POIs
    let allPois = [];
    try {
      const result = await API.graphql({
        query: queryLastPoiForHome,
        variables: { limit: 1000 },
        authMode: GRAPHQL_AUTH_MODE.API_KEY
      });
      allPois = result.data?.getLastPoiForHome?.items || [];
    } catch (error) {
      console.error('Error fetching POIs for sitemap:', error);
    }

    const baseUrl = 'https://www.civiglioweb.com';
    const currentDate = new Date().toISOString();

    // Static pages
    const staticPages = [
      {
        url: '',
        changefreq: 'daily',
        priority: '1.0',
        lastmod: currentDate
      },
      {
        url: '/guide/pub/home',
        changefreq: 'hourly',
        priority: '0.9',
        lastmod: currentDate
      }
    ];

    // Dynamic POI pages
    const poiPages = allPois.map(poi => {
      const firstAudio = poi.audios?.[0];
      const poiId = firstAudio?.PK || poi.rangeKey;
      const titolo = encodeURI((firstAudio?.audioTitle || 'dettaglio').replace(/\s/g, '-'));

      return {
        url: `/guide/pub/detail/${poiId}/${titolo}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: poi.updated_at || currentDate
      };
    });

    const allPages = [...staticPages, ...poiPages];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    res.status(200).send(sitemap);

  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
}
