import React from 'react';
import Head from 'next/head';
import AppLayout from '../../../src/components/layouts/AppLayout';
import Profile from '../../../src/components/app-components/Profile';

export default function EditProfilePage() {
  return (
    <AppLayout>
      <Head>
        <title>Profilo - Civiglio</title>
        <meta name="description" content="Area personale - Modifica profilo" />
      </Head>

      <Profile />
    </AppLayout>
  );
}
