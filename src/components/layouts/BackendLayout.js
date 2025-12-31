import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getCurrentUser } from '../../utils/amplify-ssr-safe';

const { Content } = Layout;

export const BackendLayout = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);

        // TODO: Aggiungere check per ruolo admin qui se necessario
        // const groups = user.signInUserSession.idToken.payload['cognito:groups'];
        // if (!groups || !groups.includes('admin')) {
        //   router.push('/app/home');
        // }
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Caricamento...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Admin Header/Sidebar sarà aggiunto dopo */}
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale };
};

export default connect(mapStateToProps)(BackendLayout);
