import React from 'react';
import Head from 'next/head';
import AppLayoutSimple from '../../../src/components/layouts/AppLayoutSimple';
import Profile from '../../../src/components/app-components/Profile';

export default function EditProfilePage() {
  return (
    <AppLayoutSimple>
      <Head>
        <title>Profilo - Civiglio</title>
        <meta name="description" content="Area personale - Modifica profilo" />
      </Head>

      <Profile />
    </AppLayoutSimple>
  );
}
