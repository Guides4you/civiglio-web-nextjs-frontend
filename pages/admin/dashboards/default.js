import React from 'react';
import Head from 'next/head';
import { Row, Col, Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import AdminLayout from '../../../src/components/layout-components/AdminLayout';

export default function AdminDashboardPage() {
  // TODO: Fetch real statistics from API
  const statData = [
    {
      title: 'POI Totali',
      value: 0,
      status: 0,
      subtitle: 'Punti di interesse nel sistema'
    },
    {
      title: 'Media da Validare',
      value: 0,
      status: 0,
      subtitle: 'In attesa di approvazione'
    },
    {
      title: 'Utenti Attivi',
      value: 0,
      status: 0,
      subtitle: 'Utenti registrati'
    },
    {
      title: 'Ascolti Totali',
      value: 0,
      status: 0,
      subtitle: 'Ascolti degli ultimi 30 giorni'
    }
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard Admin - Civiglio</title>
      </Head>

      <div className="container-fluid" style={{ padding: '20px' }}>
        <h2>Dashboard Amministratore</h2>

        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          {statData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{
                    color: stat.status > 0 ? '#3f8600' : stat.status < 0 ? '#cf1322' : '#000'
                  }}
                  prefix={
                    stat.status > 0 ? (
                      <ArrowUpOutlined />
                    ) : stat.status < 0 ? (
                      <ArrowDownOutlined />
                    ) : null
                  }
                />
                <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                  {stat.subtitle}
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col xs={24}>
            <Card title="Attività Recenti">
              <p>Nessuna attività recente da mostrare.</p>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}
