import React from 'react';
import Head from 'next/head';
import AppLayoutSimple from '../../../src/components/layouts/AppLayoutSimple';
import MyAudio from '../../../src/components/app-components/MyAudio';

export default function MyAudioPage() {
  return (
    <AppLayoutSimple>
      <Head>
        <title>I Miei Audio - Civiglio</title>
        <meta name="description" content="Area personale - I miei contenuti audio" />
      </Head>

      <MyAudio />
    </AppLayoutSimple>
  );
}
