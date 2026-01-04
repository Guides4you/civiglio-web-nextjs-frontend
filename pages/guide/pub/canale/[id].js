import React from 'react';
import { Amplify, API } from 'aws-amplify';
import Head from 'next/head';
import ChannelProfile from '../../../../src/components/layoutpub-components/ChannelProfile';
import { getProfileInfo, listMediaByProprietario2 } from '../../../../src/graphql/publicQueries';
import awsconfig from '../../../../src/aws-exports';

// Configure Amplify for SSR
Amplify.configure({ ...awsconfig, ssr: true });

export default function ChannelPage({ profileInfo, medias, channelId, error }) {
  const pageTitle = profileInfo ? `Il Canale di ${profileInfo.channelTitle}` : 'Canale';
  const pageDescription = profileInfo
    ? `Tutti i contenuti multimediali caricati sul canale di ${profileInfo.channelTitle}`
    : 'Profilo pubblico del canale';
  const keywords = profileInfo ? `Audio di ${profileInfo.channelTitle}` : 'Audio guide';

  if (error) {
    return (
      <>
        <Head>
          <title>Canale non trovato</title>
          <meta name="description" content="Il canale richiesto non è disponibile" />
        </Head>
        <div style={{
          padding: '100px 20px',
          textAlign: 'center',
          minHeight: '60vh'
        }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ fontSize: '28px', color: '#2c3e50', marginBottom: '12px' }}>
              Canale non trovato
            </h2>
            <p style={{ fontSize: '16px', color: '#6c757d' }}>
              Il canale che stai cercando non esiste o non è più disponibile.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
      </Head>

      <ChannelProfile
        profileInfo={profileInfo}
        medias={medias}
        channelId={channelId}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    // Fetch profile info
    const profileResponse = await API.graphql({
      query: getProfileInfo,
      variables: { PK: id },
    });

    const profile = profileResponse.data.getProfileInfo;

    if (!profile) {
      return {
        props: {
          profileInfo: null,
          medias: [],
          channelId: id,
          error: 'Channel not found',
        },
      };
    }

    // Fetch channel medias
    const mediasResponse = await API.graphql({
      query: listMediaByProprietario2,
      variables: { proprietario: profile.PK },
    });

    const medias = mediasResponse.data.listMediaByProprietario2.items || [];

    return {
      props: {
        profileInfo: profile,
        medias: medias,
        channelId: id,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error fetching channel data:', error);

    return {
      props: {
        profileInfo: null,
        medias: [],
        channelId: id,
        error: error.message || 'Error loading channel',
      },
    };
  }
}
