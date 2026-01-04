import React from 'react';
import Head from 'next/head';
import AppLayoutSimple from '../../src/components/layouts/AppLayoutSimple';
import Dashboard from '../../src/components/app-components/Dashboard';

export default function AppHomePage() {
  return (
    <AppLayoutSimple>
      <Head>
        <title>Dashboard - Civiglio</title>
        <meta name="description" content="Area personale - Dashboard" />
      </Head>

      <Dashboard />
    </AppLayoutSimple>
  );
}
