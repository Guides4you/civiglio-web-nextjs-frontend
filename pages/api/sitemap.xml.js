/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml with all public pages and POI details
 * Access via: https://www.civiglio.it/sitemap.xml
 */
export default async function handler(req, res) {
  try {
    // Import Amplify solo quando necessario
    const { API } = await import('aws-amplify');
    const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api');
    const { queryLastPoiForHome } = await import('../../src/graphql/publicQueries');

    // Fetch all public POIs
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

    const baseUrl = 'https://www.civiglio.it';
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Static pages
    const staticPages = [
      {
        url: '',
        changefreq: 'weekly',
        priority: '1.0',
        lastmod: currentDate
      },
      {
        url: '/guide/pub/home',
        changefreq: 'daily',
        priority: '0.9',
        lastmod: currentDate
      }
    ];

    // Dynamic POI pages
    const poiPages = allPois.map(poi => {
      // Use rangeKey as POI ID
      const poiId = poi.rangeKey;

      // Get first audio for the title slug
      const firstAudio = poi.audios?.[0];
      const title = firstAudio?.audioTitle || poi.audios?.[0]?.titolo || 'poi';
      const slug = encodeURIComponent(title.replace(/\s+/g, '-'));

      return {
        url: `/guide/pub/poi/${poiId}`,
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: poi.updated_at?.split('T')[0] || currentDate
      };
    });

    const allPages = [...staticPages, ...poiPages];

    // Generate XML sitemap
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
