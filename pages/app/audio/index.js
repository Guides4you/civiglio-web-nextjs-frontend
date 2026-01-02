import React from 'react';
import Head from 'next/head';
import AppLayout from '../../../src/components/layouts/AppLayout';
import MyAudio from '../../../src/components/app-components/MyAudio';

export default function MyAudioPage() {
  return (
    <AppLayout>
      <Head>
        <title>I Miei Audio - Civiglio</title>
        <meta name="description" content="Area personale - I miei contenuti audio" />
      </Head>

      <MyAudio />
    </AppLayout>
  );
}
