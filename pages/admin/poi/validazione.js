import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Table, Button, Switch, Tag, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import AdminLayout from '../../../src/components/layout-components/AdminLayout';
import { adminGetMediaDaValidare, adminGetAllMedia } from '../../../src/graphql/adminQueries';
import { STATO_MEDIA } from '../../../src/constants/CiviglioConstants';

export default function ValidationPage() {
  const [loading, setLoading] = useState(true);
  const [mediaList, setMediaList] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadMedia();
  }, [showAll]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const query = showAll ? adminGetAllMedia : adminGetMediaDaValidare;

      const response = await API.graphql(graphqlOperation(query));

      const items = showAll
        ? response.data.adminGetAllMedia.items
        : response.data.adminGetMediaDaValidare.items;

      setMediaList(items || []);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (stato) => {
    switch (stato) {
      case STATO_MEDIA.APPROVATO:
        return <Tag color="green">Approvato</Tag>;
      case STATO_MEDIA.RIFIUTATO:
        return <Tag color="red">Rifiutato</Tag>;
      case STATO_MEDIA.NUOVO:
        return <Tag color="orange">In Revisione</Tag>;
      default:
        return <Tag>{stato}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Proprietario',
      dataIndex: 'proprietario',
      key: 'proprietario',
      width: 150,
    },
    {
      title: 'Titolo',
      dataIndex: 'audioTitle',
      key: 'audioTitle',
      width: 250,
    },
    {
      title: 'Lingua',
      dataIndex: 'lingua',
      key: 'lingua',
      width: 80,
      render: (lingua) => <Tag>{lingua?.toUpperCase()}</Tag>,
    },
    {
      title: 'Data Creazione',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('it-IT'),
    },
    {
      title: 'Collegato',
      dataIndex: 'linked',
      key: 'linked',
      width: 100,
      render: (linked) => (linked ? <Tag color="blue">Sì</Tag> : <Tag>No</Tag>),
    },
    {
      title: 'Stato',
      dataIndex: 'stato_media',
      key: 'stato_media',
      width: 120,
      render: (stato) => getStatusTag(stato),
    },
    {
      title: 'Azioni',
      key: 'actions',
      width: 100,
      render: (_, record) => {
        // Costruisci l'URL: PK__SK (senza underscore iniziale)
        const sk = record.SK.startsWith('_') ? record.SK.substring(1) : record.SK;
        const editUrl = `/admin/poi/edit/${record.PK}__${sk}`;

        return (
          <Space>
            <Link href={editUrl}>
              <Button type="primary" icon={<EditOutlined />} size="small">
                Modifica
              </Button>
            </Link>
          </Space>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Validazione Media - Admin Civiglio</title>
      </Head>

      <div className="container-fluid" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Validazione Media</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Media da validare</span>
            <Switch
              checked={showAll}
              onChange={(checked) => setShowAll(checked)}
            />
            <span>Tutti i media</span>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={mediaList}
          loading={loading}
          rowKey="SK"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Totale: ${total} media`,
          }}
          scroll={{ x: 1000 }}
        />
      </div>
    </AdminLayout>
  );
}
