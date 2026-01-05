import React, { useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getGeoPoi, queryLastPoiForHome } from '../../../../src/graphql/publicQueries';
import PicturesPoi from '../../../../src/components/layoutpub-components/DetailsPoi/PicturesPoi';
import AudiosPoi from '../../../../src/components/layoutpub-components/DetailsPoi/AudiosPoi';
import DescriptionPoi from '../../../../src/components/layoutpub-components/DetailsPoi/DescriptionPoi';
import Popular from '../../../../src/components/layoutpub-components/DetailsPoi/Popular';
import QuickInfoCard from '../../../../src/components/layoutpub-components/DetailsPoi/QuickInfoCard';
import IntlMessage from '../../../../src/components/util-components/IntlMessage';

// Import dinamico della mappa per evitare problemi SSR
const GMapCiviglioDetail = dynamic(
  () => import('../../../../src/components/layoutpub-components/GMapCiviglioDetail'),
  { ssr: false }
);

const MapSection = ({ poi }) => (
  <div className="property-location map" id="poimap" style={{ marginBottom: '30px' }}>
    <h5><IntlMessage id="poidetail.location" /></h5>
    <div className="divider-fade"></div>
    <GMapCiviglioDetail poi={poi} />
  </div>
);

export default function POIDetailPage({ poi, popular, poiId }) {
  const router = useRouter();
  const mapRef = useRef(null);

  // Fallback per ISR
  if (router.isFallback) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Caricamento POI...</h2>
      </div>
    );
  }

  if (!poi) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>POI non trovato</h2>
        <p>ID: {poiId}</p>
      </div>
    );
  }

  const pageTitle = poi.titolo || 'Dettaglio POI';
  const pageDescription = poi.descrizione || 'Scopri questo punto di interesse con Civiglio';
  const pageUrl = `https://www.civiglio.it${router.asPath}`;
  const pageImage = poi.immagine
    ? `https://civigliowebba8ebe1e07b047938f92b0cad411ac6f221800-test.s3.eu-west-1.amazonaws.com/public/images/${poi.immagine}`
    : 'https://www.civiglio.it/img/civiglio/logo.png';

  return (
    <>
      <Head>
        <title>{pageTitle} - Civiglio</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${pageTitle}, audioguida, punto di interesse, turismo, cultura`} />

        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={`${pageTitle} - Civiglio`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />

        {/* Twitter Card */}
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={`${pageTitle} - Civiglio`} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        {/* Structured Data - Place Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Place',
              name: pageTitle,
              description: pageDescription,
              image: pageImage,
              ...(poi.geoCoord && {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: poi.geoCoord[1],
                  longitude: poi.geoCoord[0]
                }
              })
            })
          }}
        />
      </Head>

      <section className="single-proper blog details" key={poiId}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12 blog-pots">
              <div className="row">
                <div className="col-md-12">
                  <PicturesPoi poi={poi} mapRef={mapRef} key={`pictures-${poiId}`} />
                  <QuickInfoCard poi={poi} key={`quickinfo-${poiId}`} />
                  <AudiosPoi poi={poi} key={`audios-${poiId}`} />
                  <DescriptionPoi poi={poi} key={`description-${poiId}`} />
                  <div ref={mapRef}>
                    <MapSection poi={poi} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 blog-pots">
              <div className="blog-sidebar">
                <Popular pois={popular} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Generate static paths for top POIs
export async function getStaticPaths() {
  try {
    const { API } = await import('aws-amplify');
    const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api-graphql');
    const awsExports = (await import('../../../../src/aws-exports')).default;
    const Amplify = (await import('aws-amplify')).default;

    Amplify.configure(awsExports);

    // Fetch top 10 POIs to pre-generate
    const result = await API.graphql({
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
      query: queryLastPoiForHome,
      variables: { limit: 10 }
    });

    const pois = result.data?.getLastPoiForHome?.items || [];

    // Generate paths for each POI
    const paths = pois.map(poi => ({
      params: {
        slug: [poi.rangeKey, 'dettaglio'] // [id, seo-text]
      }
    }));

    return {
      paths,
      fallback: 'blocking' // ISR: generate other pages on-demand
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

// Fetch POI data
export async function getStaticProps({ params }) {
  const { slug } = params;
  const poiId = slug[0]; // First part is the ID

  try {
    const { API, graphqlOperation } = await import('aws-amplify');
    const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api-graphql');
    const awsExports = (await import('../../../../src/aws-exports')).default;
    const Amplify = (await import('aws-amplify')).default;

    Amplify.configure(awsExports);

    // Parse POI ID (format: POI123_it_POI or just POI123)
    const idParts = poiId.split('_');
    const rangeKey = idParts[0];
    const locale = idParts[1] || 'it'; // Default to Italian

    // Fetch POI details
    const poiResult = await API.graphql(
      graphqlOperation(getGeoPoi, {
        rangeKey: rangeKey,
        SK: `_${locale}_POI`
      })
    );

    const poi = {
      ...poiResult.data?.getGeoPoi,
      ...poiResult.data?.getPoi,
      PK: rangeKey,
    };

    // Fetch popular POIs for sidebar
    const popularResult = await API.graphql({
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
      query: queryLastPoiForHome,
      variables: { limit: 15 }
    });

    const popular = popularResult.data?.getLastPoiForHome?.items?.slice(0, 4) || [];

    return {
      props: {
        poi: poi || null,
        popular,
        poiId
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching POI:', error);
    return {
      props: {
        poi: null,
        popular: [],
        poiId
      },
      revalidate: 60
    };
  }
}
