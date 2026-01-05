import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import IntlMessage from '../../../src/components/util-components/IntlMessage';
import { queryLastPoiForHome } from '../../../src/graphql/publicQueries';

// Import dinamici per evitare problemi SSR
const GMapCiviglioHome = dynamic(
  () => import('../../../src/components/layoutpub-components/GMapCiviglioHome'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '500px',
        background: '#e9ecef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#6c757d' }}>Caricamento mappa...</p>
      </div>
    )
  }
);

const POICarousel = dynamic(
  () => import('../../../src/components/layoutpub-components/POICarousel'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <p style={{ color: '#6c757d' }}>Caricamento POI...</p>
      </div>
    )
  }
);

// POICard e POIListPlaceholder sono stati sostituiti dal nuovo POICarousel component

export default function HomePage({ pois }) {
  const pageUrl = 'https://www.civiglio.it/guide/pub/home';
  const pageTitle = 'Civiglio - Ascolta la storia, vivi la cultura';
  const pageDescription = 'Civiglio trasformiamo i vostri beni culturali in risorse per il futuro. Scopri audioguide interattive e luoghi storici da esplorare.';
  const pageImage = 'https://www.civiglio.it/img/civiglio/logo.png';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Civiglio, Beni Culturali, Riqualificazione Borghi, Valorizzazione Punti di Interesse, audioguide, guide turistiche" />

        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />

        {/* Twitter Card */}
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Head>

      <div>
        <div style={{ marginBottom: '40px' }}>
          <GMapCiviglioHome pois={pois} />
        </div>
        <POICarousel
          pois={pois}
          title={<IntlMessage id="home.ultimipoiinseriti" />}
          subtitle={<IntlMessage id="home.scopriultimiluoghiinseriti" />}
          autoplayDelay={5000}
        />
      </div>
    </>
  );
}

// Static Site Generation con Incremental Static Regeneration
export async function getStaticProps() {
  try {
    // Dynamic import di Amplify per evitare problemi SSR
    const { API } = await import('aws-amplify');
    const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api-graphql');

    // Configura Amplify se necessario
    const awsExports = (await import('../../../src/aws-exports')).default;
    const Amplify = (await import('aws-amplify')).default;
    Amplify.configure(awsExports);

    // Fetch POI data con GraphQL
    const result = await API.graphql({
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
      query: queryLastPoiForHome,
      variables: { limit: 20 }
    });

    const pois = result.data?.getLastPoiForHome?.items || [];

    return {
      props: {
        pois,
      },
      // ISR: Revalidate ogni ora (3600 secondi)
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching POIs:', error);
    return {
      props: {
        pois: [],
      },
      revalidate: 60, // Retry più frequentemente se c'è un errore
    };
  }
}
