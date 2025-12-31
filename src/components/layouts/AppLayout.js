import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getCurrentUser } from '../../utils/amplify-ssr-safe';

const { Content } = Layout;

export const AppLayout = ({ children, navCollapsed, navType }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Hub listener for auth events
    if (typeof window !== 'undefined') {
      import('aws-amplify').then(({ Hub, Auth }) => {
        const hubListener = Hub.listen('auth', async (data) => {
          switch (data.payload.event) {
            case 'signIn':
              setIsAuthenticated(true);
              try {
                const session = await Auth.currentSession();
                console.log('User signed in:', session);
              } catch (err) {
                console.log(err);
              }
              break;
            case 'signOut':
              setIsAuthenticated(false);
              router.push('/auth/login');
              break;
            default:
              break;
          }
        });

        return () => {
          hubListener();
        };
      });
    }
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
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>
          <p>Non autenticato. Reindirizzamento al login...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* HeaderNav sarà aggiunto quando migreremo i componenti */}
      {/* {isAuthenticated && <HeaderNav isMobile={false} />} */}

      <Layout className="app-container">
        {/* SideNav sarà aggiunto quando migreremo i componenti */}
        {/* {isAuthenticated && <SideNav />} */}

        <Layout className="app-layout" style={{ padding: '24px' }}>
          <Content>
            <div className="container">
              {children}
            </div>
          </Content>
          {/* Footer sarà aggiunto quando migreremo i componenti */}
        </Layout>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType, locale } = theme;
  return { navCollapsed, navType, locale };
};

export default connect(mapStateToProps)(AppLayout);
