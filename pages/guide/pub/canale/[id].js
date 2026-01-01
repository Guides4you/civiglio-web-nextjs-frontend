import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API, graphqlOperation } from 'aws-amplify';
import Head from 'next/head';
import ChannelProfile from '../../../../src/components/layoutpub-components/ChannelProfile';
import { getProfileInfo, listMediaByProprietario2 } from '../../../../src/graphql/publicQueries';

export default function ChannelPage() {
  const router = useRouter();
  const { id } = router.query;

  const [profileInfo, setProfileInfo] = useState(null);
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchChannelData = async () => {
      setLoading(true);
      try {
        // Fetch profile info
        const profileResponse = await API.graphql(
          graphqlOperation(getProfileInfo, { PK: id })
        );

        const profile = profileResponse.data.getProfileInfo;
        setProfileInfo(profile);

        // Fetch channel medias
        if (profile) {
          const mediasResponse = await API.graphql(
            graphqlOperation(listMediaByProprietario2, { proprietario: profile.PK })
          );

          setMedias(mediasResponse.data.listMediaByProprietario2.items || []);
        }
      } catch (error) {
        console.error('Error fetching channel data:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        setProfileInfo(null);
        setMedias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [id]);

  const pageTitle = profileInfo ? `Il Canale di ${profileInfo.channelTitle}` : 'Canale';
  const pageDescription = profileInfo
    ? `Tutti i contenuti multimediali caricati sul canale di ${profileInfo.channelTitle}`
    : 'Profilo pubblico del canale';
  const keywords = profileInfo ? `Audio di ${profileInfo.channelTitle}` : 'Audio guide';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
      </Head>

      {loading ? (
        <div style={{
          padding: '100px 20px',
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <p style={{ fontSize: '18px', color: '#6c757d' }}>Caricamento del canale...</p>
          </div>
        </div>
      ) : (
        <ChannelProfile
          profileInfo={profileInfo}
          medias={medias}
          channelId={id}
        />
      )}
    </>
  );
}
