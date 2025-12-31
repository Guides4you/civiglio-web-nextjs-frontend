import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';

const AdminDashboardPage = () => {
  return (
    <div>
      <h1>⚙️ Admin Dashboard</h1>
      <p>Pannello di amministrazione Civiglio</p>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Utenti Totali"
              value={1234}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="POI Pubblicati"
              value={89}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Da Validare"
              value={12}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{
        marginTop: 32,
        padding: 20,
        background: '#fff7e6',
        border: '1px solid #ffd591',
        borderRadius: 8
      }}>
        <h3>⚠️ Area Admin</h3>
        <p>Questa è un'area protetta accessibile solo agli amministratori.</p>
        <ul>
          <li>✅ BackendLayout attivo</li>
          <li>✅ Auth check funzionante</li>
          <li>⏳ Componenti admin da migrare</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
