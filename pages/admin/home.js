import React from 'react';
import Head from 'next/head';
import AdminLayout from '../../src/components/layout-components/AdminLayout';

export default function AdminHomePage() {
  return (
    <AdminLayout>
      <Head>
        <title>Admin - Civiglio Administration Panel</title>
      </Head>

      <div className="container-fluid" style={{ padding: '20px' }}>
        <h1>Civiglio Administration Panel</h1>
        <p>Benvenuto nell'area di amministrazione di Civiglio.</p>
        <p>Usa il menu di navigazione per accedere alle diverse funzionalità amministrative.</p>
      </div>
    </AdminLayout>
  );
}
