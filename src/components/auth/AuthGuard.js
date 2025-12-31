import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { getCurrentUser } from '../../utils/amplify-ssr-safe';

const AuthGuard = ({ children, fallback = null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setAuthenticated(true);
          setLoading(false);
        } else {
          // Non autenticato, redirect a login
          router.push('/auth/login');
        }
      } catch (error) {
        console.log('Not authenticated, redirecting to login');
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    if (fallback) {
      return fallback;
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f2f5',
        }}
      >
        <Spin size="large" tip="Caricamento..." />
      </div>
    );
  }

  return authenticated ? children : null;
};

export default AuthGuard;
