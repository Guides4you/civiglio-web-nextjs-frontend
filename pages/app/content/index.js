import React from 'react';
import Head from 'next/head';
import AppLayoutSimple from '../../../src/components/layouts/AppLayoutSimple';
import MyContent from '../../../src/components/app-components/MyContent';

export default function MyContentPage() {
  return (
    <AppLayoutSimple>
      <Head>
        <title>I Miei Contenuti - Civiglio</title>
        <meta name="description" content="Area personale - I miei contenuti audio e POI" />
      </Head>
      <MyContent />
    </AppLayoutSimple>
  );
}
