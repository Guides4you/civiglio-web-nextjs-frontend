import React from 'react';
import Head from 'next/head';
import AppLayout from '../../src/components/layouts/AppLayout';
import Dashboard from '../../src/components/app-components/Dashboard';

export default function AppHomePage() {
  return (
    <AppLayout>
      <Head>
        <title>Dashboard - Civiglio</title>
        <meta name="description" content="Area personale - Dashboard" />
      </Head>

      <Dashboard />
    </AppLayout>
  );
}
